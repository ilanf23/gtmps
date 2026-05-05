# Lock forbidden vocabulary into ESLint

## Goal

The `enrich-magnet` system prompt (line 77) forbids four words in AI output: **underutilized, optimize, leverage, synergy**. Hand-written JSX bypasses that guardrail, so `SPRSittingOn.tsx` ("highest-leverage opportunity") and `AwardsGrid.tsx` ("systematic origination") slipped through. Add a static check so future regressions fail lint.

## Key finding before coding

`leverage` is used in **legitimate product surface names**, not just stray copy:

- `src/components/magnet/v10/HighestLeverageMove.tsx` (entire component, css file, eyebrow text "09 · Your Highest Leverage Move")
- `MagnetBreakdown.tsx` nav label "Leverage"
- `MagnetWaitTheater.tsx` loading copy "Drafting your highest leverage move…"
- `CompactCtaCard.tsx` "highest leverage move"
- `ctaVariants.ts` "highest-leverage move"
- `verticalFlow.ts` "highest leverage move"

These are the canonical name for Section 09. Banning the bare word breaks the product. Two options for handling them:

1. **Recommended**: ban the words generally, but allow the exact phrase **"highest leverage move"** / **"highest-leverage move"** (case-insensitive) as the only sanctioned use of `leverage`. Anything else (e.g. "highest-leverage opportunity") fails.
2. Ban the four words with zero exceptions. Forces a global rename of Section 09. Bigger surgery, not what the prompt is doing either (the prompt itself uses "highest-leverage move" at line 112).

I will plan for option 1 unless you say otherwise.

## Plan

### 1. ESLint rule (`eslint.config.js`)

Add a `no-restricted-syntax` rule keyed on `Literal` and `JSXText` nodes. Use a single regex per word so the message points at the offender.

```text
/\b(synergy|synergies)\b/i                      → forbidden
/\b(optimize|optimized|optimizing|optimization)\b/i → forbidden
/\b(underutilized|underutilised)\b/i            → forbidden
/\bleverage(?!\s*move|-move|d\s+move)\b/i       → forbidden EXCEPT in "leverage move" / "leveraged move"
```

Implementation: use `no-restricted-syntax` selectors on `Literal[value=/.../i]` and `JSXText[value=/.../i]`. Severity = `error`. Message names the word and tells the author to rephrase.

The rule scans `src/**/*.{ts,tsx}` only; `supabase/functions/**` is already not in the lint set per current config (`files: ["**/*.{ts,tsx}"]` plus the project layout). No `eslint-disable` allowlist; if a future case truly needs the word, the author must justify and add a comment.

### 2. Clean the two cited violations

- `src/components/spr/SPRSittingOn.tsx:143` — rephrase "highest-leverage opportunity" as **"largest single opportunity"** (matches voice, no jargon).
- `src/components/awards/AwardsGrid.tsx:28` and the matching string in `src/pages/Awards.tsx:35` and `src/content/verticals.ts` (×2 hits with "systematic origination") — note: "systematic origination" is **not in the forbidden list above**, so the lint rule won't flag it. The user mentioned it as an example of jargon that leaked, but we're scoped to the four words `enrich-magnet` already forbids. I'll leave "systematic origination" alone unless you want it added to the banlist.

### 3. Sweep current violations the new rule will catch

Running the rule's regexes across `src/` today shows likely hits beyond the two flagged:
- `Faq.tsx:71` — "not optimized for your stage" → "not built for your stage"
- `DeeperSection.tsx:21` and `v1/DeeperSection.tsx:21` — "fully optimized machine" → "fully built machine"
- `Google.tsx:114` — "underutilized" inside a microsite data row → "low usage"

Plus the legitimate `leverage move` usages, which the regex exception preserves.

I'll fix all of these in one pass so `npm run lint` is clean after the rule lands.

### Out of scope

- Renaming Section 09 ("Highest Leverage Move").
- Banning words beyond the four in the system prompt (e.g. "systematic origination", "world-class", "best-in-class"). Easy to add later if you give the list.
- Scanning the edge function source — the prompt already constrains it; lint is for hand-written JSX.

## Files modified

- `eslint.config.js` — add `no-restricted-syntax` rule.
- `src/components/spr/SPRSittingOn.tsx` — rephrase line 143.
- `src/components/discover/Faq.tsx` — rephrase line 71.
- `src/components/DeeperSection.tsx`, `src/components/v1/DeeperSection.tsx` — rephrase line 21.
- `src/pages/microsites/Google.tsx` — rephrase line 114.

## Verification

1. `npm run lint` — clean.
2. Add a temporary line `<p>This will leverage synergy</p>` in any component, run lint, confirm two errors fire on correct word and line. Revert.
3. Confirm `<p>Your highest leverage move…</p>` still passes.
4. Visit `/spr` — Sitting On section reads naturally with the new phrasing.
