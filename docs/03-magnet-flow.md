# 03 · The Magnet Flow

> The personalized AI lead-gen funnel. The most complex piece in this codebase. The single most important conversion surface in the entire Discover Mabbly authority play.

> **Sprint 2 update (2026-05-02 → 2026-05-03):** the standalone `/assess` page was removed. URL submission now lives in the homepage hero (`HeroUrlField` → `lib/magnetSubmit.ts`). All "Add Your Firm" CTAs across the site scroll to that hero field via `lib/scrollToHero.ts`. The `/m/:slug` flow itself is unchanged. A new sibling route `/m/:slug/cohort` was also added (cohort placement view). When you read references to `/assess` or `pages/MagnetAssess.tsx` below, mentally rewrite them as "homepage hero URL field" — the submit logic and target table are otherwise identical. The polling theater also gained a hard-fail recovery surface (no more silent infinite poll).

---

## The flow at a glance

```
   /discover  (hero URL field)     /m/:slug                /book
            │                          │                     │
   ┌────────▼─────────┐            ┌───▼─────┐          ┌────▼────┐
   │ Hero with        │ ──submit──▶│ AI       │ ──CTA──▶│ Calendly│
   │ embedded URL     │            │ enriches │          │ booking │
   │ field            │            │ in ~90s  │          │         │
   └──────────────────┘            └────┬─────┘          └─────────┘
                                         │
                                         ├──▶ /m/:slug/chat     (Talk to the Book)
                                         ├──▶ /m/:slug/read     (Manuscript reader)
                                         ├──▶ /m/:slug/feedback
                                         └──▶ /m/:slug/cohort   (cohort placement, NEW Sprint 2)
```

**Hero submit. One AI pipeline. Zero manual work per lead.**

---

## V10 spec — the locked architecture (April 27 2026)

The Magnet flow has gone through 10 major iterations. V10 is the current locked architecture. Three major shifts and one major addition from V6:

### Shift 1 — Form simplified from 10 fields to 1

| Old (V6) | New (V10) |
|---|---|
| 10 fields: name, role, email, LinkedIn, CRM size, deal size, BD challenge, case studies URL, team page URL, website | **Single field — website URL only** |

**Rationale:** Hormozi + B2B benchmark research both confirmed: more fields = exponentially lower completion. PS firm partners are time-pressed. With 90-second AI analysis, the website alone is sufficient. Email captured optionally on the result page (`Email me this map`) instead of gated upfront.

**Deprecated form fields (do NOT collect):** name, role, email, LinkedIn, CRM size, deal size, BD challenge, case studies URL, team page URL.

Dead Zone calculation continues using industry default (60–80% dormancy) with adjustable slider on result page.

### Shift 2 — Result page restructured as RESEARCH ARTIFACT

**11 sections with DUAL CTA strategy.** Research artifact framing throughout.

```
01 — Personalized Header (score-adaptive subheader)
02 — Five Orbits Visualization
03 — Core Analysis (Observed / Hypothesis / Question)
04 — Proof Analysis (Observed / Hypothesis / Question)
05 — COMPACT CTA CARD ("Skip ahead. Book Adam now.")        ← First conversion opportunity
06 — Why This Research Matters (Copulsky, Deloitte, Kellogg)
07 — The Value (In Their Words) — Madcraft, Calliope, SPR
08 — FULL CTA SECTION (inline calendar + score-adaptive)    ← Primary CTA
09 — The One Move (highest-leverage action for THIS firm)
10 — Signal + Cadence + Research Flag (deeper findings)
11 — Manuscript Anchor + Share + Save
```

**Rationale:** Synthetic ICP 10-iteration optimization showed CTA at position 5 prevents decision fatigue (was a breakthrough +16 points). Dual CTA serves momentum personas at 5 and skeptics/institutional at 8 after credibility build.

### Shift 3 — Email gate REMOVED, full reveal default

| Old (V6) | New (V10) |
|---|---|
| Result reveal partial then email gate to unlock full map | **FULL reveal immediately. No blur, no lock, no email gate.** Email is OPTIONAL save feature ("Email me this map"), not a gate. |

**Rationale:** PS firm partners reject manipulation. The blurred-lock pattern works for SaaS but actively damages trust with this audience. Optimization metric pivoted from email capture to schedule-meeting click. **Trust converts to calls.**

### Addition — Score-adaptive copy variants (A / B / C / D)

The full CTA section at position 8 uses 4 score-adaptive variants:

