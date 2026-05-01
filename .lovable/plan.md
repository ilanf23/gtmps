## Goal

Add the scraped client logo as a small mark inside the center of the Five Orbits diagram on every microsite, replacing (or accompanying) the current "YOUR FIRM" text in the middle.

The logo is already scraped and available on the theme as `theme.logoUrl` (sourced from `client_logo_url`). It is currently unused in the orbit visualization.

## Changes

### 1. `src/components/magnet/v10/FiveOrbitsViz.tsx`
- Add an optional `logoUrl?: string | null` prop to the component.
- Inside the SVG, render the logo at the center using an `<image>` element clipped to a circle:
  - Small footprint: 56px square, centered inside the inner ring (radius 50).
  - Use `preserveAspectRatio="xMidYMid meet"` so logos of any aspect ratio fit cleanly without distortion.
  - Wrap in a `<clipPath>` circle (radius 26) so logos with square/transparent backgrounds still feel contained.
  - When a logo is present: hide the "YOUR / FIRM" text and show the logo only. When no logo: keep the current "YOUR FIRM" text fallback so older microsites without a scraped logo still look correct.
- Mobile (vertical card list) is unchanged; the logo lives only in the SVG diagram.
- Add `crossOrigin="anonymous"` and `onError` handling so a broken logo URL silently falls back to the text label.

### 2. `src/components/magnet/MagnetBreakdown.tsx`
- Pass `logoUrl={theme.logoUrl}` (or the equivalent already-resolved value used elsewhere in this file) into the `<FiveOrbitsViz />` instance.
- No other call sites need changes.

## Technical Details

- Logo size: 56×56 viewBox units, centered at `(VIEW_CENTER, VIEW_CENTER)`. Inner ring radius is 50, so the logo sits comfortably inside without touching the ring.
- Rendering uses SVG `<image href={logoUrl} />` so it scales with the responsive SVG (no extra HTML overlay, no layout math).
- A `<title>` element is added to the logo group for accessibility (e.g. "Acme Corp logo").
- No new dependencies, no migration, no schema changes. The `client_logo_url` column already exists and is populated during enrichment.
- Behavior is backwards compatible: microsites missing a logo continue to render the existing "YOUR FIRM" text.
