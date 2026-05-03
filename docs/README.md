# discover.mabbly.com · Documentation

> The category authority hub for **GTM for Professional Services** — a book + lead-magnet + research-cohort engine. Built by Mabbly.
>
> **North Star:** *Professional services firms deserve marketing as sophisticated as the work they sell.*

---

## At a glance

| | |
|---|---|
| **Production URL** | https://discover.mabbly.com |
| **Stack** | React 18 · Vite · TypeScript · Tailwind · Supabase |
| **Status** | Live · post-Lovable migration to local + Vercel pipeline |
| **Owner** | Adam Fridman (strategy) · Richard Ashbaugh (relationships) · Ilan (engineering) |
| **Last major release** | Sprint 2 — Discover light register + Magnet viz pack + cohort layer (May 2–3 2026) |
| **Last doc refresh** | May 3 2026 |

---

## What is this project

Three overlapping product surfaces sharing one repository:

1. **Discover** — the editorial book microsite at `/` and `/discover`. Long-form authority page that introduces the *Relationship Revenue OS* (RROS), the Five Orbits framework, and the case for GTM for Professional Services as a category.
2. **The Magnet** — the personalized AI lead-gen funnel. The visitor submits their firm URL from the homepage hero (`HeroUrlField`); AI generates a custom Five Orbits map in ~90 seconds at `/m/:slug` (with sub-routes for chat, read, feedback, cohort), no email gate. The previous standalone `/assess` page was removed in Sprint 2 — the URL field now lives on the homepage.
3. **Vertical & client surfaces** — eight industry landings (`/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency`), bespoke client microsites (`/pepper-group`, `/google`, `/spr`, `/aletheia`), plus editorial pages (`/about`, `/awards`, `/manuscript`).

Every surface ladders into one of three magnets on the homepage:

| Tier | Magnet | Friction | Captures |
|---|---|---|---|
| 1 | GTM Score | 10 questions, no email | Anonymous session |
| 2 | Light MAP / Playbook | 25 questions, 25 min | Email + firm details |
| 3 | Discovery Session MAP | 60-min call with Adam | Direct close path |

---

## Documentation map

Six docs, ordered for reading top-to-bottom on first read, but each is independently readable.

| Doc | What's inside | Read when |
|---|---|---|
| [`01-strategy.md`](./01-strategy.md) | The WHY. RROS thesis. ICP. Locked vocabulary (Five Orbits, Five Truths, Three Laws, The Formula, The MAP). Verified facts library. | You're touching copy, positioning, CTAs, or framework references |
| [`02-architecture.md`](./02-architecture.md) | The WHAT. Stack, routing, page taxonomy, component organization, backend, styling, conventions. | You're shipping code or onboarding a new dev |
| [`03-magnet-flow.md`](./03-magnet-flow.md) | The HOW. The Magnet flow (homepage hero submit → `/m/:slug` and sub-routes). AI enrichment pipeline. V10 spec. MAP 12-field schema. Failure modes. *Note: this doc still references `/assess` in places — the page was removed in Sprint 2 and submission now happens from the homepage hero.* | You're working on the Magnet hero submit, `/m/:slug`, the AI pipeline, or anything Magnet-related |
| [`04-roadmap.md`](./04-roadmap.md) | The NEXT. Audit findings. P0/P1/P2 priority queue. Week 1–4 ship plan. Email capture strategy. Ops dashboard plan. | You're deciding what to build next or status-checking the trajectory |
| [`05-playbook.md`](./05-playbook.md) | The DAILY. Local dev setup. Common tasks (add vertical, add microsite, edit copy, deploy). Lovable→Vercel migration plan. | You're sitting down to work today |
| [`06-references.md`](./06-references.md) | The SOURCES. Notion link library. Lovable prompt archive. Glossary. Killed-stats list. Recommended reading order. | You need a citation or a backstop |
| [`07-design-system.md`](./07-design-system.md) | The BRAND. Mabbly.com design system (palette, typography, visual language) extracted 2026-03-29 + migration map for `discover.mabbly.com`. Cross-property source of truth. | You're touching color, typography, CTAs, slides/social, or planning the brand-system migration |

