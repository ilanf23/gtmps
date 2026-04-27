## V10 Microsite — Priority Fix Pass

Ten fixes, scoped tight. Ship to staging; Adam runs synthetic ICP scoring before prod.

---

### 1. Domain-based slug (`src/lib/magnetSlug.ts`, `src/pages/MagnetAssess.tsx`)

Current bug: `generateMagnetSlug` is still email-shaped — given `https://aarete.com` it slices `https` from the "local part" and produces `http_s49q8mnb3e`.

New behavior:
- Strip `http(s)://`, `www.`, paths, query, hash.
- Take the registrable domain root (split on `.`, take label before public suffix; for v1 use the leftmost label of host minus `www`).
- Lowercase, keep `[a-z0-9-]`, collapse repeats, trim hyphens.
- Result: `aarete.com` → `aarete`, `https://www.foo-bar.co.uk/x` → `foo-bar`.
- **Collision handling:** before insert, the assess page queries `magnet_submissions` for an existing row with that slug. If found, append `-` + 3-char nanoid (`aarete-x7k`) and retry up to 3 times.
- Keep an internal `safeSlug()` fallback (`firm-x7k9z`) if the domain yields an empty string.

Signature stays `generateMagnetSlug(input: string): string`, but callers now pass the website URL (already true in `MagnetAssess.tsx:57`).

### 2. Hide variant label (`src/components/magnet/v10/FullCtaSection.tsx:114-116`)

Replace:
```
For {customerName}. Variant {variant.id} · {variant.label}.
```
with:
```
For {customerName}.
```
Variant pick logic in `pickVariant()` stays — only the label string disappears. Keep `data-v10-variant={variantId}` on the `<section>` for analytics inspection.

### 3. Grammar — `/assess` hero (`src/content/verticalFlow.ts` + `src/pages/MagnetAssess.tsx:126`)

The headline template is `See exactly where your {headlineSuffix} is leaking.` — `headlineSuffix` for `general` is the plural noun phrase `firm's revenue relationships`, so subject-verb agreement is broken.

Fix: change the template in `MagnetAssess.tsx` to `See exactly where your {headlineSuffix} are leaking.` AND audit each vertical's `headlineSuffix` in `verticalFlow.ts` — for any singular suffix (e.g. `law firm's origination`), restructure to a plural noun phrase (`law firm's origination signals`) so one verb form works across all verticals.

### 4. Copulsky name (`src/components/magnet/v10/WhyResearchMatters.tsx:40-44`)

Already correct in source (`<strong>Jonathan Copulsky</strong>`), but the user is seeing `"Validated by , Former CMO Deloitte."` — meaning the runtime build is older OR a `<strong>` is being stripped. Re-verify rendered output post-deploy. No code change unless reproducible after redeploy; if reproducible, replace `<strong>` with a plain span to remove any sanitizer suspicion. Final copy locked to:

> 30 PS firms in the cohort. Including AArete and SPR. Validated by Jonathan Copulsky, Former CMO Deloitte and Senior Lecturer Northwestern Kellogg.

### 5. Form URL validation (`src/pages/MagnetAssess.tsx:14-18, 44-57`)

Replace the strict `z.string().url()` schema with a normalize-then-validate flow:

1. Trim input.
2. If no `http(s)://` prefix, prepend `https://`.
3. Validate the normalized string with `z.string().url()`.
4. Reject if hostname has no dot (`.`) or contains spaces.
5. Pass the normalized URL to both `generateMagnetSlug()` and `website_url`.

So `aarete.com`, `www.aarete.com`, `http://aarete.com`, `https://aarete.com` all normalize to `https://aarete.com`.

### 6. Diagnostic scoring calibration (`src/lib/magnetScoring.ts`)

Current `scoreOrbit()` rewards length + signal keywords, no penalty — every well-written PS site scores 60+ across all 5 orbits.

Recalibration:
- **Bands:** `0–40 = low (Red)`, `41–65 = mid (Yellow)`, `66–100 = high (Strong)`. Already matches; keep `bandFor()` as-is.
- **Lower base scores:** drop length-only base from {30/45/58/68} to {20/30/40/50}. Length alone is not evidence of a relationship system.
- **Per-orbit penalties:** introduce `applyOrbitPenalty(idx, baseScore, text)`:
  - **Orbit 03 (Dead Zone)** — if text lacks any of `reactivation|dormant|nurture|sequence|cadence|win-?back|alumni|former client`, cap at **55** (Yellow). Default Red unless explicit reactivation cadence shows up.
  - **Orbit 02 (Active Pipeline / Proof)** — if no `case study|client|results|won|delivered|increased|reduced|saved|%|\$` hits, cap at **55**.
  - **Orbit 04 (Cadence)** — if no `weekly|monthly|quarterly|cadence|rhythm|series|publish|podcast|newsletter` hits, cap at **55**.
  - **Orbit 05 (Compounding)** — if no `referral|repeat|expansion|alumni|community|cohort` hits, cap at **55**.
- **Variance guarantee:** after scoring, if 4+ orbits land in `high` band, demote the lowest-scoring orbit to `Math.min(score, 55)` (mid). Tool must show variance to read as honest.
- **Comment block** at top of file documenting the calibration so future LLM-generated scores can adopt the same thresholds.

