# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing/landing site for Mabbly's "Relationship Revenue OS" — a book + GTM operating system for professional services firms. Built with **React 18 + Vite + TypeScript** (not Next.js). Production: https://discover.mabbly.com. Originally scaffolded by Lovable; `lovable-tagger` is still in dev deps.

## Commands

```bash
npm run dev          # Dev server at localhost:8080
npm run build        # Production build
npm run build:dev    # Vite build in development mode
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch)
npm run preview      # Preview production build
npx vitest run path/to/file.test.ts   # Single test file
npx playwright test                    # E2E (config exists, minimal usage)
```

## Architecture

### Entry & Routing
`index.html` → `src/main.tsx` → `src/App.tsx`. React Router DOM v6. `App.tsx` is the source of truth for routes — when adding a microsite, register it ABOVE the `*` catch-all (there's a comment marker).

`ScrollToTop` component resets scroll on navigation. `QueryClientProvider` wraps the tree but TanStack Query is used sparingly; most pages fetch via direct Supabase calls or polling.

### CRITICAL: Vite base + Router basename
**Do NOT set `base` in `vite.config.ts` or `basename` on `<BrowserRouter>`.**
The site is published at the root of `discovermabbly.lovable.app` (and `discover.mabbly.com`). Setting `base: "/discover/"` causes built assets to be requested from `/discover/assets/*.js`, which 404 on the published site and produce a fully white screen with a "MIME type 'text/plain'" CSS error in the console. The matching `basename="/discover"` on the router compounds the issue. Both must remain unset. If you need a `/discover` URL, add it as a route alias inside `<Routes>`, never as a base path.

### Page taxonomy (what lives where)

The site is really four overlapping product surfaces sharing one repo:

| Surface | Purpose | Pattern |
|---|---|---|
| **Discover** (the book microsite) | The current `/` landing | Long editorial page composed of section components in `src/components/discover/` |
| **Magnet** (the lead-gen funnel) | URL submit → AI enrichment → personalized site | Stateful flow backed by Supabase + edge functions |
| **Vertical landings** | SEO landing per industry | Single shared `VerticalLanding` component driven by `src/content/verticals.ts` |
| **Editorial / static** | About, Awards, Manuscript, Aletheia | Bespoke per-page composition |

### Routes and what each page does

| Route | Component | Notes |
|---|---|---|
| `/`, `/discover` | `pages/Discover.tsx` | The current homepage. Composes ~30 section components from `components/discover/`. Has its own embedded `TopNav`. |
| `/v1` | `pages/Index.tsx` | Original v1 landing. Section stack from `components/` root (`HeroSection` → `Footer`). |
| `/1` | `pages/IndexV1.tsx` | Earlier v1 variant using `components/v1/`. Kept for comparison. |
| `/about` | `pages/About.tsx` | Founder/company page. Uses `SectionRail` and shared `Footer`. |
| `/awards` | `pages/Awards.tsx` | Awards program. Sections in `components/awards/`. Uses `VerticalFooter`. |
| `/manuscript` | `pages/Manuscript.tsx` | Self-contained editorial page about the book chapters. Sets its own SEO meta tags. |
| `/aletheia` | `pages/Aletheia.tsx` | Bespoke "Market Activation Profile" microsite (dark navy theme). Sections in `components/aletheia/`. |
| `/pepper-group`, `/google` | `pages/microsites/*.tsx` | Per-client tabbed microsites. Each page is a thin wrapper that defines a `SiteData` object (typed by `src/types/microsite.ts`) and passes it to `MicrositeShell`. **Pattern: copy an existing file and edit the data block.** |
| `/spr` | `pages/SPRGroup.tsx` | One-off SPR microsite using its own components in `components/spr/`. Predates the shared shell pattern. |
| `/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency` | `pages/verticals/*.tsx` | One-line wrappers — `<VerticalLanding vertical={VERTICALS.<slug>} />`. All copy/config lives in `src/content/verticals.ts`. **Add a vertical by editing that file, not by writing components.** |
| `/assess` | `pages/MagnetAssess.tsx` | Step 1 of the Magnet funnel. Single-field form (website URL). Generates a slug via `lib/magnetSlug.ts`, writes to Supabase, navigates to `/m/:slug`. |
| `/m/:slug` | `pages/MagnetSite.tsx` | Step 2. Polls Supabase for enrichment status (`POLL_BASE_MS`/`POLL_MAX_MS`/`HARD_TIMEOUT_MS`), shows `MagnetWaitTheater` while pending, renders `MagnetShell` + `MagnetBreakdown` when complete. Theme is loaded per-slug via `useClientTheme`. |
| `/m/:slug/chat` | `pages/MagnetBookChatPage.tsx` | `MagnetShell` + `BookChat` (calls `book-chat` edge function). |
| `/m/:slug/read` | `pages/MagnetBookReaderPage.tsx` | `MagnetShell` + `BookReader` (PDF reader via `react-pdf` / `pdfjs-dist`). |
| `/m/:slug/feedback` | `pages/MagnetFeedbackPage.tsx` | `MagnetShell` + `FeedbackForm` (calls `submit-feedback` edge function). |
| `/book` | `pages/MagnetBook.tsx` | Static booking/process page (uses `MagnetShell`). |
| `*` | `pages/NotFound.tsx` | Catch-all. |

### The Magnet flow (most complex piece)

`/assess` (URL submit) → row inserted in Supabase → `enrich-magnet` edge function processes it → `/m/:slug` polls until `complete`, then renders the personalized "MAP" with sub-routes for chat/read/feedback. All four `/m/:slug/*` pages share `MagnetShell`, which loads per-client branding via the cached `useClientTheme` hook (see `lib/clientTheme.ts`). When touching this flow, account for: poll backoff, missing-row grace period, hard timeout, dynamic theming, and the vertical-flow override (`useVerticalFlow`, `?vertical=` URL param).

### Microsite shell vs. one-off microsites

Two coexisting patterns — don't mix them:
- **Shared shell** (`MicrositeShell` in `components/microsite/`, driven by `SiteData` from `types/microsite.ts`): `/pepper-group`, `/google`. Tabbed layout (Overview / Identity / Signals / Orbits / Roadmap / Content Engine). New client microsites should use this.
- **One-off** (`/spr`, `/aletheia`): own component folders, own composition. Only extend these if the client needs something the shell can't express.

### Component organization

- `src/components/` — root contains v1 sections (`HeroSection`, `ApplySection`, etc.) plus shared `Footer`, `ScrollToTop`. Subfolders group per-surface components: `discover/`, `aletheia/`, `magnet/` (with `magnet/v10/` for the current iteration), `microsite/`, `pepper/`, `spr/`, `awards/`, `VerticalLanding/`, `v1/`.
- `src/components/ui/` — shadcn/ui primitives (Radix-based).
- `src/content/` — typed content modules driving content-driven pages (`verticals.ts`, `industryStats.ts`, `industryIcons.ts`, `manuscriptQuotes.ts`, `verticalFlow.ts`, `ctaVariants.ts`). **Editing copy usually means editing here, not JSX.**
- `src/hooks/` — `useScrollReveal`, `useReducedMotion`, `useRevealRef`, `useScrollProgress`, `useFooterVisible`, `useInlineCtaVisible`, `useClientTheme` (per-slug branding cache), `useCountUp`, `useCursorParallax`, `useVerticalFlow`, `use-mobile`, `use-toast`.
- `src/lib/` — `utils.ts` (`cn()`), `magnetSlug.ts`, `magnetScoring.ts`, `magnetAnalytics.ts`, `clientTheme.ts`, `calendly.ts`, `mabblyAnchors.ts`.
- `src/integrations/supabase/` — auto-generated `client.ts` and `types.ts`. **Do not edit manually.**
- `src/types/` — `magnet.ts`, `microsite.ts` shared types.

### Path alias

`@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).

## Backend (Supabase)

- Client: `src/integrations/supabase/client.ts`. Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Migrations live in `supabase/migrations/` (10+ migrations exist — schema is non-trivial despite what older docs may claim).
- Edge functions in `supabase/functions/`: `enrich-magnet`, `book-chat`, `magnet-chat`, `submit-feedback`, `og-pepper-group`, plus `_shared/`.
- RLS-related fixes have been applied via RPCs — when adding a new table accessed from the client, plan for either RLS policies or an RPC wrapper.

## Styling

- **Tailwind** with custom tokens in `tailwind.config.ts`.
- **Brand colors**: `ink` (#0D1117), `gold` (#B8933A), `sage` (#3D5A4A), `rust` (#8B3A2A), `slate` (#5A6A7A), `cream` (CSS var). Magnet/per-client surfaces also use a *dynamic* brand palette resolved at runtime via `useClientTheme`.
- **Fonts**: `font-display` Inter Tight, `font-serif` Cormorant Garamond, `font-sans` Instrument Sans, `font-mono` DM Mono.
- **Scroll reveal**: add `.scroll-reveal` (and optionally `.stagger-children`) to elements; `useScrollReveal` wires up the IntersectionObserver. Some newer pages use `useRevealRef` + `revealStyle` for per-element control instead.
- **Glass surfaces**: `.glass-card` / `.glass-card-light` in `src/index.css`. Custom keyframes also defined there (goldPulse, bookFloat, countUp, etc.).
- **Global CTA hook**: any `[data-cta="add-your-firm"]` element gets the hot-pink palette via a global rule in `src/index.css` — used because several "Add Your Firm" buttons set inline styles. Use the data-attribute rather than rewriting per-component styles.

## TypeScript Config

Loose mode: `strict: false`, `noImplicitAny: false`, `strictNullChecks: false`. Don't tighten without coordinating — many existing files rely on these defaults.

## Testing

- **Unit**: Vitest + jsdom + Testing Library. Test setup in `src/test/`.
- **E2E**: Playwright config exists; coverage is minimal.

## Conventions worth knowing

- **Adding a vertical landing**: edit `src/content/verticals.ts`, add a one-line wrapper in `pages/verticals/`, register the route in `App.tsx`.
- **Adding a client microsite**: copy `pages/microsites/PepperGroup.tsx`, edit the `SITE_DATA` block, register the route. The shell handles the rest.
- **Editing the homepage**: it's `pages/Discover.tsx`, not `pages/Index.tsx`. `Index` is the v1 landing at `/v1`.
- **Editing copy**: check `src/content/` first — much of the user-facing text is data, not JSX.
- **Magnet edge functions**: when changing `enrich-magnet` payload shape, update both the function and the polling/render code in `MagnetSite.tsx` + `MagnetBreakdown`.
