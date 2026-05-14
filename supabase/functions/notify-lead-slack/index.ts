// Posts a Slack notification to the same #microsite-gtmps channel used by
// the magnet flow. Called fire-and-forget from the browser after a lead
// signup form submits successfully. Failures are swallowed.
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  source: z.string().min(1).max(64),
  variant: z.string().max(32).nullable().optional(),
  email: z.string().email().max(320),
  first_name: z.string().max(120).nullable().optional(),
  last_name: z.string().max(120).nullable().optional(),
  firm: z.string().max(200).nullable().optional(),
  page_path: z.string().max(500).nullable().optional(),
  message: z.string().max(2000).nullable().optional(),
});

const SOURCE_LABEL: Record<string, string> = {
  beta_reader: "Beta reader signup",
  notify_ai: "Mabbly.ai notify signup",
  notify_com: "Mabbly.com notify signup",
  contact: "Contact form submission",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const p = parsed.data;

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const slackKey = Deno.env.get("SLACK_API_KEY");
    if (!lovableKey || !slackKey) {
      console.warn("[notify-lead-slack] missing keys");
      return new Response(JSON.stringify({ ok: false, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
    const label = SOURCE_LABEL[p.source] ?? `Lead signup (${p.source})`;
    const lines = [
      `*${label}*`,
      name ? `Name: ${name}` : null,
      `Email: ${p.email}`,
      p.firm ? `Firm: ${p.firm}` : null,
      p.page_path ? `Page: ${p.page_path}` : null,
      p.message ? `Message: ${p.message}` : null,
    ].filter(Boolean);
    const text = lines.join("\n");

    const res = await fetch("https://connector-gateway.lovable.dev/slack/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": slackKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "microsite-gtmps",
        text,
        username: "Mabbly Leads",
        icon_emoji: ":mailbox_with_mail:",
        unfurl_links: false,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[notify-lead-slack] http error", res.status, body);
      return new Response(JSON.stringify({ ok: false, status: res.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
    if (data && data.ok === false) {
      console.warn("[notify-lead-slack] api error", data.error);
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.warn("[notify-lead-slack] threw", e instanceof Error ? e.message : String(e));
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});