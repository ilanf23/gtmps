# ANALYTICS PAGE

Business requirements for **EDITH OPS v2** — the redesigned internal analytics portal at `/ops`.

> Replaces the existing `/ops` dashboard. Single-tenant internal admin tool. No customer-facing surfaces.

---

## 1. Access
- **R1.1** Single admin login behind one shared password (keep current `ops-auth` edge function pattern + sessionStorage token).
- **R1.2** Rate limiting + lockout on failed attempts (already exists — keep).
- **R1.3** No user accounts, no roles, no email, no SSO.

## 2. Microsite Lifecycle
- **R2.1** **Pre-generation**: admin enters a target firm's URL inside Ops; system generates the Magnet microsite without the firm submitting it. Status = `draft`.
- **R2.2** **Status states**: `draft` → `ready` → `sent` → `opened` → `engaged` → `booked`. Auto-advance based on tracked events.
- **R2.3** **Bulk generation**: paste a list of URLs → queue → progress view.
- **R2.4** **Edit before send**: review/override AI-enriched copy, swap hero image, adjust CTAs before producing the shareable link.
- **R2.5** **Mark as sent**: admin records the recipient (name, company, email, channel sent through) and gets the trackable link to copy. No email sending from Ops.
- **R2.6** **Optional expiration** per microsite (e.g., link dies after 30 days).

## 3. Recipient Tracking
> "Affiliate" in this context = the person the microsite was sent to.

- **R3.1** Each `sent` microsite has one identified primary recipient (name, company, email, channel).
- **R3.2** Track per recipient session:
  - First open timestamp, every subsequent open
  - Total time on site, time per visit
  - Scroll depth per section
  - Which CTAs clicked
  - Chat opened / messages sent / transcript captured
  - PDF opened / pages read / time per page
  - Feedback submitted
  - Booking made
- **R3.3** Device, browser, geo (city-level), referrer for each session.
- **R3.4** Return-visit detection (same device fingerprint or cookie).
- **R3.5** Per-recipient timeline view: chronological event stream.

## 4. Viral / Share Tracking
- **R4.1** Every share action by the recipient generates a unique share token tied to (microsite, sharer).
- **R4.2** Track full referral tree: recipient → person B → person C, up to N hops.
- **R4.3** Per-microsite tree visualization: depth, breadth, who shared with whom.
- **R4.4** Per-microsite metrics: total shares, unique downstream viewers, K-factor (avg invites per recipient), max depth reached.
- **R4.5** Channel breakdown per share (LinkedIn, copy-link, email, X, etc.).
- **R4.6** Downstream visitor analytics: same engagement tracking (time, scroll, chat, etc.) as the primary recipient, but tagged as `downstream`.

## 5. Analytics Dashboard
- **R5.1** **Overview tab**: KPI cards (microsites generated, sent, opened, engaged, booked, total downstream views), 30-day timeseries, recent activity feed.
- **R5.2** **Microsites tab**: sortable/filterable table — recipient, status, sent date, opens, total time, shares, downstream views, booked. Click row → detail view.
- **R5.3** **Microsite detail view**: recipient profile, full event timeline, share tree visualization, section-level heatmap, chat transcript, feedback.
- **R5.4** **Funnel view per microsite**: sent → opened → engaged → shared → booked.
- **R5.5** **Cohort/compare view**: group by send-week or vertical, compare conversion rates; pick 2+ microsites side-by-side.
- **R5.6** **Top performers**: leaderboard of microsites by engagement, by virality, by conversion.
- **R5.7** Saved filters / views.
- **R5.8** CSV export on every list view.

## 6. In-App Alerts
- **R6.1** Real-time alert badges in the dashboard for: first open, booking made, share count crosses threshold, recipient returns 3rd+ time.
- **R6.2** No external notification channels — only visible inside Ops when admin logs in.

## 7. Data & Performance
- **R7.1** Append-only `events` table; aggregates via materialized views or scheduled job.
- **R7.2** Dashboards load <2s for the 30-day window at scale (10k microsites, 1M events).
- **R7.3** Raw events retained 24 months; aggregates indefinite.

## 8. Out of Scope
- Multi-user / role-based access
- Email sending from Ops
- Recipient-facing portal or login
- External webhooks / Slack / HubSpot / Stripe / Calendly integrations
- Payouts or commission logic of any kind
- Affiliate accounts or affiliate dashboards (recipients are tracked, not given accounts)

---

## Related docs
- `docs/edith-ops-v2-pencil-spec.md` — screen-by-screen design spec for pencil.dev
