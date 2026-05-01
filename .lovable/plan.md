# Hover tooltip + Calendly CTA on orbit pills

When the user hovers any of the five orbit pills, show a small tooltip card explaining why that orbit got its rating. The card includes a "Learn more" button that opens the existing Calendly popup.

## UX

- Hover (or focus) a pill → tooltip card appears in a fixed area directly below the orbits diagram. Anchoring HTML to the slowly drifting SVG pills would jitter, so the tooltip lives in a stable slot beneath the chart instead of floating next to the pill.
- The card shows: orbit number + name, band label (Strong / Mixed / Gap), the per-orbit observation text (same source as click-expand uses), and a "Learn more" button.
- "Learn more" calls `openCalendlyPopup(calendlyCtx)` from `src/lib/calendly.ts`.
- Mouse leave → tooltip fades out after a short grace period (so users can move into the card without it disappearing).
- The existing click-to-expand behavior under the diagram stays intact and unchanged.
- Mobile (existing card list) is untouched.

```text
[ ring diagram ]

  ┌────────────────────────────────────────────┐
  │ 03 · Dead Zone               GAP           │
  │                                            │
  │ Observation text explaining what we saw    │
  │ on the site and why this orbit scored low. │
  │                                            │
  │           [ Learn more →  ]                │
  └────────────────────────────────────────────┘
```

The card uses the band's color palette (green / yellow / red) for border + label, matching the pill colors.

## Files

1. `src/components/magnet/v10/FiveOrbitsViz.tsx`
   - Add `calendlyCtx?: CalendlyContext` to `Props`.
   - Import `openCalendlyPopup` and `CalendlyContext` from `@/lib/calendly`.
   - Add `hoverIdx` state with `setHoverIdx` (number | null) and a small `setTimeout`-based grace period for leave.
   - On each `<g>` wrapping a pill, add `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur` to set `hoverIdx`.
   - Below the SVG (above the click-expand panel), render a hover preview card when `hoverIdx !== null && openIdx === null`. The card mirrors the same observation text the click panel uses (`orbits[hoverIdx]?.trim() || fallbackObs`) and shows a "Learn more" button that calls `openCalendlyPopup(calendlyCtx)` if provided.
   - If `calendlyCtx` is not passed, hide the "Learn more" button (graceful degradation).
   - Card has `onMouseEnter` / `onMouseLeave` of its own so users can move into it without it disappearing.

2. `src/components/magnet/MagnetBreakdown.tsx`
   - Build a `calendlyCtx` from existing `brand`, `slug`, `customerName`, `submission?.first_name` (the same shape `CompactCtaCard` / `FullCtaSection` already build internally).
   - Pass it as `calendlyCtx={calendlyCtx}` to `<FiveOrbitsViz />`.

## Out of scope

- Ring colors, drift animation, click-to-expand panel
- Mobile card list
- Any other section
- Changes to `calendly.ts`
