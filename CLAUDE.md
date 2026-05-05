# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Single source of truth for code structure and conventions.** `docs/02-architecture.md` was collapsed into this file on 2026-05-05 to eliminate doc bifurcation. Topical docs (`docs/01-strategy.md`, `docs/03-magnet-flow.md`, `docs/04-roadmap.md`, `docs/05-playbook.md`, `docs/06-references.md`, `docs/07-design-system.md`) remain authoritative for their topics.

## Project Overview

Marketing/landing site for Mabbly's "Relationship Revenue OS", a book + GTM operating system for professional services firms. Built with **React 18 + Vite + TypeScript** (not Next.js). Production: https://discover.mabbly.com. Originally scaffolded by Lovable; `lovable-tagger` is still in dev deps.

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

## Stack at a glance

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + Vite | Fast dev cycle, instant HMR, no SSR overhead |
| **Language** | TypeScript (loose mode) | Type safety where it matters, flexibility where it doesn't |
| **Routing** | react-router-dom v6 | SPA routing, no Next.js |
| **Styling** | Tailwind CSS + shadcn/ui (Radix primitives) | Utility-first, owned components |
| **State** | TanStack Query (sparingly) + direct Supabase calls | Most pages poll or fetch directly |
| **Forms** | react-hook-form + zod | Validation before Supabase write |
| **Animation** | framer-motion + Tailwind keyframes | Locked free-tools stack, no GSAP |
| **Charts** | recharts | Already wired for stats/dashboards |
| **PDF** | react-pdf + pdfjs-dist | Manuscript reader at `/m/:slug/read` |
| **Backend** | Supabase (Postgres + Edge Functions + RLS) | Auth-free anon access where appropriate, RPC for protected ops |
| **AI** | OpenAI gpt-4o-mini via edge function | ~$0.002/MAP, sufficient quality post-tuning |
| **Web scraping** | Jina Reader (`https://r.jina.ai/{url}`) | Free tier, clean text extraction |
| **Hosting** | Vercel (post-Lovable migration) | Auto-deploy on push, edge config |
| **Test** | Vitest + jsdom + Testing Library, Playwright (minimal) | Unit-first, E2E backstop |

## Architecture

