

# Fix Orbit Map Readability & Hover Interaction

## Problems
1. Ring labels are 9px, 0.5 opacity — nearly invisible on the dark background
2. Hover targets are thin circle strokes (1px) — extremely hard to hit with a cursor
3. Tooltip appears only while hovering the thin stroke, disappearing instantly

## Solution

### Make labels always readable
- Increase font size from 9 → 11px
- Increase base opacity from 0.5 → 0.75 (hovered → 1)
- Add a subtle text-shadow glow so labels pop against the dark background

### Add invisible wide hover zones
- For each ring, add a second transparent `<circle>` with `strokeWidth={24}` and `fill="none"` as the actual hover target
- This gives each ring a ~24px wide invisible hit area while the visible stroke stays thin and elegant

### Show all ring details permanently (not just on hover)
- Always display the detail text for each ring along the right side as a legend/key
- On hover, highlight the corresponding ring and its legend entry

### Alternative: click-to-lock tooltips
- On click, lock the tooltip open so users can read it without holding hover
- Click again or click another ring to switch

### Recommended approach
Go with wide invisible hover zones + larger labels + persistent legend. This makes the map scannable without any interaction, while hover still adds emphasis.

## Files Changed
- `src/components/pepper/PepperOrbitMap.tsx` — add invisible hit-area circles, increase label size/opacity, add right-side legend with ring details

