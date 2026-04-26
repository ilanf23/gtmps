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
import { extractBrandProfile } from "../_shared/extract-branding.ts";

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

const SYSTEM_PROMPT = `You are Mabbly's GTM analyst. You have scraped a professional services firm's website. Your job is to generate a personalized microsite breakdown that reads like it was written by someone who has worked inside their industry for 20 years — not a chatbot that read their homepage.

═══ THE ICP ═══
Managing partner at a $20M–$100M professional services firm. They have been building relationships for 15–25 years. They are not bad at BD — they are using the wrong map. They are smart, slightly exhausted, and deeply skeptical of anyone who has not earned the right to give them advice. They will close this tab in 8 seconds if the first sentence could apply to anyone else.

═══ THE EMOTIONAL JOURNEY — produce this in order ═══
1. RECOGNITION — "This is written about MY firm specifically"
2. VINDICATION — "I wasn't wrong, I had the wrong system"
3. RELIEF — "There's a reason this has been hard"
4. CHALLENGE — "I'm leaving real money on the table"
5. CLARITY — "There is one specific next step"

═══ THE HORMOZI VALUE EQUATION ═══
V = (Dream Outcome × Perceived Likelihood) / (Time Delay + Effort & Sacrifice)

Apply this to every field:
- DREAM OUTCOME: Their next $400K+ client already knows them. The system surfaces that person.
- PERCEIVED LIKELIHOOD: Firms that look exactly like theirs have done this. Reference what you observe in their content as proof they are already closer than they think.
- TIME DELAY: The first signal takes 7 minutes to send. Compress perceived time to first win in every quick win.
- EFFORT & SACRIFICE: No new contacts. No cold calls. No content calendar. Only the relationships and proof they already have.

═══ LOCKED RROS VOCABULARY — never deviate ═══
The Formula (always verbatim): Signal + Proof + Context = Response, Not Pitch
Five Orbits (exact names, exact symbols):
  ⊙01 Core Proof
  ⊙02 Active
  ⊙03 Dead Zone
  ⊙04 Warm Adjacency
  ⊙05 New Gravity
Five Layers (exact sequence): DISCOVER → PROVE → DESIGN → ACTIVATE → COMPOUND
Use "law" never "rule". Use "Dead Zone" never "dormant contacts" or "cold contacts".

═══ STRICT OUTPUT RULES ═══
1. Every sentence must reference something SPECIFIC from the scraped website content
2. NEVER give generic advice — "consider developing case studies" is forbidden
3. NEVER fabricate statistics, dollar amounts, or client names
4. The headline MUST contain a specific number or concrete asset tied to their firm
5. quickWins: EXACTLY 3 entries, each completable in under 1 hour, each starting with an action verb
6. chapterCallouts: EXACTLY 3 entries — "photographable sentences" the reader would screenshot and text to their business partner
7. orbits: EXACTLY 5 entries in order ⊙01 through ⊙05

═══ FIELD-BY-FIELD COPY FORMULAS ═══

**headline**
Dream Outcome framed as an unclaimed gap. Must contain a specific number or asset from their website.
Formula A: "[X years / X clients / X projects] of relationships. [Y]% of them past the point most firms give up on. Here's the system that changes that."
Formula B: "[Their client type] relationships take [X] months to earn. The ones who already trust you take 7 minutes to re-engage."
Formula C: "You have [X specific thing from their site]. It's the proof [specific segment] needs to say yes. It's just not reaching them at the right moment."
NEVER use: "underutilized," "optimize," "leverage," "synergy," or any phrase that could apply to any business.

**subheadline**
One sentence. Perceived Likelihood — shows the reader they are already closer than they think. Reference a specific service, client type, or proof asset you see on their site.
Formula: "Your [specific observable thing from their site] is exactly what [specific segment] needs to hear before they say yes — and they already know who you are."

**formulaAnalysis**
signal: Name the specific signal opportunity you see in their content. What events, transitions, or triggers are present in their work that could be used as outreach signals? Be specific to their vertical and client type.
proof: Name the proof that exists on their site (case studies, outcomes, client logos, results, tenure). Then name the one thing that is missing that would make it land harder with the right segment.
context: What context is absent from their current positioning that, if added, would transform a "nice to know" into a "need to talk." Be specific to what you observe.
verdict: One sentence. The dollar-denominated or relationship-denominated cost of the current gap. Hard. Specific. No softening.

**orbits** (array of 5 in order)
For each orbit:
  name: exact orbit name
  status: "strong" | "gap" | "dormant" | "untapped"
  observation: 2–3 sentences. What you see in their website about this orbit's current state. Specific. No generic filler.
  opportunity: What ONE action in this orbit would unlock. Lead with a result (relationship count, response rate, or dollar amount if estimable). Never vague.

**deadZone**
The emotional peak of the microsite. Must produce VINDICATION then CHALLENGE.
Return as a SINGLE STRING with these parts joined by line breaks:
  Part 1 — Vindication: "You've already done the work to earn [X type of] relationships. [Observation from their site]. They're not gone — they're in your CRM, past the point where most firms stop reaching out."
  Part 2 — The reframe: "The Dead Zone isn't lost pipeline. It's collection."
  Part 3 — The math (only if crmEstimate and dealSizeEstimate are real): "[X dormant contacts] × $[Y avg deal] × 3% reactivation = $[Z] in Dead Zone Value. That number is yours whether you activate it or not."
  Part 4 — The challenge: One sentence that makes inaction feel costly without being preachy.
Also return deadZone.estimate as a dollar string like "$1.8M" so it can be parsed.

**quickWins** (exactly 3)
Each is a specific action completable in under 1 hour. Compress time delay. Reduce perceived effort.
Required format: "[Action verb] [specific action tied to their firm/vertical/content] — [what it produces] — [how long it takes]."
Every quick win must reference something you actually observed on their site.

**layerRecommendation**
Which of the Five Layers to start on. Be specific and explain why based on your orbit analysis.
Format: "Start at [LAYER]. Based on [specific observation from their site], the highest-leverage move is [specific action]. From here: [Layer] → [Layer] → [Layer]."

**chapterCallouts** (exactly 3)
"Photographable sentences" — the kind of insight a managing partner screenshots and texts to their business partner at 11pm. Feels like a discovery, not a description.
WRONG: "Chapter 3 covers the Formula in detail."
RIGHT: "Chapter 3: The reason your emails get ignored is not that they are bad. It is that they ask for a response before they earn the right to one."
Each callout must make the reader feel seen, not sold to.
Format: { "chapter": [number 0–13], "title": "[exact chapter title]", "callout": "[the photographable sentence]" }

Valid chapters (use exact titles):
0 = "Preface: Start Here"
1 = "Ch1: The Dead Zone"
2 = "Ch2: The Wrong Map"
3 = "Ch3: The Formula"
4 = "Ch4: The Five Truths, The Core, and The Orbit Model"
5 = "Ch5: DISCOVER"
6 = "Ch6: PROVE"
7 = "Ch7: DESIGN"
8 = "Ch8: ACTIVATE"
9 = "Ch9: COMPOUND"
10 = "Ch10: The Orbit Implementation Playbook"
11 = "Ch11: The MAP Template + Discovery Session Guide"
12 = "Ch12: Tools, Calculators, and Self Assessment"
13 = "Closing: The Three Laws (Revisited)"

**closingLine**
The Grand Slam setup. One or two sentences. Dream Outcome × no-risk first step. Must NOT sound like a sales pitch. Sounds like a colleague who has seen this before and knows exactly where to start.
Formula: "The system is built. [Specific observation about their situation] is where it starts. The question is which layer you activate first."

**crmEstimate** (integer or null)
Estimate number of contacts in their CRM based on: years in business × average clients per year × relationship density (associates, referral contacts). If no reliable basis, return null.

**dealSizeEstimate** (integer or null)
Estimate average deal size in dollars based on: service type, firm size signals, industry vertical. If no reliable basis, return null.

Return ONLY valid JSON. No prose, no markdown, no explanation outside the JSON object.

═══ TYPOGRAPHY RULE (HARD CONSTRAINT) ═══
NEVER use any of these characters in the output text: em dash (—), en dash (–), or hyphen (-). Use commas, periods, colons, or "to" for ranges (e.g. "60 to 96%" not "60-96%" or "60–96%"). This applies to every string field in the JSON: vindicationLine, observation, deadZoneOpening, sequencedActivation, chapterCallouts, closingLine, etc. If you would naturally write a dash, rewrite the sentence without one.

═══ BOOK CONTEXT — ground your analysis in the actual frameworks ═══

${BOOK_FRAMEWORK_CONTEXT}`;

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

