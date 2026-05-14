## Goal

A new `/contact` page on the dark cinematic main-site theme, with a simple Name / Email / Message form. Submissions save into the existing `lead_signups` table with `source = "contact"` so they appear automatically in the existing `/ops` Leads tab.

## What gets built

**1. New page: `src/pages/Contact.tsx`**
- Uses `TopNav` + shared `Footer`, matching `About.tsx` structure.
- Hero: "Get in touch" headline + short intro sentence.
- Two-column layout on desktop, stacked on mobile:
  - Left: contact form (Name, Email, Message).
  - Right: a quiet info card pointing to the Calendly link (`https://calendly.com/richard-mabbly`) as a "prefer to book a call?" alternative. No new contact details added since none were specified.
- SEO: `<title>` "Contact — Mabbly", meta description, single H1, canonical tag.

**2. New form component: `src/components/contact/ContactForm.tsx`**
- `react-hook-form` + `zod` validation:
  - `name`: 1 to 120 chars
  - `email`: valid email, max 320 chars
  - `message`: 1 to 2000 chars
- Splits `name` into `first_name` / `last_name` on submit (first token vs the rest), so it maps cleanly to the existing `lead_signups` columns.
- Calls `captureLead()` from `src/lib/leadCapture.ts` with `source: "contact"`, putting the message into a new optional `message` field.
- Success state: form is replaced by a confirmation panel ("Thanks, we will be in touch.").
- Errors surfaced inline; submit button disabled while pending.

**3. Route registration: `src/App.tsx`**
- Add `<Route path="/contact" element={<Contact />} />` above the `*` catch-all.

**4. Nav link**
- Add a "Contact" link to `TopNav` and the shared `Footer` so the page is discoverable. (User picked "/contact (new page)" not "+ nav link", but a contact page that isn't reachable from anywhere is a footgun. If they want it removed from nav we'll pull it back out.)

## Database

Add a `message` text column to `lead_signups` (nullable, length-checked at the RLS level) so contact-form messages persist alongside the other lead metadata.

```text
ALTER TABLE lead_signups
  ADD COLUMN message text;
-- update the existing INSERT RLS check to also allow
-- (message IS NULL OR length(message) <= 2000)
```

`captureLead()` is extended to accept an optional `message` argument and pass it through.

## Ops view

The existing `LeadsTab` already lists everything in `lead_signups`. We will:
- Add `"contact"` to the source filter buttons.
- Show the `message` (truncated, with hover/expand) in the row detail or as a new column.
- The `ops-overview` "Leads" KPI already counts every row, so contact submissions show up automatically.

## What we are NOT doing

- No Slack notification for contact submissions (user only picked "Save to database + Ops Leads tab"). Easy to add later by calling `notify-lead-slack` from `captureLead()` when source === "contact".
- No phone, role, or firm fields (user picked the minimal set).
- No additional contact info on the page (no answer given for extras).

## Files touched

```text
NEW   src/pages/Contact.tsx
NEW   src/components/contact/ContactForm.tsx
EDIT  src/App.tsx                       (register /contact route)
EDIT  src/components/TopNav.tsx         (add Contact link)
EDIT  src/components/Footer.tsx         (add Contact link)
EDIT  src/lib/leadCapture.ts            (accept optional message)
EDIT  src/components/ops/tabs/LeadsTab.tsx  (show message + add 'contact' filter)
NEW   supabase/migrations/<ts>_lead_signups_message.sql
```
