# Redesign Section 06 — "Why This Research Matters"

The current section uses a barely-there beige tint (`rgba(28,16,8,0.025)`) that reads as visual noise next to the new light-beige Sections 3 and 4. We will convert it into a dark, full-width "credibility break" that anchors the middle of the page, matching the cinematic editorial aesthetic from the main Discover page.

## Visual direction

- **Background**: Deep near-black (`#1C1008`, the existing `MABBLY_DARK`) extending edge-to-edge of the viewport, the same breakout technique used for Sections 3 and 4.
- **Text inversion**: Cream/off-white body text (`#FBF8F4`) on the dark ground; gold (`MABBLY_GOLD #B8933A`) for the eyebrow, hairline, and accent numerals.
- **Imagery layer** (subtle, atmospheric, not decorative noise):
  1. A soft gold radial spotlight in the upper-right (matches the cinematic spotlight motif already memorized for the main site).
  2. A faint topographic contour pattern reusing the existing `TopographicBackground` component at very low opacity (~0.06) — it ties to the "MAP / research / cartography" metaphor without introducing a new asset.
  3. A film-grain overlay using a CSS noise gradient at ~3% opacity for editorial texture.
- **Editorial numerals**: The three credibility stats (`30`, `500`, `26`) get pulled out as large serif display numerals in gold, with their labels beneath in small caps. This makes the stats scannable and gives the section the visual weight it currently lacks.
- **Verified cohort firms strip**: Keep the locked list (Madcraft, Calliope, SPR, AArete) but render the names in cream at higher opacity against the dark ground so they actually read as a logo strip.

## Layout sketch

```text
┌──────────────────────────── full-width dark band ────────────────────────────┐
│  ·· faint topographic contours ··           ·· soft gold spotlight ··        │
│                                                                              │
│   — 06 · WHY THIS RESEARCH MATTERS                                           │
│                                                                              │
│   30 firms. 500 practitioner interviews.                                     │
│   Validated by Copulsky.                                                     │
│                                                                              │
│   ┌────────────┬────────────┬────────────┐                                   │
│   │    30      │    500     │     26     │   ← large gold serif numerals     │
│   │  PS FIRMS  │ INTERVIEWS │   YEARS    │                                   │
│   └────────────┴────────────┴────────────┘                                   │
│                                                                              │
│   [existing 3 paragraphs of body copy, in cream]                             │
│                                                                              │
│   ── VERIFIED COHORT FIRMS ──                                                │
│   Madcraft   Calliope   SPR   AArete                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Files to edit

1. **`src/components/magnet/v10/WhyResearchMatters.tsx`** — single-file change:
   - Replace the section's near-transparent background with `backgroundColor: MABBLY_DARK` and apply the same full-width breakout classes used in `CoreAnalysisSection` / `ProofAnalysisSection`:
     `relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6 md:px-10`
   - Wrap inner content in `<div className="max-w-2xl mx-auto relative">` to keep alignment with the rest of the page.
   - Add three absolutely-positioned visual layers inside the section (behind content, `pointer-events-none`):
     - A radial gold spotlight via inline `background: radial-gradient(...)` at top-right.
     - The existing `TopographicBackground` component at `opacity={0.06}`.
     - A grain layer using a tiny SVG noise data-URI at `opacity-[0.03]`.
   - Recolor text: eyebrow + hairline stay gold; `<h2>` becomes `#FBF8F4`; body paragraphs become `#FBF8F4` at ~75% opacity; cohort firm names become `#FBF8F4` at ~70% opacity.
   - Insert the three editorial stat tiles between the headline and body paragraphs. Numerals use the existing `font-serif` (Source Serif 4) at ~`text-5xl md:text-6xl` in gold; labels are `text-[10px] uppercase tracking-[0.25em]` in cream/60.
   - Update the divider above the cohort firms strip to `border-white/10` so it reads on dark.

## Out of scope

- No changes to other sections, no font additions, no new imported assets.
- The locked `VERIFIED_CLIENTS` list is preserved exactly (Madcraft, Calliope, SPR, AArete) — only its text color changes.
- No copy edits to the three body paragraphs.
- No layout/width changes to neighboring sections.

## Constraints respected

- No hyphens / em-dashes / en-dashes in any new copy (only the three numeral labels are added, all single words).
- Full-width breakout uses the exact pattern already approved for Sections 3 and 4.
- Gold accent color stays `MABBLY_GOLD` (`#B8933A`); no new palette values introduced.
- Reuses `TopographicBackground` rather than adding new image files — keeps bundle size flat.