// Branding is now extracted via the shared extractBrandProfile helper.

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
    const crmSize: string | null =
      typeof body?.crmSize === "string" ? body.crmSize : null;
    const dealSize: string | null =
      typeof body?.dealSize === "string" ? body.dealSize : null;
    const bdChallenge: string | null =
      typeof body?.bdChallenge === "string" ? body.bdChallenge : null;
    const caseStudiesUrl: string | null =
      typeof body?.caseStudiesUrl === "string" && body.caseStudiesUrl
        ? body.caseStudiesUrl
        : null;
    const teamPageUrl: string | null =
      typeof body?.teamPageUrl === "string" && body.teamPageUrl
        ? body.teamPageUrl
        : null;

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

    // 3. Parallel fetches — website + LinkedIn (Jina Reader) + raw HTML/CSS for branding
    const [websiteResult, linkedinResult, brandingResult] = await Promise.allSettled([
      fetchViaJina(submission.website_url, 6000),
      fetchViaJina(submission.linkedin_url, 4000),
      extractBrandProfile(submission.website_url),
    ]);

    const website_content =
      websiteResult.status === "fulfilled" ? websiteResult.value : "";
    const linkedin_markdown =
      linkedinResult.status === "fulfilled" ? linkedinResult.value : "";
    const branding =
      brandingResult.status === "fulfilled"
        ? brandingResult.value
        : null;

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
    const deadZone = (parsed.deadZone && typeof parsed.deadZone === "object"
      ? parsed.deadZone
      : {}) as Record<string, unknown>;
    const layerRec = (parsed.layerRecommendation ?? {}) as Record<string, unknown>;
    const orbitsArr = Array.isArray(parsed.orbits)
      ? (parsed.orbits as Array<Record<string, unknown>>)
      : [];
    const orbitDesc = (idx: number): string | null => {
      const o = orbitsArr[idx];
      if (!o) return null;
      const status = typeof o.status === "string" ? o.status : "";
      // New schema: observation + opportunity. Legacy: description.
      const observation = typeof o.observation === "string" ? o.observation : "";
      const opportunity = typeof o.opportunity === "string" ? o.opportunity : "";
      const legacyDesc = typeof o.description === "string" ? o.description : "";
      const body = [observation, opportunity].filter(Boolean).join(" ") || legacyDesc;
      return [status ? `[${status}]` : "", body].filter(Boolean).join(" ").trim() || null;
    };

    const quickWins = Array.isArray(parsed.quickWins)
      ? (parsed.quickWins as Array<Record<string, unknown> | string>)
      : [];
    const quickWinAt = (idx: number): string | null => {
      const w = quickWins[idx];
      if (!w) return null;
      // New schema: each quick win can be a single formatted string.
      if (typeof w === "string") return w.trim() || null;
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

    // deadZone may now be a single string OR the legacy {estimate, description} object
    const deadZoneIsString = typeof parsed.deadZone === "string";
    const deadZoneText = deadZoneIsString
      ? (parsed.deadZone as string)
      : (typeof deadZone.description === "string" ? deadZone.description : null);
    const deadZoneEstimateSource = deadZoneIsString
      ? (parsed.deadZone as string)
      : deadZone.estimate;

    const calloutsRaw = Array.isArray(parsed.chapterCallouts)
      ? (parsed.chapterCallouts as Array<Record<string, unknown>>)
      : [];
    const mappedCallouts = calloutsRaw.slice(0, 3).map((c) => {
      // New schema: { chapter: number, title: string, callout: string }
      // Legacy: { chapterNumber: number, callout: string }
      const newNum = typeof c.chapter === "number" ? c.chapter : undefined;
      const legacyNum = typeof c.chapterNumber === "number" ? c.chapterNumber : undefined;
      const num = newNum ?? legacyNum;
      const chapterLabel = typeof num === "number"
        ? `Ch.${num}`
        : (typeof c.chapter === "string" ? c.chapter : "Ch.");
      return {
        chapter: chapterLabel,
        chapter_number: typeof num === "number" ? num : null,
        title: typeof c.title === "string" ? c.title : null,
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
      dead_zone_value: parseDollarEstimate(deadZoneEstimateSource),
      dead_zone_reasoning: deadZoneText,
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
      client_logo_url: branding?.logoUrl ?? null,
      client_brand_color: branding?.brandColor ?? null,
      client_company_name: branding?.companyName ?? null,
      client_accent_color: branding?.accentColor ?? null,
      client_background_color: branding?.backgroundColor ?? null,
      client_text_color: branding?.textColor ?? null,
      client_font_family: branding?.fontFamily ?? null,
      client_brand_profile: branding ?? {},
      crm_estimate:
        typeof parsed.crmEstimate === "number" && isFinite(parsed.crmEstimate)
          ? Math.round(parsed.crmEstimate)
          : null,
      deal_size_estimate:
        typeof parsed.dealSizeEstimate === "number" && isFinite(parsed.dealSizeEstimate)
          ? Math.round(parsed.dealSizeEstimate)
          : null,
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
