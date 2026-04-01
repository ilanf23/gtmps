

# Mobile Responsiveness Audit & Fix Plan

## Issues Found

### Pepper Group Page (`/pepper-group`)

1. **PepperTabBar** — Tabs overflow horizontally on mobile with no visual scroll indicator; tiny 12px text and tight padding make tapping difficult
2. **PepperOverview** — "Revenue Tower Mapped to RROS" expandable has fixed-width `w-48` and `w-36` spans in a flex row that overflows on mobile; key numbers grid `grid-cols-2` works but border-right on 2nd column looks odd
3. **PepperIdentity** — Competitor table has 6 columns that overflow; no mobile-friendly alternative
4. **PepperOrbits** — Orbit Map SVG `max-w-[420px]` works, but the overall section has no mobile padding adjustments; George's 4 Networks cards `lg:grid-cols-4` jump from 2-col to 4 without intermediate
5. **PepperSignals** — Formula grid `md:grid-cols-[1fr_auto_1fr_auto_1fr]` is fine but the example email blockquote uses large text and padding that can feel cramped
6. **PepperDotMatrix** — `grid-cols-10` with `w-7 h-7` dots overflows narrow screens (needs 10 × 28px + gaps = ~305px, tight on 320px screens)
7. **PepperContentEngine** — LinkedIn/Blog headers use `flex` with `ml-auto` that wraps oddly on small screens
8. **PepperTopBar** — "Prepared for" hidden at `lg`, URL pill hidden at `md` — this is fine
9. **PepperSpectrumBar** — Bottom labels `flex justify-between` with 3 labels can overlap on narrow screens

### Index Page (`/`)

10. **StickyNav** — Already has mobile hamburger; looks good
11. **HeroSection** — Stats row `flex` with 3 items can get very cramped; stat labels `maxWidth: 120` may clip
12. **MissionSection** — Story cards and pillars stack properly; callout box padding `36px` may be too wide on mobile

## Implementation Plan

### File: `src/components/pepper/PepperTabBar.tsx`
- Add `scrollbar-hide` styling and increase tap targets with larger padding on mobile
- Add subtle scroll fade indicators on edges

### File: `src/components/pepper/PepperOverview.tsx`
- Revenue Tower rows: make the flex row stack on mobile (`flex-col md:flex-row`), remove fixed widths on mobile
- Remove border-right on the 2nd stat in the 2×2 mobile grid

### File: `src/components/pepper/PepperIdentity.tsx`
- Wrap competitor table in a scrollable container with visual scroll hint on mobile
- Or transform into stacked cards on mobile (better UX)

### File: `src/components/pepper/PepperDotMatrix.tsx`
- Reduce to `grid-cols-8` on mobile, or scale down dot sizes

### File: `src/components/pepper/PepperSpectrumBar.tsx`
- Stack or abbreviate bottom labels on mobile

### File: `src/components/pepper/PepperContentEngine.tsx`
- Wrap header metadata to stack on mobile (`flex-wrap`)

### File: `src/components/pepper/PepperSignals.tsx`
- Reduce blockquote font size and padding on mobile

### File: `src/components/HeroSection.tsx`
- Ensure stats row doesn't clip on very small screens

### File: `src/components/MissionSection.tsx`
- Reduce callout box padding on mobile

### File: `src/pages/PepperGroup.tsx`
- Reduce `pt-36` top padding on mobile (tab bar is shorter on mobile)

## Scope
~10 files, mostly adding responsive Tailwind classes (`sm:`, `md:` breakpoint adjustments) and a few layout restructures (competitor table, Revenue Tower rows). No new dependencies.

