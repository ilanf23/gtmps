# discover.mabbly.com

> The category authority hub for **GTM for Professional Services** — a book + lead-magnet + research-cohort engine. Built by [Mabbly](https://mabbly.com).
>
> **North Star:** *Professional services firms deserve marketing as sophisticated as the work they sell.*

---

## What this is

Three product surfaces in one repo:

1. **Discover** — the editorial book microsite at `/` and `/discover`
2. **The Magnet** — personalized AI lead gen funnel from the homepage hero to `/m/:slug` → `/book`
3. **Vertical & client surfaces** — eight industry landings, bespoke client microsites, and editorial pages

Production: **https://discover.mabbly.com**

---

## Stack

React 18 · Vite · TypeScript · Tailwind · shadcn/ui · Supabase (Postgres + Edge Functions) · OpenAI gpt-4o-mini · Vercel

---

## Quickstart

```bash
npm install
npm run dev      # http://localhost:8080
```

You'll need a `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

---

## Documentation

The full source of truth lives in [`docs/`](./docs/README.md). Six docs, ordered for top-to-bottom reading on first pass:

| Doc | What's inside |
|---|---|
| [`docs/README.md`](./docs/README.md) | Master index + project at-a-glance |
| [`docs/01-strategy.md`](./docs/01-strategy.md) | The WHY: RROS, ICP, locked vocabulary, verified facts |
| [`CLAUDE.md`](./CLAUDE.md) | The WHAT: stack, routing, components, backend |
| [`docs/03-magnet-flow.md`](./docs/03-magnet-flow.md) | The HOW: V10 Magnet flow, AI pipeline, MAP spec |
| [`docs/04-roadmap.md`](./docs/04-roadmap.md) | The NEXT: P0/P1/P2 priority queue, 14-day ship plan |
| [`docs/05-playbook.md`](./docs/05-playbook.md) | The DAILY: setup, common tasks, deployment |
| [`docs/06-references.md`](./docs/06-references.md) | The SOURCES: Notion links, glossary, prompt library |

**For Claude Code agents:** read [`CLAUDE.md`](./CLAUDE.md) at project root first, then [`docs/README.md`](./docs/README.md).

**For new humans:** start with [`docs/README.md`](./docs/README.md). 30 minutes to operating context.

---

## Voice & convention non-negotiables

A few rules every contributor must respect — see [`docs/01-strategy.md`](./docs/01-strategy.md) for the full lock:

- **Locked vocabulary** — "Dead Zone" not "dormant contacts." `⊙` symbol on every orbit. `DISCOVER · PROVE · DESIGN · ACTIVATE · COMPOUND` in small caps. The Formula is `Signal + Proof + Context = Response, Not Pitch`. "law" not "rule."
- **Verified facts only** — no fabricated stats. The verified library is in [`docs/01-strategy.md`](./docs/01-strategy.md).
- **Single CTA per page** — no competing offers.
- **Confidentiality, not scarcity** — "Confidential. Benchmarked against peer firms," never "25 seats remaining."
- **Native vocabulary per vertical** — origination strategy for law, practice growth for consulting, etc.
- **Research framing, not sales pitch** — visitor is a contributor, not a lead.

---

## Project structure

```
discover-mabbly/
├── CLAUDE.md           ← Claude Code agent orientation
├── README.md           ← This file
├── docs/               ← Full documentation suite
├── src/                ← App source
│   ├── pages/
│   ├── components/     (discover/, magnet/, microsite/, aletheia/, awards/, ...)
│   ├── content/        (verticals.ts and other typed copy modules)
│   ├── hooks/
│   ├── lib/
│   ├── integrations/supabase/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── functions/      (enrich-magnet, book-chat, submit-feedback, ...)
├── public/
└── package.json
```

---

## Status

| | |
|---|---|
| **Baseline release** | Sprint 2 and post audit updates. See `docs/changelog/2026-05-05-baseline.md` |
| **MAP quality** | 5.3/10 today (per May 1 audit) — target 9.0/10 over next 14 days |
| **In flight** | Firm name extraction · Hypothesis de-templating · "Did we nail it?" capture · PostHog event taxonomy · Ops dashboard at `/ops` |

See [`docs/04-roadmap.md`](./docs/04-roadmap.md) for the full priority queue.

## Review and rollback workflow

- Open a branch for each coherent change
- Review through GitHub PRs before merge
- Add a changelog entry for notable product, content, routing, AI, or data-shape changes
- Write rollback notes in the PR so reversions are fast under pressure

The old detailed commit history is not available in this repo. Treat the current codebase as the baseline and preserve decision history from here forward.

---

## Owners

- **Strategy + content** — Adam Fridman
- **Practitioner voice + ecosystem** — Richard Ashbaugh
- **Engineering + GTM infrastructure** — Ilan Fridman
- **AI co-pilot** — EDITH (operational layer + audit + improvement memos)

---

## License

Private. © 2026 Mabbly LLC.
