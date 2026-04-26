## Problem

The "logo" shown for Idea2Result is actually their `og:image` social-share photo. The brand extractor's logo priority list is:

1. `<img>` with `logo` in alt/class/id
2. `apple-touch-icon`
3. **`og:image`** ← landscape marketing photo
4. **`twitter:image`** ← landscape marketing photo

When sites lack #1 and #2 (very common), it falls through to a marketing image and we display it as a brand logo. We need to (a) stop using social-share images as logos, (b) add better real-logo signals, and (c) defend the UI so a bad asset never ships even if extraction misfires.

## Fix Strategy

### 1. Rewrite `findLogoUrl` in `supabase/functions/_shared/extract-branding.ts`

Replace the priority list with a stricter, logo-only sequence:

1. `<img>` with `logo` in alt/class/id/src (both attribute orders)
2. Inline `<svg>` inside `<header>` or `<nav>` (extract and return as data URL, capped at ~25KB)
3. `<img>` whose `src` ends in `logo.svg`, `logo.png`, `logo-*.svg`, etc., anywhere in the document
4. `<link rel="icon" type="image/svg+xml">` (vector favicons are almost always the real mark)
5. `<link rel="mask-icon">` (Safari pinned-tab SVG, always a logo)
6. `<link rel="apple-touch-icon">` (square, designed asset)
7. `<link rel="icon">` only when size ≥ 96×96 (skip 16/32 favicons)

**Removed**: `og:image` and `twitter:image` are no longer logo candidates. Period.

### 2. Add a server-side sanity check

Before returning the logo URL, do a `HEAD` request and reject:

- `content-type` not in `image/svg+xml`, `image/png`, `image/webp`, `image/x-icon`, `image/vnd.microsoft.icon`
- `content-length` > 500 KB (real logos are tiny; hero photos are huge)

If rejected, return `null` rather than a bad URL — the UI will gracefully fall back to the company name.

### 3. Front-end aspect-ratio guard

In `src/components/magnet/MagnetShell.tsx` and `src/components/magnet/MagnetBreakdown.tsx`, when the logo `<img>` loads, measure `naturalWidth / naturalHeight`. If the aspect ratio is **wider than 5:1** or **taller than 1:2**, hide the image (`display: none`) — that's a banner/photo, not a logo. This is the safety net that protects against any extractor edge cases we haven't thought of.

### 4. Re-enrich existing rows

Rows already in `magnet_breakdowns` keep their bad `client_logo_url`. Add a one-shot SQL migration that nulls out `client_logo_url` for any row whose URL contains `og-image`, `social`, `share`, `cover`, `hero`, `banner`, or ends in `.jpg`/`.jpeg` (real logos are virtually never JPEG). Future visits to those microsites will then re-trigger enrichment with the new extractor.

## Files

- `supabase/functions/_shared/extract-branding.ts` — rewrite `findLogoUrl`, add `validateLogoAsset` HEAD check
- `src/components/magnet/MagnetShell.tsx` — add `onLoad` aspect-ratio guard on the logo img
- `src/components/magnet/MagnetBreakdown.tsx` — same guard on the hero logo img
- New migration: `null` out junk `client_logo_url` values so they re-enrich

## Result

- No more landscape marketing photos masquerading as logos
- Real SVG / favicon logos pulled from sites that don't tag their `<img>` with "logo"
- Idea2Result and any similarly-affected client microsites self-heal on next visit
- Hard front-end guard means even a future extractor regression can't ship a stretched banner