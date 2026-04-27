## Vertical context flow-through

Propagate vertical context (`law`, `consulting`, `accounting`, `msp`, `advisory`, `ae`, `recruiting`, `agency`) from vertical landing pages → form → wait → result, plus persist it for analytics.

### Route name

Spec mentions `/diagnostic`, but the actual route in this codebase is **`/assess`** (every vertical CTA, sitemap entry, and analytics tag already points there). Keeping `/assess` to avoid breaking existing CTAs and tracking. The vertical query param works the same either way.

---

### 1. Vertical config (single source of truth)

Extend `src/content/verticals.ts` with a new optional `flow` block on each `VerticalContent`:

```ts
flow?: {
  eyebrow: string;                  // form eyebrow
  headlineSuffix: string;           // "law firm's origination"
  methodologyLine: string;
  waitStageTitles: [string, string, string, string]; // overrides 4 stage titles
  waitStageTicks: [string[], string[], string[], string[]];
  resultMapHeaderSuffix: string;    // "· Law Firm"
  insightNativeTerm: string;        // "origination"
  calendarCta: string;
  peerBenchmarkPhrase: string;
  chapterRecommendationLead: string;
  emailSubject: string;             // "Your law firm origination map"
  shareTemplate: string;            // for the Copy Share Link toast / native share
};
```

Add a sibling `general` preset (the current generic copy) used as the fallback. Each existing vertical gets a populated `flow` block using its native vocabulary (origination, practice growth, client development, GTM/renewals/churn, prospecting/AUM, BD/RFPs, mandate origination, new business/pitch).

### 2. Vertical resolver hook

New file `src/hooks/useVerticalFlow.ts`:
- Reads `?vertical=<slug>` from `useSearchParams` (or, on `/m/[slug]`, from a column persisted in `magnet_submissions`).
- Returns `{ slug: VerticalSlug | 'general', flow: FlowConfig }` — always returns a complete config (falls back to `general`).
- Validates the slug against the known list; unknown values silently fall back to `general`.

### 3. CTA wiring on vertical pages

Append `?vertical=<slug>` to all `/assess` links **only** on vertical landing pages:
- `src/components/VerticalLanding/VerticalLanding.tsx` (2 inline `<a href="/assess">` and the sticky CTA prop)
- `src/components/VerticalLanding/VerticalNav.tsx` (2 inline links)
- `src/components/VerticalLanding/VerticalStickyCta.tsx` — accept `vertical` prop and render the right href.

Other entry points stay generic (no param):
- `/discover` "Add Your Firm" → `/assess` (general)
- `/about`, `/awards`, MagnetSite "Try Again" → `/assess` (general)

### 4. Form (`MagnetAssess.tsx`)

- Read vertical via `useVerticalFlow()`.
- Eyebrow = `flow.eyebrow`.
- Headline = `See exactly where your ${flow.headlineSuffix} is leaking.`
- Methodology line = `flow.methodologyLine`.
- Submit handler writes the vertical slug into `magnet_submissions.vertical` (new column; defaults to `general`).
- Navigate forward preserving the param: `/m/${slug}?vertical=${slug}` so the wait + result stages can read it without needing to fetch the row first.

### 5. Wait stage (`MagnetWaitTheater.tsx`)

- Accept new optional `vertical` prop from `MagnetSite`.
- Use `flow.waitStageTitles[i]` to override each `STAGES[i].title`.
- Use `flow.waitStageTicks[i]` to override the rotating ticks per stage.
- Visual structure, timing, progress bar — unchanged.

### 6. Result (`MagnetBreakdown.tsx`)

