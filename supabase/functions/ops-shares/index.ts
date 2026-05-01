// Share/affiliate tracking. Outbound (magnet_shares + legacy magnet_share_events),
// inbound (magnet_views with referrer_slug set), top sharers leaderboard.
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
    const [outboundNew, outboundLegacy, inbound, topSharersRaw] = await Promise.all([
      supabase.from("magnet_shares").select("*").order("shared_at", { ascending: false }).limit(100),
      supabase.from("magnet_share_events").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("magnet_views").select("*").not("referrer_slug", "is", null).order("viewed_at", { ascending: false }).limit(100),
      supabase.from("magnet_views").select("referrer_slug").not("referrer_slug", "is", null),
    ]);

    const tally = new Map<string, number>();
    for (const r of topSharersRaw.data ?? []) {
      if (!r.referrer_slug) continue;
      tally.set(r.referrer_slug, (tally.get(r.referrer_slug) ?? 0) + 1);
    }
    const topSharers = Array.from(tally.entries())
      .map(([slug, count]) => ({ slug, downstream_visits: count }))
      .sort((a, b) => b.downstream_visits - a.downstream_visits)
      .slice(0, 20);

    return opsJson({
      outbound_new: outboundNew.data ?? [],
      outbound_legacy: outboundLegacy.data ?? [],
      inbound: inbound.data ?? [],
      top_sharers: topSharers,
      attribution_wired: false, // flips true after Phase 3
    });
  } catch (e) {
    console.error("ops-shares error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
