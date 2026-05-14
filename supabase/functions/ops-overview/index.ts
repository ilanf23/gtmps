// Returns KPI counts, bucketed timeseries, and a recent activity feed.
//
// Honors a time-range filter passed as query params:
//   ?from=ISO&to=ISO&prevFrom=ISO&prevTo=ISO&grain=hour|day|week|month
// All optional. Defaults to the last 7 days, day grain, with the prior 7 days
// as the comparison window. Boundary math is handled client-side in
// America/New_York; the server treats from/to as opaque UTC instants.
//
// Response shape:
//   {
//     kpis: { submissions, completed, views, shares, emails, bookings },
//     kpis_prev: { ... } | null,
//     timeseries: [{ bucket, date, submissions, completions, views, shares, bookings }],
//     grain: "hour" | "day" | "week" | "month",
//     range: { from, to, prevFrom, prevTo, label },
//     activity: [...]   // unchanged: last 30 events, unfiltered
//   }
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type Grain = "hour" | "day" | "week" | "month";
const VALID_GRAINS: Grain[] = ["hour", "day", "week", "month"];

interface KpiBucket {
  submissions: number;
  completed: number;
  views: number;
  shares: number;
  emails: number;
  bookings: number;
  leads: number;
}

function isoOrNull(v: string | null): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function defaultGrain(fromMs: number, toMs: number): Grain {
  const days = (toMs - fromMs) / (24 * 60 * 60 * 1000);
  if (days <= 2) return "hour";
  if (days <= 60) return "day";
  if (days <= 366) return "week";
  return "month";
}

// Truncate a UTC timestamp string to a bucket key for the requested grain.
// We bucket by UTC for transport simplicity; the client renders short
// MM-DD / HH labels, so UTC vs ET drift on bucket edges is acceptable for
// the dashboard. Day boundaries already line up with ET start-of-day for
// the filter range itself.
function bucketKey(ts: string, grain: Grain): string {
  if (grain === "hour") return ts.slice(0, 13) + ":00"; // "2026-05-05T14:00"
  if (grain === "day") return ts.slice(0, 10);
  if (grain === "week") {
    const d = new Date(ts);
    const dow = d.getUTCDay(); // 0=Sun..6=Sat; align to Monday
    const offset = (dow + 6) % 7;
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - offset));
    return monday.toISOString().slice(0, 10);
  }
  // month
  return ts.slice(0, 7);
}

// Generate the full set of bucket keys that span [fromMs, toMs] at the given
// grain. We pre-fill empties so the chart shows zero days/hours/weeks.
function buildBuckets(fromMs: number, toMs: number, grain: Grain): string[] {
  const out: string[] = [];
  if (grain === "hour") {
    const start = new Date(fromMs);
    start.setUTCMinutes(0, 0, 0);
    for (let t = start.getTime(); t <= toMs; t += 60 * 60 * 1000) {
      out.push(new Date(t).toISOString().slice(0, 13) + ":00");
    }
  } else if (grain === "day") {
    const start = new Date(fromMs);
    start.setUTCHours(0, 0, 0, 0);
    for (let t = start.getTime(); t <= toMs; t += 24 * 60 * 60 * 1000) {
      out.push(new Date(t).toISOString().slice(0, 10));
    }
  } else if (grain === "week") {
    const d = new Date(fromMs);
    const dow = d.getUTCDay();
    const offset = (dow + 6) % 7;
    let cursor = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - offset);
    while (cursor <= toMs) {
      out.push(new Date(cursor).toISOString().slice(0, 10));
      cursor += 7 * 24 * 60 * 60 * 1000;
    }
  } else {
    const d = new Date(fromMs);
    let y = d.getUTCFullYear();
    let m = d.getUTCMonth();
    while (Date.UTC(y, m, 1) <= toMs) {
      const mm = String(m + 1).padStart(2, "0");
      out.push(`${y}-${mm}`);
      m++;
      if (m > 11) {
        m = 0;
        y++;
      }
    }
  }
  return out;
}

interface TimestampRow {
  ts: string;
}

async function fetchTimestamps(
  table: string,
  tsCol: string,
  from: string,
  to: string,
  extra?: Record<string, string>,
): Promise<TimestampRow[]> {
  let q = supabase.from(table).select(tsCol).gte(tsCol, from).lte(tsCol, to);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) q = q.eq(k, v);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r: Record<string, string>) => ({ ts: r[tsCol] }));
}

