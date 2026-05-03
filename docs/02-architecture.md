# 02 · Architecture

> The technical doc. How this codebase is organized, what lives where, and the conventions that keep it sane.

---

## Stack at a glance

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + Vite | Fast dev cycle, instant HMR, no SSR overhead |
| **Language** | TypeScript (loose mode) | Type safety where it matters, flexibility where it doesn't |
| **Routing** | react-router-dom v6 | SPA routing, no Next.js |
| **Styling** | Tailwind CSS + shadcn/ui (Radix primitives) | Utility-first, owned components |
| **State** | TanStack Query (sparingly) + direct Supabase calls | Most pages poll or fetch directly |
| **Forms** | react-hook-form + zod | Validation before Supabase write |
| **Animation** | framer-motion + Tailwind keyframes | Locked free-tools stack — no GSAP |
| **Charts** | recharts | Already wired for stats/dashboards |
| **PDF** | react-pdf + pdfjs-dist | Manuscript reader at `/m/:slug/read` |
| **Backend** | Supabase (Postgres + Edge Functions + RLS) | Auth-free anon access where appropriate, RPC for protected ops |
| **AI** | OpenAI gpt-4o-mini via edge function | ~$0.002/MAP, sufficient quality post-tuning |
| **Web scraping** | Jina Reader (`https://r.jina.ai/{url}`) | Free tier, clean text extraction |
| **Hosting** | Vercel (post-Lovable migration) | Auto-deploy on push, edge config |
| **Test** | Vitest + jsdom + Testing Library, Playwright (minimal) | Unit-first, E2E backstop |

The project was originally scaffolded by Lovable and `lovable-tagger` is still in `devDependencies`. Plan to remove once the local + Vercel pipeline is stable.

---

## Entry point & routing

```
index.html  →  src/main.tsx  →  src/App.tsx
```

