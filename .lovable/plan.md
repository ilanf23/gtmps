# Add client logo to center of Five Orbits

Render the client's logo (`client_logo_url` from the breakdown row) inside the center of the orbits diagram, fitted within the existing 50px-radius inner circle. No layout shifts, no other character changes anywhere.

## Approach

The breakdown table already has a `client_logo_url` text column. Plumb it through to `FiveOrbitsViz` and render an SVG `<image>` clipped to a circle in the center.

When a logo URL exists: show the logo and hide the "YOUR / FIRM" text.
When it does not exist or fails to load: keep the existing "YOUR / FIRM" text fallback unchanged.

The logo lives entirely inside the existing center glow region (radius 50). This means no SVG dimensions change, no surrounding spacing changes, and no other text on the page is touched.

## Files

1. `src/components/magnet/MagnetBreakdown.tsx`
   - Add `client_logo_url?: string | null;` to `BreakdownRow`.
   - Pass `clientLogoUrl={data.client_logo_url ?? null}` to `<FiveOrbitsViz />`.

2. `src/components/magnet/v10/FiveOrbitsViz.tsx`
   - Add `clientLogoUrl?: string | null;` to `Props`.
   - Add `const [logoOk, setLogoOk] = useState(true);` so a broken URL falls back to text.
   - In the SVG, just inside the existing `defs`/center group, add a `<clipPath id="orbit-center-clip">` with a circle (cx=VIEW_CENTER, cy=VIEW_CENTER, r=44).
   - When `clientLogoUrl && logoOk`: render an `<image>` with `href={clientLogoUrl}`, x=VIEW_CENTER−40, y=VIEW_CENTER−40, width=80, height=80, `preserveAspectRatio="xMidYMid meet"`, `clipPath="url(#orbit-center-clip)"`, and `onError={() => setLogoOk(false)}`. Hide the two existing `<text>` elements.
   - When no URL or load failed: keep the existing two `<text>` elements exactly as today.

## Out of scope

- Ring colors, drift animation, hover tooltip, click-expand
- Any change to viewBox, RADII, or surrounding section spacing
- Mobile card list
- All other components and content