### Entry & Routing
`index.html` → `src/main.tsx` → `src/App.tsx`. React Router DOM v6. `App.tsx` is the source of truth for routes. When adding a route, register it ABOVE the `*` catch-all (there's a comment marker: `{/* ADD NEW MICROSITE ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`).

`ScrollToTop` resets scroll on navigation. `QueryClientProvider` wraps the tree but TanStack Query is used sparingly; most pages fetch via direct Supabase calls or polling.

### CRITICAL: Vite base + Router basename
**Do NOT set `base` in `vite.config.ts` or `basename` on `<BrowserRouter>`.**
The site is published at the root of `discovermabbly.lovable.app` (and `discover.mabbly.com`). Setting `base: "/discover/"` causes built assets to be requested from `/discover/assets/*.js`, which 404 on the published site and produce a fully white screen with a "MIME type 'text/plain'" CSS error in the console. The matching `basename="/discover"` on the router compounds the issue. Both must remain unset. If you need a `/discover` URL, add it as a route alias inside `<Routes>`, never as a base path.

### Page taxonomy (the four surfaces)

The site is really four overlapping product surfaces sharing one repo. **Don't mix them.**

| Surface | Purpose | Pattern |
|---|---|---|
| **Discover** (the book microsite) | Homepage / authority hub at `/` | Long editorial page composed of section components in `src/components/discover/` |
| **Magnet** (the lead-gen funnel) | URL submit → AI enrichment → personalized site | Stateful flow backed by Supabase + `enrich-magnet` edge function |
| **Vertical landings** | SEO landing per industry | Templated via `pages/verticals/_template/VerticalPage.tsx`. Each route is a one-liner that passes a config from `_template/data.tsx`. Cross-surface metadata stays in `src/content/verticals.ts`. |
| **Editorial / static / one-off microsites** | About, Awards, Manuscript, Aletheia, SPR, cohort sites | Bespoke per-page composition OR shared `MicrositeShell` |

### Full route table

| Route | Component | Notes |
|---|---|---|
| `/`, `/discover` | `pages/Discover.tsx` | The current homepage. Composes ~30 section components from `components/discover/`. Embedded `TopNav`. |
| `/v1` | `pages/Index.tsx` | Original v1 landing. Section stack: `HeroSection → Footer`. |
| `/1` | `pages/IndexV1.tsx` | Earlier v1 variant using `components/v1/`. Kept for comparison. |
| `/about` | `pages/About.tsx` | Founder/company page. Uses `SectionRail` + shared `Footer`. |
| `/awards` | `pages/Awards.tsx` | Awards program. Sections in `components/awards/`. |
| `/manuscript` | `pages/Manuscript.tsx` | Self-contained book chapter overview. Sets its own SEO meta tags. |
| `/aletheia` | `pages/Aletheia.tsx` | Bespoke "Market Activation Profile" microsite (dark navy theme). Sections in `components/aletheia/`. |
| `/pepper-group`, `/google` | `pages/microsites/*.tsx` | Per-client tabbed microsites on shared `MicrositeShell`. Each is a thin wrapper defining a `SiteData` object passed to the shell. **Pattern: copy an existing file, edit the data block.** |
| `/spr` | `pages/SPRGroup.tsx` | One-off SPR microsite using its own components in `components/spr/`. Predates the shared shell. |
| `/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency` | `pages/verticals/*.tsx` | One-liner wrappers around `pages/verticals/_template/VerticalPage.tsx`. **Page content lives in `pages/verticals/_template/data.tsx`. Cross-surface metadata (slug, nav links, short labels) still lives in `src/content/verticals.ts`.** |
| `/m/:slug` | `pages/MagnetSite.tsx` | Polls Supabase for enrichment status, shows `MagnetWaitTheater` while pending (with hard-fail recovery surface), renders `MagnetShell` + `MagnetBreakdown` when complete. Theme loaded per-slug via `useClientTheme`. URL submission happens upstream from the homepage hero (`HeroUrlField` → `lib/magnetSubmit.ts`). |
| `/m/:slug/chat` | `pages/MagnetBookChatPage.tsx` | `MagnetShell` + `BookChat` (calls `book-chat` edge function). Empty state with per-firm starter prompts. |
| `/m/:slug/read` | `pages/MagnetBookReaderPage.tsx` | `MagnetShell` + `BookReader` (PDF reader via `react-pdf` / `pdfjs-dist`). |
| `/m/:slug/feedback` | `pages/MagnetFeedbackPage.tsx` | `MagnetShell` + `FeedbackForm` (calls `submit-feedback` edge function). |
| `/m/:slug/cohort` | `pages/MagnetCohortPage.tsx` | Standalone cohort placement view. Reads from the `cohort_metrics` view via `lib/cohort.ts`. |
| `/book` | `pages/MagnetBook.tsx` | Static booking/process page (uses `MagnetShell`). |
| `/ops` | `pages/Ops.tsx` | Password-gated ops dashboard (Bookings, Emails, Microsites tabs). |
| `*` | `pages/NotFound.tsx` | Catch-all. |

> **Removed in Sprint 2 (2026-05-02 → 2026-05-03):** `/assess` and `pages/MagnetAssess.tsx`. The Magnet URL field is now embedded in the homepage hero. All "Add Your Firm" CTAs scroll to that field via `lib/scrollToHero.ts` rather than navigating to a separate page.

### The Magnet flow (most complex piece)

Homepage hero URL submit (`HeroUrlField` → `lib/magnetSubmit.ts`) → row inserted in Supabase → `enrich-magnet` edge function processes it → `/m/:slug` polls until `complete`, then renders the personalized "MAP" with sub-routes for chat/read/feedback/cohort. All `/m/:slug/*` pages share `MagnetShell`, which loads per-client branding via the cached `useClientTheme` hook (see `lib/clientTheme.ts`). When touching this flow, account for: poll backoff, missing-row grace period, hard timeout, dynamic theming, hard-fail recovery surface, and the vertical-flow override (`useVerticalFlow`, `?vertical=` URL param). Deep dive: [`docs/03-magnet-flow.md`](./docs/03-magnet-flow.md).

### Microsite shell vs. one-off microsites — DO NOT MIX

| Pattern | What it is | When to use |
|---|---|---|
| **Shared shell** (`MicrositeShell` in `components/microsite/`) | Tabbed layout (Overview / Identity / Signals / Orbits / Roadmap / Content Engine), driven by `SiteData` from `types/microsite.ts`. Used by `/pepper-group`, `/google`. | **All new client microsites.** |
| **One-off** (`/spr`, `/aletheia`) | Own component folders, own composition. | **Policy: Aletheia, SPR, and LaunchPad Lab stay as one-offs.** They are intentionally bespoke. Only extend this pattern if a client truly needs something the shell can't express. |

### Component organization

```
src/components/
├── ApplySection.tsx, HeroSection.tsx, ...   ← v1 sections (root level, legacy from /v1)
├── Footer.tsx                                ← shared Footer
├── ScrollToTop.tsx
│
├── ui/                       ← shadcn/ui primitives (Radix-based)
├── discover/                 ← /discover homepage sections (~30 components)
├── magnet/                   ← Magnet flow components
│   ├── MagnetWaitTheater.tsx, MagnetBreakdown.tsx, MagnetShell.tsx
│   ├── BookChat.tsx, BookReader.tsx, FeedbackForm.tsx
│   ├── CohortRankCardData.tsx
│   └── v10/                  ← V10 viz pack (Sprint 2)
│       ├── OrbitGapRadar.tsx, PercentileBar.tsx, GapSlopeChart.tsx
│       ├── RevenueLeakWaterfall.tsx, FrameworkProgress.tsx
│       ├── CohortCompareWidget.tsx, CohortRankCard.tsx, ResearchCard.tsx
├── microsite/                ← Shared client microsite shell (Mabbly v2 brand spec)
├── pepper/                   ← Per-client overrides if needed
├── spr/                      ← /spr (one-off)
├── aletheia/                 ← /aletheia (one-off bespoke)
├── awards/                   ← /awards page sections
├── ops/                      ← /ops dashboard tabs and gating
├── VerticalLanding/          ← VerticalNavBar (cross-vertical switcher) + helpers
├── SkipLink.tsx              ← keyboard skip link (a11y)
└── v1/                       ← /1 (earlier v1 archive)
```

### Where copy lives — `src/content/`

Most user-facing text lives in **typed content modules**, not in JSX. **Editing copy usually means editing here, not JSX.**

| File | What's in it |
|---|---|
| `verticals.ts` | Cross-surface vertical metadata (slug, nav links, short labels, types). Page content for the vertical landings themselves moved to `pages/verticals/_template/data.tsx` in Sprint 2. |
| `industryStats.ts` | Per-vertical stat cards |
| `industryIcons.ts` | Lucide icons per vertical |
| `manuscriptQuotes.ts` | Pull-quotes from the manuscript |
| `verticalFlow.ts` | Score-adaptive variants for `?vertical=` URL param overrides on the Magnet flow |
| `ctaVariants.ts` | CTA copy variants A/B/C/D |

### Hooks — `src/hooks/`

| Hook | Purpose |
|---|---|
| `useScrollReveal` | IntersectionObserver-based fade-in for `.scroll-reveal` elements |
| `useReducedMotion` | Respect `prefers-reduced-motion` |
| `useRevealRef` + `revealStyle` | Per-element scroll reveal control (newer pattern) |
| `useScrollProgress` | Bound to scroll position |
| `useScrollRestoration` | Explicit scroll restoration across magnet sub-routes (Sprint 2) |
| `useFocusOnRouteChange` | Moves focus to `<main>` on route change (a11y, Sprint 2) |
| `useFooterVisible` | Detects when footer is in viewport (sticky CTA collision fix) |
| `useInlineCtaVisible` | Auto-hides sticky CTA when an inline CTA is visible |
| `useClientTheme` | Per-slug brand theme cache for Magnet flow |
| `useCountUp`, `useCursorParallax` | Animation helpers |
| `useVerticalFlow` | Reads `?vertical=` URL param, returns vertical config |
| `use-mobile`, `use-toast` | Breakpoint + toast |

### Lib — `src/lib/`

| File | Purpose |
|---|---|
| `utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `tokens.ts` | Typed v2 design-system token registry. Sprint 2. |
| `magnetSlug.ts` | `generateMagnetSlug(...)` — slug generation (unit-tested) |
| `magnetSubmit.ts` | Magnet submission logic, called from the homepage `HeroUrlField`. Sprint 2. |
| `magnetScoring.ts` | Orbit score calculation logic |
| `magnetAnalytics.ts` | Client-side analytics helpers |
| `clientTheme.ts` | Per-slug brand color resolution + cache (unit-tested) |
| `companyName.ts` | Slug ↔ canonical display name disambiguation (unit-tested). Sprint 2. |
| `cohort.ts` | Fetcher for the `cohort_metrics` view. Sprint 2. |
| `scrollToHero.ts` | Smooth-scroll to the homepage hero URL field; powers all "Add Your Firm" CTAs. Sprint 2. |
| `calendly.ts` | Calendly embed helpers + URL builders |
| `mabblyAnchors.ts` | Outbound link helpers to mabbly.com / mabbly.ai |

### Integrations & types

- `src/integrations/supabase/client.ts` and `types.ts` are **auto-generated. Do not edit manually.**
- `src/types/magnet.ts` (`BreakdownData`), `src/types/microsite.ts` (`SiteData`), `src/types/cohort.ts` (cohort viz types).

### Path alias

`@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`). Always use `@/` imports.

## Backend (Supabase)

- Client: `src/integrations/supabase/client.ts`. Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (the publishable/anon key is fine on the client; service-role never touches the browser).
- Migrations live in `supabase/migrations/` (10+ exist). Schema is non-trivial. When adding a client-accessed table, plan for either RLS policies or an RPC wrapper.

### Edge functions (`supabase/functions/`)

| Function | Purpose |
|---|---|
| `enrich-magnet` | The heart of the Magnet flow. Scrapes via Jina, calls gpt-4o-mini, writes `breakdown_data` + `enrich_status = 'complete'`. Triggered fire-and-forget from `lib/magnetSubmit.ts`. |
| `book-chat` | Powers `/m/:slug/chat`. Loads `breakdown_data`, calls gpt-4o-mini scoped to the firm's GTM context. |
| `magnet-chat` | Earlier alias / variant of book-chat. |
| `submit-feedback` | Receives feedback from `/m/:slug/feedback`. |
| `og-pepper-group` | Generates dynamic OG image for `/pepper-group`. |
| `_shared/` | Shared utilities (CORS, env config). |

When changing `enrich-magnet` payload shape, **update both the function AND the polling/render code in `MagnetSite.tsx` + `MagnetBreakdown.tsx` AND `src/types/magnet.ts`.** They are coupled.

## Styling

- **Tailwind** with custom tokens in `tailwind.config.ts`.
- **Brand colors**: `ink` (#0D1117), `gold` (#B8933A), `sage` (#3D5A4A), `rust` (#8B3A2A), `slate` (#5A6A7A), `cream` (CSS var). Magnet/per-client surfaces also use a *dynamic* brand palette resolved at runtime via `useClientTheme`.
- **Fonts**: `font-display` Inter Tight, `font-serif` Cormorant Garamond, `font-sans` Instrument Sans, `font-mono` DM Mono. Loaded via Google Fonts in `index.html`. **Do not add new font families without coordinating** — every additional font is a render-blocking request.
- **Scroll reveal**: two patterns coexist. (A, legacy) add `.scroll-reveal` (and optionally `.stagger-children`); `useScrollReveal` wires up the IntersectionObserver. (B, newer) use `useRevealRef` + `revealStyle` for per-element control.
- **Glass surfaces**: `.glass-card` / `.glass-card-light` in `src/index.css`. Custom keyframes also defined there (`goldPulse`, `bookFloat`, `countUp`, `orbit-pulse`).
- **Global CTA hook**: any `[data-cta="add-your-firm"]` element gets the hot-pink palette via a global rule in `src/index.css`. Use the data-attribute rather than rewriting per-component styles.

## TypeScript Config

Loose mode: `strict: false`, `noImplicitAny: false`, `strictNullChecks: false`. Don't tighten without coordinating, many existing files rely on these defaults. If you want stricter types in a new file, use `// @ts-strict` at the top, or restructure into its own module with explicit type guards.

## Testing

- **Unit**: Vitest + jsdom + Testing Library. Test setup in `src/test/`. `npm run test` (single), `npm run test:watch` (watch), `npx vitest run path/to/file.test.ts` (single file).
- **E2E**: Playwright (`playwright.config.ts`, `playwright-fixture.ts`). Coverage is currently minimal.

## Copy / typography (HARD RULE)

**No dashes in user-facing copy.** Forbidden characters: em dash (`—`, U+2014), en dash (`–`, U+2013), and ASCII hyphen-minus (`-`) when used as a punctuation dash between phrases. Use commas, periods, colons, semicolons, parentheses, or the word "to" (for ranges) instead.

This rule applies to: JSX text content, string literals rendered to the page, content modules in `src/content/`, edge-function-generated copy (the LLM is told this in `supabase/functions/enrich-magnet/index.ts`), `aria-label` and other accessible-name strings, and CLAUDE.md / docs for consistency.

**Hyphens are still fine in:** CSS class names (`text-gold`), URLs and route paths (`/pepper-group`), file names, HTML attributes (`data-cta`, `aria-label`), `kebab-case` identifiers, and any other code construct where `-` is syntactic. The rule is about *prose*, not *code*.

**Replacement guide for prose:**
- ` — ` (em dash with spaces) → `, ` (comma) by default; use `: ` if introducing a definition/list, or `. ` only if it really is a sentence break with a capitalized continuation.
- `word—word` (em dash joining two words/numbers) → ` to ` for ranges, otherwise rewrite.
- `–` en dash in numeric ranges (`6–12`, `$1.2M–$2.4M`) → ` to ` (`6 to 12`, `$1.2M to $2.4M`).
- Compound modifiers in copy (e.g. `well-known`, `lead-gen`, `AI-native`): rewrite without the hyphen when feasible. Exceptions only for proper nouns or technical terms where the hyphenated form is canonical.

**Existing enforcement:**
- `src/components/magnet/MagnetBreakdown.tsx` (`stripDashes`) sanitizes em/en-dashes from LLM output at runtime.
- The `enrich-magnet` system prompt instructs the LLM to never emit dashes and forbids invented dollar figures + the words `leverage`, `synergy`, `optimize`, `underutilized`.
- The forbidden vocabulary is also enforced in hand-written JSX via an ESLint `no-restricted-syntax` rule in `eslint.config.js`. Locked phrases: `synergy`, `optimize`, `underutilized`, `leverage` (except "leverage move"), and the AI tell `systematic origination`. When adding new LLM-generated copy paths, mirror both safeguards.

## Conventions worth knowing

### Adding a vertical landing (Sprint 2 templated pattern)

1. **Add the slug + nav metadata** in `src/content/verticals.ts` — extend `VerticalSlug` and `NAV_VERTICAL_LINKS`.
2. **Add the page content** in `src/pages/verticals/_template/data.tsx` — export a config object alongside `consulting`, `law`, etc. Type comes from `_template/configs.ts`.
3. **Add a one-liner page wrapper** in `src/pages/verticals/`:
   ```tsx
   import VerticalPage from "./_template/VerticalPage";
   import { newVertical } from "./_template/data";
   export default function NewVerticalPage() {
     return <VerticalPage config={newVertical} />;
   }
   ```
4. **Register the route** in `src/App.tsx` above the catch-all.
5. Verify the vertical appears in the homepage's "Find Your Industry" grid and the `VerticalNavBar` firm menu.

### Adding a client microsite (shared shell)

1. Copy `src/pages/microsites/PepperGroup.tsx` to `src/pages/microsites/<NewClient>.tsx`.
2. Edit the `SITE_DATA` object (typed by `src/types/microsite.ts`).
3. Register the route in `src/App.tsx`.
4. The shell handles tab rendering, navigation, and theming.

### Adding a one-off microsite

Only do this if the client truly needs something the shared shell can't express. Aletheia, SPR, and LaunchPad Lab are intentionally one-offs and stay that way; do not migrate them into `MicrositeShell`.

1. Create `src/components/<client>/` for client-specific components.
2. Create `src/pages/<Client>.tsx` composing those components.
3. Register the route.

### Editing the homepage

It's `src/pages/Discover.tsx`, **not** `src/pages/Index.tsx`. `Index` is the v1 landing at `/v1`. This trips people up.

### Editing copy

Check `src/content/` first. Most user-facing text is data, not JSX. Editing JSX directly is often a mistake.

### Magnet edge function changes

When changing `enrich-magnet` payload shape:
1. Update the edge function (`supabase/functions/enrich-magnet/index.ts`).
2. Update polling/render in `src/pages/MagnetSite.tsx`.
3. Update `src/components/magnet/MagnetBreakdown.tsx`.
4. Update `src/types/magnet.ts` (`BreakdownData` schema).

These four are coupled. If any one drifts, the flow breaks silently.

## See also

- [`docs/01-strategy.md`](./docs/01-strategy.md) — Why this codebase exists (RROS thesis, locked vocabulary, verified facts).
- [`docs/03-magnet-flow.md`](./docs/03-magnet-flow.md) — Magnet flow deep dive.
- [`docs/04-roadmap.md`](./docs/04-roadmap.md) — Priority queue, sprint plan.
- [`docs/05-playbook.md`](./docs/05-playbook.md) — Daily operating commands and tasks.
- [`docs/07-design-system.md`](./docs/07-design-system.md) — Mabbly brand system.
