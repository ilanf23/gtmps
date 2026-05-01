# Lovable Prompt · Build the EDITH Ops Dashboard

**Goal:** Build a password-gated internal dashboard at `/ops` that gives Ilan a single-pane view of every signal flowing through the discover.mabbly.com funnel — microsite views, share/affiliate tracking, captured emails, bookings, errors, and overall funnel health.

**The catch:** most of the underlying tracking infrastructure doesn't exist yet. This prompt builds:
1. New Supabase tables for views, referrals, and email aggregation
2. Tracking pixel/event wiring on the existing magnet flow
3. Server-side share-link generation with attribution
4. The admin dashboard UI itself

All in one pass. Heavy guardrails included so Lovable doesn't overreach.

---

## Copy/paste prompt for Lovable

```
Build a password-gated internal operations dashboard at the route /ops for the discover.mabbly.com project. This dashboard surfaces every analytics signal flowing through the personalized MAP funnel. Most of the tracking infrastructure does not exist yet — this prompt builds both the dashboard AND the underlying tracking layer.

Execute the build in seven phases, in this exact order. Do not skip steps. After each phase, verify it works before moving to the next.

═══════════════════════════════════════════════════════════
PHASE 1 — DATABASE MIGRATIONS (Supabase)
═══════════════════════════════════════════════════════════

Create three new tables in supabase/migrations/. Do NOT modify the existing magnet_submissions table — only ADD new tables and ADD columns where noted.

Migration 1: Create magnet_views table
- id: uuid, primary key, default gen_random_uuid()
- slug: text, not null, indexed
- viewed_at: timestamptz, default now()
- visitor_fingerprint: text (hashed IP + user agent — do NOT store raw IP)
- referrer_url: text (where they came from, document.referrer)
- referrer_slug: text, nullable (set if URL has ?ref= parameter)
- utm_source: text, nullable
- utm_medium: text, nullable
- utm_campaign: text, nullable
- session_id: text (client-generated, persists per session)
- dwell_seconds: int, nullable (updated on page unload via beacon)
- max_scroll_percent: int, nullable (0-100)
- last_section_seen: text, nullable
- created_at: timestamptz, default now()

Index on slug + viewed_at for fast per-slug queries.

Migration 2: Create magnet_shares table
- id: uuid, primary key
- source_slug: text, not null (the slug of the map being shared)
- sharer_email: text, nullable (only if captured at share time)
- recipient_email: text, nullable (the partner being sent the map)
- share_method: text (one of: email_forward, copy_link, linkedin, twitter, other)
- share_token: text, unique, not null (random 12-char token appended to share URL as ?ref=[token])
- shared_at: timestamptz, default now()
- visited_at: timestamptz, nullable (set when someone visits the URL with this ref token)
- visited_count: int, default 0
- created_at: timestamptz, default now()

Index on source_slug, share_token, recipient_email.

Migration 3: Create magnet_emails table (unified email capture log)
- id: uuid, primary key
- email: text, not null, indexed
- source_event: text, not null (one of: assess_form, share_self, share_recipient, save_map, exit_intent, booking, manual)
- source_slug: text, nullable (slug they were viewing when captured)
- captured_at: timestamptz, default now()
- consented_marketing: boolean, default false (true only if they explicitly opted in)
- email_domain: text, generated column from email
- created_at: timestamptz, default now()

Unique constraint on (email, source_event, source_slug) — same person can be captured from multiple sources without duplicates.

Migration 4: Create magnet_bookings table (if it does not already exist — check first)
- id: uuid, primary key
- slug: text, indexed
- booker_email: text
- booker_name: text, nullable
- booked_at: timestamptz
- meeting_at: timestamptz
- meeting_url: text, nullable
- status: text (one of: scheduled, completed, no_show, cancelled)
- notes: text, nullable
- created_at: timestamptz, default now()

Migration 5: Add columns to existing magnet_submissions table (if not present):
- view_count: int, default 0 (denormalized counter, updated by trigger)
- last_viewed_at: timestamptz, nullable
- share_count: int, default 0
- booking_count: int, default 0

Apply RLS policies: All four new tables — service role full access. Anon role: insert-only on magnet_views and magnet_shares (so the tracking pixel can write); no read access for anon. Email and bookings tables: no anon access at all.

═══════════════════════════════════════════════════════════
PHASE 2 — TRACKING PIXEL ON THE MAGNET MICROSITE
═══════════════════════════════════════════════════════════

Wire client-side tracking that fires automatic events from /m/:slug into the magnet_views table.

Create a new module at src/lib/magnetTracking.ts with these exported functions:

trackView(slug, opts) — fires on /m/:slug page mount
  Inserts a row into magnet_views with the slug, parsed referrer_url, parsed UTM params, parsed ?ref= param (-> referrer_slug), session_id from sessionStorage (generate if missing), visitor_fingerprint (sha-256 of IP-via-edge + userAgent — IP comes from edge function, so this requires a small edge function call OR just hash userAgent + screen size + timezone).

trackDwell(slug, sessionId, seconds, lastSection, scrollPercent) — fires on visibilitychange/beforeunload via navigator.sendBeacon. Updates the existing magnet_views row for this session with final dwell, last section seen, max scroll percent.

trackEvent(slug, sessionId, eventName, payload) — generic event for clicks (CTA clicks, orbit details opened, share initiated, etc.). Posts to a new edge function magnet-track that writes to a magnet_events table (create this table too — same schema as magnet_views with eventName + payload jsonb).

Wire trackView() into the MagnetSite.tsx mount effect (after the breakdown_data finishes loading — only count "real" views, not loading-state hits).

Wire trackDwell() to fire on page unload using navigator.sendBeacon (works even on tab close).

Wire trackEvent() into:
- Each "Read the observation →" button on orbit detail panels (orbit_detail_opened)
- Each CTA button (cta_click with location: section_5, section_8, etc.)
- Each share button (share_initiated)
- Each "Email me this map" button (save_initiated)
- Each "Did we nail it?" button (if it exists yet) — pass sentiment in payload

DO NOT track personal information beyond the hashed fingerprint. Do NOT log raw IP addresses. Do NOT include user agent strings in the events table — only in the fingerprint hash.

═══════════════════════════════════════════════════════════
PHASE 3 — SHARE LINK GENERATION + AFFILIATE TRACKING
═══════════════════════════════════════════════════════════

Modify the existing share UX in Section 11 of MagnetBreakdown.tsx to generate trackable share links:

When user clicks "Forward to my partner" or "Copy link":
1. Call a new edge function magnet-create-share that:
   - Generates a random 12-character share_token
   - Inserts row into magnet_shares with source_slug, sharer_email (if captured), recipient_email (if captured), share_method, share_token
   - Returns a URL: https://discover.mabbly.com/m/[slug]?ref=[share_token]
2. Returns that URL to the client for clipboard copy or email composition

When a visitor lands on /m/:slug with a ?ref=[token] parameter:
- The trackView() call inherits the referrer_slug from the share_token lookup (resolve token → source_slug server-side)
- Update magnet_shares.visited_at if not set, and increment visited_count
- Update magnet_submissions.share_count for the source slug

This is what makes "who shared with who" visible:
- magnet_shares row tells us: source_slug A was shared by sharer_email X to recipient_email Y at time T via method M
- magnet_views row with referrer_slug = A tells us: someone visited A's map via a share link
- Joining the two tells us the full attribution chain.

═══════════════════════════════════════════════════════════
PHASE 4 — UNIFIED EMAIL CAPTURE
═══════════════════════════════════════════════════════════

Anywhere in the codebase where an email gets captured today (or in the future), write to magnet_emails with the appropriate source_event.

Audit and wire:
- /assess form submit (if email field exists — current V10 says no email, but check) → source_event: assess_form
- "Email me this map" button submit → source_event: save_map
- Share form (when sharer enters their own email) → source_event: share_self
- Share form (recipient email) → source_event: share_recipient
- Calendly booking webhook → source_event: booking
- Future exit-intent modal → source_event: exit_intent

Create an edge function magnet-capture-email that handles dedup logic (same email + source + slug = no insert) and calls into magnet_emails.

═══════════════════════════════════════════════════════════
PHASE 5 — BUILD THE /ops ROUTE WITH PASSWORD GATE
═══════════════════════════════════════════════════════════

Create a new page at src/pages/Ops.tsx and register it in src/App.tsx ABOVE the * catch-all route.

PASSWORD HANDLING — read carefully:

The password is "12345678910" but it MUST NOT be hardcoded in client-side source. Instead:
1. Store the password in a Supabase environment secret named OPS_DASHBOARD_PASSWORD with value "12345678910" (the user will set this in Supabase Secrets — instruct them to do so).
2. Create an edge function ops-auth that takes a submitted password, compares server-side against the env var, and returns either { token: "[short-lived JWT]" } or { error: "invalid" }.
3. The token is a JWT signed with another env secret, expires in 8 hours, and contains a single claim: { role: "ops" }.
4. Store the token in sessionStorage (not localStorage — clears on tab close).
5. All ops dashboard data fetches must include the token in an Authorization header. The dashboard's data-fetch edge functions verify the token before returning data.

If the password env var is missing at deploy time, the auth function returns 503 "ops dashboard not configured" — never silently allow access.

UI for the password gate:
- Centered single input at /ops if no valid token in sessionStorage
- Label: "EDITH OPS · enter access code"
- Submit button: "Enter →"
- On wrong password: shake animation + "wrong code" message, no specifics about why
- 5 wrong attempts in 60 seconds = lock out for 5 minutes (track in sessionStorage; soft lock, not server-enforced — acceptable for v1)

After successful auth:
- Set sessionStorage.opsToken = jwt
- Render the dashboard layout

═══════════════════════════════════════════════════════════
PHASE 6 — BUILD THE DASHBOARD UI
═══════════════════════════════════════════════════════════

Layout: dark-mode admin panel feel. Clean. Functional. No marketing styling.

Top nav strip: "EDITH · OPS" logo on left, "last refresh: Xm ago" + manual [Refresh] button + [Sign out] button on right.

Main content: tabbed interface with these tabs:

TAB 1 — OVERVIEW
A row of 6 KPI cards at top:
- Total submissions all-time
- Maps completed (enrich_status = complete)
- Total views (sum of magnet_submissions.view_count)
- Total shares
- Emails captured (count distinct from magnet_emails)
- Bookings scheduled

Below: a 30-day line chart with toggleable lines for: submissions, completions, views, shares, bookings. Use a simple charting library if not already installed (recharts is already in the project per the React lib list).

Below the chart: "Last 24 hours activity feed" — a reverse-chronological list of: new submissions, completed maps, share events, booking events. Each event shows timestamp, slug, and a one-line description. Click a slug to open it in a new tab.

TAB 2 — MICROSITES
A sortable, searchable table of every slug ever created.

Columns:
- Slug (link, opens in new tab)
- Firm name (from breakdown_data.companyName)
- Created at (relative time)
- Status (pending / complete / error)
- Views (count)
- Last viewed (relative time)
- Shares (count)
- Emails captured (count tied to this slug)
- Booking? (yes/no with date)

Default sort: most recently viewed. Search by slug or firm name.

Click a row to expand inline detail showing:
- Full breakdown_data JSON viewer (collapsible)
- Recent views (last 20 with referrer info)
- Recent shares (with sharer/recipient if captured)
- Direct link to the Supabase row for raw data inspection

TAB 3 — SHARE / AFFILIATE TRACKING
Two views side-by-side:

Left: "Outbound" — table of all shares, sorted by most recent
- Source slug (the map being shared)
- Sharer email (if captured)
- Recipient email (if captured)
- Share method (email_forward / copy_link / etc.)
- Shared at
- Visited? (yes/no with click count)
- Visited at (if applicable)

Right: "Inbound" — visitors who arrived via share links
- Visiting which slug
- Referrer slug (the map that was shared with them)
- Visit time
- Did they then submit their own URL? (linked to their own slug if so)

Bottom of this tab: "Top sharers" — leaderboard of the slugs that have generated the most onward traffic. This is the K-factor view.

TAB 4 — EMAIL LIST
Full table of every email ever captured.

Columns: email, source event, source slug (if any), captured at, marketing consent, email domain.

Filters:
- By source event (multi-select)
- By date range
- By domain
- Search by email

Top of tab: [Download CSV] button that exports the filtered set. Filename: emails-export-YYYY-MM-DD.csv.

Above the table: a 1-line stat — "X unique emails across Y capture events. Z opted into marketing."

TAB 5 — BOOKINGS
Calendly-bookings table. Columns: booker email, booker name, slug, booked at, meeting at, status, notes.

If no Calendly webhook is wired yet, show a stub with instructions: "No bookings tracked yet. Wire Calendly webhook to magnet-track-booking edge function to populate this tab."

TAB 6 — HEALTH
System health view.

- Recent enrichment errors (magnet_submissions where enrich_status = error in last 7 days)
- Long-pending submissions (status = pending older than 5 minutes — flagged red)
- Edge function error rate over 24h (if accessible via Supabase logs API)
- Daily digest stats: submissions / day, completions / day, errors / day, last 30 days

═══════════════════════════════════════════════════════════
PHASE 7 — DATA FETCH EDGE FUNCTIONS
═══════════════════════════════════════════════════════════

The dashboard reads data through edge functions, not direct Supabase queries from the browser. This keeps the service-role key off the client.

Create these edge functions, each verifying the ops JWT token before returning data:

- ops-overview: returns the 6 KPI counts + 30-day time series
- ops-microsites: paginated list of slugs with all denorm columns
- ops-microsite-detail (slug param): full breakdown_data + last 20 views + last 20 shares
- ops-shares: paginated outbound + inbound share data
- ops-emails (with filter params): paginated email list
- ops-emails-export (with filter params): full CSV export
- ops-bookings: paginated bookings list
- ops-health: error and pending-submission view

Each function: validates JWT first → if invalid, returns 401 immediately → if valid, runs the appropriate Supabase query with service role and returns the JSON.

═══════════════════════════════════════════════════════════
DO NOT do any of the following — explicit redundant guardrails:
═══════════════════════════════════════════════════════════

- Do NOT hardcode the password "12345678910" anywhere in client-side source. Server-side env var only.
- Do NOT skip the JWT check on any data-fetch edge function. Every single one validates first.
- Do NOT use localStorage for the auth token. sessionStorage only — clears on tab close.
- Do NOT bundle the Supabase service-role key into the client. Edge functions only.
- Do NOT log raw IP addresses anywhere in the database or in edge function logs.
- Do NOT expose visitor PII (emails, names) in URL parameters.
- Do NOT make /ops crawlable. Add <meta name="robots" content="noindex,nofollow" /> in the page head and add /ops to robots.txt as Disallow.
- Do NOT modify magnet_submissions schema beyond the four columns explicitly listed (view_count, last_viewed_at, share_count, booking_count).
- Do NOT modify the existing /assess flow, MagnetAssess.tsx, MagnetSite.tsx polling logic, or breakdown_data shape. Tracking is additive.
- Do NOT modify the MagnetBreakdown.tsx Section 11 share UX beyond wiring it to call magnet-create-share. Do not redesign the share card layout, copy, or buttons.
- Do NOT add npm dependencies beyond what is already in package.json — recharts (already there), @supabase/supabase-js (already there), react-router-dom (already there), date-fns or similar (check first). NO chart.js, NO MUI, NO Ant Design, NO new auth library.
- Do NOT install Next/Auth, Auth0, Clerk, Supabase Auth UI, or any auth library — this is a simple JWT password gate, not a real auth system.
- Do NOT create real user accounts. There is one role: ops, accessed by one password.
- Do NOT modify supabase/functions/_shared/ unless adding utilities that ALL edge functions need.
- Do NOT touch /discover, /about, /awards, /manuscript, /aletheia, vertical pages, or microsite pages. Tracking pixels go ONLY on /m/:slug.
- Do NOT retroactively populate magnet_views or magnet_shares with synthetic data. Empty tables are fine on day 1.
- Do NOT change any colors, fonts, or design tokens of the public-facing site.
- Do NOT use Tailwind classes that don't exist in the existing config. Stay within the project's design system.
- Do NOT add any animation libraries. Plain CSS transitions only on the dashboard.
- Do NOT add real-time subscriptions (Supabase realtime) for v1. Manual refresh button is sufficient.
- Do NOT auto-refresh the dashboard on a timer. The user controls refresh.
- Do NOT add export functionality beyond the email CSV export. No PDF reports, no Excel files.
- Do NOT add user roles, permissions levels, or admin/viewer split. One password = full access.
- Do NOT add a "create new microsite" button or any write operations on the dashboard. Read-only.
- Do NOT delete any data from the dashboard. Read-only. Deletion happens in Supabase directly.
- Do NOT track-and-display individual visitor PII beyond the hashed fingerprint and what's already collected (emails captured at known events).
- Do NOT add fingerprinting beyond the basic hash. No browser fingerprinting libraries, no canvas fingerprinting, no audio fingerprinting.
- Do NOT add A/B testing infrastructure on the public site as part of this prompt. That is a separate build.
- Do NOT add cookies beyond the session_id cookie (which can also be sessionStorage-only — prefer that).
- Do NOT add a "forgot password" flow. The password is what it is. If the user forgets it, they update the env var.
- Do NOT add multi-factor auth, IP allowlisting, or any other advanced auth feature for v1.
- Do NOT add server-side rendering (SSR). The project is Vite SPA.
- Do NOT add a public status page, public analytics page, or any URL that exposes any of this data without the password.
- Do NOT modify the project's existing routes in App.tsx beyond adding /ops above the catch-all.
- Do NOT run npm run build, npm run test, or npm run lint as part of execution. Just write the code.
- Do NOT auto-commit. Stage all changes for human review.

═══════════════════════════════════════════════════════════
SECURITY NOTES (acknowledge, do not fix in this prompt):
═══════════════════════════════════════════════════════════

This is a v1 internal tool. Acknowledged tradeoffs:
- Password "12345678910" is weak. Recommend rotating to a stronger value via Supabase secret update before production use. Do not change the password as part of this prompt.
- No rate limiting on the auth function beyond the client-side soft lockout. A determined attacker could brute force. Add server-side rate limiting in v2.
- No audit log of who-accessed-when. Add ops_access_log table in v2 if needed.
- Data CSV exports contain emails — handle with care once exported.

═══════════════════════════════════════════════════════════
VERIFICATION AFTER BUILD
═══════════════════════════════════════════════════════════

Step-by-step verification the user runs after this ships:

1. Set OPS_DASHBOARD_PASSWORD = "12345678910" in Supabase Secrets.
2. Set OPS_JWT_SECRET = (generate a 32-character random string) in Supabase Secrets.
3. Deploy. Visit /ops. Should see password gate.
4. Enter wrong password → shake + error.
5. Enter "12345678910" → access granted.
6. Verify all 6 tabs render without console errors.
7. Submit a test MAP via /assess (e.g., example.com). Verify it shows up in Microsites tab within 90 seconds.
8. Visit the resulting /m/[slug] page. Wait 30 seconds. Close tab. Refresh /ops → Microsites tab should show 1 view, dwell ~30s.
9. On /m/[slug], click "Copy link" → verify the copied URL contains ?ref=[token].
10. Open that URL in incognito. Verify Shares tab shows the share AND the visit attribution.
11. Sign out → sessionStorage cleared → /ops requires password again.
12. Robots check: visit /ops in Google's URL inspection tool — should show "blocked by robots.txt" or "noindex".

═══════════════════════════════════════════════════════════
REPORT BACK
═══════════════════════════════════════════════════════════

After completing the build, report:
1. List of new files created (path + one-line purpose)
2. List of existing files modified (path + what changed)
3. List of new Supabase tables and columns
4. List of new edge functions
5. List of new env secrets the user needs to set
6. Confirmation that no client-side code contains "12345678910"
7. Confirmation that all data-fetch edge functions verify the JWT
8. Any gaps where the build is incomplete (e.g., "Calendly webhook stub left as placeholder")
9. Suggested route URL — confirm /ops is live and not exposed in any sitemap or nav

COMMIT MESSAGE:
"Build /ops dashboard — password gate + view/share/email/booking tracking infra"
```

