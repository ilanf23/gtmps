## What went wrong last time

In the previous overlap fix I kept the on-screen `maxWidth` at 640px but expanded the SVG `viewBox` from ~640 to ~840 units. Result: every element (rings, pills, center logo) got scaled down ~24% to fit, so the diagram looks shrunken even though nothing actually changed in proportion.

I also re-staggered the angles, but I never enforced enough radial spacing between rings, so pills on adjacent rings can still touch when their angles land near each other.

## Fix

Two coordinated changes in `src/components/magnet/v10/FiveOrbitsViz.tsx`:

### 1. Restore original on-screen size
Bump the SVG `maxWidth` from `640` to `820` so the diagram renders at roughly its original physical size on the page (matching the now-larger viewBox that includes pill outsets and padding).

### 2. Guarantee zero overlap with deterministic spacing
Replace the evenly spaced ring radii `[50, 100, 150, 200, 250]` with a wider set: `[50, 112, 178, 244, 310]`.

Why these numbers: each pill sits at `r + PILL_OUTSET` (PILL_OUTSET = 25) and is 38 units tall. With a minimum 62-unit gap between adjacent rings, even worst-case angles (pills landing near each other on the same hemisphere) cannot collide on the radial axis.

Combined with the existing staggered angles `[270, 18, 162, 306, 90]` (which already place adjacent rings on opposite hemispheres), this provides two independent layers of separation:
- Angular: adjacent rings drop their pills on opposite sides of the diagram.
- Radial: even if two pills did fall near the same angle, the 62-unit ring gap > pill height + outset, so they would never touch.

The viewBox formula `2 * (CENTER + maxRadius + PILL_OUTSET + PILL_W/2 + 12)` already adapts automatically when `RADII` changes, so the outermost "New Gravity" pill stays comfortably inside the canvas.

## What stays the same

- Center logo (size, clip, fallback) — unchanged.
- Ring colors, dead-zone pulse animation, pill typography — unchanged.
- Mobile vertical card list — unchanged.
- Click-to-expand observation panel — unchanged.

## Files

- `src/components/magnet/v10/FiveOrbitsViz.tsx` — update `RADII` array, update SVG `maxWidth`, refresh the geometry comment.

No data, no migrations, no other component changes.
