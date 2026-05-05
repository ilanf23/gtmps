// Ops referral codes CRUD + analytics.
//   GET  /                       -> list codes with click+map aggregates
//   POST /                       -> create a code  { code, label, utm_source?, utm_medium?, utm_campaign?, destination_path?, notes?, suppress_slack? }
//   PATCH /                      -> update a code  { code, ...fields }
//   GET  /?code=xxx&detail=1     -> per-code drill: list of submissions
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CODE_RE = /^[a-z0-9][a-z0-9-_]{1,79}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  const url = new URL(req.url);

  try {
    if (req.method === "GET") {
      const detailCode = url.searchParams.get("code");
      if (detailCode) {
        const { data: subs } = await supabase
          .from("magnet_submissions")
          .select("slug, website_url, first_name, status, created_at, vertical")
          .eq("ref_code", detailCode)
          .order("created_at", { ascending: false })
          .limit(500);
        const { data: clicks } = await supabase
          .from("magnet_ref_clicks")
          .select("clicked_at, landing_path, visitor_fingerprint, referrer_url")
          .eq("code", detailCode)
          .order("clicked_at", { ascending: false })
          .limit(500);
        return opsJson({ submissions: subs ?? [], clicks: clicks ?? [] });
      }

      const [codesRes, clicksRes, subsRes] = await Promise.all([
        supabase.from("magnet_referral_codes").select("*").order("created_at", { ascending: false }),
        supabase.from("magnet_ref_clicks").select("code, clicked_at, visitor_fingerprint"),
        supabase.from("magnet_submissions").select("ref_code, created_at").not("ref_code", "is", null),
      ]);

      const clickAgg = new Map<string, { clicks: number; unique: Set<string>; last: string | null }>();
      for (const c of clicksRes.data ?? []) {
        const key = c.code;
        if (!key) continue;
        const e = clickAgg.get(key) ?? { clicks: 0, unique: new Set<string>(), last: null };
        e.clicks++;
        if (c.visitor_fingerprint) e.unique.add(c.visitor_fingerprint);
        if (!e.last || (c.clicked_at && c.clicked_at > e.last)) e.last = c.clicked_at;
        clickAgg.set(key, e);
      }

      const subAgg = new Map<string, { maps: number; last: string | null }>();
      for (const s of subsRes.data ?? []) {
        const key = s.ref_code;
        if (!key) continue;
        const e = subAgg.get(key) ?? { maps: 0, last: null };
        e.maps++;
        if (!e.last || (s.created_at && s.created_at > e.last)) e.last = s.created_at;
        subAgg.set(key, e);
      }

      const rows = (codesRes.data ?? []).map((c: any) => {
        const cl = clickAgg.get(c.code);
        const sa = subAgg.get(c.code);
        const clicks = cl?.clicks ?? 0;
        const uniqueClicks = cl?.unique.size ?? 0;
        const maps = sa?.maps ?? 0;
        const lastClick = cl?.last ?? null;
        const lastMap = sa?.last ?? null;
        const lastActivity = [lastClick, lastMap].filter(Boolean).sort().pop() ?? null;
        const conversion = uniqueClicks > 0 ? maps / uniqueClicks : 0;
        return { ...c, clicks, unique_clicks: uniqueClicks, maps_created: maps, conversion_rate: conversion, last_click_at: lastClick, last_map_at: lastMap, last_activity_at: lastActivity };
      });

      return opsJson({ rows });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const code = String(body?.code ?? "").trim().toLowerCase();
      const label = String(body?.label ?? "").trim();
      if (!CODE_RE.test(code)) return opsJson({ error: "invalid code (a-z, 0-9, -, _, 2-80 chars)" }, 400);
      if (!label) return opsJson({ error: "label required" }, 400);

      const row = {
        code,
        label: label.slice(0, 200),
        utm_source: body?.utm_source ? String(body.utm_source).slice(0, 80) : null,
        utm_medium: body?.utm_medium ? String(body.utm_medium).slice(0, 80) : null,
        utm_campaign: body?.utm_campaign ? String(body.utm_campaign).slice(0, 80) : null,
        destination_path: body?.destination_path ? String(body.destination_path).slice(0, 500) : "/",
        notes: body?.notes ? String(body.notes).slice(0, 1000) : null,
        suppress_slack: !!body?.suppress_slack,
      };
      const { data, error } = await supabase.from("magnet_referral_codes").insert(row).select().single();
      if (error) return opsJson({ error: error.message }, error.code === "23505" ? 409 : 500);
      return opsJson({ row: data });
    }

    if (req.method === "PATCH") {
      const body = await req.json().catch(() => ({}));
      const code = String(body?.code ?? "").trim().toLowerCase();
      if (!code) return opsJson({ error: "code required" }, 400);
      const patch: Record<string, unknown> = {};
      if (typeof body.label === "string") patch.label = body.label.slice(0, 200);
      if ("utm_source" in body) patch.utm_source = body.utm_source ? String(body.utm_source).slice(0, 80) : null;
      if ("utm_medium" in body) patch.utm_medium = body.utm_medium ? String(body.utm_medium).slice(0, 80) : null;
      if ("utm_campaign" in body) patch.utm_campaign = body.utm_campaign ? String(body.utm_campaign).slice(0, 80) : null;
      if (typeof body.destination_path === "string") patch.destination_path = body.destination_path.slice(0, 500) || "/";
      if ("notes" in body) patch.notes = body.notes ? String(body.notes).slice(0, 1000) : null;
      if ("suppress_slack" in body) patch.suppress_slack = !!body.suppress_slack;
      if ("archived" in body) patch.archived_at = body.archived ? new Date().toISOString() : null;

      const { data, error } = await supabase.from("magnet_referral_codes").update(patch).eq("code", code).select().single();
      if (error) return opsJson({ error: error.message }, 500);
      return opsJson({ row: data });
    }

    return opsJson({ error: "method not allowed" }, 405);
  } catch (e) {
    console.error("ops-referrals error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
