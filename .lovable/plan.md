# Expand the GTM Assessment Intake

Add 5 new fields to the `/m` assessment form, persist them, and use them to make the AI breakdown sharper and more grounded.

## 1. Database migration — add 5 columns to `magnet_submissions`

```sql
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS crm_size text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS deal_size text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS bd_challenge text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS case_studies_url text;
ALTER TABLE public.magnet_submissions ADD COLUMN IF NOT EXISTS team_page_url text;
```

All nullable so existing rows remain valid. RLS policies are unchanged (insert-by-anon stays open, select still gated by slug).

## 2. `src/pages/MagnetAssess.tsx` — form expansion

**Updated Zod schema:**
- `name`, `role`, `websiteUrl`, `email` — unchanged (required)
- `linkedinUrl` — **now optional**: `z.string().trim().url('Enter a valid LinkedIn URL').optional().or(z.literal(''))`
- `crmSize` — required enum: `under_100 | 100_300 | 300_700 | 700_plus` (with custom message "Please select a range")
- `dealSize` — required enum: `under_50k | 50k_150k | 150k_500k | 500k_plus`
- `bdChallenge` — required enum: `finding_new | reengaging_past | converting_warm | consistent_intros | generating_inbound`
- `caseStudiesUrl`, `teamPageUrl` — optional: `z.string().trim().url().optional().or(z.literal(''))`

**Field order (5 existing + 5 new):**
1. Your name
2. Your title / role
3. Company website
4. Your LinkedIn profile (now optional, no asterisk)
5. Work email
6. **CRM contact range** (native `<select>`, styled to match existing inputs — `inputClass` + chevron via `appearance-none` + background SVG)
7. **Typical engagement / project value** (select)
8. **Biggest BD challenge right now** (select)
9. **Link to your case studies or work page** (url, optional) + helper text "Helps us analyze your proof assets" rendered in a small `text-xs opacity-50` line below the input
10. **Link to your team or about page** (url, optional) + helper text "Helps us understand your firm's background"

Reuse the existing `Field` helper and add a small `helper` prop so the helper line sits between the input and any error message. Selects use the same `inputClass` plus `appearance-none pr-10` and a background chevron, matching the existing visual language (no shadcn Select component — keeps the editorial flat aesthetic identical).

**Submit handler updates:**
- Insert into `magnet_submissions` adds:
  ```ts
  crm_size: data.crmSize,
  deal_size: data.dealSize,
  bd_challenge: data.bdChallenge,
  case_studies_url: data.caseStudiesUrl || null,
  team_page_url: data.teamPageUrl || null,
  linkedin_url: data.linkedinUrl || '',  // keep column non-null safe
  ```
- Fire-and-forget `enrich-magnet` invoke body changes to:
  ```ts
  { 
    slug, 
    crmSize: data.crmSize,
    dealSize: data.dealSize,
    bdChallenge: data.bdChallenge,
    caseStudiesUrl: data.caseStudiesUrl || null,
    teamPageUrl: data.teamPageUrl || null,
  }
  ```

No changes to slug generation, navigation, loading state, or `MagnetSite.tsx`.

## 3. `supabase/functions/enrich-magnet/index.ts` — use the intake data

**Destructure new body fields** (with safe defaults):
```ts
const { slug, crmSize, dealSize, bdChallenge, caseStudiesUrl, teamPageUrl } = body;
```

**Scrape extra pages via Jina** (only if URLs provided), appended to `website_content` before the OpenAI call:
```ts
if (caseStudiesUrl) {
  const cs = await fetchViaJina(caseStudiesUrl, 3000);
  if (cs) website_content += "\n\n--- CASE STUDIES / WORK PAGE ---\n" + cs;
}
if (teamPageUrl) {
  const tp = await fetchViaJina(teamPageUrl, 2000);
  if (tp) website_content += "\n\n--- TEAM / ABOUT PAGE ---\n" + tp;
}
```
(Reuses the existing `fetchViaJina` helper, which already has a 10s timeout and char cap, so we keep timing predictable.)

**Prepend an INTAKE DATA block to `userMessage`** so the model treats it as ground truth:

```
=== INTAKE DATA (what the firm told us directly) ===
CRM Size: <crmSize>
Typical Deal Size: <dealSize>
Biggest BD Challenge: <bdChallenge>

USE THIS DATA:
- For Dead Zone math: map crmSize → number 
  (under_100→75, 100_300→200, 300_700→500, 700_plus→800), 
  multiply by 0.81 for dormant estimate.
- For Dead Zone Value: dormant contacts × deal size midpoint × 0.03
- Deal size midpoints: 
  under_50k→35000, 50k_150k→100000, 150k_500k→325000, 500k_plus→650000
- For layer recommendation, use bdChallenge as the primary signal:
  finding_new → start PROVE
  reengaging_past → start ACTIVATE with ⊙03
  converting_warm → start DESIGN
  consistent_intros → start ACTIVATE with ⊙04
  generating_inbound → start COMPOUND
=== END INTAKE DATA ===
```

This block is inserted **before** the existing `WEBSITE CONTENT:` section in the user message. The system prompt is left intact (typography rule, RROS vocabulary, Hormozi framing all preserved).

If the intake fields are missing on the body (older clients), they fall back to whatever is on the `submission` row from the DB so the function never breaks.

## Files touched
- **New migration**: `supabase/migrations/<timestamp>_add_intake_fields_to_magnet_submissions.sql`
- **Edited**: `src/pages/MagnetAssess.tsx`
- **Edited**: `supabase/functions/enrich-magnet/index.ts`

## Out of scope
- No visual redesign of the form — only adds fields in the existing style.
- No changes to `MagnetSite.tsx`, the breakdown UI, or routing.
- No changes to the SYSTEM_PROMPT itself; intake is supplied as user-message context (simpler to iterate on, no risk to existing copy formulas).
