// Required secrets — set in Supabase project dashboard:
// OPENAI_API_KEY              → platform.openai.com
// SUPABASE_URL                → auto-available in Edge Functions
// SUPABASE_SERVICE_ROLE_KEY   → auto-available in Edge Functions
//
// LinkedIn enrichment note: this function does NOT use Proxycurl.
// Both the website and the LinkedIn profile URL are fetched via the
// Jina Reader proxy (https://r.jina.ai/<url>) which returns a clean
// markdown rendering of any public page — no API key required.
// OpenAI then reads both sources to produce the RROS breakdown.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SYSTEM_PROMPT = `You are an expert in the Relationship Revenue OS (RROS) — a GTM framework for professional services firms built by Mabbly.

THE RROS FRAMEWORK:

DEFINITION: GTM for professional services is a system for activating the market you already own.

THE FORMULA: Signal + Proof + Context = Response, Not Pitch

FIVE TRUTHS:
I.   Every firm already has enough relationships to hit their next revenue milestone.
II.  The bottleneck is never leads. It is activation.
III. Proof is the currency of professional services. Not content. Not cold outreach.
IV.  The relationship you already have is the most valuable lead you will ever generate.
V.   GTM is not a campaign. It is a system.

FIVE ORBITS:
⊙01 Core Proof — Active clients, case studies, reference accounts.
⊙02 Active — Current pipeline, engaged prospects, deals in motion.
⊙03 Dead Zone — Dormant relationships. 60-96% of any firm's CRM. The single biggest untapped asset in professional services.
⊙04 Warm Adjacency — Referrals, intros, adjacent networks.
⊙05 New Gravity — New relationships via content and thought leadership.

FIVE LAYERS (in order — never skip):
DISCOVER → PROVE → DESIGN → ACTIVATE → COMPOUND

THREE LAWS:
1. Proof before pitch
2. Relationships before revenue
3. Signal before message

DEAD ZONE VALUE FORMULA:
Estimated CRM size × average deal size × 3% reactivation rate.
Estimate CRM size: LinkedIn headcount × 8.
Estimate deal size: infer from service type and firm size. Default to $25,000 if unclear.

YOUR JOB:
Analyze the website and LinkedIn data. Generate a personalized GTM breakdown using the RROS framework. Be specific — reference their actual service language, firm name, and real signals you observed. Do not be generic. If you cannot find a signal, say so plainly.

Return ONLY valid JSON matching this schema. No markdown. No explanation. Just the JSON object.