| Variant | Persona | Approach |
|---|---|---|
| **A** | Skeptics, score under 40 OR small firm | Research reciprocity + risk reversal ("if no value in 5 min, we'll stop") |
| **B** | Institutional, $50M+ revenue, conservative vertical | Deloitte/Kellogg framework + manuscript reference |
| **C** | Operational personas, agency/MSP/engineering | Clear agenda + research feedback loop |
| **D** | ROI-focused, time-pressed | Dollar math + 90-day plan emphasis |

Vertical context overrides automatically: `/law` → Variant B, `/agency` → Variant C, etc.

### Addition — Vertical context flow-through

When visitor arrives with `?vertical=law` (or similar), copy adapts across all 3 stages:

- **Form page eyebrow** → vertical-specific ("ORIGINATION STRATEGY ANALYSIS")
- **Wait stage voiceover** → native vocabulary
- **Result page header** → includes vertical suffix ("· Law Firm")
- **CTA Variant** → defaults to vertical-appropriate
- **Email subject** → vertical-native term

When no vertical param (visitor came from `/discover`), uses generic copy.

### Addition — Tonal discipline as RESEARCH COLLABORATION

Not sales pitch. Not consulting diagnostic. **Research artifact.**

- "We observe" not "we identified gaps"
- "Hypothesis" and "feedback" language throughout
- Visitor is contributor, not lead
- Each section ends with question to visitor (Observed / Hypothesis / **Question**)
- "No pitch" appears in CTA copy explicitly

---

## Page-by-page deep dive

### Page 1 — `/discover` (entry)

The CTA above the fold is `Add Your Firm →`, routing to `/assess`.

**Per-vertical CTA variants** (8 vertical pages):

| Route | CTA text |
|---|---|
| `/law` | See Your Firm's Origination Profile → |
| `/consulting` | See Your Firm's Practice Growth Profile → |
| `/accounting` | See Your Firm's Client Development Profile → |
| `/msp` | See Your Firm's GTM Profile → |
| `/advisory` | See Your Firm's Prospecting Strategy Profile → |
| `/ae` | See Your Firm's BD Profile → |
| `/recruiting` | See Your Firm's Mandate Origination Profile → |
| `/agency` | See Your Firm's New Business Profile → |

All CTAs route to `/assess?vertical=[name]`. The vertical param flows through the entire post-CTA experience.

### Page 2 — `/assess` (intake)

**File:** `src/pages/MagnetAssess.tsx`

**Form:** Single field — `https://yourfirm.com`. CTA: `Build My Map →`. Trust line: `Free. 90 seconds. Full map shown — no email required to see it.`

**On submit:**

1. Zod validates the URL
2. `generateMagnetSlug(websiteUrl)` → format derived from URL stem (e.g., `agconsultingpartners.com` → slug `agconsultingpartners`)
3. Insert row to `magnet_submissions` Supabase table with `enrich_status = 'pending'`
4. Fire-and-forget `POST` to `enrich-magnet` Edge Function with the slug + website URL + vertical context
5. Navigate to `/m/[slug]`

### Page 3 — `/m/:slug` (the MAP)

**File:** `src/pages/MagnetSite.tsx` + `src/components/magnet/MagnetBreakdown.tsx`

**Loading state:** Polls `magnet_submissions` row by slug every 3s (with backoff). Shows `MagnetWaitTheater` with:

- 4 stages: "Reading homepage" → "Mapping orbits" → "Calculating Dead Zone" → "Building breakdown"
- Time counter (00:04 / 01:30)
- Firm logo (extracted from scrape)
- Progress bar 0–100%

When `enrich_status === 'complete'` AND `breakdown_data` is populated → renders `<MagnetShell>` + `<MagnetBreakdown>`.

**Failure modes** to handle (some still pending — see [04-roadmap.md](./04-roadmap.md)):
- Hard timeout (`HARD_TIMEOUT_MS`) — show graceful error, capture email for async delivery
- Missing-row grace period (race between insert and edge function start)
- Rate-limited Jina scrape
- gpt-4o-mini parse failure

### Page 4 — `/book` (booking)

**File:** `src/pages/MagnetBook.tsx`

Static booking page wrapped in `MagnetShell`. Shows 4 expectations:
1. What happens in the 90-minute session
2. What you'll leave with
3. Who this is for
4. What it costs (free)

Embeds Calendly inline. **The Calendly URL is currently a placeholder** — replace before launch (see [04-roadmap.md](./04-roadmap.md)).

### Sub-routes — `/m/:slug/chat`, `/read`, `/feedback`

All three share `MagnetShell` (header, theming, footer). Each loads `breakdown_data` for the slug from Supabase.

