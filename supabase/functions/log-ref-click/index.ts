// Public endpoint: log a click on a referral link.
// Called fire-and-forget by the frontend when a visitor lands with ?ref=.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const code = typeof body?.code === "string" ? body.code.trim().slice(0, 80) : "";
    if (!code) return new Response(JSON.stringify({ ok: false }), { status: 400, headers: corsHeaders });

    // Validate code exists and is not archived.
    const { data: codeRow } = await supabase
      .from("magnet_referral_codes")
      .select("code, archived_at")
      .eq("code", code)
      .maybeSingle();
    if (!codeRow || codeRow.archived_at) {
      return new Response(JSON.stringify({ ok: false, error: "unknown code" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fingerprint = typeof body?.visitor_fingerprint === "string" ? body.visitor_fingerprint.slice(0, 120) : null;
    const landingPath = typeof body?.landing_path === "string" ? body.landing_path.slice(0, 500) : null;
    const referrerUrl = typeof body?.referrer_url === "string" ? body.referrer_url.slice(0, 500) : null;
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

    await supabase.from("magnet_ref_clicks").insert({
      code,
      visitor_fingerprint: fingerprint,
      landing_path: landingPath,
      referrer_url: referrerUrl,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("log-ref-click error", e);
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: corsHeaders });
  }
});
