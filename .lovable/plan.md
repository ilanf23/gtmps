## Goal

Cut initial JS payload by 50 to 70 percent and improve Time to Interactive across all pages, especially the homepage and `/m/:slug`. Today every page (vertical landings, microsites, the PDF reader, ops dashboard, awards, about, aletheia, etc.) is loaded eagerly on first visit, so a homepage hit drags down ~30 components plus `react-pdf` and `pdfjs-dist`.

## What to change

### 1. Route-level code splitting in `src/App.tsx` (biggest win)

Convert eager page imports to `React.lazy(...)` and wrap `<Routes>` in `<Suspense>`. The homepage stays eagerly imported (it is the most visited route, so we want it in the main bundle for fast LCP). Everything else becomes its own chunk that loads on navigation.

- Eager: `Discover` (the `/` route).
- Lazy: `IndexV1`, `Index`, `PepperGroup`, `Google`, `SPRGroup`, `Manuscript`, all 8 verticals, `MagnetSite`, `MagnetBook`, `MagnetBookChatPage`, `MagnetBookReaderPage`, `MagnetFeedbackPage`, `MagnetCohortPage`, `Awards`, `About`, `Aletheia`, `Ops`, `NotFound`.
- Suspense fallback: minimal full-bleed cream div (no spinner needed for sub-second loads).
- Expected impact: PDF reader + `pdfjs-dist` (the largest single dep) only loads when someone hits `/m/:slug/read`. Ops, Aletheia, About, all microsites become separate chunks.

### 2. Lazy heavy in-page sections on the homepage

`Discover.tsx` currently imports ~12 large below-the-fold sections eagerly. Wrap the ones below the hero in `React.lazy` with `Suspense` and IntersectionObserver-driven mounting, OR at minimum lazy-import the ones the user almost never scrolls to (`FloatingHeroVideo`, `Faq`, `FinalCta`, `Results`, `TheDecision`, `EarlyAccessReminder`).

### 3. Font payload audit (second biggest win for FCP)

`index.html` loads two Google Fonts requests covering 13 families with many weights. Audit which families are actually rendered above the fold and which are only used on one-off microsites:

- Critical (above the fold on `/`): Inter Tight, Cormorant Garamond, Instrument Sans, IBM Plex Mono. Keep render-blocking.
- Non-critical (move to `<link rel="preload" as="style" ... onload>` async pattern, already partially done): Barlow Condensed, DM Mono, DM Sans, EB Garamond, IBM Plex Sans, Libre Baskerville, Playfair Display, Source Serif 4. Confirm async path is correct (current `media="print"` swap is good).
- Trim unused weights. For example, Instrument Sans uses 4, 5, 6, 7. Confirm all four are actually used; otherwise drop.

### 4. Vite manualChunks for vendor splitting

In `vite.config.ts`, add a `build.rollupOptions.output.manualChunks` rule to split the largest vendor groups so they cache independently across deploys:

- `react-vendor`: react, react-dom, react-router-dom, scheduler.
- `radix`: all `@radix-ui/*`.
- `supabase`: `@supabase/supabase-js`.
- `pdf`: `react-pdf`, `pdfjs-dist` (only loaded by reader route after step 1).
- `recharts`: recharts.
- `framer`: framer-motion.

This means a typo fix in your code does not bust the 200KB+ vendor chunks in users' browser caches.

### 5. Remove or defer `posthog-js` until after first paint

Right now PostHog initializes inside `PostHogPageview` mounted in `App`. Confirm it is dynamically imported or deferred (`requestIdleCallback` / `setTimeout(..., 1500)`). If it ships in the main bundle synchronously it adds ~50 to 80KB to TTI for analytics that does not need to be live in the first paint.

### 6. Quick wins (no risk)

- Fix the React `forwardRef` warning showing in console for `DeeperFindings` and `ManuscriptShareSave` (Radix `Dialog` is calling them as triggers and they need to forward the ref). Wrong refs are a correctness bug, not a perf bug, but it is in the active console and worth cleaning up while we are in there.
- Add `loading="lazy"` and `decoding="async"` to any `<img>` below the fold that is missing them.
- Verify `@vitejs/plugin-react-swc` is being used in production (it is faster than babel) — already configured. Good.

## Out of scope for this pass

- SSR/SSG. The site is a pure SPA on Vite. Adding SSR is a separate, bigger project.
- Image format conversion (WebP/AVIF). Worth doing later but not the bottleneck.
- Service worker / offline cache. Marginal for a marketing site.

## Order of operations

1. Route-level lazy loading + Suspense (steps 1, 2). This is the single highest-impact change.
2. Vendor chunk splitting (step 4) so the win sticks across deploys.
3. Font trim + async (step 3).
4. PostHog defer (step 5).
5. Console warning cleanup (step 6).

After step 1 alone, expect the homepage initial JS payload to drop by roughly half. After all 5, expect a 60 to 75 percent reduction with materially faster Lighthouse / Web Vitals scores on `/` and `/m/:slug`.

## Risks

- Lazy loading introduces a tiny inter-route loading flash. We will use a transparent `<Suspense fallback>` so it is invisible for sub-200ms loads.
- `manualChunks` can occasionally break ordering for libraries that rely on side-effect import order. Will verify with `npm run build` and a smoke test.
- Font trimming can cause FOUT/FOIT if a weight that is actually used gets dropped. Will grep `font-weight` references before removing any weight.