| Sub-route | Component | Edge function | Purpose |
|---|---|---|---|
| `/chat` | `BookChat` | `book-chat` | Floating chat scoped to the firm's GTM context |
| `/read` | `BookReader` | (none — static PDF) | Manuscript PDF reader via `react-pdf` |
| `/feedback` | `FeedbackForm` | `submit-feedback` | Standalone feedback capture |

---

## The AI enrichment pipeline (`enrich-magnet`)

**File:** `supabase/functions/enrich-magnet/index.ts`

**Trigger:** Fire-and-forget POST from `/assess` on form submit. The edge function picks up the request, processes asynchronously, and writes back to Supabase. The client polls until `enrich_status === 'complete'`.

### Pipeline steps

```
1. Receive payload
   └─ { slug, websiteUrl, vertical }

2. Scrape via Jina Reader
   └─ GET https://r.jina.ai/{websiteUrl}
   └─ Returns clean text (~3,000 chars)

3. Extract brand colors
   └─ Fetch raw HTML, regex top 8 hex codes by frequency
   └─ AI later picks 5 from this set

4. Build intake context block
   └─ Vertical context, layer map (which RROS layer matters for this vertical)

5. Call gpt-4o-mini
   └─ System prompt: Hormozi × RROS framework
   └─ Temperature: 0.4
   └─ Max tokens: 2000

6. Parse JSON response
   └─ Validate against BreakdownData schema
   └─ If parse fails → set enrich_status = 'error', notify

7. Upsert to Supabase
   └─ breakdown_data: <json>, enrich_status: 'complete'
```

**Cost:** ~$0.002 per call. At 1,000 maps/month, that's $2/month in OpenAI cost. Negligible.

### AI output schema (`BreakdownData`)

```typescript
{
  companyName: string;
  headline: string;            // Dream Outcome framed as a gap
  subheadline: string;          // Perceived Likelihood in one sentence
  formulaAnalysis: {
    signal: string;
    proof: string;
    context: string;
    verdict: string;            // dollar-denominated cost of the gap
  };
  orbits: Array<{
    name: "Core Proof" | "Active" | "Dead Zone" | "Warm Adjacency" | "New Gravity";
    status: "strong" | "gap" | "dormant" | "untapped" | "mixed";
    score: number;              // 0-100
    observation: string;
    opportunity: string;
  }>;                          // length 5
  deadZone: string;            // emotional peak copy
  layerRecommendation: string; // which of 5 layers to start on + why
  quickWins: Array<string>;    // length 3, each <1 hour, action verb
  chapterCallouts: Array<{
    chapter: number;
    title: string;
    callout: string;            // photographable sentence
  }>;                          // length 3
  closingLine: string;
  branding: {
    primary: string;            // hex
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  crmEstimate: number | null;
  dealSizeEstimate: number | null;
}
```

**The `branding` object** is consumed by `useClientTheme` and applied as CSS variables on the `MagnetShell` wrapper. Per V10, this should produce per-firm visual personalization. **Currently broken on most firms — defaults to Mabbly navy regardless. Tracked in [04-roadmap.md](./04-roadmap.md).**

---

## The MAP — 12-field artifact (per book chapter 11)

The full Discovery Session MAP (Tier 3) includes 12 fields. The auto-generated MAP at `/m/:slug` is a Tier 2 derivative that surfaces the most-actionable subset:

| Field | In auto-MAP? | Source |
|---|---|---|
| The Core (purpose + niche) | ✅ Section 03 | AI-generated |
| Session Voice (5 verbatim phrases) | ❌ Tier 3 only | Discovery Session |
| Corporate Objectives | ❌ | Discovery Session |
| Core Values | ❌ | Discovery Session |
| ICP Lock | Partial (vertical inference) | AI-inferred from site |
| Beachhead Segment | ❌ | Discovery Session |
| Spectrum Position | ❌ | Discovery Session |
| Dead Zone Estimate | ✅ Section 04 + Impact Model | AI + sliders |
| Orbit Priority | ✅ Section 02 + 09 (One Move) | AI |
| Primary Signal Type | ✅ Section 10 | AI |
| Vision State | ❌ | Discovery Session |
| Competitive Landscape Signal | Partial Section 10 | AI |

**The Tier 2 MAP gives a strong taste of the Tier 3 MAP** without requiring a 60-minute call. That's the conversion mechanism — readers see what 4 of the 12 fields look like, want the other 8, book the call.

---

## Database — `magnet_submissions` table

| Column | Type | Source |
|---|---|---|
| `id` | uuid | auto |
| `slug` | text | `generateMagnetSlug(url)` |
| `website_url` | text | form |
| `enrich_status` | text | `pending` → `complete` → `error` |
| `breakdown_data` | jsonb | AI-generated JSON (BreakdownData shape) |
| `vertical` | text, nullable | URL param |
| `created_at` | timestamptz | auto |

