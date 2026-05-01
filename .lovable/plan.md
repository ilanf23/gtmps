# Color orbit pill cells by band

Update only the pill (oval cell + label text) in the Five Orbits SVG diagram so its color reflects the band:

- Strong (high) → green
- Mixed (mid) → yellow
- Gap (low) → red

Rings, ring colors, dead-zone pulse, mobile cards, and all other elements remain untouched.

## File

`src/components/magnet/v10/FiveOrbitsViz.tsx` — desktop label loop (~lines 174–236).

## Change

Inside the label `.map`, derive three status colors from `bandPerOrbit[i]`:

```text
band === "high" → fill #E8F5E9, stroke #2E7D32, text #1B5E20  (green)
band === "mid"  → fill #FFF8E1, stroke #C9A227, text #8A6D1A  (yellow)
band === "low"  → fill #FDECEA, stroke #C62828, text #B71C1C  (red)
```

Apply:
- `<rect>` `fill` and `stroke` use the new status colors instead of `var(--brand-bg-subtle…)` and `tokens.border`.
- Both `<text>` elements use the new status text color instead of `tokens.fg`.

Keep stroke-width logic (`isOpen || isDeadZone ? 2 : 1`) and the drop-shadow filter exactly as-is.

## Out of scope

- Ring `<circle>` colors, opacity, dead-zone pulse animation
- Center "YOUR FIRM" text
- Expanded observation panel below the diagram
- Mobile card list
- BAND_TOKENS object (still used for `tokens.label` text and the panel)