async function fetchCount(
  table: string,
  tsCol: string,
  from: string,
  to: string,
  extra?: Record<string, string>,
): Promise<number> {
  let q = supabase.from(table).select("*", { count: "exact", head: true }).gte(tsCol, from).lte(tsCol, to);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) q = q.eq(k, v);
  }
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);

    const now = new Date();
    const defaultFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const from = isoOrNull(url.searchParams.get("from")) ?? defaultFrom;
    const to = isoOrNull(url.searchParams.get("to")) ?? now.toISOString();
    const prevFrom = isoOrNull(url.searchParams.get("prevFrom"));
    const prevTo = isoOrNull(url.searchParams.get("prevTo"));
    const requestedGrain = url.searchParams.get("grain");
    const grain: Grain =
      requestedGrain && (VALID_GRAINS as string[]).includes(requestedGrain)
        ? (requestedGrain as Grain)
        : defaultGrain(new Date(from).getTime(), new Date(to).getTime());

    // Current period: pull timestamps for chart bucketing AND derive KPI counts
    // from .length, avoiding 5 separate count queries.
    const [
      submissionsRows,
      completedRows,
      viewsRows,
      sharesRows,
      bookingsRows,
      emailsCount,
      leadsCount,
    ] = await Promise.all([
      fetchTimestamps("magnet_submissions", "created_at", from, to),
      fetchTimestamps("magnet_submissions", "created_at", from, to, { status: "complete" }),
      fetchTimestamps("magnet_views", "viewed_at", from, to),
      fetchTimestamps("magnet_share_events", "created_at", from, to),
      fetchTimestamps("magnet_call_bookings", "created_at", from, to),
      fetchCount("magnet_emails", "captured_at", from, to),
      fetchCount("lead_signups", "created_at", from, to),
    ]);

    const kpis: KpiBucket = {
      submissions: submissionsRows.length,
      completed: completedRows.length,
      views: viewsRows.length,
      shares: sharesRows.length,
      emails: emailsCount,
      bookings: bookingsRows.length,
      leads: leadsCount,
    };

    // Previous-period KPIs (counts only, no buckets needed).
    let kpis_prev: KpiBucket | null = null;
    if (prevFrom && prevTo) {
      const [pSub, pComp, pView, pShare, pBook, pEmail, pLeads] = await Promise.all([
        fetchCount("magnet_submissions", "created_at", prevFrom, prevTo),
        fetchCount("magnet_submissions", "created_at", prevFrom, prevTo, { status: "complete" }),
        fetchCount("magnet_views", "viewed_at", prevFrom, prevTo),
        fetchCount("magnet_share_events", "created_at", prevFrom, prevTo),
        fetchCount("magnet_call_bookings", "created_at", prevFrom, prevTo),
        fetchCount("magnet_emails", "captured_at", prevFrom, prevTo),
        fetchCount("lead_signups", "created_at", prevFrom, prevTo),
      ]);
      kpis_prev = {
        submissions: pSub,
        completed: pComp,
        views: pView,
        shares: pShare,
        emails: pEmail,
        bookings: pBook,
        leads: pLeads,
      };
    }

    // Build the bucket scaffold and tally timestamps into it.
    const fromMs = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    const buckets = buildBuckets(fromMs, toMs, grain);
    const empty = () => Object.fromEntries(buckets.map((b) => [b, 0]));
    const tally = (rows: TimestampRow[]) => {
      const map: Record<string, number> = empty();
      for (const r of rows) {
        if (!r.ts) continue;
        const k = bucketKey(r.ts, grain);
        if (k in map) map[k]++;
      }
      return map;
    };

    const submissionsBy = tally(submissionsRows);
    const completionsBy = tally(completedRows);
    const viewsBy = tally(viewsRows);
    const sharesBy = tally(sharesRows);
    const bookingsBy = tally(bookingsRows);

    const timeseries = buckets.map((b) => ({
      bucket: b,
      date: b, // legacy alias for any caller still keying on "date"
      submissions: submissionsBy[b] ?? 0,
      completions: completionsBy[b] ?? 0,
      views: viewsBy[b] ?? 0,
      shares: sharesBy[b] ?? 0,
      bookings: bookingsBy[b] ?? 0,
    }));

    // Activity feed stays unfiltered: a rolling last-30 stream regardless of the
    // selected window. Operators want to see "what just happened" even when
    // looking at YTD or a custom historical range.
    const [recentSubs, recentCompletions, recentShares, recentBookings] = await Promise.all([
      supabase.from("magnet_submissions").select("slug, first_name, created_at, status").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_breakdowns").select("slug, created_at").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_share_events").select("slug, channel, created_at").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_call_bookings").select("slug, scheduled_at, created_at").order("created_at", { ascending: false }).limit(15),
    ]);

    const activity = [
      ...(recentSubs.data ?? []).map((r) => ({ kind: "submission", at: r.created_at, slug: r.slug, label: `New submission · ${r.first_name ?? "unknown"} · ${r.status}` })),
      ...(recentCompletions.data ?? []).map((r) => ({ kind: "completion", at: r.created_at, slug: r.slug, label: "Map completed" })),
      ...(recentShares.data ?? []).map((r) => ({ kind: "share", at: r.created_at, slug: r.slug, label: `Share via ${r.channel}` })),
      ...(recentBookings.data ?? []).map((r) => ({ kind: "booking", at: r.created_at, slug: r.slug, label: `Booking · ${r.scheduled_at ?? "tbd"}` })),
    ].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 30);

    return opsJson({
      kpis,
      kpis_prev,
      timeseries,
      grain,
      range: { from, to, prevFrom, prevTo, label: rangeLabel(from, to) },
      activity,
    });
  } catch (e) {
    console.error("ops-overview error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});

function rangeLabel(from: string, to: string): string {
  const f = from.slice(5, 10).replace("-", "/");
  const t = to.slice(5, 10).replace("-", "/");
  return `${f} to ${t}`;
}
