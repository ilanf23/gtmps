## Goal
Make the "Dormant · $400K" pill on the hero orbit graphic smaller so it sits more proportionally next to the orbiting red planet.

## Change
File: `src/components/discover/DiscoverHero.tsx` (lines ~823–838)

Reduce the pill's geometry and text size:
- `<rect>`: `width` 148 → 118, `height` 30 → 24, `y` -15 → -12, `rx` 15 → 12
- `<text>`: `fontSize` 13 → 10.5, `x` 14 → 11, `y` 4 → 3

This keeps the same style (cream fill, rust border, Inter Tight 600) but ~20% smaller overall, matching the scale shown in the user's screenshot reference.

No other elements change. The orbit animation and label tracking ref stay intact.