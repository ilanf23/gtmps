## Goal

Replace the `SYSTEM_PROMPT` in `supabase/functions/enrich-magnet/index.ts` with the new GTM-analyst prompt + JSON shape you provided, and update the OpenAI call params:

- `model: "gpt-4o-mini"` (already correct)
- `temperature: 0.4` (was `0.3`)
- `max_tokens: 2000` (was `4000` — note: this is a **decrease**, not an increase; flagging in case you meant something else)

No other changes to the file.

## Single file change

**`supabase/functions/enrich-magnet/index.ts`**

1. Replace the entire `SYSTEM_PROMPT` constant (lines 27–98) with the new prompt verbatim, including:
   - The "GTM analyst trained on Mabbly's RROS" framing
   - The 6 non-negotiable rules
   - The exact output JSON shape (`companyName`, `headline`, `subheadline`, `formulaAnalysis {signal, proof, context, verdict}`, `orbits[5]` with fixed names Inner Circle / Warm Network / Dead Zone / Content Gravity / New Gravity, `deadZone {estimate, description}`, `layerRecommendation {startHere, rationale}`, `quickWins[3]`, `chapterCallouts[3]`, `closingLine`)

2. Update the OpenAI call (line 207–208):
   ```
   temperature: 0.4,
   max_tokens: 2000,
   ```

Everything else (Jina fetch, user message construction, error handling, DB write, status updates) stays untouched.

## ⚠️ Critical compatibility issue you should know before approving

The new JSON schema **does not match** the existing `magnet_breakdowns` table columns or the rest of the codebase. The persistence step at lines 248–273 reads keys like `parsed.welcome_message`, `parsed.orbit_01`, `parsed.action_1`, `parsed.dead_zone_value` — none of which the new prompt produces. If we ship this prompt change in isolation, here is what will happen on the next submission:

- `welcome_message`, `gtm_profile_observed`, `gtm_profile_assessment`, `dead_zone_reasoning`, `orbit_01`–`orbit_05`, `action_1`–`action_3`, `dead_zone_value` → all written as **null**
- `chapter_callouts` → written as the new 3-item array, but each item has shape `{chapterNumber, callout}` while the TS type and UI expect `{chapter, callout}` (string, not number) — UI will render blank chapter labels
- `MagnetBreakdown.tsx`, `magnet-chat/index.ts`, and the `MagnetBreakdown` TypeScript type all reference the old columns — the breakdown page will display empty sections and the chatbot's system prompt will inject mostly-null context

You explicitly said "Do not change anything else in the file." So I want to confirm before I touch it.

## Three options

**Option A — Prompt-only swap (literal interpretation of your request).**
Update only the prompt + temperature + max_tokens. Accept that the breakdown page and chatbot will be broken until a follow-up migration + UI refactor lands. Good if you're staging a larger refactor and want the prompt in place first.

**Option B — Prompt swap + minimal mapping shim.**
Update the prompt, then in the same file map the new shape back to the existing DB columns at write time (e.g. flatten `formulaAnalysis` into `gtm_profile_observed`, join `quickWins` into `action_1/2/3`, transform `chapterCallouts` items to `{chapter: "Ch.N", callout}`). UI keeps working. This technically violates "do not change anything else" but only inside the same file, and only the persistence block.

**Option C — Full migration.**
Add new columns to `magnet_breakdowns`, update the TS type, refactor `MagnetBreakdown.tsx` and `magnet-chat` to consume the new shape. Largest blast radius, but the cleanest end state.

## Recommendation

**Option B.** Honors your prompt change exactly while keeping the live breakdown page and chatbot functional. The mapping is ~20 lines confined to one block in the same file.

If you want strict literal Option A, say so and I'll ship just the prompt + params. If you want Option C, I'll prepare a separate plan with the migration and UI changes.