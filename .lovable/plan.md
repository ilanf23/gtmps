## Inspection findings

The actual file with the orbit chart is `src/components/magnet/v10/FiveOrbitsViz.tsx` (rendered by `MagnetBreakdown.tsx` as `<FiveOrbitsViz />`). All edits land there. I did not find any `min-height: 100vh`, `min-height: 800px`, or aspect-ratio padding hack.

The dead space comes from a different mechanism:

- The SVG has `viewBox="0 0 1090 1090"` (a square) and `style={{ maxWidth: 2460 }}` with `width="100%"` inside a `w-screen` viewport-breakout container.
- At any wide viewport, the SVG renders at the full container width as a SQUARE block. At a 1920px viewport, that's a 1920×1920 SVG.
- The actual orbit content (rings + outermost pills) only occupies the central ~620 viewBox units. The remaining ~470 units (~235 above + 235 below) are pure SVG aspect-ratio padding, which renders as 400-600px of empty vertical space above and below the visible chart.
- That padding is what the user perceives as dead space. The section's top/bottom CSS padding is already tight (`py-2 md:py-2.5`), so it is not the culprit.

## Fix (Section 02 only, geometry untouched)

In `src/components/magnet/v10/FiveOrbitsViz.tsx`:

1. Cap the SVG's rendered height with `maxHeight: "min(80vh, 760px)"` and add `preserveAspectRatio="xMidYMid meet"` so the content scales down to fit the height while staying perfectly centered. This collapses the empty top/bottom padding without changing the viewBox, ring radii, label angles, or trig math.
2. Adjust the section's vertical CSS padding to the spec values: `pt-2 md:pt-2.5` (kept tight at the top) and `pb-8 md:pb-12` (≤32px mobile / ≤48px desktop below the chart, before the next section divider).
3. Tighten the gap between the subheading paragraph and the chart container from `mb-8` to `mb-6 md:mb-8` (24px mobile / 32px desktop), matching the spec.

## Explicit non-changes (per guardrails)

- viewBox values, RADII, ORBIT_ANGLES_DEG, PILL_W/PILL_H/PILL_OUTSET, VIEW math: unchanged.
- `@keyframes orbit-pulse` and `.orbit-ring-pulse` animation (2.4s ease-in-out, opacity 0.85 to 1, strokeWidth 2 to 3.5): unchanged.
- Eyebrow text "02 · Your Five Orbits", H2 wording, subheading paragraph wording: unchanged.
- Band colors (Strong green / Mixed orange / Gap red), ring stroke logic, center logo styling, hover tooltips, click-to-expand behavior: unchanged.
- No new dependencies. No changes to MagnetBreakdown, other sections, MagnetWaitTheater, MagnetChat, Supabase fetches, types, config files, or unrelated folders.
- No console.log, no debug code, no commented blocks, no aria changes.

## Files

- `src/components/magnet/v10/FiveOrbitsViz.tsx` — section padding tweaks (`py-2 md:py-2.5` → `pt-2 md:pt-2.5 pb-8 md:pb-12`), subheading bottom margin (`mb-8` → `mb-6 md:mb-8`), SVG attributes (add `preserveAspectRatio="xMidYMid meet"`, add `maxHeight: "min(80vh, 760px)"` to inline style).

No other file is touched.
