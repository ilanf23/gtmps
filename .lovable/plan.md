

# Pepper Group Market Activation Profile — Build Plan

## Summary
Build a standalone single-page microsite at `/pepper-group` with 6-tab navigation, a warm editorial design (Playfair Display + Inter), and rich interactive content. Completely separate visual identity from the existing discover.mabbly.com dark theme.

## Architecture

```text
src/
  pages/
    PepperGroup.tsx          ← Route entry, tab state, top bar
  components/pepper/
    PepperTopBar.tsx          ← Fixed header with logo + pill + "Prepared for"
    PepperTabBar.tsx          ← 6 tabs + progress bar
    PepperOverview.tsx        ← Tab 1: Hero, stats, quotes, table, expandables
    PepperIdentity.tsx        ← Tab 2: Positioning, EOS, competitor table
    PepperOrbits.tsx          ← Tab 3: Spectrum bar, networks, dot matrix, calculator, orbit SVG
    PepperSignals.tsx         ← Tab 4: Formula, example email, signal chips
    PepperRoadmap.tsx         ← Tab 5: Today vs 12mo, quarterly cards
    PepperContentEngine.tsx   ← Tab 6: LinkedIn post, blog outline, CTA
    PepperAnimatedCounter.tsx ← Reusable number counter (IntersectionObserver)
    PepperExpandable.tsx      ← Reusable accordion section
    PepperOrbitMap.tsx         ← SVG concentric circles
    PepperDotMatrix.tsx        ← Interactive dot grid with tooltips
    PepperSpectrumBar.tsx      ← Gradient bar with animated marker
    PepperDeadZoneCalc.tsx     ← Slider-based calculator
```

## Design System (scoped via Tailwind + CSS)

- **Fonts**: Import Playfair Display (serif headlines) + Inter (body) via Google Fonts in `index.html`
- **Colors**: All scoped to Pepper components via Tailwind arbitrary values or a small CSS class layer — no changes to the existing dark theme variables
  - Terracotta `#C65D3E`, Amber `#C4A747`, Off-white `#FBF8F4`, Alt `#F3EDE6`
  - Text: `#2D2A26`, `#6B6560`, `#A09890`
  - Success `#4A6741`, Gap `#8B3A3A`, Navy `#1A1A2E`

## Routing

Add `/pepper-group` route in `App.tsx` pointing to `PepperGroup.tsx`. Existing `/` route untouched.

## Key Interactive Elements

1. **Tab navigation** — React state (`activeTab`), no router. Progress bar fills proportionally (tab index / 6).
2. **Animated counters** — IntersectionObserver triggers count-up with cubic ease-out over 1.2s.
3. **Scroll reveals** — CSS `opacity: 0; transform: translateY(20px)` → visible state, 0.6s ease.
4. **Spectrum bar** — CSS gradient with an animated marker dot sliding to 37.5%.
5. **Dot matrix** — 80-dot grid, 16 terracotta / 64 gray. Hover shows tooltip with example contact.
6. **Dead Zone Calculator** — 3 range sliders computing `contacts × value × rate`.
7. **Orbit Map** — SVG with 5 concentric rings, hover tooltips, breathing animation on ring 3.
8. **Expandable sections** — Radix accordion, smooth height animation.
9. **Competitor table** — Styled table with highlighted Pepper row and colored check/tilde/X icons.

## Implementation Order

1. Create `PepperGroup.tsx` page + route + Google Fonts import
2. Build `PepperTopBar` + `PepperTabBar` (fixed header, tab state, progress bar)
3. Build Tab 1 (Overview) — hero, stats with animated counters, quotes, interactive table, expandables, RROS progress
4. Build Tab 2 (Identity) — positioning cards, EOS test, competitor table, expandables
5. Build Tab 3 (Orbits + Spectrum) — spectrum bar, 4 networks cards, dot matrix, calculator, orbit SVG, expandables
6. Build Tab 4 (Live Signals) — formula visual, example email, signal chips, expandable
7. Build Tab 5 (Roadmap) — today vs 12mo, quarterly cards, expandable
8. Build Tab 6 (Content Engine) — LinkedIn preview, blog outline, CTA, footer

## Technical Notes

- All content is static — no backend/API calls
- CSS transitions preferred over framer-motion (already in project stack, no new dependency)
- Responsive: desktop-first, tablet friendly, mobile doesn't break
- Keyboard-navigable tabs with proper ARIA roles
- ~15 component files, all under `src/components/pepper/`