{
  "welcome_message": "2-3 sentence personalized opener using their firm name and what we observed",
  "dead_zone_value": <integer dollar amount>,
  "dead_zone_reasoning": "1-2 sentences explaining the calculation using their estimated CRM and deal size",
  "gtm_profile_observed": "2-3 sentences on their current GTM motion — reference real things from their website and LinkedIn",
  "gtm_profile_assessment": "2-3 sentences on what RROS says about firms at this stage with this profile",
  "orbit_01": "1 sentence on Core Proof based on visible case studies, results, testimonials",
  "orbit_02": "1 sentence on Active pipeline signals",
  "orbit_03": "1 sentence on Dead Zone size and opportunity",
  "orbit_04": "1 sentence on Warm Adjacency signals",
  "orbit_05": "1 sentence on New Gravity — content footprint",
  "recommended_layer": "<DISCOVER|PROVE|DESIGN|ACTIVATE|COMPOUND>",
  "action_1": "Specific named first action for this firm. Not vague.",
  "action_2": "Specific named second action.",
  "action_3": "Specific named third action.",
  "chapter_callouts": [
    { "chapter": "Preface", "callout": "1-2 sentences connecting this chapter to their specific situation" },
    { "chapter": "Ch.1 — The Dead Zone", "callout": "..." },
    { "chapter": "Ch.2 — The Wrong Map", "callout": "..." },
    { "chapter": "Ch.3 — The Formula", "callout": "..." },
    { "chapter": "Ch.4 — Five Truths, The Core, The Orbits", "callout": "..." },
    { "chapter": "Ch.5 — DISCOVER", "callout": "..." },
    { "chapter": "Ch.6 — PROVE", "callout": "..." },
    { "chapter": "Ch.7 — DESIGN", "callout": "..." },
    { "chapter": "Ch.8 — ACTIVATE", "callout": "..." },
    { "chapter": "Ch.9 — COMPOUND", "callout": "..." },
    { "chapter": "Ch.10 — Orbit Implementation Playbook", "callout": "..." },
    { "chapter": "Ch.11 — MAP Template + Discovery Guide", "callout": "..." },
    { "chapter": "Ch.12 — Tools, Calculators, Self-Assessment", "callout": "..." },
    { "chapter": "Closing", "callout": "..." }
  ]
}`;

async function fetchViaJina(url: string, maxChars: number): Promise<string> {
  if (!url) return "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(`https://r.jina.ai/${url}`, {
      signal: controller.signal,
      headers: { Accept: "text/plain" },
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, maxChars);
  } catch (_err) {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let slug: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    slug = body?.slug;

    if (!slug || typeof slug !== "string") {
      return json({ success: false, error: "Missing or invalid slug" }, 400);
    }

    // 1. Fetch submission row
    const { data: submission, error: subErr } = await supabase
      .from("magnet_submissions")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (subErr || !submission) {
      return json(
        { success: false, error: `Submission not found for slug: ${slug}` },
        404,
      );
    }

    // 2. Mark as processing
    await supabase
      .from("magnet_submissions")
      .update({ status: "processing" })
      .eq("slug", slug);

    // 3. Parallel fetches — website + LinkedIn (both via Jina Reader)
    const [websiteResult, linkedinResult] = await Promise.allSettled([
      fetchViaJina(submission.website_url, 6000),
      fetchViaJina(submission.linkedin_url, 4000),
    ]);

    const website_content =
      websiteResult.status === "fulfilled" ? websiteResult.value : "";
    const linkedin_markdown =
      linkedinResult.status === "fulfilled" ? linkedinResult.value : "";

    const linkedin_data: Record<string, unknown> = linkedin_markdown
      ? { source: "jina_reader", markdown: linkedin_markdown }
      : {};

    // 4. Build user message
    const userMessage = `FIRM: ${submission.first_name}, ${submission.role}
WEBSITE: ${submission.website_url}
LINKEDIN: ${submission.linkedin_url}

WEBSITE CONTENT:
${website_content || "(unavailable)"}

LINKEDIN DATA:
${JSON.stringify(linkedin_data)}`;

    // 5. Call OpenAI
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      await supabase
        .from("magnet_submissions")
        .update({ status: "error" })
        .eq("slug", slug);
      return json(
        { success: false, error: "OPENAI_API_KEY not configured" },
        500,
      );
    }

    let parsed: Record<string, unknown>;
    try {
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 4000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!aiRes.ok) {
        const errBody = await aiRes.text();
        throw new Error(`OpenAI ${aiRes.status}: ${errBody}`);
      }

      const completion = await aiRes.json();
      const raw = completion?.choices?.[0]?.message?.content ?? "";
      parsed = JSON.parse(raw);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : String(aiErr);

      await supabase.from("magnet_breakdowns").upsert(
        {
          slug,
          enrichment_error: `AI call/parse failed: ${errMsg}`,
          raw_website_content: website_content || null,
          raw_linkedin_data: linkedin_data,
          chapter_callouts: [],
        },
        { onConflict: "slug" },
      );

      await supabase
        .from("magnet_submissions")
        .update({ status: "error" })
        .eq("slug", slug);

      return json({ success: false, error: errMsg }, 500);
    }

    // 6. Insert breakdown
    const breakdownRow = {
      slug,
      welcome_message: parsed.welcome_message ?? null,
      dead_zone_value:
        typeof parsed.dead_zone_value === "number"
          ? parsed.dead_zone_value
          : Number(parsed.dead_zone_value) || null,
      dead_zone_reasoning: parsed.dead_zone_reasoning ?? null,
      gtm_profile_observed: parsed.gtm_profile_observed ?? null,
      gtm_profile_assessment: parsed.gtm_profile_assessment ?? null,
      orbit_01: parsed.orbit_01 ?? null,
      orbit_02: parsed.orbit_02 ?? null,
      orbit_03: parsed.orbit_03 ?? null,
      orbit_04: parsed.orbit_04 ?? null,
      orbit_05: parsed.orbit_05 ?? null,
      recommended_layer: parsed.recommended_layer ?? null,
      action_1: parsed.action_1 ?? null,
      action_2: parsed.action_2 ?? null,
      action_3: parsed.action_3 ?? null,
      chapter_callouts: Array.isArray(parsed.chapter_callouts)
        ? parsed.chapter_callouts
        : [],
      raw_website_content: website_content || null,
      raw_linkedin_data: linkedin_data,
      enrichment_error: null,
    };

    const { error: insertErr } = await supabase
      .from("magnet_breakdowns")
      .upsert(breakdownRow, { onConflict: "slug" });

    if (insertErr) {
      await supabase
        .from("magnet_submissions")
        .update({ status: "error" })
        .eq("slug", slug);
      return json({ success: false, error: insertErr.message }, 500);
    }

    // 7. Mark complete
    await supabase
      .from("magnet_submissions")
      .update({ status: "complete" })
      .eq("slug", slug);

    return json({ success: true, slug });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (slug) {
      await supabase
        .from("magnet_submissions")
        .update({ status: "error" })
        .eq("slug", slug)
        .then(() => {});
    }
    return json({ success: false, error: errMsg }, 500);
  }
});
