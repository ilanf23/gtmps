## Post-CTA Flow Rebuild

Rebuild the `/assess → /m/:slug` flow into three connected experiences: a 3-step micro-form, a 4-stage cinematic wait, and a two-phase reveal with an inline email confirm gate.

---

## Open questions before build

A few decisions need confirmation — flagging now so we don't ship the wrong thing:

1. **Dropped form fields.** The new spec collects only `name`, `email`, `websiteUrl`. The current form also collects `role`, `linkedinUrl`, `crmSize`, `dealSize`, `bdChallenge`, `caseStudiesUrl`, `teamPageUrl`. The enrich edge function uses `crmSize`, `dealSize`, `bdChallenge`, `caseStudiesUrl`, `teamPageUrl` to compute the Dead Zone value and pick a starting layer.
   - **Recommended:** drop them from the form and have `enrich-magnet` infer everything from the website scrape (it already does most of this). Dead Zone falls back to industry defaults when not provided.
   - **Alternative:** keep them as a hidden Step 4 or as optional advanced disclosure.
2. **Adam founder video.** Spec says "20 sec, Adam, inline embedded with custom thumbnail." We don't have this asset in the repo. Options: (a) you provide MP4 + thumbnail, (b) ship a styled placeholder card with a "Play intro" button that opens a modal once the asset arrives, (c) skip the video for v1.
3. **Adam voiceover for wait stages.** Same question — do we have audio files, or ship the optional audio button as disabled/hidden until provided?
4. **Booking link.** Primary CTA is "Book a 20-min walkthrough with Adam" — what calendar URL?

I'll proceed assuming: (1) drop fields, (2) placeholder video card, (3) hide audio button until assets land, (4) use `mailto:adam@mabbly.com` until a Calendly link is supplied. Tell me if any of those should change.

---

## Stage 1 — `/assess` 3-step micro-form

Rewrite `src/pages/MagnetAssess.tsx` as a stepper.

**Sticky top bar (fixed, h-12):** progress bar + "Step N of 3" label, gold fill animates on step change.

**Persistent above-form block (always visible):**
- Eyebrow: `GET YOUR PERSONALIZED ANALYSIS`
- H1: "Understand your firm's revenue potential in 90 seconds."
- Sub: positioning / messaging / dormant relationship signal copy
- Methodology line in gold caps: `ANALYZES: POSITIONING · MESSAGING · CTAs · CONSISTENCY`
- Founder video card (placeholder until asset lands): muted-by-default `<video>` with custom poster, captions on, auto-pauses on first form input via shared focus listener
- Static social proof strip: "Trusted by 60+ managing partners at PS firms $5M to $100M"

**Steps:** one input per screen, slide-in transitions, Enter advances, "Continue →" button, Back chevron after Step 1.
- Step 1: `name` → after submit, fire dynamic toast "Maria from Northwind just completed her analysis · 4 min ago" (rotates from a 10-name array of plausible firms; deterministic per session)
- Step 2: `email`
- Step 3: `websiteUrl` → CTA "Build My Analysis →" (gold pill) + trust microline "Free. 90 seconds. No credit card. Confidential."

**Validation:** zod per step; can't continue until current field passes.

**Submit:** insert into `magnet_submissions` with the three collected fields plus nulls for the dropped columns (DB columns stay; just pass nulls), then `void supabase.functions.invoke('enrich-magnet', ...)` and `navigate('/m/:slug')`.

**Mobile (375px):** full-width 48px tap targets; sticky bar collapses to thin progress only.

---

## Stage 2 — `/m/:slug` cinematic wait

Rewrite `MagnetLoadingScene` (or add a new `MagnetWaitTheater`) and update `MagnetSite.tsx` to drive it.

**Persistent header:** "Building your RROS map for {Company}" + live `MM:SS / 01:30` timer + top progress bar synced to elapsed time (cap at 88% until enrichment actually completes).

**Four scripted stages (timed by elapsed seconds, not poll state):**

| Stage | Window | Visual | Status ticker |
|---|---|---|---|
| 1 | 0–22s | Domain card slides in (favicon via `https://www.google.com/s2/favicons?domain=…&sz=64`, page title pulled from submission) | "Found your headline…" → "Reading your value prop…" → "Identifying your services…" |
| 2 | 22–45s | Service cards fade in one-by-one (4 generic chips: Strategy / Branding / Delivery / Growth) | "Detecting service areas…" → "Checking CTA clarity…" |
| 3 | 45–70s | Five Orbits SVG draws ring-by-ring around a center node | "Estimating CRM size…" → "Detecting engagement signals…" → "Mapping your Five Orbits…" + mid-stage trust callout card |
| 4 | 70–90s | Score number counts up from 0 to a teaser value (use `useCountUp`) | "Calculating your Relationship Revenue Score…" then at 85s "Almost ready…" |