**RLS:** Anon role can `INSERT` (so `/assess` writes work) and `SELECT` (so `/m/:slug` polling works). Service role has full access for the edge function.

Roadmap-pending columns (per ops dashboard plan):
- `view_count` (int) — denormalized counter
- `last_viewed_at` (timestamptz)
- `share_count` (int)
- `booking_count` (int)

---

## Failure modes — what could go wrong

| Failure | Symptom | Current handling | Roadmap fix |
|---|---|---|---|
| **Wrong firm name** | Header shows service line ("Growth Strategy") instead of firm | None — visible to user | Title → og:site_name → URL stem fallback chain (P0) |
| **Templated Hypothesis/Question** | Identical boilerplate across all firms | None | Move into AI call tied to actual `Observed` text (P0) |
| **Fabricated $1.2M** | "Could cost you $1.2M" appears word-for-word on multiple firms | None — violates verified-facts lock | Audit prompt, replace with calculated estimate or remove (P0) |
| **Score compression** | Every firm scores 78–84/26–30/53–55 | None — narrows below useful signal | Widen signal source (multi-page scrape) + temperature variance (P1) |
| **Brand color extraction fails** | Default Mabbly navy on every map | Falls back to default | Force non-default if any branded color extractable (P2) |
| **Jina scrape blocked** | JS-only SPA with no SSR returns empty text | AI gets weak input → weak output | Surface "couldn't read this site — try /about URL" error (P1) |
| **gpt-4o-mini parse fail** | Bad JSON returned | `enrich_status = 'error'`, no UI handling | Build graceful error state with email-when-ready capture (P0) |
| **Slug collision** | Two firms with same domain stem create same slug | Last write wins | Append 4-char hash to all slugs (P1) |
| **Hard timeout** | Edge function takes >2 min | Polling gives up | Already has `HARD_TIMEOUT_MS` — verify the UI handles it gracefully |

---

## What's NOT yet in the Magnet flow (planned)

Per [04-roadmap.md](./04-roadmap.md):

- "Did we nail it?" capture (copy exists at sections 03/04, mechanism doesn't)
- Org-specific chat starter prompts (currently 3 generic prompts)
- In-book inline feedback layer at `/m/:slug/read`
- PostHog event taxonomy for attribution drop-off tracking
- Engagement-triggered email capture after Section 5 (per email capture strategy memo)
- Share-triggered double email capture (sharer + recipient)
- Exit intent salvage modal
- Pre-generated microsites for cold email cohort
- 90-day re-take automation
- Calendly webhook → bookings tracking

---

## Working on the Magnet flow — practical guidance

### When changing the AI prompt

1. Update `supabase/functions/enrich-magnet/index.ts`
2. **Test with at least 3 ICP firms** (use Adam's named cohort: AG Consulting Partners, Chief Outsiders, Jabian — submit each via `/assess`, score outputs)
3. Verify `breakdown_data` JSON shape matches `BreakdownData` type in `src/types/magnet.ts`
4. Update render code in `MagnetBreakdown.tsx` if schema changes
5. Roll back via `git revert` if quality regresses

### When changing the result page layout

1. Edit `src/components/magnet/MagnetBreakdown.tsx` (or sub-components in `magnet/v10/`)
2. Test at 375px, 414px, 768px, 1024px, 1280px, 1920px
3. Verify all 11 sections still render
4. Verify the floating chat doesn't collide with section CTAs
5. Verify the section progress rail (left side) updates correctly

### When changing the wait theater

1. Edit `src/components/magnet/MagnetWaitTheater.tsx`
2. The 4 stages are time-based (not actually tied to AI progress) — keep that in mind
3. Test the timeout path

### When testing locally

You can submit `https://example.com` as a test URL. The edge function will run the full pipeline, AI will generate a generic-looking MAP. Useful for exercising the flow without burning real-firm slugs.

For real ICP testing, use Adam's cohort:
- `https://www.agconsultingpartners.com`
- `https://chiefoutsiders.com`
- `https://www.jabian.com`
- `https://koltinconsulting.com`
- `https://cmgcg.com`

**Each test submission costs ~$0.002.** Don't worry about it.

---

## See also

- [01-strategy.md](./01-strategy.md) — The strategic context behind this flow
- [02-architecture.md](./02-architecture.md) — The codebase architecture
- [04-roadmap.md](./04-roadmap.md) — What's next for the Magnet flow
- [06-references.md](./06-references.md) — Lovable prompts library, Notion sources

---

*Last updated: May 1, 2026*
