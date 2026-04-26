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
import { BOOK_FRAMEWORK_CONTEXT } from "../_shared/book-context.ts";

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

const SYSTEM_PROMPT = `You are a GTM analyst trained on Mabbly's Relationship Revenue OS (RROS).
You have scraped the firm's website. Your job is to produce a personalized
GTM breakdown that reads like it was written by someone who spent an hour
studying this specific firm — not a generic template.

RULES — non-negotiable:
1. Every sentence must reference something SPECIFIC from the scraped website
   content. Quote their actual language, name their actual services, reference
   their actual positioning. Never write a sentence that could apply to
   any other firm.
2. Orbit names MUST be exactly: Inner Circle, Warm Network, Dead Zone,
   Content Gravity, New Gravity (in that order, IDs 01-05).
3. chapterCallouts array must contain EXACTLY 3 entries — the 3 chapters
   most relevant to this firm's specific situation. No more.
4. The headline must be a sharp, specific observation about this firm's
   GTM situation — not a greeting.
5. formulaAnalysis labels are: signal, proof, context, verdict.
6. Quick wins must name a specific action tied to what you found on their
   website — never generic advice like "audit your CRM."

OUTPUT — return valid JSON matching this exact shape, nothing else:
{
  "companyName": "string — the firm's actual name from the website",
  "headline": "string — one sharp observation, 10 words max, no greeting",
  "subheadline": "string — one sentence naming their specific GTM gap",
  "formulaAnalysis": {
    "signal": "string — what specific signals this firm is or isn't sending, reference their actual content/positioning",
    "proof": "string — what proof exists or is missing, name their actual clients/results if visible on the site",
    "context": "string — what context they are or aren't giving prospects, reference their actual messaging",
    "verdict": "string — one sentence on what to fix first, specific to them"
  },
  "orbits": [
    { "id": "01", "name": "Inner Circle",    "status": "strong | weak | untapped", "description": "string — specific to this firm" },
    { "id": "02", "name": "Warm Network",    "status": "strong | weak | untapped", "description": "string — specific to this firm" },
    { "id": "03", "name": "Dead Zone",       "status": "strong | weak | untapped", "description": "string — specific to this firm" },
    { "id": "04", "name": "Content Gravity", "status": "strong | weak | untapped", "description": "string — specific to this firm" },
    { "id": "05", "name": "New Gravity",     "status": "strong | weak | untapped", "description": "string — specific to this firm" }
  ],
  "deadZone": {
    "estimate": "string — dollar figure e.g. $1.8M",
    "description": "string — explain the specific math based on what you know about their firm size, deal size, and CRM"
  },
  "layerRecommendation": {
    "startHere": "DISCOVER | PROVE | DESIGN | ACTIVATE | COMPOUND",
    "rationale": "string — why THIS layer for THIS firm specifically, reference something from their website"
  },
  "quickWins": [
    { "title": "string — specific action, not generic", "description": "string — ties back to something observed on their site" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ],
  "chapterCallouts": [
    { "chapterNumber": 0, "callout": "string — 2-3 sentences that name something SPECIFIC about this firm. Must reference their actual situation." }
  ],
  "closingLine": "string — one sentence that names their specific highest-leverage move"
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
          temperature: 0.4,
          max_tokens: 2000,
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

    // 6. Map new prompt schema → existing DB columns (keeps UI + chatbot working)
    const asString = (v: unknown): string | null =>
      typeof v === "string" && v.trim() ? v : null;

    const formula = (parsed.formulaAnalysis ?? {}) as Record<string, unknown>;
    const deadZone = (parsed.deadZone ?? {}) as Record<string, unknown>;
    const layerRec = (parsed.layerRecommendation ?? {}) as Record<string, unknown>;
    const orbitsArr = Array.isArray(parsed.orbits)
      ? (parsed.orbits as Array<Record<string, unknown>>)
      : [];
    const orbitDesc = (idx: number): string | null => {
      const o = orbitsArr[idx];
      if (!o) return null;
      const status = typeof o.status === "string" ? o.status : "";
      const desc = typeof o.description === "string" ? o.description : "";
      return [status ? `[${status}]` : "", desc].filter(Boolean).join(" ").trim() || null;
    };

    const quickWins = Array.isArray(parsed.quickWins)
      ? (parsed.quickWins as Array<Record<string, unknown>>)
      : [];
    const quickWinAt = (idx: number): string | null => {
      const w = quickWins[idx];
      if (!w) return null;
      const title = typeof w.title === "string" ? w.title : "";
      const desc = typeof w.description === "string" ? w.description : "";
      return [title, desc].filter(Boolean).join(" — ") || null;
    };

    // Parse "$1.8M" / "$250,000" → integer dollars
    const parseDollarEstimate = (s: unknown): number | null => {
      if (typeof s === "number") return Math.round(s);
      if (typeof s !== "string") return null;
      const m = s.replace(/,/g, "").match(/\$?\s*([\d.]+)\s*([kKmMbB])?/);
      if (!m) return null;
      const n = parseFloat(m[1]);
      if (!isFinite(n)) return null;
      const mult = m[2]?.toLowerCase() === "k" ? 1_000
        : m[2]?.toLowerCase() === "m" ? 1_000_000
        : m[2]?.toLowerCase() === "b" ? 1_000_000_000
        : 1;
      return Math.round(n * mult);
    };

    const calloutsRaw = Array.isArray(parsed.chapterCallouts)
      ? (parsed.chapterCallouts as Array<Record<string, unknown>>)
      : [];
    const mappedCallouts = calloutsRaw.slice(0, 3).map((c) => {
      const num = c.chapterNumber;
      const chapter = typeof num === "number"
        ? `Ch.${num}`
        : (typeof c.chapter === "string" ? c.chapter : "Ch.");
      return {
        chapter,
        callout: typeof c.callout === "string" ? c.callout : "",
      };
    });

    // Welcome message: prefer headline + subheadline
    const welcome = [asString(parsed.headline), asString(parsed.subheadline)]
      .filter(Boolean)
      .join(" — ") || null;

    // Observed: signal + context. Assessment: proof + verdict + closing.
    const observed = [asString(formula.signal), asString(formula.context)]
      .filter(Boolean)
      .join(" ") || null;
    const assessment = [
      asString(formula.proof),
      asString(formula.verdict),
      asString(parsed.closingLine),
    ].filter(Boolean).join(" ") || null;

    const breakdownRow = {
      slug,
      welcome_message: welcome,
      dead_zone_value: parseDollarEstimate(deadZone.estimate),
      dead_zone_reasoning: asString(deadZone.description),
      gtm_profile_observed: observed,
      gtm_profile_assessment: assessment,
      orbit_01: orbitDesc(0),
      orbit_02: orbitDesc(1),
      orbit_03: orbitDesc(2),
      orbit_04: orbitDesc(3),
      orbit_05: orbitDesc(4),
      recommended_layer: asString(layerRec.startHere),
      action_1: quickWinAt(0),
      action_2: quickWinAt(1),
      action_3: quickWinAt(2),
      chapter_callouts: mappedCallouts,
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
