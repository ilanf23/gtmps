# Widen microsite content column by 20%

The `/m/:slug` microsite currently constrains content to `max-w-2xl` (672px). The user wants it 20% wider, so 672 * 1.2 = 806px.

## Change

Replace `max-w-2xl` with `max-w-[806px]` on every wrapper that defines the microsite's centered content column. The horizontal page padding (`px-6`) stays exactly as-is. Headlines and inner blocks that also use `max-w-2xl` get widened to match so wrapping stays consistent.

## Files

1. `src/components/magnet/MagnetBreakdown.tsx` line 275 — main column wrapper.
2. `src/components/magnet/v10/CoreAnalysisSection.tsx` line 21 — re-centered inner column for the full-width beige section.
3. `src/components/magnet/v10/ProofAnalysisSection.tsx` line 21 — same.
4. `src/components/magnet/v10/WhyResearchMatters.tsx` lines 61 and 72 — re-centered inner column + headline cap.
5. `src/components/magnet/v10/ShareAttributionBanner.tsx` line 23 — top attribution banner, kept aligned with main column.
6. `src/components/magnet/v10/FiveOrbitsViz.tsx` lines 331 and 370 — hover/expanded preview cards.
7. `src/components/magnet/v10/ManuscriptShareSave.tsx` line 126 — manuscript anchor block.
8. `src/components/magnet/v10/HighestLeverageMove.tsx` line 52 — section headline cap.
9. `src/components/magnet/v10/FullCtaSection.tsx` line 128 — section headline cap.

## Out of scope

- No padding changes (`px-6` stays).
- No font-size changes.
- No layout/grid restructuring.
- Other microsites (`/pepper-group`, `/spr`) are unrelated and untouched.