---

## What you need to do before pasting this prompt

1. **Set the secrets in Supabase BEFORE running the prompt:**
   - `OPS_DASHBOARD_PASSWORD` = `12345678910`
   - `OPS_JWT_SECRET` = generate a 32-char random string (any password generator works)
2. **Confirm Calendly webhook setup** if you want bookings to populate. If not yet wired, the Bookings tab will show a stub with instructions, which is fine for v1.
3. **Decide if you want `/ops` or a different obscure URL.** Default suggestion is `/ops`. If you want it less guessable, change the route in the prompt to something like `/edith-ops-7k2x` (still password-gated, but the URL itself is harder to stumble onto).

---

## What you'll have after this ships

A single dashboard at `https://discover.mabbly.com/ops` showing in real time:

**Overview** — total submissions, completed maps, views, shares, emails, bookings. 30-day trend chart. Last 24h activity feed.

**Microsites** — every slug ever created, sortable by views/shares/recency. Click any row for full breakdown_data, recent views, recent shares, and a direct Supabase link.

**Share / Affiliate tracking** — outbound view (every share initiated, sharer + recipient emails if captured, share method, did the recipient visit yet?). Inbound view (every visitor who arrived via a share link, which map they were sent, did they then submit their own URL?). Top sharers leaderboard for K-factor.

