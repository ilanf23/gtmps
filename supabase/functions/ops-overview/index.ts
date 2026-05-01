// Returns KPI counts, 30-day timeseries, and a recent activity feed.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      submissionsAll,
      completedAll,
      viewsAll,
      sharesAll,
      emailsAll,
      bookingsAll,
      submissions30,
      completed30,
      views30,
      shares30,
      bookings30,
      recentSubs,
      recentCompletions,
      recentShares,
      recentBookings,
    ] = await Promise.all([
      supabase.from("magnet_submissions").select("*", { count: "exact", head: true }),
      supabase.from("magnet_submissions").select("*", { count: "exact", head: true }).eq("status", "complete"),
      supabase.from("magnet_views").select("*", { count: "exact", head: true }),
      supabase.from("magnet_share_events").select("*", { count: "exact", head: true }),
      supabase.from("magnet_emails").select("email", { count: "exact", head: true }),
      supabase.from("magnet_call_bookings").select("*", { count: "exact", head: true }),
      supabase.from("magnet_submissions").select("created_at").gte("created_at", since),
      supabase.from("magnet_submissions").select("created_at").eq("status", "complete").gte("created_at", since),
      supabase.from("magnet_views").select("viewed_at").gte("viewed_at", since),
      supabase.from("magnet_share_events").select("created_at").gte("created_at", since),
      supabase.from("magnet_call_bookings").select("created_at").gte("created_at", since),
      supabase.from("magnet_submissions").select("slug, first_name, created_at, status").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_breakdowns").select("slug, created_at").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_share_events").select("slug, channel, created_at").order("created_at", { ascending: false }).limit(15),
      supabase.from("magnet_call_bookings").select("slug, scheduled_at, created_at").order("created_at", { ascending: false }).limit(15),
    ]);

    // Build 30-day buckets keyed by yyyy-mm-dd.
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      days.push(d.toISOString().slice(0, 10));
    }
    const empty = () => Object.fromEntries(days.map((d) => [d, 0]));
    const bucket = (rows: Array<{ created_at?: string; viewed_at?: string }> | null, key: "created_at" | "viewed_at") => {
      const map = empty();
      for (const r of rows ?? []) {
        const ts = (r as Record<string, string | undefined>)[key];
        if (!ts) continue;
        const d = ts.slice(0, 10);
        if (d in map) map[d]++;
      }
      return map;
    };

    const submissionsBy = bucket(submissions30.data ?? [], "created_at");
    const completionsBy = bucket(completed30.data ?? [], "created_at");
    const viewsBy = bucket(views30.data ?? [], "viewed_at");
    const sharesBy = bucket(shares30.data ?? [], "created_at");
    const bookingsBy = bucket(bookings30.data ?? [], "created_at");

    const timeseries = days.map((d) => ({
      date: d,
      submissions: submissionsBy[d],
      completions: completionsBy[d],
      views: viewsBy[d],
      shares: sharesBy[d],
      bookings: bookingsBy[d],
    }));

    const activity = [
      ...(recentSubs.data ?? []).map((r) => ({ kind: "submission", at: r.created_at, slug: r.slug, label: `New submission · ${r.first_name ?? "unknown"} · ${r.status}` })),
      ...(recentCompletions.data ?? []).map((r) => ({ kind: "completion", at: r.created_at, slug: r.slug, label: "Map completed" })),
      ...(recentShares.data ?? []).map((r) => ({ kind: "share", at: r.created_at, slug: r.slug, label: `Share via ${r.channel}` })),
      ...(recentBookings.data ?? []).map((r) => ({ kind: "booking", at: r.created_at, slug: r.slug, label: `Booking · ${r.scheduled_at ?? "tbd"}` })),
    ].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 30);

    return opsJson({
      kpis: {
        submissions: submissionsAll.count ?? 0,
        completed: completedAll.count ?? 0,
        views: viewsAll.count ?? 0,
        shares: sharesAll.count ?? 0,
        emails: emailsAll.count ?? 0,
        bookings: bookingsAll.count ?? 0,
      },
      timeseries,
      activity,
    });
  } catch (e) {
    console.error("ops-overview error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
