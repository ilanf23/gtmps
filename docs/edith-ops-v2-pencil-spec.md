# EDITH OPS v2 — Pencil.dev Design Spec

Paste each `## Screen` block into pencil.dev as a separate prompt. Order matters: build screens 1→9, then go back and link them.

**Global design language** (include this preamble in every prompt):

> Internal admin dashboard. Dense, professional, data-first — think Linear meets Stripe. Dark mode primary. Brand accent: gold #B8933A. Surface: ink #0D1117. Card surface: #161B22. Text primary: #E6EDF3. Text muted: #7D8590. Borders: #30363D. Sans: Inter Tight. Mono: DM Mono. No marketing flourishes. No emoji. Compact spacing (8px grid). Sticky top nav, sticky table headers, keyboard-friendly.

---

## Screen 1 — Login

Single-screen password gate. Centered card on full-bleed dark background.

- Logo/wordmark "EDITH OPS" top of card
- Single password field (type=password), label "Password"
- One primary button "Unlock" (gold)
- Below button: muted text "Rate-limited. 5 failed attempts triggers a 5-minute lockout."
- Error state: red inline message "Incorrect password — N attempts remaining"
- Locked state: button disabled, message "Locked. Try again in M:SS"
- No "forgot password", no "sign up", no email field

---

## Screen 2 — App Shell (applies to screens 3–9)

Persistent left sidebar + top bar.

**Left sidebar (220px, collapsible to 56px):**
- "EDITH OPS" wordmark
- Nav items with icons:
  - Overview
  - Microsites
  - Generate (with "+" icon)
  - Share Trees
  - Top Performers
  - Compare
  - Activity
- Bottom: "Sign out" button

**Top bar:**
- Breadcrumb on left ("Overview" / "Microsites / Pepper Group" / etc.)
- Global search (cmd+K) "Search recipients, companies, microsites…"
- Date range picker (default: Last 30 days)
- Alert bell with red dot if unseen alerts

**Body:** scrollable content area, max-width 1440px.

---

## Screen 3 — Overview Dashboard

Top of page: 6 KPI cards in a row (responsive to 3×2 on narrow). Each card:
- Big number
- Label below
- Tiny sparkline (last 30d)
- Delta vs prior period (green/red, e.g. "+12%")

KPIs in order: **Microsites Generated · Sent · Opened · Engaged · Booked · Downstream Views**

Below KPIs: 2-column layout.

**Left column (2/3 width):**
- Card titled "Activity — last 30 days"
- Stacked area chart, x-axis = days, series = Sent / Opened / Engaged / Booked
- Legend top-right
- Hover tooltip with date + per-series counts

**Right column (1/3 width):**
- Card titled "Live activity"
- Vertical feed, newest top, auto-refresh every 30s
- Each item: avatar circle (initials), one-line event ("Sarah Chen opened Pepper Group MAP"), timestamp ("2m ago"), faint event-type chip
- Items animate in from top
- "View all →" link at bottom

Below: full-width card titled "Funnel — sent through booked"
- Horizontal bar funnel with 5 stages: Sent → Opened → Engaged → Shared → Booked
- Each stage shows count and conversion % from previous

---

## Screen 4 — Microsites List

Sticky filter bar at top:
- Search input "Find by recipient, company, slug…"
- Status multi-select dropdown: Draft / Ready / Sent / Opened / Engaged / Booked
- Vertical filter dropdown (consulting, law, etc.)
- Date range
- "Generate new" button (gold, top right) → opens Screen 5

Table below, sticky header:
| Recipient | Company | Status | Sent | Opens | Time on site | Shares | Downstream | Booked |

- Recipient column: avatar + name + email muted below
- Status: pill (color-coded — gray draft, blue sent, amber opened, gold engaged, green booked)
- Time on site: formatted "12m 34s"
- Shares: number with tiny share-icon
- Downstream: number with tiny tree-icon
- Booked: checkmark or "—"

Row hover: subtle background. Row click → Screen 7 (microsite detail).

Empty state: illustration + "No microsites yet — generate your first" CTA.

Bulk-select checkboxes (for export). Bottom-right: pagination.

---

## Screen 5 — Generate (Single)

Modal or full-page form. Two-column layout.

**Left column — input:**
- Section title "Generate microsite"
- Field: Target URL (required, URL validator) "e.g. acme.com"
- Field: Recipient name
- Field: Recipient email
- Field: Recipient company (auto-fill from URL if possible)
- Field: Channel sent through (dropdown: LinkedIn / Email / Manual / Other)
- Field: Internal notes (textarea, optional)
- Toggle: "Auto-expire after 30 days"
- Big primary button "Generate" (gold)

**Right column — live preview:**
- Skeleton shows "Preview will appear here"
- Once generation kicks off: spinner with steps ("Scraping site…", "Enriching…", "Composing…")
- Once complete: thumbnail of microsite + "Open preview" link

Bottom of right column when ready:
- Trackable URL input (read-only) with copy button
- Two buttons: "Mark as sent" (gold) and "Edit before sending" (ghost, → Screen 6)

