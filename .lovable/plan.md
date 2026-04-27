Implement the P1 round 2 fixes surgically across the v10 microsite, enrichment function, and Discover hub.

1. Fix Section 6 Copulsky sentence inline
- Update `src/components/magnet/v10/WhyResearchMatters.tsx` so the paragraph renders the exact inline sentence:
  `Validated by Jonathan Copulsky, Former CMO Deloitte and Senior Lecturer Northwestern Kellogg.`
- Remove any JSX structure that could separate the name from the comma or create an empty text gap.

2. Make Calendly embed actually initialize
- Keep the booking target centralized at `https://calendly.com/adam-fridman/30min`.
- Update `src/lib/calendly.ts` to expose a ready callback / Promise for Calendly script loading instead of only appending the script.
- In `src/components/magnet/v10/FullCtaSection.tsx`, replace passive `data-url` rendering with an explicit `window.Calendly.initInlineWidget({ url, parentElement })` call using a `ref`.
- Clear/reinitialize the embed when slug/theme props change so Section 8 does not remain placeholder text.
- Keep UTM params exactly: `utm_source=microsite`, `utm_medium=map`, `utm_campaign=[firm-slug]`.
- Keep Section 5 button opening the same URL via popup; fallback opens the same URL in a new tab if widget JS is not ready.

3. Add firm-name fallback so result pages never say “your firm”
- Add a utility in `src/lib/magnetSlug.ts` or a small companion utility to convert a slug/domain root to display name, e.g. `calliope` -> `Calliope`.
- In `MagnetBreakdown.tsx`, change `data.client_company_name ?? "your firm"` to a deterministic fallback derived from the current slug.
- In the enrichment helper `supabase/functions/_shared/extract-branding.ts`, update company extraction priority to:
  1. `og:site_name`
  2. `og:title`
  3. `meta name="application-name"`
  4. document `<title>`
  5. capitalized domain root
- Persist that fallback into `client_company_name` for all newly generated maps.

4. Remove scarcity copy on Discover hub / main pages
- Replace “46 of 50 sessions remaining,” “46 spots remain,” and “Applications close when sessions are full” style scarcity copy in the Discover-facing/shared landing components with confidentiality framing.
- Suggested replacement theme: `Participation defaults to confidential benchmarking. Named examples are opt-in only.`
- Preserve CTA intent, but remove numeric scarcity language.

5. Calibrate orbit scoring to prevent fallback-default 44/44/44/44/48
- Update `src/lib/magnetScoring.ts` so scores incorporate orbit-specific status tags returned by the model (`[strong]`, `[gap]`, `[dormant]`, `[untapped]`) instead of relying mostly on length/keywords.
- Add deterministic per-orbit baselines and variance logic so real PS firms produce meaningful spread across five orbits.
- Enforce variance > 15 points when the text is substantive but scores collapse into a narrow default band.
- Preserve bands: Red 0-40, Yellow 41-65, Green/Strong 66-100.

6. Strip dead-code references
- Full-project grep for `Holaway` and `Coda Strategy` already returns no matches in this repo.
- During implementation, run the grep again and remove any matches if the workspace exposes additional repo content.

7. Verification after changes
- Run targeted searches for:
  - `Validated by ,`
  - `Select a Date & Time - Calendly`
  - `70 of 100 spots remain`, `46 of 50`, `spots remain`, `sessions remaining`
  - `Holaway`, `Coda Strategy`
- Run lint/build or the available project test command.
- Use the preview at mobile widths 375px, 414px, and 768px to verify:
  - Section 6 sentence is exact and inline.
  - Section 8 shows a real Calendly iframe/widget.
  - Section 5 button opens the same Calendly booking URL.
  - `/m/calliope` style pages render `Calliope`, not `your firm`.
  - Orbit scores are not collapsed to near-identical values for verified firm samples.