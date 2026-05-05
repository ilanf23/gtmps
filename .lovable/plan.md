## Goal

Apply the practices in `docs/mobile-optimization-research.md` to the live Discover homepage and shared infrastructure. Scope is bounded to high-impact, low-risk wins. No design changes, no copy changes (and no new dashes per the project rule).

## Scope

Only changes that map directly to the research doc's three pillars: Core Web Vitals, mobile UX, accessibility. Discover page (`/`) and shared chrome only. v1, microsites, magnet, vertical landings are out of scope unless they share a touched file.

## Part 1, Core Web Vitals

### LCP

- `index.html`: preconnects look fine; the Google Fonts request loads ~10 families, many unused on first paint. Trim the font request to families actually used above the fold (Cormorant Garamond, Instrument Sans, Inter Tight, IBM Plex Mono). Move the rest to a second `<link>` with `media="print" onload="this.media='all'"` so they don't block render.
- Add `<link rel="preload" as="image" fetchpriority="high">` for the hero LCP image (book cover `bookCoverGm` used in the Book intro block on Discover) only if it qualifies as LCP at mobile widths; otherwise preload the actual hero asset.
- Audit `<img>` tags on Discover sections (`WarStory`, `Authors`, book intro in `Discover.tsx`) and add explicit `width`/`height` (or `aspect-ratio`) plus `loading="lazy"` for everything below the fold and `fetchpriority="high"` + eager loading for the LCP image only.
- Confirm `FloatingHeroVideo` uses `preload="metadata"` and `playsInline`; defer mounting on mobile until in viewport.

### INP

- `useScrollReveal` and `ScrollProgressRail` both attach scroll listeners. Verify `{ passive: true }` everywhere (already true in `MobileProgressBar` and `StickyCTA`). Patch any remaining non-passive scroll listeners.
- `StickyCTA` re-renders on every scroll past 600. Already gated, leave alone.
- Replace any `setTimeout(fn, 0)` long-task patterns with `requestIdleCallback` fallback where present (spot-check, only if found).

### CLS

- Add explicit `width`/`height` to every `<img>` on Discover that lacks them.
- Tailwind config already loads fonts via Google Fonts CSS, which uses `font-display: swap`. Add a CSS `@font-face` `size-adjust` override for Cormorant Garamond and Instrument Sans against their fallbacks in `src/index.css` to eliminate font-swap CLS on the hero headline.
- Reserve space for `FloatingHeroVideo` container so its mount does not shift content.

## Part 2, Mobile UX

- Audit Discover for any `<input>` with implicit font-size; ensure `font-size: 16px` minimum on `HeroUrlField` so iOS does not auto-zoom on focus.
- Touch targets: the sticky CTA pill (56px) and main nav are fine. `WhyNow` and `AuthorityStrip` use 10 to 12px copy; that is body micro-copy, not interactive, so leave font sizes but verify any links inside reach 24x24 hit area (add padding if needed, no visible change).
- `index.html` viewport tag is correct (`width=device-width, initial-scale=1.0`). No change needed.
- Confirm `max-width: 65ch` (or equivalent) on long-form prose blocks in Discover; add where missing.

## Part 3, Accessibility

- Verify every icon-only button on Discover/StickyNav has an `aria-label` (StickyNav menu toggle already does, spot-check the rest).
- Ensure focus styles are visible on the sticky CTA and rail items (currently rely on default `:focus-visible`; add explicit ring if missing).
- Skip link: `SkipLink` component exists but is not mounted on `Discover.tsx`. Mount it at the top of `<main>`.

## Files likely to change

- `index.html` (font loading split, optional preload)
- `src/index.css` (font-face size-adjust overrides, focus-visible polish)
- `src/pages/Discover.tsx` (mount `SkipLink`, image dimensions on book cover img)
- `src/components/discover/WarStory.tsx`, `Authors.tsx` (add `width`/`height`/`loading` to imgs)
- `src/components/discover/FloatingHeroVideo.tsx` (preload, dimensions, defer mount)
- `src/components/discover/HeroUrlField.tsx` (16px font-size on input)
- Possibly `src/components/discover/ScrollProgressRail.tsx` (passive listener check)

## Out of scope

- Speculation Rules API rollout (needs route-level prefetch design, separate task)
- Converting JPG/PNG to AVIF/WebP (needs build pipeline change)
- Screen reader audit on every microsite
- Core Web Vitals lab measurement before/after (can do if you want, adds time)

## Validation

After changes, I will rebuild and visually verify Discover at 390x844 (mobile) and 1024 (tablet) breakpoints, plus run a quick console check for layout shift warnings.
