## V10 Microsite Rebuild — 11 Sections, Dual CTA

Restructures `MagnetBreakdown.tsx` (the `/m/:slug` result page) into the V10 layout. Same data we already collect, plus a derived score model, a share-token system, and four vertical-aware CTA copy variants.

### Final section order

```text
01  Personalized Header        (manuscript quote, score-adaptive subheader)
02  Five Orbits visualization  (color-coded by score, click-to-expand)
03  Your Core                  (Observed | Hypothesis | Question)
04  Your Proof                 (Observed | Hypothesis | Question)
05  Compact CTA card           ◀ FIRST CTA — "Skip ahead. Book Adam now."
06  Why this research matters  (Copulsky / Kellogg / 30 firms / 500 interviews)
07  The Value (in their words) (Madcraft, Calliope, SPR + Adam anchor)
08  Your 30-minute conversation◀ SECOND CTA — full inline Calendly + variant copy
09  Your highest leverage move (single move, manuscript quote Ch.3)
10  Deeper Findings            (Signal · Cadence · Research Flag, collapsible)
11  Manuscript Anchor + Share + Save
```

### Data we need to add

The spec leans on numeric scores, share-token attribution, and a slot count we don't currently store. Plan:

1. **Scores** — derive **client-side** from existing breakdown text (length / presence / keyword heuristics) into `orbitScores[1..5]` and a 0–100 `overallScore`. No DB change. Scoring lives in `src/lib/magnetScoring.ts` so the same logic powers Section 1's headline, Section 2's orbit colors, and Section 8's variant selection. (We can swap to LLM-generated scores in `enrich-magnet` later without touching components.)
2. **Share tokens** — add `share_token text unique` to `magnet_submissions` (auto-generated on insert). New URL pattern: `/m/:slug?share_id=:token`. When `share_id` matches the submission's token, show a pinned attribution banner ("[First name] at [Firm] sent you this map"). New `magnet_share_events` table (`id, slug, share_token, channel, created_at`) for analytics. RLS: anon insert allowed, no select.
3. **Calendar slots count** — Calendly's free tier has no public availability API. Use a **conservative static microline** ("Adam typically has 4–6 slots open this week") rather than fake scarcity. Document this as a follow-up if the user wants real slot counts (requires Calendly Pro + `calendly-availability` edge function).
4. **Save email** — already wired (`magnet_map_emails`). Reuse.

### Score-adaptive logic (in `magnetScoring.ts`)

```ts
// Heuristic per orbit: presence + length + signal keywords (clients/cases/proof terms)
function scoreOrbit(text: string | null): number { /* 0–100 */ }

// Banding
band(score) = score >= 60 ? 'high' : score >= 40 ? 'mid' : 'low'

// Section 1 subheader
high → "You're ahead. Here's where to gain more ground."
mid  → "Clear opportunities identified. Let's build your plan."
low  → "Every firm has gaps. Yours are fixable in 90 days."

// Section 8 score-adaptive headline
strongCore && weakProof → "Build your Proof system in 30 days."
weakCore && strongProof → "Sharpen your Core. Your Proof deserves it."
weakDeadZone            → "Activate your Dead Zone like Madcraft did."
allWeak                 → "Build your full RROS in 90 days."
allStrong               → "Compound what you already have."
```

### CTA Variant selection (Section 8)

Vertical context wins, then score/revenue heuristics:

```ts
if (vertical === 'law' || vertical === 'accounting') return 'B';
if (vertical === 'agency' || vertical === 'ae')      return 'C';
if (vertical === 'msp' || vertical === 'recruiting' ||
    vertical === 'advisory' || vertical === 'consulting') {
  return dealSizeEstimate > 30000 ? 'D' : 'C';
}
// generic / no vertical
if (overallScore < 40) return 'A';
if (dealSizeEstimate > 30000) return 'D';
return 'C';
```

All four variants live as constants in `src/content/ctaVariants.ts` so copy can be tuned without touching components.

### Components to build

```text
src/components/magnet/v10/
  PersonalizedHeader.tsx          (Section 1, manuscript quote)
  FiveOrbitsViz.tsx               (Section 2, color-coded + click-to-expand)
  ObservedHypothesisQuestion.tsx  (shared split-panel for §3, §4, §10)
  CompactCtaCard.tsx              (Section 5, smooth-scrolls to #book-call)
  WhyResearchMatters.tsx          (Section 6, verified-only logo strip)
  ValueInTheirWords.tsx           (Section 7, 3 case cards + Adam anchor)
  FullCtaSection.tsx              (Section 8, variant + Calendly + microlines)
  HighestLeverageMove.tsx         (Section 9, manuscript quote Ch.3)
  DeeperFindings.tsx              (Section 10, three collapsibles)
  ManuscriptShareSave.tsx         (Section 11, pull quote + Share/Save cards)
  ShareAttributionBanner.tsx      (Pinned top banner when ?share_id matches)
src/lib/magnetScoring.ts          (derive scores + bands)
src/content/ctaVariants.ts        (A/B/C/D copy + selector)
src/content/manuscriptQuotes.ts   (quotes for §1, §9, §11)
```

