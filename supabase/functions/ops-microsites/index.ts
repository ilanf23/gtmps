// Paginated microsites list with denormalized counts.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const PAGE_SIZE = 50;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
    const sort = url.searchParams.get("sort") ?? "recent";

    let query = supabase
      .from("magnet_submissions")
      .select("slug, first_name, role, website_url, vertical, status, created_at", { count: "exact" });

    if (q) {
      query = query.or(`slug.ilike.%${q}%,first_name.ilike.%${q}%,website_url.ilike.%${q}%`);
    }
    if (sort === "recent") query = query.order("created_at", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    const { data: subs, count, error } = await query;
    if (error) throw error;

    const slugs = (subs ?? []).map((s) => s.slug);

    // Pull denorm counts in parallel for the page.
    const [breakdowns, viewCounts, shareCounts, emailCounts, bookings] = await Promise.all([
      slugs.length
        ? supabase.from("magnet_breakdowns").select("slug, client_company_name, enrichment_error").in("slug", slugs)
        : Promise.resolve({ data: [] as Array<{ slug: string; client_company_name?: string; enrichment_error?: string }> }),
      slugs.length
        ? supabase.from("magnet_views").select("slug, viewed_at").in("slug", slugs)
        : Promise.resolve({ data: [] as Array<{ slug: string; viewed_at: string }> }),
      slugs.length
        ? supabase.from("magnet_share_events").select("slug").in("slug", slugs)
        : Promise.resolve({ data: [] as Array<{ slug: string }> }),
      slugs.length
        ? supabase.from("magnet_emails").select("source_slug").in("source_slug", slugs)
        : Promise.resolve({ data: [] as Array<{ source_slug: string }> }),
      slugs.length
        ? supabase.from("magnet_call_bookings").select("slug, scheduled_at").in("slug", slugs)
        : Promise.resolve({ data: [] as Array<{ slug: string; scheduled_at: string | null }> }),
    ]);

    const bdMap = new Map((breakdowns.data ?? []).map((b) => [b.slug, b]));
    const viewByMap = new Map<string, { count: number; last: string | null }>();
    for (const v of viewCounts.data ?? []) {
      const cur = viewByMap.get(v.slug) ?? { count: 0, last: null };
      cur.count++;
      if (!cur.last || v.viewed_at > cur.last) cur.last = v.viewed_at;
      viewByMap.set(v.slug, cur);
    }
    const shareCountMap = new Map<string, number>();
    for (const s of shareCounts.data ?? []) shareCountMap.set(s.slug, (shareCountMap.get(s.slug) ?? 0) + 1);
    const emailCountMap = new Map<string, number>();
    for (const e of emailCounts.data ?? []) {
      if (!e.source_slug) continue;
      emailCountMap.set(e.source_slug, (emailCountMap.get(e.source_slug) ?? 0) + 1);
    }
    const bookingMap = new Map<string, string | null>();
    for (const b of bookings.data ?? []) bookingMap.set(b.slug, b.scheduled_at);

    const rows = (subs ?? []).map((s) => {
      const bd = bdMap.get(s.slug);
      const v = viewByMap.get(s.slug);
      return {
        slug: s.slug,
        firm_name: bd?.client_company_name ?? null,
        first_name: s.first_name,
        role: s.role,
        website_url: s.website_url,
        vertical: s.vertical,
        status: s.status,
        created_at: s.created_at,
        view_count: v?.count ?? 0,
        last_viewed_at: v?.last ?? null,
        share_count: shareCountMap.get(s.slug) ?? 0,
        email_count: emailCountMap.get(s.slug) ?? 0,
        booking_at: bookingMap.get(s.slug) ?? null,
        enrichment_error: bd?.enrichment_error ?? null,
      };
    });

    return opsJson({ rows, total: count ?? 0, page, pageSize: PAGE_SIZE });
  } catch (e) {
    console.error("ops-microsites error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
