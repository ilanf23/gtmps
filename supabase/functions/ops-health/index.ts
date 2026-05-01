// Health: enrichment errors, long-pending submissions, daily stats.
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
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [errors, pending, daily] = await Promise.all([
      supabase
        .from("magnet_breakdowns")
        .select("slug, enrichment_error, created_at")
        .not("enrichment_error", "is", null)
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("magnet_submissions")
        .select("slug, first_name, created_at, status")
        .eq("status", "pending")
        .lt("created_at", fiveMinAgo)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("magnet_submissions")
        .select("created_at, status")
        .gte("created_at", thirtyDaysAgo),
    ]);

    // Build per-day stats.
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      days.push(d.toISOString().slice(0, 10));
    }
    const stats: Record<string, { submissions: number; completed: number; errors: number }> = {};
    for (const d of days) stats[d] = { submissions: 0, completed: 0, errors: 0 };
    for (const r of daily.data ?? []) {
      const d = r.created_at?.slice(0, 10);
      if (!d || !(d in stats)) continue;
      stats[d].submissions++;
      if (r.status === "complete") stats[d].completed++;
      if (r.status === "error") stats[d].errors++;
    }
    const dailyStats = days.map((d) => ({ date: d, ...stats[d] }));

    return opsJson({
      enrichment_errors: errors.data ?? [],
      pending_long: pending.data ?? [],
      daily_stats: dailyStats,
    });
  } catch (e) {
    console.error("ops-health error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
