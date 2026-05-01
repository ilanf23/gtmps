# Slow planetary drift on orbit pills

Add a barely perceptible rotation to each of the 5 orbit pills so they slowly travel around their ring like planets. Rings, colors, click behavior, and mobile cards are unchanged.

## Approach

Use SVG `<animateTransform>` on a wrapper `<g>` around each pill, rotating around the SVG center. A second inner `<g>` counter-rotates around the pill's own center so the text stays upright (no upside-down labels).

Each orbit gets a different period so they don't move in lockstep:

```text
Orbit 01 (Core Proof)     240s, clockwise
Orbit 02 (Active)         300s, counter-clockwise
Orbit 03 (Dead Zone)      360s, clockwise
Orbit 04 (Warm Adjacency) 420s, counter-clockwise
Orbit 05 (New Gravity)    480s, clockwise
```

At 240–480 seconds per full revolution the motion is below conscious perception unless watched directly.

## File

`src/components/magnet/v10/FiveOrbitsViz.tsx` — desktop label `.map` (~lines 173–245).

## Change

Wrap the existing label `<g>` in two new groups, using SMIL so the rotation works inside SVG without coordinate-math drift:

```tsx
<g>
  <animateTransform
    attributeName="transform"
    type="rotate"
    from={`0 ${VIEW_CENTER} ${VIEW_CENTER}`}
    to={`${i % 2 ? -360 : 360} ${VIEW_CENTER} ${VIEW_CENTER}`}
    dur={`${240 + i * 60}s`}
    repeatCount="indefinite"
  />
  <g>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from={`0 ${lx} ${ly}`}
      to={`${i % 2 ? 360 : -360} ${lx} ${ly}`}
      dur={`${240 + i * 60}s`}
      repeatCount="indefinite"
    />
    {/* existing pill <g> with rect + text untouched */}
  </g>
</g>
```

Add `prefers-reduced-motion` guard: if reduced motion is set, skip rendering the `<animateTransform>` elements so the diagram stays static.

## Out of scope

- Ring colors, dead-zone pulse, pill colors, click/expand behavior
- Mobile card list
- Hover pause (SMIL pause-on-hover is fragile across browsers; skipping unless requested later)
