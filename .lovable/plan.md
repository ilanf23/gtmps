## Goal

Let you create custom referral links inside `/ops`, hand them out (LinkedIn DM, email, partner, etc.), and see exactly which **new maps** each link generated.

Today the Channels tab already mints `?utm_source/medium/campaign` URLs, but those UTMs only get captured **after** someone lands on `/m/:slug`. They are NOT captured when a brand-new visitor lands on the **homepage**, types their firm URL, and creates a new map. That's the gap. Result: a referral link that drives a new map shows up as "untagged / direct" in Ops.

## What you'll get

1. **Ops → Referrals tab** (new, replaces/augments today's "Channels" link builder):
   - Build a referral link: pick a label (e.g. `adam-linkedin-dm`, `pepper-email-blast`), source, medium, campaign. Get a short URL like `discover.mabbly.com/?ref=adam-linkedin-dm` (or `/consulting?ref=...`).
   - Table of all referral codes you've minted: clicks, maps created, conversion rate, last activity.
   - Per-code drill-down: list of every map created via that link (firm URL, slug, created at, status, opened/booked).
   - Copy button + QR code for each link.

2. **One special case honored**: any link tagged `?ref=hi.com` (or whatever you set) is excluded from the Slack notification, matching the existing rule.

## How it works

```text
Step 1  You create code "adam-li-dm" in Ops
        → row in new `magnet_referral_codes` table

Step 2  Visitor clicks https://discover.mabbly.com/?ref=adam-li-dm
        → landing page reads ?ref=, stores it in localStorage + sessionStorage
          (first-touch, survives across pages until they submit)

Step 3  Visitor types "acme.com" in hero, hits submit
        → submitMagnetUrl() reads the stored ref + UTMs
        → writes ref_code, utm_source/medium/campaign onto the
          new magnet_submissions row

Step 4  Ops → Referrals tab joins magnet_referral_codes ←→ magnet_submissions
        → shows "adam-li-dm: 12 clicks, 4 maps, 33% conversion"
```

## Implementation

### Database (migration)

- New table `public.magnet_referral_codes`:
  - `code text primary key` (URL-safe, e.g. `adam-li-dm`)
  - `label text` (human name)
  - `utm_source/medium/campaign text` (auto-applied when the link is built)
  - `destination_path text default '/'` (so a code can target `/consulting`, `/m/<existing-slug>`, etc.)
  - `notes text`, `created_at`, `archived_at`
  - `suppress_slack boolean default false` (covers the `hi.com` no-Slack rule)
  - RLS: service-role only.
- Add columns to `public.magnet_submissions`:
  - `ref_code text` (FK soft-ref to `magnet_referral_codes.code`)
  - `utm_source text`, `utm_medium text`, `utm_campaign text`
  - `referrer_url text` (document.referrer at submit time)
  - Indexes on `ref_code`, `(utm_source, utm_medium, utm_campaign)`.
- New table `public.magnet_ref_clicks` (lightweight click log, append-only):
  - `id`, `code`, `clicked_at`, `visitor_fingerprint`, `landing_path`, `user_agent`.
  - Lets us show "12 clicks → 4 maps" even before submission.

### Frontend

- **New `src/lib/refAttribution.ts`** (mirror of `magnetAttribution.ts` but homepage-scoped):
  - On any page load, read `?ref=`, `?utm_*`. If `?ref=` present and not yet stored, persist `{ref, utm_*, captured_at}` in `localStorage` under `mabbly:ref:firstTouch`. First-touch wins.
  - Fire-and-forget POST to a tiny edge function `log-ref-click` (so `magnet_ref_clicks` gets a row).
- **Wire into App shell** (likely `src/App.tsx` or a new `<RefCapture/>` mounted once like `PostHogPageview`).
- **`src/lib/magnetSubmit.ts`**: when inserting into `magnet_submissions`, attach `ref_code` + `utm_*` from `refAttribution`. No other behavior change.
- **Slack suppression** in `enrich-magnet`: extend the existing `hi.com` skip rule to also skip when the submission's `ref_code` resolves to a code with `suppress_slack = true`.

### Edge functions

- `log-ref-click` (new, public, no auth): validates code exists + not archived, inserts a `magnet_ref_clicks` row. Rate-limited per fingerprint to prevent log spam.
- `ops-referrals` (new, ops-auth gated):
  - `GET /` → list codes with aggregated `clicks`, `maps_created`, `last_map_at`, `bookings`.
  - `POST /` → create a code (validate URL-safe slug, uniqueness).
  - `PATCH /:code` → archive / edit label / toggle `suppress_slack`.
  - `GET /:code/maps` → list of submissions tied to that code.
- `ops-channels` stays for the legacy UTM-only funnel view; new tab is the primary surface going forward.

### Ops UI

- New `src/components/ops/tabs/ReferralsTab.tsx`:
  - Top: "Create referral link" form (label, source, medium, campaign, destination path, suppress Slack toggle).
  - Generated URL shown with Copy + QR.
  - Below: sortable table (Code | Label | Clicks | Maps | CR% | Last activity | Actions).
  - Click row → drawer showing the maps created via that code (firm, slug → link to microsite, status, opened, booked).
- Register the tab in `src/pages/Ops.tsx` between `channels` and `health`.

## Open question

The existing **Channels** tab already partly does this (UTM builder + funnel). Two paths:

1. **Replace** Channels with the new Referrals tab (cleaner, one place for everything).
2. **Add** Referrals as a new tab, leave Channels as the post-landing UTM funnel.

I'll default to **option 2** unless you say otherwise — Channels is still useful for tracking shares from inside microsites, while Referrals is specifically about new-map acquisition.