Optional audio button (top-right, ghost) — hidden until voiceover assets exist.

**Reduced motion:** `useReducedMotion()` collapses all SVG animation to a static stage label list with the top progress bar only.

**Mobile:** vertical stack, animations clipped to viewport width, controls 48px.

---

## Stage 3 — two-phase reveal in `MagnetBreakdown.tsx`

Add a gate between the existing teaser content and the full breakdown. Reuse `client_brand_profile` palette logic already in place.

### Phase A — pre-gate teaser (no email re-ask required to view this phase)

Render at top of breakdown:
- H1: "Your Revenue Map for {Company}"
- Subline: "Built {n} seconds ago" (computed from `created_at`)
- Hero insight block:
  - Big sentence: "{Company} is leaking ~${dead_zone_value}K in dormant pipeline."
  - Specific finding paragraph (use `gtm_profile_observed` + `gtm_profile_assessment`)
  - One Five Orbits sentence: derive strongest/weakest from `orbit_01..05` content length / explicit scoring already produced by enrich
- Five Orbits map — render the existing orbit visualization but wrap in a `relative` container with a sibling overlay `<div>` applying `backdrop-filter: blur(8px)` + dark gradient + centered lock icon. Labels rendered above the blur layer; numeric values inside the blur.
- Inline gate card (no full-screen modal):
  - Eyebrow: `UNLOCK YOUR FULL MAP`
  - Pull quote
  - Email input pre-filled from `magnet_submissions.email`
  - CTA "Unlock My Map →" — single click confirms (no new request needed; just unlocks UI state)
  - Trust microline

### Phase B — post-gate full reveal (state toggled in component)

Persist unlock state in `localStorage[`magnet:unlocked:${slug}`]` so refresh keeps it open. On unlock:
- Remove blur overlay; show numeric scores + benchmarks per orbit
- 3 insight cards (top opportunity / strength / what firms like yours do next) — derive from existing `action_1..3` and orbit fields
- Three CTAs in clear hierarchy:
  - Primary gold pill: "Book a 20-min walkthrough with Adam" → calendar link (placeholder `mailto:` until provided)
  - Secondary gold outline: "See the full GTM framework" → `/discover`
  - Tertiary text link: "Read the manuscript first" → `/m/:slug/read`
- Editorial italic book mention + 140px cover thumbnail linking to `/about`

### Backend

Optional but recommended migration: add `unlocked_at TIMESTAMPTZ` to `magnet_submissions` so we can track conversion. On unlock click, fire-and-forget `update` via RPC. Not blocking — UI works without it.

---

## Stage 4 — copy alignment

Update only the eyebrow on the new `/assess` page to `GET YOUR PERSONALIZED ANALYSIS` (drops "GTM Breakdown"). The homepage CTA "Add Your Firm →" stays unchanged. Headline already updated above.

---

## Files touched

- **Edit:** `src/pages/MagnetAssess.tsx` (full rewrite to stepper)
- **New:** `src/components/magnet/MagnetWaitTheater.tsx` (replaces `MagnetLoadingScene` for the new four-stage timeline; old file kept until cutover then deleted)
- **Edit:** `src/pages/MagnetSite.tsx` (swap loading component, pass elapsed timer + company name)
- **Edit:** `src/components/magnet/MagnetBreakdown.tsx` (add phase A teaser, blur overlay, gate card, unlock state, restructured phase B layout, 3 CTAs + book mention)
- **New (optional):** `supabase/migrations/<ts>_add_unlocked_at.sql` if we track unlocks
- **Edit (light):** `supabase/functions/enrich-magnet/index.ts` only if we need it to gracefully handle null `crmSize/dealSize/bdChallenge/caseStudiesUrl/teamPageUrl` (it likely already does — verify on build)

## Out of scope

- Real founder video / voiceover audio (placeholder until assets provided)
- Real "Maria from Northwind" feed (static rotating array)
- Calendar booking integration (link only)

## Test checklist (375px first)

1. Form: 3 steps, sticky bar, single field per screen, Enter advances
2. Methodology line + static social proof visible on Step 1
3. Dynamic social proof toast fires between Step 1→2
4. Wait: 4 stages with status ticker, timer, top progress
5. Reduced motion: stages collapse to text + bar
6. Result: teaser + blurred map render before unlock
7. Email pre-filled in gate; unlock reveals full map + 3 insights + 3 CTAs
8. Book mention + cover only in result footer
9. localStorage keeps post-gate state across refresh
10. All tap targets ≥ 48px on 375px width
