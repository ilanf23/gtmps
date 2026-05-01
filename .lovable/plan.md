# EDITH Ops Dashboard, Pass 1

## Scope

This pass ships the dashboard skeleton end-to-end against the data we already collect. The new tracking pixel, share-token attribution, and unified email log (Phases 2, 3, 4) are intentionally deferred to a second prompt. That keeps the blast radius small and gets you something usable today.

Tabs that ship with real data:
- Overview, Microsites, Email List, Bookings, Health.

Tabs that ship with a clearly-labelled "needs Phase 2 wiring" empty state:
- Share / Affiliate Tracking. The view-attribution columns on Microsites (views, last viewed, shares) will display a placeholder pill rather than fake numbers.

Nothing on the public site changes. No new client deps. No design tokens touched.

## Auth approach (decision)

Password-on-every-request, no JWT. Reason:

- One role, one password. A signed JWT adds a key (`OPS_JWT_SECRET`), a signing library, and a verification path on every endpoint, with no security gain over re-checking the password header server-side.
- Each `ops-*` edge function reads `Authorization: Bearer <password>` and constant-time compares against `OPS_DASHBOARD_PASSWORD`. If missing or wrong, return 401 immediately with no body details.
- Client stores the password (after a successful `ops-auth` ping) under `sessionStorage.opsAuth` only. Never `localStorage`. Cleared on Sign Out and on tab close.
- 5 wrong attempts inside 60s triggers a 5-minute soft lockout in `sessionStorage` (matches the prompt).
- If `OPS_DASHBOARD_PASSWORD` is not set in Supabase secrets, every endpoint returns 503 "ops dashboard not configured". Never silently allows access.

Only one secret to add: `OPS_DASHBOARD_PASSWORD`. I will request it via `add_secret` before deploying any function. Recommended value is the prompt's `12345678910`. You can rotate any time without code changes.

## Phase 1, database migrations

Create three new tables with RLS service-role-only (no anon access at all, since this pass has no public writes to them yet):

- `magnet_views` (full schema as specified, indexed on `(slug, viewed_at)`)
- `magnet_shares` (full schema as specified, indexed on `source_slug`, `share_token`, `recipient_email`)
- `magnet_emails` (unified email log, unique on `(email, source_event, source_slug)`, generated `email_domain` column)

`magnet_bookings`: skip in this pass. The Bookings tab will read from existing `magnet_call_bookings` and show empty-state copy if you want a separate table later.

`magnet_submissions` denorm columns: skip. The dashboard derives counts at query time. We add denorm in Phase 2 alongside the triggers that populate them.

RLS:
- All three new tables: service role only. No anon insert, no anon select. Safe even if the table names leak; only edge functions with the service-role key can read them.

## Phase 5, /ops route + password gate

- `src/pages/Ops.tsx`: password gate UI, then dashboard layout. Centered single input, "EDITH OPS, enter access code". Shake animation on wrong code via a Tailwind keyframe added inline. Soft lockout after 5 fails / 60s.
- `<meta name="robots" content="noindex,nofollow" />` injected via `react-helmet-async`-style pattern (the project does not have helmet; use a small `useEffect` that mutates `document.head`). No `robots.txt` change per your decision.
- Register `/ops` in `src/App.tsx` above the catch-all `*`.

## Phase 6, dashboard UI (admin styling)

Plain dark surface using existing tokens (`bg-background`, `text-foreground`, `border-border`). No new colors. Layout: top strip + tabbed content via existing `@/components/ui/tabs`.

Tabs and their data sources:
- Overview, KPI cards from `magnet_submissions`, `magnet_call_bookings`, `magnet_emails`, `magnet_share_events`, `magnet_views`. 30-day chart via `recharts`. Activity feed from a UNION of recent inserts.
- Microsites, paginated table from `magnet_submissions` joined to `magnet_breakdowns`. Click a row to expand inline detail (full breakdown JSON via `<pre>` viewer).
- Share / Affiliate, current data: rows from `magnet_share_events` (already exists). New `magnet_shares` is empty until Phase 3, displayed as a "wire share-token attribution to populate" banner.
- Email List, all rows from `magnet_emails`. Filters by source/date/domain. CSV export downloads via Blob link, no edge function needed beyond the data fetch. Backfill rows from existing `magnet_map_emails` on the fly with a UNION inside the edge function so day-1 isn't empty.
- Bookings, list from `magnet_call_bookings`. If empty, copy: "No bookings tracked yet. Wire Calendly webhook to populate this tab."
- Health, recent enrichment errors (`magnet_breakdowns.enrichment_error not null`), pending submissions older than 5 minutes (`status = 'pending' and created_at < now() - 5m`), edge function error rate (skip for v1, show "wire Supabase logs API for live error rate").

