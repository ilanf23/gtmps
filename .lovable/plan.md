## Goal

Make the per-channel funnel reflect reality: every UTM-tagged click should produce a Views row, every map created from that click should attribute to the same channel, and one broken layer should never zero out the whole funnel.

## What's broken today (verified against live data)

Querying the last 7 days:

- `magnet_views`: 43 rows total, ALL with null utm_source/medium/campaign. Only one `__home__` row exists, and it only fires when the landing path is exactly `/` or `/discover`.
- `magnet_submissions`: 10 rows, ALL with null UTMs.

Three concrete gaps:

1. **Homepage view logging is path-restricted.** `RefAttributionCapture` only inserts a `__home__` view row when `pathname === "/"` or `"/discover"`. A UTM link pointing at `/consulting`, `/m/<slug>`, `/pepper-group`, etc. produces zero channel-attributed views.
2. **First-touch capture is also path-aware in practice.** `captureRefFromUrl` runs on every route, but if the user lands on `/m/<slug>` directly (shared link with UTM), the `magnet_views` row that `MagnetShell` writes pulls UTMs from `useMagnetAttribution`, which reads localStorage. If localStorage is empty (incognito, different device), the row is untagged.
3. **Submission attribution has no fallback.** `magnetSubmit.ts` only reads `getRefAttribution()` (localStorage). If first-touch wasn't captured for any reason, the row is permanently null. There is no second source.

PostHog dual-write exists for analytics events but NOT for views or submissions, so the funnel has no backstop.

## Fix, in layers (each layer independently improves the funnel)

### Layer 1, capture on every surface

Update `src/components/RefAttributionCapture.tsx`:

- Remove the `path !== "/" && path !== "/discover"` guard. Log a `__home__` view row on ANY route when UTMs are present in the URL.
- Keep the per-tab dedupe key, but make it `${path}|${utm}` so the same visitor moving across pages with the same UTM doesn't double-count, but a fresh tab does.
- Also log when only `ref=` is present (currently requires utm_*).

### Layer 2, URL-first attribution at submit

Update `src/lib/magnetSubmit.ts`:

- Before reading `getRefAttribution()`, read the current `window.location.search` for `utm_*` and `ref` directly. If present, prefer those values (current click wins over stale localStorage).
- If the URL has nothing, fall back to localStorage (current behavior).
- If both are empty, fall back to `document.referrer` parsing (LinkedIn/Twitter/Google domains map to inferred utm_source).

### Layer 3, server-side belt-and-suspenders

Update `src/components/magnet/MagnetShell.tsx`:

- When inserting the `magnet_views` row, also pass UTMs from the current URL (not just `useMagnetAttribution`). URL > localStorage > null.

Update `supabase/functions/enrich-magnet/index.ts`:

- After enrichment completes, if the submission row has null UTMs, look up the most recent `magnet_views` row for the same `visitor_fingerprint` within the last 30 minutes that DOES have UTMs, and copy them onto the submission row. This recovers attribution when localStorage was cleared between landing and submit.

### Layer 4, PostHog dual-write for views and submissions

Update `RefAttributionCapture.tsx` and `magnetSubmit.ts`:

- Mirror every `magnet_views` insert as a PostHog `channel_view` event with `{utm_source, utm_medium, utm_campaign, slug, path}`.
- Mirror every successful submission as `channel_map_submitted`.

This gives the Channels tab a fallback data source if Supabase RLS or the views table ever breaks again, and lets us cross-check counts.

### Layer 5, self-test in the Ops Channels tab

Update `src/components/ops/tabs/ChannelsTab.tsx`:

- Add a "Test pipeline" button next to Save. It opens the built UTM URL in a new tab AND immediately writes a synthetic `magnet_views` row with the chosen UTMs from the ops user's browser. After 5 seconds, it re-fetches `/ops-channels` and shows a green check (row found) or red x (still missing) right next to the row, so the operator can verify the pipeline end to end without leaving the page.
- Add a small "Pipeline health" badge at the top of the tab that runs three checks on mount:
  1. Can we insert into `magnet_views` from the browser? (anonymous insert RLS still works)
  2. Does the latest `__home__` view in the last hour have UTMs?
  3. Does the latest `magnet_submissions` row have UTMs?
  Show pass/fail for each. This makes regressions visible before the operator wastes a campaign.

### Layer 6, backfill and visibility

- Run a one-shot SQL backfill (via migration with a `DO` block, or manual psql) that joins `magnet_submissions` to `magnet_views` on `visitor_fingerprint` within a 1-hour window and copies UTMs onto submissions where they're null. This rescues past traffic where Layer 3 would have caught it.
- Add an "Untagged investigation" expandable in the Channels tab listing the most recent untagged views with their `referrer_url` and `landing_path`, so we can spot which campaigns are missing UTMs in their links.

## File touch list

- `src/components/RefAttributionCapture.tsx` (Layers 1, 4)
- `src/lib/magnetSubmit.ts` (Layers 2, 4)
- `src/lib/refAttribution.ts` (Layer 2 helper for referrer inference)
- `src/components/magnet/MagnetShell.tsx` (Layer 3)
- `supabase/functions/enrich-magnet/index.ts` (Layer 3 reconciliation)
- `src/components/ops/tabs/ChannelsTab.tsx` (Layer 5, Layer 6 untagged panel)
- `supabase/functions/ops-channels/index.ts` (Layer 6: include `referrer_url`/`landing_path` in untagged rows)
- New migration: backfill submission UTMs from views (Layer 6)

## Order of operations after approval

1. Layers 1 + 2 + 3 ship together in one pass (tightest loop, biggest immediate impact).
2. Layer 4 (PostHog mirror) ships next.
3. Layer 5 (self-test) ships third so operator can verify 1 to 4 are working.
4. Layer 6 (backfill + untagged panel) last.

## What success looks like

- A fresh browser clicking a UTM link to ANY page logs one Views row with the UTMs.
- Creating a map from that session attributes the submission to the same channel.
- If localStorage is cleared between landing and submit, the enrich function repairs the attribution.
- PostHog has matching `channel_view` and `channel_map_submitted` events for cross-check.
- The Channels tab shows a green pipeline health badge and lets the operator self-test any UTM combo in under 10 seconds.