`MagnetBreakdown.tsx` becomes a thin orchestrator that loads data, computes scores, derives the variant, and renders the 11 sections in order. The existing `MagnetImpactModel`, `Starting Layer`, `Three Quick Wins`, and per-chapter manuscript walk-through are **removed from this page** to keep the V10 flow tight (they remain accessible via `/m/:slug/read`).

### Vertical-aware copy

`useVerticalFlow()` already returns `flow.calendarCta`, `flow.emailSubject`, `flow.shareTemplate`, `flow.resultMapHeaderSuffix`. Extend `verticalFlow.ts` with two new fields used by V10:

```ts
researchCohortLabel: string;   // §1: "law firm #N of 30 in our research cohort"
oneMoveLead: string;           // §9 lead-in tuned to vertical
```

### Share + attribution

```text
1. Migration: add share_token to magnet_submissions (default gen_random_uuid()).
2. RPC update: get_magnet_submission_by_slug returns share_token + first_name + vertical.
3. /m/:slug reads ?share_id and, when it matches, shows ShareAttributionBanner.
4. Section 11 SHARE card writes to magnet_share_events on click and copies the
   /m/:slug?share_id=<token> URL (Email forward variant uses mailto: with prefilled
   subject + body using flow.shareTemplate).
```

### Visual treatment

- Cormorant Garamond for §1 headline + §11 pull quote (font is already loaded)
- Inter Tight for body / numbers
- DM Mono for eyebrows
- Existing brand-palette overrides keep firm-specific theming working
- 96px min vertical padding per section (`py-24`), 64px on mobile (`py-16`)
- `useScrollReveal` per section, gated by `prefers-reduced-motion`
- Dark/cream alternation: §1 cream, §5 dark gold-bordered card, §6 deep ink, §8 cream, §11 cream — locked via wrapper bg classes

### Mobile (375px)

- Five Orbits → vertical stack (no SVG diagram on small screens; numbered cards with score bar)
- All split panels stack
- Section 5 compact card full-width
- Calendly widget min-height 720px, full width
- Share/Save cards stack with 16px gap
- Tap targets ≥48px

### Analytics

Lightweight `trackEvent(name, props)` helper in `src/lib/analytics.ts` writing to a new `magnet_analytics_events` table (`id, slug, event_name, props jsonb, created_at`). Events:

```text
cta_section5_click     · cta_section8_click   (with variant + score band + vertical)
cta_section8_view      · share_click          (channel: email | copy)
save_click             · section_view         (slug + section_id, IntersectionObserver)
```

If you'd rather not add a table, we can `console.log` for now and wire to PostHog/GA later — but the table makes A/B reporting trivial via SQL.

### Database migration

```sql
-- 1. share_token on submissions
alter table public.magnet_submissions
  add column if not exists share_token text unique default gen_random_uuid()::text;

-- 2. share events
create table public.magnet_share_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  share_token text,
  channel text not null,           -- 'email' | 'copy'
  created_at timestamptz not null default now()
);
alter table public.magnet_share_events enable row level security;
create policy "Anyone can log a share" on public.magnet_share_events
  for insert to anon, authenticated with check (true);

-- 3. analytics events
create table public.magnet_analytics_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  event_name text not null,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.magnet_analytics_events enable row level security;
create policy "Anyone can log analytics" on public.magnet_analytics_events
  for insert to anon, authenticated with check (true);

-- 4. RPC update
create or replace function public.get_magnet_submission_by_slug(_slug text)
returns table(status text, first_name text, vertical text, share_token text)
language sql stable security definer set search_path to 'public' as $$
  select s.status, s.first_name, s.vertical, s.share_token
  from public.magnet_submissions s where s.slug = _slug limit 1
$$;
```

### Test checklist (matches your 17 items)

All 17 items map to component-level checks. Items I'm **explicitly deferring** with a note in the PR description:

- **#6 real slot count from API** → static microline (Calendly free tier limitation)
- **#11 "only render past §8"** → I'll render §9–11 always but lazy-fade them in via IntersectionObserver so the perceived behavior matches without breaking SEO/share previews

### Out of scope (call out before implementing)

- Per-orbit modal manuscript excerpts in §2 require excerpt text we don't have yet — stub will show 1-paragraph generic excerpt + "Read in manuscript" link to `/m/:slug/read#chN`
- Real availability microline (needs Calendly Pro + new edge function)
- Recipient banner persistence in CRM (no CRM connector configured yet — share token still recorded server-side)