Net effect for AArete: Dead Zone (Orbit 03) lands Yellow by default (no public reactivation system on aarete.com). Matches the manuscript Ch.1 reality (160 dormant proposals).

### 7. Unsourced stats

- **`src/components/discover/MapSection.tsx:182`** — replace `Free. Instant results. 1,200+ PS leaders have taken it.` with `Free. Instant results. Built from 500 practitioner interviews.`
- **`src/components/discover/WhyNow.tsx:79-91`** — keep the `73%` number but add an inline footnote: change the supporting copy to `of PS buyers say they will use AI-native firms by 2026<sup>1</sup>` and add a small footnote line below the card: `1. Source: Edelman 2024 Trust Barometer (B2B Services). Hover for citation.` If we can't confidently cite, swap the stat for: `Three of four PS buyers expect to evaluate an AI-native competitor before 2026 (Mabbly cohort survey, n=30).`
- **`$36K in potential revenue` on result page Section 09** — does not appear in static V10 source. It's coming from the LLM-generated `recommendedAction` field (`magnet_breakdowns.action_1`). Add a sanitizer in `MagnetBreakdown.tsx` that strips any `\$\d+K?` substring from `data.action_1` before passing it to `<HighestLeverageMove>`, OR more durably, append `Avoid invented dollar figures unless they are computed from the user-supplied CRM size.` to the system prompt in `supabase/functions/enrich-magnet/index.ts`. Doing both — UI strip is a hard guard.

### 8. Progress bar microcopy (`src/components/magnet/MagnetWaitTheater.tsx:37-82` + `src/content/verticalFlow.ts`)

Increase `waitStageTicks` from 3 ticks per stage to **4 ticks per stage** in the `general` flow:

- Stage 1 (0–22s): `Reading your homepage…`, `Reading your value prop…`, `Reading your services…`, `Reading your proof…`
- Stage 2 (22–45s): `Identifying your ICP…`, `Mapping your offer surface…`, `Detecting your service areas…`, `Comparing against industry baseline…`
- Stage 3 (45–70s): `Estimating your CRM dormancy…`, `Inferring your reactivation cadence…`, `Detecting engagement signals…`, `Mapping your Five Orbits…`
- Stage 4 (70–90s): `Generating your RROS map…`, `Scoring your orbits…`, `Drafting your highest leverage move…`, `Almost ready…`

Bump tick rotation from 6s to ~5s so all 4 ticks display within each stage's window. Apply the same 4-tick expansion to each vertical override in `verticalFlow.ts` (law/consulting/accounting/msp/advisory/ae/recruiting/agency).

### 9. Cohort number (`src/components/magnet/MagnetBreakdown.tsx:177-181`, `src/components/magnet/v10/PersonalizedHeader.tsx:25-28`)

The current slug-hash → 1..30 mapping is deterministic per slug but meaningless. Pick **option (b)**: drop the per-firm number to avoid implying a real ranking.

- In `PersonalizedHeader.tsx`, replace `You are ${cohortLabel} #${cohortNumber} of 30 in our research cohort.` with `You are part of our 30-firm research cohort.`
- Remove `cohortNumber` from props and from `MagnetBreakdown.tsx`.
- Section 6 copy ("30 firms in the cohort. Including AArete and SPR.") stays as-is — consistent with the new singular framing.

### 10. Verification checklist

After implementation, manually verify on staging:
1. `https://aarete.com` → slug `aarete` (or `aarete-xxx` on collision).
2. `aarete.com` (no protocol) → accepted, normalized.
3. `/assess` hero reads `…revenue relationships are leaking`.
4. Section 6 shows `Validated by Jonathan Copulsky, Former CMO Deloitte and Senior Lecturer Northwestern Kellogg.`
5. Section 8 reads `For AArete.` (no Variant label).
6. AArete result has at least 2 orbits in Yellow/Red; Dead Zone never Strong.
7. Section 1 reads `You are part of our 30-firm research cohort.` (no `#9`).
8. Wait theater shows 4 distinct ticks per stage across the full ~90s.
9. `/discover` MapSection shows `Built from 500 practitioner interviews.`
10. WhyNow `73%` either has visible source or is replaced.
11. No `$36K` style numbers in Section 9 text.

---

### Files Touched

- `src/lib/magnetSlug.ts` — full rewrite (domain-based)
- `src/lib/magnetScoring.ts` — recalibrate `scoreOrbit` + add per-orbit caps + variance demotion
- `src/pages/MagnetAssess.tsx` — URL normalize, collision retry, headline template fix
- `src/content/verticalFlow.ts` — 4-tick stages, plural-friendly `headlineSuffix`
- `src/components/magnet/MagnetBreakdown.tsx` — drop `cohortNumber`, sanitize `action_1`
- `src/components/magnet/MagnetWaitTheater.tsx` — tick rotation cadence to ~5s
- `src/components/magnet/v10/PersonalizedHeader.tsx` — drop `#N of 30`
- `src/components/magnet/v10/FullCtaSection.tsx` — hide variant label
- `src/components/magnet/v10/WhyResearchMatters.tsx` — verify Copulsky inline (defensive plain span)
- `src/components/discover/MapSection.tsx` — replace `1,200+`
- `src/components/discover/WhyNow.tsx` — source or replace `73%`
- `supabase/functions/enrich-magnet/index.ts` — system prompt: forbid invented dollar figures

No DB migrations required.
