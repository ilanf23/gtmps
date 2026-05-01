## Problem

In the Five Orbits SVG diagram (microsite Section 02), pills representing each orbit are placed **directly on top of their orbit ring** at fixed angles. Two specific failure modes are visible in the screenshots:

1. **Outer ring (05 New Gravity)** sits at the top of the SVG. Because the pill is centered on the ring at the top edge, the ring's curve clips into the pill from above and the pill itself sits tight against (and sometimes outside) the viewBox top edge.
2. **Rings 01 (Core Proof) and 02 (Active)** are only 50 viewBox units apart. With pills both placed on the right side at similar angles (342° and 54°), the pills crowd and visually overlap.

## File modified

Only `src/components/magnet/v10/FiveOrbitsViz.tsx`. No copy, scoring logic, theme tokens, or other components are touched.

## Geometry strategy

The fix is purely positional and uses three rules that compose:

1. **Outset pills beyond the ring, not on it.** Each pill center is computed at `r + PILL_OUTSET` (half pill height + 6px breathing room) instead of exactly `r`. This guarantees the ring line never crosses the pill body for any orbit at any angle.
2. **Grow the viewBox to fit.** Recompute `VIEW` from the geometry so the outermost pill (ring 5 + outset + half pill width + a 12px margin) is always inside the viewBox on every side. No more clipping at the top of New Gravity.
3. **Stagger angles by ring index** to keep adjacent small rings' pills from crowding. The current angles (270, 342, 54, 126, 198) put rings 1 and 2 on the same side at close angles. We rotate the angles per ring so neighboring rings drop their pills on opposite sides of the diagram. The new angle set is chosen so:
   - Ring 1 (Core Proof) and Ring 2 (Active) sit on opposite hemispheres
   - No two adjacent rings have angles within 60° of each other
   - The overall composition still reads as orbital, not random

Concrete angle assignment used: `[270, 18, 162, 306, 90]` (ring 1 top, ring 2 upper-right far out, ring 3 upper-left, ring 4 lower-right, ring 5 bottom). Combined with the radial outset, this places every pill in unique angular space with no visual collision at any ring radius.

## Quick desktop visual reference

```text
Before                              After
─────────                           ─────────
   [05]  ← clips top edge              [01]  ← top, ring 1 (smallest)
  /    \                              /    \
 /  [01][02] ← crowd right           /      \
/  YOUR    \                        /  YOUR  \  [02] ← outer-right
\  FIRM    /                        \  FIRM  /
 \  [04][03]                       [03]      \
  \      /                          \   [05] /  ← bottom, ring 5 outset
   ─────                              ─[04]──
```

## Mobile

The mobile vertical card list is unchanged. Overlap was a desktop SVG-only concern.

## Out of scope

- No changes to the orbit copy, scoring bands, or color tokens.
- No changes to the expanded observation panel that opens on pill click.
- No changes to other sections, the main page, or the homepage.