- Read vertical via `useVerticalFlow()`. If the URL param is missing (e.g., refresh after the email-share path), fall back to the persisted `vertical` column on the breakdown's submission row (already fetched in `MagnetSite`).
- Map header line: append `flow.resultMapHeaderSuffix` after company name.
- "What's next for {customerName}" headline: use `flow.calendarCta` for the booking CTA button label.
- Adaptive insight cards: where the existing copy says "Firms in your size band", swap with `flow.peerBenchmarkPhrase`.
- Manuscript chapter recommendation block: use `flow.chapterRecommendationLead` as the heading.
- Email-save modal: subject/title uses `flow.emailSubject`. The new column on `magnet_map_emails.vertical` records which vertical the recipient came from.
- Copy-share-link toast: optionally include `flow.shareTemplate` as a clipboard-copied template (skipping for now to avoid clipboard surprise; toast just says "Link copied").

### 7. MagnetSite plumbing

- Read `?vertical` from URL.
- Pass it down to `MagnetWaitTheater` and to `MagnetBreakdown`.
- When polling fetches the submission row, if the URL doesn't have `?vertical` but the row does, push it into the URL with `navigate(..., { replace: true })` so refresh keeps the context.

### 8. Database (one migration)

Two new nullable columns + an index:

```sql
ALTER TABLE public.magnet_submissions
  ADD COLUMN vertical text NOT NULL DEFAULT 'general';

ALTER TABLE public.magnet_map_emails
  ADD COLUMN vertical text;

CREATE INDEX idx_magnet_submissions_vertical
  ON public.magnet_submissions (vertical);
```

Update `get_magnet_submission_by_slug` SQL function to return `vertical` so `MagnetSite` can read it without a second query.

### 9. Analytics

- The vertical column on `magnet_submissions` is the canonical attribution record (one row per assessment). Conversion funnels, vertical splits, and vertical-level booking rates can all be computed off it.
- `magnet_map_emails.vertical` records the share recipient's context.
- The existing CTAs already carry `data-vertical` and `data-cta` attributes — analytics dashboards can already group on those for click-side data.
- A dedicated dashboard surface is **out of scope** for this change (no admin UI exists yet; we'll just ensure the data is captured cleanly so it's queryable later).

---

### Files changed

- `src/content/verticals.ts` — add `flow` block on each vertical + `general` preset.
- `src/hooks/useVerticalFlow.ts` — new resolver hook.
- `src/components/VerticalLanding/VerticalLanding.tsx`, `VerticalStickyCta.tsx`, `VerticalNav.tsx` — append `?vertical=<slug>`.
- `src/pages/MagnetAssess.tsx` — apply `flow.eyebrow / headlineSuffix / methodologyLine`; persist `vertical` on insert; forward param.
- `src/pages/MagnetSite.tsx` — read/forward `?vertical`; rehydrate from row on refresh.
- `src/components/magnet/MagnetWaitTheater.tsx` — accept `vertical` prop; apply per-stage titles and ticks.
- `src/components/magnet/MagnetBreakdown.tsx` — apply header suffix, insight terms, peer phrase, chapter lead, calendar CTA, email subject.
- One migration adding the two columns + updating the submission-by-slug RPC.

### Out of scope

- "Cross-vertical share-recipient analytics" beyond the `magnet_map_emails.vertical` column. We're capturing the data; visualizing it needs an admin dashboard that doesn't exist yet.
- Renaming the route to `/diagnostic` — would break every existing CTA with no upside since `?vertical=` works on any path.
- Per-vertical Five Orbits bodies (the spec mentions these "vary per vertical" but they're already produced dynamically by the GPT-4o `enrich-magnet` function, which now receives the vertical via the submission row).

### Acceptance test mapping (from spec)

1. `/law` CTA → form eyebrow `ORIGINATION STRATEGY ANALYSIS` ✓
2. `/agency` CTA → form eyebrow `NEW BUSINESS ANALYSIS` ✓
3. `/discover` CTA → form eyebrow `GET YOUR PERSONALIZED ANALYSIS` (general) ✓
4. Wait stage titles + ticks adapt ✓
5. Result header includes vertical suffix ✓
6. Calendar CTA copy adapts ✓
7. Email-save subject adapts ✓
8. Refresh on `/m/[slug]?vertical=law` preserves; refresh on `/m/[slug]` re-hydrates from `vertical` column ✓
9. Mobile layout untouched ✓