---

## 30-second quickstart

```bash
# Install
npm install

# Run dev server (localhost:8080)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

You'll need a `.env` file with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

For deeper setup, see [`05-playbook.md`](./05-playbook.md).

---

## Strategic North Star (read this first)

This project exists to make Mabbly the default authority for **GTM for Professional Services** — a category that does not yet exist as a named discipline.

The thesis: most PS firms grow on relationships and reputation, not funnels and cold outreach. They sit on millions of dollars in dormant relationships ("the Dead Zone") that no SaaS GTM playbook is built to activate. By naming the category, building the proof (the Five Orbits framework + the MAP), and shipping the book (Q3 2026), Mabbly becomes the default authority. Authority pulls inbound. Inbound funnels into either Mabbly.com (agency engagement) or Mabbly.ai (product pilot).

Everything in this codebase ladders to that thesis. When in doubt, ask: *does this advance Mabbly as the authority on GTM for Professional Services?*

If yes, ship it.
If no, kill it.

---

## Status snapshot (May 3 2026)

> Just shipped: Sprint 2 (May 2–3). Full changelog in [`changelog/2026-05-02-2026-05-03-sprint-2.md`](./changelog/2026-05-02-2026-05-03-sprint-2.md).

**Live:**
- All 8 vertical landings (now templated via `pages/verticals/_template/VerticalPage.tsx`)
- `/discover` homepage on the light editorial register, with the Magnet URL field embedded in the hero (replaces `/assess`)
- Magnet flow `/m/:slug` with V10 + visualization pack: `OrbitGapRadar`, `PercentileBar`, `GapSlopeChart`, `RevenueLeakWaterfall`, `FrameworkProgress`, `CohortCompareWidget`, `CohortRankCard`
- New cohort placement page at `/m/:slug/cohort`
- AI enrichment pipeline (`enrich-magnet` edge function, gpt-4o-mini)
- Book chat (`/m/:slug/chat`) with empty state and "Ask Adam" framing
- Manuscript reader (`/m/:slug/read`)
- Two cohort microsites (`/pepper-group`, `/google`) on shared shell, now on Mabbly v2 brand spec
- Awards page restructured (`/awards`) with 5-ring sculpture
- A11y baseline: skip link, focus-on-route-change, `<main>` landmark
- Design-system v2 tokens applied (`src/lib/tokens.ts`, `tailwind.config.ts`)
- Hard-fail recovery surface for the magnet polling theater (no more silent infinite poll)

**Removed:**
- `/assess` route and `pages/MagnetAssess.tsx` — submission now lives in the homepage hero (`HeroUrlField` → `lib/magnetSubmit.ts`)
- `VerticalLanding`, `VerticalNav`, `VerticalFooter`, `VerticalStickyCta` — replaced by `_template/VerticalPage` + `VerticalNavBar`
- `VITE_CLIENT_THEME_V2` env gate — dark-body guard is now always-on

**In flight (next 14 days per [04-roadmap.md](./04-roadmap.md) — these P0s are NOT yet shipped):**
- Firm name extraction fix (priority chain: title → og:site_name → URL stem)
- Hypothesis/Question de-templating (kill the boilerplate that repeats across firms)
- Kill the $1.2M fabrication (audit prompt for placeholder dollar values)
- "Did we nail it?" feedback capture widget
- PostHog event taxonomy for attribution
- Org-specific book chat starter prompts
- In-book inline feedback layer
- Ops dashboard at `/ops` (password-gated tracking + email + share intelligence)

**Backlog:**
- Brand color extraction actually applies per-firm
- Score variance fix (widen signal source beyond homepage HTML)
- Mobile audit pass at 375/414/768
- Email lifecycle automation (Day 0/2/5/10/21 sequence)
- Pre-generated microsites for Wave 1 cold email cohort
- 90-day re-take automation

---

## Voice & conventions (project-wide)

- **Locked vocabulary** is non-negotiable. "Dead Zone," not "dormant contacts." "law" not "rule." `⊙` symbol on every orbit. `DISCOVER · PROVE · DESIGN · ACTIVATE · COMPOUND` in small caps. The Formula is `Signal + Proof + Context = Response, Not Pitch`. See [`01-strategy.md`](./01-strategy.md) for the full lock list.
- **Verified facts only.** No fabricated stats. Adam killed seven of them in the April 26 audit (Travis Holaway quote, $2.6B, 8.1x ROI, 167%/51%/288%, 100% beta). The verified library is in [`01-strategy.md`](./01-strategy.md).
- **Single CTA per page.** Hero, sticky, and final CTA all use the same destination. Never compete with yourself for clicks.
- **Confidentiality, not scarcity.** Trust signal is "Confidential. Benchmarked against peer firms," not "25 seats remaining." Law and accounting partners reject scarcity tactics.
- **Native vocabulary per vertical.** GTM is consultant/SaaS language. Each vertical reads native to its own world (origination strategy for law, practice growth for consulting, etc.). The book IP terms (Dead Zone, Five Orbits, RROS) are preserved with first-use translation per vertical.
- **Research framing, not sales pitch.** Every CTA reads as research collaboration. "You're contributing to the cohort" beats "sign up for the report" every time with this audience.

---

## Who reads what

| Reader | Start with |
|---|---|
| **First-time engineer** | [02-architecture.md](./02-architecture.md) → [05-playbook.md](./05-playbook.md) |
| **First-time content/marketing collaborator** | [01-strategy.md](./01-strategy.md) → [03-magnet-flow.md](./03-magnet-flow.md) |
| **Adam / Richard reviewing the build** | This file → [04-roadmap.md](./04-roadmap.md) |
| **Ilan deciding what to ship next** | [04-roadmap.md](./04-roadmap.md) |
| **A future Claude Code agent** | `CLAUDE.md` at project root → this file |
| **A partner / advisor reviewing the funnel** | [01-strategy.md](./01-strategy.md) → [03-magnet-flow.md](./03-magnet-flow.md) |

---

## Project root files (orientation)

```
discover-mabbly/
├── CLAUDE.md           ← Claude Code agent orientation (project-rules-of-engagement)
├── README.md           ← Project landing (30s pitch + pointer to /docs)
├── docs/               ← This folder. The full source of truth.
├── src/                ← App code
│   ├── pages/          ← Route components
│   ├── components/     ← UI components, grouped by surface
│   ├── content/        ← Typed content modules (verticals, stats, copy)
│   ├── hooks/          ← Custom React hooks
│   ├── lib/            ← Utilities (slug gen, theme, calendly, analytics)
│   ├── integrations/   ← Auto-generated Supabase client (do not edit)
│   └── types/          ← Shared TypeScript types
├── supabase/
│   ├── migrations/     ← Schema migrations (10+ exist)
│   └── functions/      ← Edge functions (enrich-magnet, book-chat, etc.)
├── public/             ← Static assets (PDF, video, OG images, audio)
└── package.json
```

---

## Reading suggestions by goal

**"I need to ship something today."**
→ [05-playbook.md](./05-playbook.md) for setup, then [04-roadmap.md](./04-roadmap.md) for what to ship.

**"I need to understand why this exists before I touch it."**
→ [01-strategy.md](./01-strategy.md). Read it cover to cover. It is the contract.

**"Something broke in the Magnet flow."**
→ [03-magnet-flow.md](./03-magnet-flow.md) for the architecture, then [02-architecture.md](./02-architecture.md) for backend specifics.

**"I want the full picture."**
→ Read this file, then 01 → 02 → 03 → 04 → 05 → 06 in order. ~30 minutes of focused reading.

---

*Documentation last updated: May 3, 2026*
*Maintained by: EDITH (with Ilan)*