---

## Screen 5b — Generate (Bulk)

Tab next to "Single" on Screen 5.

- Big drop zone "Paste URLs (one per line) or drop a CSV"
- Textarea below for pasted URLs
- Field: default channel
- Button "Queue all"
- Below: progress list — each row shows URL, status (queued / generating / ready / error), and per-row "Open" link when ready

---

## Screen 6 — Edit Microsite Before Send

Split view.

**Left (40%):** scrollable form
- Sections collapsed by default: Hero, Sections, CTAs, Theme
- Each editable: text field for headline, textarea for subhead, image swap for hero, button label/URL for CTAs

**Right (60%):** live iframe preview of the microsite, updates as you edit.

Top-right buttons: "Discard" (ghost), "Save draft" (ghost), "Save & mark sent" (gold).

---

## Screen 7 — Microsite Detail

Most complex screen. Top section: recipient header card.

**Header card:**
- Avatar + recipient name (large)
- Company, role, email, sent channel as muted metadata row
- Right side: status pill (large), "Sent N days ago", trackable URL with copy
- Action buttons: "Open microsite", "Resend", "Mark as booked", "Archive"

**Stat strip below header (5 mini-stats in a row):**
Total opens · Time on site · Sections viewed · Shares · Downstream views

**Tabbed body** (5 tabs):

### Tab A — Timeline
Vertical event stream, newest first. Group by day with date header. Each event row:
- Icon (open / scroll / chat / pdf / share / book / feedback)
- One-line description ("Opened from iPhone in Chicago, IL")
- Timestamp + duration if applicable
- Expandable for detail (e.g. chat messages, scroll depth %)

### Tab B — Engagement
- Section heatmap: render a thumbnail of the microsite on the left, with horizontal bands beside each section showing time-on-section as a bar
- Below: scroll depth chart (% reached over time)
- Below: CTA click breakdown (table of CTA → clicks → click-through rate)

### Tab C — Share Tree
- Force-directed graph or horizontal tree
- Root node = recipient
- Branches = each share, colored by channel
- Each node shows: name (or "Anonymous"), city, time of view, "+N" if they re-shared
- Side panel on node click: that visitor's mini-timeline
- Above graph: stats — Max depth · Total downstream views · K-factor · Top sharer

### Tab D — Chat Transcript
- Conversation log between recipient and BookChat
- Recipient bubbles right (gold), AI bubbles left (gray)
- Timestamps muted
- Empty state: "No chat activity yet"

### Tab E — Feedback
- List of feedback submissions, newest first
- NPS-style score badge if present
- Free-text quote, submitter context
- Empty state: "No feedback yet"

---

## Screen 8 — Share Trees (cross-microsite view)

Grid of microsites ranked by virality.

Each card:
- Microsite name + recipient
- Mini tree visualization (small, ~120×80px)
- Stats: shares · downstream views · max depth · K-factor
- Click → Screen 7 Share Tree tab

Top of page: filter bar (date range, vertical, min depth).

Below grid: leaderboard "Top sharers across all microsites" — table of (sharer name, # microsites shared, total downstream views).

---

## Screen 9 — Top Performers

Three side-by-side ranked lists, each a card.

**Card 1 — By engagement:** sorted by time-on-site × opens. Top 10.
**Card 2 — By virality:** sorted by downstream views. Top 10.
**Card 3 — By conversion:** sorted by booked / opened ratio. Top 10.

Each list item: rank (#1, #2…), microsite name, recipient, primary metric.

Filter bar at top: date range.

---

## Screen 10 — Compare

Multi-select on Screen 4 → "Compare" button → this screen.

Side-by-side columns (up to 4 microsites). Each column shows:
- Recipient header
- All key stats (vertical list, aligned across columns for easy scanning)
- Funnel mini-bar
- Tiny share tree

Difference highlights: cells where one column is the leader get a faint gold left-border.

---

## Screen 11 — Activity (full firehose)

Full-page version of the live activity feed from Screen 3.
- Sticky filter bar: event type multi-select, microsite filter, date range
- Long scrolling list, virtualized
- Each row clickable → microsite detail with timeline scrolled to that event

---

## Empty / Loading / Error states (apply across screens)

- **Empty:** centered illustration (line-art), one-line headline, one-line subcopy, single CTA
- **Loading:** skeleton matching final layout, no spinners on full pages
- **Error:** muted red banner with "Retry" button; never a blank page

---

## Component primitives to define in pencil

Define these once as reusable components:
- `KpiCard` (number + label + sparkline + delta)
- `StatusPill` (variants: draft, ready, sent, opened, engaged, booked)
- `EventRow` (icon + text + timestamp)
- `RecipientChip` (avatar + name + company)
- `MiniSparkline`
- `MiniShareTree`
- `Funnel` (horizontal bar funnel, configurable stages)
- `DateRangePicker`
- `FilterBar`
- `DataTable` (sticky header, sortable, row-clickable)