`App.tsx` is the **single source of truth for routes.** When adding a new route, register it in `App.tsx` *above* the `*` catch-all (there's a comment marker: `{/* ADD NEW MICROSITE ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`).

`ScrollToTop` resets scroll on navigation. `QueryClientProvider` wraps the tree, but TanStack Query is used sparingly — most pages fetch via direct Supabase calls or polling.

### Full route table

| Route | Component | Surface | Purpose |
|---|---|---|---|
| `/`, `/discover` | `pages/Discover.tsx` | Discover | The current homepage. Composes ~30 section components from `components/discover/`. Embedded `TopNav`. |
| `/v1` | `pages/Index.tsx` | Discover (v1 archive) | Original v1 landing. Section stack: `HeroSection → Footer`. |
| `/1` | `pages/IndexV1.tsx` | Discover (earlier v1) | Earlier v1 variant using `components/v1/`. Kept for comparison. |
| `/about` | `pages/About.tsx` | Editorial | Founder/company page. Uses `SectionRail` + shared `Footer`. |
| `/awards` | `pages/Awards.tsx` | Editorial | Awards program. Sections in `components/awards/`. Uses `VerticalFooter`. |
| `/manuscript` | `pages/Manuscript.tsx` | Editorial | Self-contained book chapter overview. Sets its own SEO meta tags. |
| `/aletheia` | `pages/Aletheia.tsx` | One-off microsite | Bespoke "Market Activation Profile" microsite (dark navy theme). Sections in `components/aletheia/`. |
| `/pepper-group`, `/google` | `pages/microsites/*.tsx` | Cohort microsite (shared shell) | Per-client tabbed microsites. Each is a thin wrapper defining a `SiteData` object passed to `MicrositeShell`. **Pattern: copy an existing file, edit the data block.** |
| `/spr` | `pages/SPRGroup.tsx` | One-off microsite | One-off SPR microsite using its own components in `components/spr/`. Predates the shared shell pattern. |
| `/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency` | `pages/verticals/*.tsx` | Vertical landings | One-liner wrappers around `pages/verticals/_template/VerticalPage.tsx`. **Page content lives in `pages/verticals/_template/data.tsx`. Cross-surface metadata (slug, nav links, short labels) still lives in `src/content/verticals.ts`.** |
| `/m/:slug` | `pages/MagnetSite.tsx` | Magnet | Polls Supabase for enrichment status, shows `MagnetWaitTheater` while pending (with hard-fail recovery surface), renders `MagnetShell` + `MagnetBreakdown` when complete. Theme loaded per-slug via `useClientTheme`. URL submission happens upstream from the homepage hero (`HeroUrlField` → `lib/magnetSubmit.ts`). |
| `/m/:slug/chat` | `pages/MagnetBookChatPage.tsx` | Magnet | `MagnetShell` + `BookChat` (calls `book-chat` edge function). Empty state with per-firm starter prompts. |
| `/m/:slug/read` | `pages/MagnetBookReaderPage.tsx` | Magnet | `MagnetShell` + `BookReader` (PDF reader via `react-pdf` / `pdfjs-dist`). |
| `/m/:slug/feedback` | `pages/MagnetFeedbackPage.tsx` | Magnet | `MagnetShell` + `FeedbackForm` (calls `submit-feedback` edge function). |
| `/m/:slug/cohort` | `pages/MagnetCohortPage.tsx` | Magnet | Standalone cohort placement view. Reads from the `cohort_metrics` view via `lib/cohort.ts`. |
| `/book` | `pages/MagnetBook.tsx` | Magnet | Static booking/process page (uses `MagnetShell`). |
| `/ops` | `pages/Ops.tsx` | Internal | Password-gated ops dashboard (Bookings, Emails, Microsites tabs). |
| `*` | `pages/NotFound.tsx` | — | Catch-all. |

> **Removed in Sprint 2 (2026-05-02 → 2026-05-03):** `/assess` and `pages/MagnetAssess.tsx`. The Magnet URL field is now embedded in the homepage hero. All "Add Your Firm" CTAs scroll to that field via `lib/scrollToHero.ts` rather than navigating to a separate page.

---

## Page taxonomy (the four surfaces)

The site is really four overlapping product surfaces sharing one repo. **Don't mix them.**

| Surface | Purpose | Implementation pattern |
|---|---|---|
| **Discover** (the book microsite) | Homepage / authority hub at `/` | Long editorial page composed of section components in `src/components/discover/` |
| **Magnet** (the lead-gen funnel) | URL submit → AI enrichment → personalized site | Stateful flow backed by Supabase + `enrich-magnet` edge function |
| **Vertical landings** | SEO landing per industry | Templated via `pages/verticals/_template/VerticalPage.tsx`. Each route is a one-liner that passes a config from `_template/data.tsx`. Cross-surface metadata stays in `src/content/verticals.ts`. |
| **Editorial / static / one-off microsites** | About, Awards, Manuscript, Aletheia, SPR, cohort sites | Bespoke per-page composition OR shared `MicrositeShell` |

### Microsite shell vs. one-off microsites — DO NOT MIX

| Pattern | What it is | When to use |
|---|---|---|
| **Shared shell** (`MicrositeShell` in `components/microsite/`) | Tabbed layout (Overview / Identity / Signals / Orbits / Roadmap / Content Engine), driven by `SiteData` from `types/microsite.ts`. Used by `/pepper-group`, `/google`. | **All new client microsites.** |
| **One-off** (`/spr`, `/aletheia`) | Own component folders, own composition. | **Only extend if the client needs something the shell can't express.** |

---

## Component organization

```
src/components/
├── ApplySection.tsx          ← v1 sections (root level, legacy from /v1)
├── HeroSection.tsx
├── ...
├── Footer.tsx                ← shared Footer
├── ScrollToTop.tsx
│
├── ui/                       ← shadcn/ui primitives (Radix-based)
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
│
├── discover/                 ← /discover homepage sections (~30 components)
│   ├── AdamNote.tsx
│   ├── AuthorityStrip.tsx
│   ├── Authors.tsx
│   └── ...
│
├── magnet/                   ← Magnet flow components
│   ├── MagnetWaitTheater.tsx     ← polling theater w/ hard-fail recovery
│   ├── MagnetBreakdown.tsx
│   ├── MagnetShell.tsx
│   ├── BookChat.tsx
│   ├── BookReader.tsx
│   ├── FeedbackForm.tsx
│   ├── CohortRankCardData.tsx    ← cohort-rank data wrapper
│   └── v10/                      ← V10 iteration sub-components
│       ├── OrbitGapRadar.tsx     ← viz pack (Sprint 2)
│       ├── PercentileBar.tsx
│       ├── GapSlopeChart.tsx
│       ├── RevenueLeakWaterfall.tsx
│       ├── FrameworkProgress.tsx
│       ├── CohortCompareWidget.tsx
│       ├── CohortRankCard.tsx
│       └── ResearchCard.tsx
│
├── microsite/                ← Shared client microsite shell (Mabbly v2 brand spec)
│   └── MicrositeShell.tsx
│
├── pepper/                   ← Per-client overrides if needed
├── spr/                      ← /spr (one-off, predates shell)
├── aletheia/                 ← /aletheia (one-off bespoke)
├── awards/                   ← /awards page sections (5-ring sculpture)
├── VerticalLanding/          ← VerticalNavBar (cross-vertical switcher) + helpers
├── SkipLink.tsx              ← keyboard skip link (a11y)
└── v1/                       ← /1 (earlier v1 archive)
```

### Where copy lives — `src/content/`

Most user-facing text lives in **typed content modules**, not in JSX. **Editing copy usually means editing here, not JSX.**

| File | What's in it |
|---|---|
| `verticals.ts` | Cross-surface vertical metadata (slug, nav links, short labels, types). Consumed by Discover, About, `VerticalNavBar`, and `lib/cohort.ts`. Page content for the vertical landings themselves moved to `pages/verticals/_template/data.tsx` in Sprint 2. |
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
| `useRevealRef` + `revealStyle` | Per-element scroll reveal control (newer pattern, finer-grained) |
| `useScrollProgress` | Bound to scroll position |
| `useScrollRestoration` | Explicit scroll restoration across magnet sub-routes (Sprint 2) |
| `useFocusOnRouteChange` | Moves focus to `<main>` on route change (a11y, Sprint 2) |
| `useFooterVisible` | Detects when footer is in viewport (for sticky CTA collision fix) |
| `useInlineCtaVisible` | Detects when an inline CTA is visible (auto-hides sticky CTA) |
| `useClientTheme` | Per-slug brand theme cache for Magnet flow |
| `useCountUp` | Animated number count-up |
| `useCursorParallax` | Mouse-tracking parallax effect |
| `useVerticalFlow` | Reads `?vertical=` URL param, returns vertical config |
| `use-mobile` | Breakpoint detection |
| `use-toast` | shadcn toast hook |

### Lib — `src/lib/`

| File | Purpose |
|---|---|
| `utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `tokens.ts` | Typed v2 design-system token registry (colors, spacing, type scale). Sprint 2. |
| `magnetSlug.ts` | `generateMagnetSlug(...)` — slug generation (unit-tested) |
| `magnetSubmit.ts` | Magnet submission logic, called from the homepage `HeroUrlField` (replaces the deleted `/assess` page). Sprint 2. |
| `magnetScoring.ts` | Orbit score calculation logic |
| `magnetAnalytics.ts` | Client-side analytics helpers (currently minimal — see roadmap for PostHog wiring) |
| `clientTheme.ts` | Per-slug brand color resolution + cache (unit-tested) |
| `companyName.ts` | Slug ↔ canonical display name disambiguation (unit-tested). Sprint 2. |
| `cohort.ts` | Fetcher for the `cohort_metrics` view. Sprint 2. |
| `scrollToHero.ts` | Smooth-scroll to the homepage hero URL field; powers all "Add Your Firm" CTAs site-wide. Sprint 2. |
| `calendly.ts` | Calendly embed helpers + URL builders |
| `mabblyAnchors.ts` | Outbound link helpers to mabbly.com / mabbly.ai |

### Integrations — `src/integrations/supabase/`

| File | Purpose | Notes |
|---|---|---|
| `client.ts` | Auto-generated Supabase client | **Do not edit manually** |
| `types.ts` | Auto-generated TypeScript types | **Do not edit manually** |

### Types — `src/types/`

| File | Purpose |
|---|---|
| `magnet.ts` | `BreakdownData` + Magnet flow types |
| `microsite.ts` | `SiteData` shape consumed by `MicrositeShell` |
| `cohort.ts` | Cohort-rank types consumed by `MagnetCohortPage` and the cohort viz components (Sprint 2) |

---

## Path alias

```typescript
"@/*" → "./src/*"
```

Configured in both `tsconfig.json` and `vite.config.ts`. Always use `@/` imports for `src/` paths.

---

## Backend (Supabase)

### Client

```typescript
// src/integrations/supabase/client.ts (auto-generated)
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Environment variables

```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

These go in `.env` (gitignored). **Never commit secrets.** The publishable (anon) key is fine on the client; the service-role key never touches the browser.

### Migrations

Live in `supabase/migrations/`. **10+ migrations exist.** Schema is non-trivial despite older docs that may claim otherwise.

When adding a new table accessed from the client, plan for either:
- **RLS policies** (preferred for read-only / append-only)
- **RPC wrapper** (when client needs operations the anon role shouldn't have)

### Edge functions

Live in `supabase/functions/`. Current set:

| Function | Purpose |
|---|---|
| `enrich-magnet` | The heart of the Magnet flow. Scrapes via Jina, calls gpt-4o-mini, writes `breakdown_data` + `enrich_status = 'complete'`. Triggered fire-and-forget from `lib/magnetSubmit.ts` (called by the homepage `HeroUrlField`). |
| `book-chat` | Powers `/m/:slug/chat`. Loads `breakdown_data` for the slug, calls gpt-4o-mini scoped to the firm's GTM context. |
| `magnet-chat` | Earlier alias / variant of book-chat. Verify if both live or one is deprecated. |
| `submit-feedback` | Receives feedback from `/m/:slug/feedback`. Writes to feedback table. |
| `og-pepper-group` | Generates dynamic OG image for `/pepper-group`. |
| `_shared/` | Shared utilities (CORS headers, env config). |

When changing `enrich-magnet` payload shape, **update both the function AND the polling/render code in `MagnetSite.tsx` + `MagnetBreakdown.tsx`.** They are coupled.

---

## Styling system

### Tailwind config

Custom design tokens in `tailwind.config.ts`:

```typescript
colors: {
  ink: "#0D1117",          // Primary dark
  gold: "#B8933A",         // Brand accent
  sage: "#3D5A4A",         // Secondary
  rust: "#8B3A2A",         // Highlight
  slate: "#5A6A7A",        // Tertiary
  cream: "hsl(var(--cream))",
  // ... CSS-variable-driven shadcn tokens
}
```

### Brand colors (the locked palette)

| Color | Hex | Use |
|---|---|---|
| **ink** | `#0D1117` | Primary dark backgrounds, headlines on light surfaces |
| **gold** | `#B8933A` | Brand accent — eyebrows, gold pulse, primary CTAs, verified badge accents |
| **sage** | `#3D5A4A` | Secondary accent (use sparingly) |
| **rust** | `#8B3A2A` | Highlight (Dead Zone visual emphasis) |
| **slate** | `#5A6A7A` | Tertiary |
| **cream** | CSS var | Light surface background |

**Magnet/per-client surfaces** also use a *dynamic* brand palette resolved at runtime via `useClientTheme` — colors extracted from the firm's website during enrichment, applied as CSS variables on the `MagnetShell` wrapper.

### Fonts

| Family | Tailwind class | Use |
|---|---|---|
| Inter Tight | `font-display` | Display headings, hero |
| Cormorant Garamond | `font-serif` | Serif body, manuscript-style quotes |
| Instrument Sans | `font-sans` | Default body |
| DM Mono | `font-mono` | Eyebrows, technical labels, monospace accents |

Loaded via Google Fonts in `index.html`. **Do not add new font families without coordinating** — every additional font is a render-blocking request.

### Scroll reveal

Two patterns coexist:

**Pattern A (legacy):** Add `.scroll-reveal` to elements (and optionally `.stagger-children`). The `useScrollReveal` hook wires up the IntersectionObserver. Used on `/discover` and earlier pages.

**Pattern B (newer):** Use `useRevealRef` + `revealStyle` for per-element control. Used on newer pages that need finer-grained reveal timing.

### Glass surfaces

```css
.glass-card        /* Dark glass (used on dark backgrounds) */
.glass-card-light  /* Light glass (used on cream surfaces) */
```

Defined in `src/index.css`. Both use `backdrop-filter: blur()` + translucent backgrounds.

### Custom keyframes

Defined in `src/index.css`:

| Keyframe | Purpose |
|---|---|
| `goldPulse` | Gold ring pulse on Dead Zone orbit |
| `bookFloat` | 3D book hero float |
| `countUp` | Number count-up animation |
| `orbit-pulse` | Orbit ring pulse (Section 02 of MAP) |

### Global CTA hook (data-attribute trick)

```css
[data-cta="add-your-firm"] { /* hot-pink palette */ }
```

This global rule in `src/index.css` lets any element use the hot-pink palette by adding `data-cta="add-your-firm"` to its DOM. Used for the Add Your Firm buttons across the site so we don't have to rewrite per-component styles.

**When adding a new "Add Your Firm" button: use the data attribute, not inline styles.**

---

## TypeScript config (loose mode)

```json
{
  "strict": false,
  "noImplicitAny": false,
  "strictNullChecks": false
}
```

**Don't tighten without coordinating** — many existing files rely on these defaults. If you tighten one rule, you'll break a long tail of components silently.

If you want stricter types in a new file, use `// @ts-strict` at the top, or restructure the new code into its own module with explicit type guards.

---

## Testing

### Unit (Vitest)

```bash
npm run test            # Single run
npm run test:watch      # Watch mode
npx vitest run path/to/file.test.ts   # Single file
```

Test setup in `src/test/`. Uses jsdom + Testing Library.

### E2E (Playwright)

```bash
npx playwright test     # Run E2E suite
```

Config exists (`playwright.config.ts`, `playwright-fixture.ts`). Coverage is currently minimal — there's an opportunity to add real E2E coverage on the Magnet flow.

---

## Conventions worth knowing

### Adding a vertical landing

Sprint 2 refactor: vertical pages are now templated. Two files are involved.

1. **Add the slug + nav metadata** in `src/content/verticals.ts` — extend `VerticalSlug` and `NAV_VERTICAL_LINKS`.
2. **Add the page content** in `src/pages/verticals/_template/data.tsx` — export a config object alongside `consulting`, `law`, etc. Type comes from `_template/configs.ts`.
3. **Add a one-liner page wrapper** in `src/pages/verticals/`:
   ```typescript
   import VerticalPage from "./_template/VerticalPage";
   import { newVertical } from "./_template/data";
   export default function NewVerticalPage() {
     return <VerticalPage config={newVertical} />;
   }
   ```
4. **Register the route** in `src/App.tsx` above the catch-all.
5. Verify the vertical appears in the homepage's "Find Your Industry" grid (driven by `src/content/verticals.ts`) and in the `VerticalNavBar` firm menu.

### Adding a client microsite (shared shell)

1. Copy `src/pages/microsites/PepperGroup.tsx` to `src/pages/microsites/<NewClient>.tsx`
2. Edit the `SITE_DATA` object — typed by `src/types/microsite.ts`
3. Register the route in `src/App.tsx`
4. The shell handles tab rendering, navigation, and theming

### Adding a one-off microsite

Only do this if the client needs something the shared shell can't express.

1. Create `src/components/<client>/` folder for client-specific components
2. Create `src/pages/<Client>.tsx` composing those components
3. Register the route

### Editing the homepage

It's `src/pages/Discover.tsx`, **not** `src/pages/Index.tsx`. `Index` is the v1 landing at `/v1`. This trips people up.

### Editing copy

Check `src/content/` first. Most user-facing text is data, not JSX. Editing JSX directly is often a mistake — the copy probably has a content-file source of truth.

### Magnet edge function changes

When changing `enrich-magnet` payload shape:
1. Update the edge function (`supabase/functions/enrich-magnet/index.ts`)
2. Update the polling/render code in `src/pages/MagnetSite.tsx`
3. Update `src/components/magnet/MagnetBreakdown.tsx`
4. Update `src/types/magnet.ts` (`BreakdownData` schema)

These four are coupled. If any one drifts, the flow breaks silently.

### Vercel deployment

After the Lovable → local migration, deployments happen via Vercel:
- `main` branch auto-deploys to production
- Pull requests get preview deployments
- Env vars must be set in Vercel dashboard (mirror `.env`)

See [05-playbook.md](./05-playbook.md) for the full deployment playbook.

---

## See also

- [01-strategy.md](./01-strategy.md) — Why this codebase exists
- [03-magnet-flow.md](./03-magnet-flow.md) — The most complex piece: Magnet flow deep dive
- [05-playbook.md](./05-playbook.md) — Daily operating commands and tasks

---

*Last updated: May 1, 2026*
