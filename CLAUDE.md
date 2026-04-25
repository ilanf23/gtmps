# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Relationship Revenue OS is a single-page marketing/landing site for a professional services book by Mabbly. Built with **React + Vite + TypeScript** (not Next.js). Production URL: https://discover.mabbly.com

## Commands

```bash
npm run dev          # Dev server at localhost:8080
npm run build        # Production build
npm run build:dev    # Development mode build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run preview      # Preview production build
```

## Architecture

### Single-Page App Structure
- **Entry**: `index.html` -> `src/main.tsx` -> `src/App.tsx`
- **Routing**: React Router DOM v6. Only two routes: `/` (Index) and `*` (NotFound)
- **Landing page** (`src/pages/Index.tsx`): Vertical stack of section components rendered in order:
  StickyNav -> HeroSection -> DefinitionBanner -> SocialProofBar -> MissionSection -> EpisodeSection -> BookSection -> AuthorsSection -> DeeperSection -> ResultsSection -> ApplySection -> Footer

### Component Organization
- `src/components/` - Page section components (HeroSection, ApplySection, etc.)
- `src/components/ui/` - shadcn/ui primitives (button, card, dialog, etc.)
- `src/hooks/` - Custom hooks (`useScrollReveal` for IntersectionObserver animations, `use-mobile` for breakpoint detection)
- `src/lib/utils.ts` - `cn()` utility (clsx + tailwind-merge)
- `src/integrations/supabase/` - Auto-generated Supabase client and types (do not edit manually)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

## Styling

- **Tailwind CSS** with custom design tokens defined in `tailwind.config.ts`
- **Custom brand colors**: `ink` (#0D1117), `gold` (#B8933A), `sage` (#3D5A4A), `rust` (#8B3A2A), `slate` (#5A6A7A), `cream` (CSS var)
- **Custom fonts**: `font-display` (Inter Tight), `font-serif` (Cormorant Garamond), `font-sans` (Instrument Sans), `font-mono` (DM Mono)
- **Scroll animations**: Add `scroll-reveal` class to elements; the `useScrollReveal` hook handles IntersectionObserver-based fade-in. Stagger children with `.stagger-children`
- **Glass effects**: `.glass-card` and `.glass-card-light` classes defined in `src/index.css`
- Many custom keyframe animations in `src/index.css` (goldPulse, bookFloat, countUp, etc.)

## Backend

- **Supabase** client in `src/integrations/supabase/client.ts` (auto-generated, do not edit)
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`
- Database schema is currently empty (types.ts has no tables defined)

## TypeScript Config

Loose mode: `strict: false`, `noImplicitAny: false`, `strictNullChecks: false`

## Testing

- **Unit**: Vitest with jsdom + Testing Library
- **E2E**: Playwright (config present but minimal usage)
