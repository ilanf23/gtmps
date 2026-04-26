# Hormozi × RROS Copy Engine Upgrade

## Goal
Make every AI-generated sentence pass the "photographable test" for a $20M–$100M PS firm managing partner. Apply Hormozi's Value Equation (Dream Outcome × Perceived Likelihood / Time + Effort) inside Mabbly's locked RROS vocabulary, and tighten 5 framing strings on the breakdown UI.

---

## PART 1 — `supabase/functions/enrich-magnet/index.ts`

Replace the entire `SYSTEM_PROMPT` constant (lines 29–99) with the new Hormozi × RROS prompt provided in the brief. Key behaviors of the new prompt:

- **ICP locked** to a $20M–$100M PS managing partner.
- **Emotional arc**: Recognition → Vindication → Relief → Challenge → Clarity.
- **Locked vocabulary**: The Formula verbatim, ⊙01–⊙05 orbit names + symbols, DISCOVER → PROVE → DESIGN → ACTIVATE → COMPOUND, "law" not "rule", "Dead Zone" never "dormant contacts".
- **Field formulas** for `headline`, `subheadline`, `formulaAnalysis`, `orbits`, `deadZone`, `quickWins`, `layerRecommendation`, `chapterCallouts`, `closingLine`, `crmEstimate`, `dealSizeEstimate`.
- **`BOOK_FRAMEWORK_CONTEXT`** will still be appended after the new prompt body so the model retains book grounding.

### Schema-shape compatibility note
The new prompt asks for a richer JSON shape (orbits with `observation` + `opportunity`, `deadZone` as a single multi-paragraph string, `chapterCallouts` with `chapter` + `title` + `callout`). To keep the existing DB columns and frontend working, I will update the JSON-to-DB mapper in the same file:

- **Orbits** — Concatenate `observation` + " " + `opportunity` (with status prefix in brackets) into the existing `orbit_01`–`orbit_05` text columns. If only `description` is provided (legacy), keep current behavior.
- **Dead Zone** — The new prompt returns `deadZone` as a string. Store it as-is in `dead_zone_reasoning`. Run `parseDollarEstimate` on the string to extract the first dollar figure for `dead_zone_value` (e.g. extracts "$1.8M" from the math line). Falls back to null gracefully.
- **Chapter callouts** — Read `c.chapter` (number 0–13) for `chapter_number`; preserve `c.callout`. Keep legacy `chapterNumber` fallback for safety.
- **Quick wins** — Continue joining "title — description" if both present; if the new prompt returns a single string, store as-is.

All CORS, request parsing, Supabase upsert logic, and error handling stay untouched.

---

## PART 2 — `src/components/magnet/MagnetBreakdown.tsx` — five copy edits

1. **Section 2 (Formula) header subtitle** — Below the gold "THE FORMULA: SIGNAL + PROOF + CONTEXT = RESPONSE, NOT PITCH" label, add:
   > *Signal + Proof + Context = Response, Not Pitch — here's how each element lands for {companyName} right now.*

   Uses `data.client_company_name ?? "your firm"` as the substitution.

2. **Section 3 (Orbits) framing** — Above the orbit cards, add a muted line:
   > *Your next client is already in one of these five orbits. The question is which signal reaches them first.*

   Style: `text-sm text-black/50 mb-6 leading-relaxed`.

3. **Section 4 (Dead Zone / Impact Model) cost-of-waiting line** — Append at the bottom of the `MagnetImpactModel` section (after the dark `<div>` block, still inside the `-mx-6` wrapper or just below it on the cream background):
   > *Every month without a system, 3–5 warm contacts cross the Dead Zone threshold permanently.*

   Style: `text-xs italic opacity-50 text-center px-6 py-4`.

4. **Section 6 (Quick Wins) title + subtitle** — Replace `THREE QUICK WINS` with `FIRST SIGNALS — THIS WEEK`, and add a subtitle directly below:
   > *Three actions. Each under an hour. Each designed to trigger a response, not ask for one.*

   Subtitle style: `text-sm opacity-60 mb-6 leading-relaxed -mt-4`.

5. **Section 8 (Closing CTA)** — Replace the body copy and button label:
   - **Headline (new, above body)**: *The system is mapped. The pipeline exists.* — `text-2xl font-bold mb-4`
   - **Body**: *The 90-minute Relationship Revenue session takes the breakdown above and turns it into a 90-day activation sequence — specific to {companyName}, starting from the layer with the most leverage.*
   - **Button**: *MAP YOUR ACTIVATION SEQUENCE →*
   - Tagline below button stays: *30 minutes. No pitch. Just the plan.* (or update to "90 minutes" to match — see decision note below)

### Open decision in the brief
The brief says "90-minute Relationship Revenue session" but the existing tagline reads "30 minutes. No pitch. Just the plan." I will update the tagline to **"90 minutes. No pitch. Just the plan."** for consistency with the new body copy. Flag if you want to keep 30.

---

## Files touched
- `supabase/functions/enrich-magnet/index.ts` — replace `SYSTEM_PROMPT`; adjust orbit/deadZone/callout mapping for new schema shape.
- `src/components/magnet/MagnetBreakdown.tsx` — 5 targeted copy edits, no structural changes.

## Out of scope (unchanged)
- No DB schema changes (`crm_estimate` / `deal_size_estimate` already exist).
- No new components.
- No changes to `MagnetImpactModel`, `MagnetShell`, branding, or routing.
- `BOOK_FRAMEWORK_CONTEXT` import preserved.