## Phase 7, ops-* edge functions

All deploy with `verify_jwt = false` (we do our own auth). Every function:
1. Reads `Authorization` header, constant-time compares against `OPS_DASHBOARD_PASSWORD`.
2. If missing/wrong, returns 401 with `{ error: "unauthorized" }`.
3. Otherwise runs the appropriate Supabase service-role query and returns JSON.

Functions:
- `ops-auth`, body `{ password }`, returns `{ ok: true }` or 401.
- `ops-overview`, returns `{ kpis, timeseries, activity }`.
- `ops-microsites`, query params `?q=&page=&sort=`, returns paginated rows.
- `ops-microsite-detail`, query param `?slug=`, returns full breakdown + recent events.
- `ops-shares`, returns outbound + inbound + top-sharers (mostly empty until Phase 3).
- `ops-emails`, query params `?source=&from=&to=&domain=&q=&page=`, returns paginated.
- `ops-emails-export`, same params, returns text/csv.
- `ops-bookings`, paginated bookings.
- `ops-health`, errors + pending + daily stats.

Shared utility: `supabase/functions/_shared/ops-auth.ts` exporting `requireOpsAuth(req): Response | null`.

## File map

New files:
- `supabase/migrations/<ts>_ops_dashboard_tables.sql`
- `supabase/functions/_shared/ops-auth.ts`
- `supabase/functions/ops-auth/index.ts`
- `supabase/functions/ops-overview/index.ts`
- `supabase/functions/ops-microsites/index.ts`
- `supabase/functions/ops-microsite-detail/index.ts`
- `supabase/functions/ops-shares/index.ts`
- `supabase/functions/ops-emails/index.ts`
- `supabase/functions/ops-emails-export/index.ts`
- `supabase/functions/ops-bookings/index.ts`
- `supabase/functions/ops-health/index.ts`
- `src/pages/Ops.tsx`
- `src/components/ops/OpsAuthGate.tsx`
- `src/components/ops/OpsLayout.tsx`
- `src/components/ops/tabs/OverviewTab.tsx`
- `src/components/ops/tabs/MicrositesTab.tsx`
- `src/components/ops/tabs/SharesTab.tsx`
- `src/components/ops/tabs/EmailsTab.tsx`
- `src/components/ops/tabs/BookingsTab.tsx`
- `src/components/ops/tabs/HealthTab.tsx`
- `src/lib/opsClient.ts` (small fetch wrapper that injects the password header)

Modified files:
- `src/App.tsx` (one new `<Route path="/ops" element={<Ops />} />` line above the catch-all)

Untouched (explicit no-touch):
- `magnet_submissions` schema
- Any file under `src/components/magnet/`
- `src/pages/MagnetSite.tsx`, `src/pages/MagnetAssess.tsx`
- `src/pages/Discover.tsx`, `About.tsx`, `Awards.tsx`, `Manuscript.tsx`, `Aletheia.tsx`, vertical pages
- `public/robots.txt`
- `index.html`
- `tailwind.config.ts`, `src/index.css`, design tokens
- `src/integrations/supabase/client.ts`, `types.ts`

## What this build does NOT do

- No tracking pixel on `/m/:slug` (Phase 2). View counts on Microsites tab read 0 / "needs pixel".
- No share-token generation or `?ref=` resolution (Phase 3). Outbound/Inbound share tables empty with banner.
- No new email-capture wire-up (Phase 4). The Emails tab unions `magnet_emails` + existing `magnet_map_emails` so day-1 has data.
- No realtime, no auto-refresh, no write operations, no roles beyond `ops`, no exports beyond email CSV.
- No JWT, no Lovable Cloud auth user, no robots.txt change, no `config.toml` changes.

## Order of operations

1. Migration (Phase 1 tables, RLS).
2. `add_secret` request for `OPS_DASHBOARD_PASSWORD`. Build pauses here until you confirm.
3. Edge functions + shared auth util.
4. `src/pages/Ops.tsx` with auth gate.
5. Dashboard layout + 6 tabs.
6. Smoke test each tab via the live preview, fix anything that surfaces.
7. Report: files touched, secrets needed, gaps, Phase 2/3/4 follow-up checklist.

## Phase 2/3/4 follow-up (next prompt, not now)

When you're ready, the second prompt is:
- `src/lib/magnetTracking.ts` (trackView / trackDwell / trackEvent)
- `magnet-create-share` and `magnet-resolve-ref` edge functions
- Triggers to maintain `view_count` / `share_count` denorm on `magnet_submissions`
- Wire-up at the 4 capture points listed in Phase 4

Approve and I'll start with the migration.