**Email list** — every email captured across every event (assess form, share self, share recipient, save map, exit intent, booking, manual). Filter by source/date/domain. Searchable. CSV export.

**Bookings** — every Discovery Session booked, with status, meeting time, notes.

**Health** — recent errors, long-pending submissions, edge function error rate, daily stats.

---

## Things this dashboard does NOT do (intentional v1 scope)

- No real-time auto-refresh — manual refresh button only
- No write operations — read-only
- No user-level roles — single password, single role
- No A/B test results dashboard (separate build later)
- No content management for the MAPs themselves
- No PostHog/Segment integration (the audit memo recommended PostHog for client-side behavioral events; this dashboard works without it but PostHog is still a good add for deeper funnel analysis later)

---

## Security caveats — flag for follow-up

The password "12345678910" is weak and the auth model is intentionally simple for v1. Real risks:

- A leaked URL + a determined brute-force attempt could break in
- No audit log of who accessed when
- The CSV email export goes onto a laptop and from there to wherever

For real production hardening (when you outgrow v1):
1. Rotate the password to something cryptographically strong
2. Add server-side rate limiting on the auth function (5/minute per IP)
3. Add IP allowlist (your home IP, Mabbly office IP)
4. Add an `ops_access_log` table that records every JWT issuance
5. Move to Supabase Auth proper with magic-link or OAuth (you'd be the only authorized email)

For v1, the "12345678910" gate is fine as long as the URL stays internal-only.

---

EDITH out.
