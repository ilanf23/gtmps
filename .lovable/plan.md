## Goal
Update the research stat from "500 practitioner interviews" to "200 practitioner interviews" everywhere it appears in user facing copy.

## Scope
35 occurrences across 16 files. Straight string replacement, no logic changes.

### Files to update
- `src/content/verticals.ts` (8 vertical `sub` strings)
- `src/content/ctaVariants.ts` (1)
- `src/pages/verticals/_template/data.tsx` (16 across 8 verticals: meta description + hero copy each)
- `src/pages/About.tsx` (2: manuscript paragraph + bullet list item)
- `src/components/MissionSection.tsx` (1 headline)
- `src/components/v1/MissionSection.tsx` (1 headline, legacy /v1)
- `src/components/Footer.tsx` (1 description)
- `src/components/discover/DiscoverHero.tsx` (1 highlighted span)
- `src/components/discover/Faq.tsx` (1)
- `src/components/discover/ReceiptsBeatClaims.tsx` (1)
- `src/components/magnet/v10/WhyResearchMatters.tsx` (1)

Also worth checking but not in current grep: any LLM prompts in `supabase/functions/enrich-magnet/index.ts` that mention 500. Will scan once during implementation and update if found.

## Approach
Single global find/replace of `500 practitioner interviews` to `200 practitioner interviews`. No punctuation or surrounding copy changes. After edit, re-grep to confirm zero remaining instances of the old phrase.

## Out of scope
Other "500" numbers in the codebase that refer to different things (e.g., manuscript intro mentions "more than 500 interviews" in `src/content/manuscriptQuotes.ts`). Will confirm with you whether that quote should also change, since it is attributed to Adam Fridman in the Introduction and may be a verbatim manuscript pull quote.

### Question to confirm before/during implementation
The `manuscriptQuotes.ts` Introduction quote reads: "I had spent 8 years conducting more than 500 interviews." Should this also become 200, or stay as a verbatim manuscript quote?
