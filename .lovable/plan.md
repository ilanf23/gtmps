## Two strategic fixes to the post-CTA flow

### Audit result (Fix 1 — fabricated logos)

- Searched the entire codebase for `Griffith`, `Mabbly × Mabbly`, `Mabbly x Mabbly` → **zero matches**.
- The post-CTA flow (`/assess`, `/m/[slug]` wait, `/m/[slug]` result) **has no logo wall at all**. The only "logo" code in the flow is `client_logo_url` — that's the **visiting firm's own scraped logo**, not a third-party proof claim. It stays.
- The only third-party social-proof element in the flow is the single line `Trusted by 60+ managing partners at PS firms $5M to $100M.` on `MagnetAssess.tsx`. That's an **unverified stat claim**, no logos. Per "verified or absent," it gets removed.
- **No verified-firm logo files** (Madcraft, Calliope, SPR, AArete) exist in `/public`. Per the rule, no logo wall gets added.

→ **Net change for Fix 1: delete one line** ("Trusted by 60+ …"). Nothing else to remove.

---

### Fix 2 — Simplify entry + remove email gate

#### Stage 1: Form (`src/pages/MagnetAssess.tsx`)

Reduce to **one field: website URL**. Same single-page layout the file already uses, just stripped down.

Final structure (top to bottom):
- Sticky top bar — **removed** (no progress needed for one field)
- Eyebrow gold mono caps: `GET YOUR PERSONALIZED ANALYSIS`
- Headline (serif): `See exactly where your firm's revenue relationships are leaking.`
- Sub: `90 seconds. We analyze your website and build your custom RROS map. No call required to see it.`
- Founder video card (S6E1 placeholder) — **kept as is**
- Methodology line: `Analyzes positioning, messaging, CTAs, consistency.` — kept
- Single input: `Your firm's website URL` / placeholder `https://yourfirm.com`
- Submit pill: `Build My Map →`
- Trust microline below button: `Free. 90 seconds. Full map shown — no email required to see it.`

Form logic changes:
- Drop multi-step state (`step`, `name`, `email`), the social-proof toast, and the per-step zod schemas. Keep just `websiteSchema`.
- Insert into `magnet_submissions` with empty strings for the NOT-NULL columns the schema still requires (`first_name`, `role`, `linkedin_url`, `email`) — same pattern already used for `role` and `linkedin_url`.
- `enrich-magnet` already gracefully handles `(not provided)` for these fields (verified in the function).
- Navigate to `/m/${slug}` with state `{ websiteUrl }` only (no email/firstName).

#### Stage 2: Wait (`MagnetWaitTheater.tsx`)

**No changes.** Already cinematic, no logo wall, no fabricated proof.

#### Stage 3: Result (`src/components/magnet/MagnetBreakdown.tsx`) — full reveal, no gate

Strip the entire two-phase reveal:
- Delete the `unlocked` / `localStorage` state + `handleUnlock` + `confirmEmail` state + `unlockKey`.
- Delete the `<TeaserAndGate />` render branch and its component definition.
- Delete `BlurredOrbitPreview` and `LockIcon` helpers.
- Delete the `hidden={!unlocked}` wrapper around `#magnet-full-reveal` — content renders unconditionally.

Replace the existing CTA cluster (Section 8) with the new three-tier structure:
- **Primary — Book Call**: inline Calendly widget embedded directly on the page using the same loader pattern already used in `src/pages/MagnetBook.tsx` (`https://calendly.com/adam-mabbly/gtm` with the firm's brand colors). Loaded lazily on first paint of the section. Above it: an eyebrow + one-line headline ("Book a 20-min walkthrough" / "See how this map applies to {customerName} live with Adam.").
- **Secondary — "Email me this map"**: a small text button below the calendar that opens a lightweight modal (existing shadcn `Dialog`). Modal contains a single email input + send button. On submit, write a row to a new `magnet_map_emails` table (slug + email + sent_at) and show inline confirmation. Map stays fully visible in the background.
- **Tertiary — "Share with team"**: a simple `Copy share link` button that copies `${origin}/m/${slug}` and toasts confirmation. (No new token URL pattern needed — the slug URL already works as a shareable read-only link.)

The book-mention block at the bottom of Section 8 stays unchanged.

---

### Database

New table `magnet_map_emails` for the optional save:
```sql
CREATE TABLE public.magnet_map_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.magnet_map_emails ENABLE ROW LEVEL SECURITY;
-- Public insert (anyone visiting a map can ask for a copy); no select/update/delete from client.
CREATE POLICY "anyone_can_request_map_email"
  ON public.magnet_map_emails FOR INSERT
  TO anon, authenticated WITH CHECK (true);
```

Wiring: client calls `supabase.from('magnet_map_emails').insert({ slug, email })`. (No edge function — the actual email send is out of scope; the row is the capture record. Mention this in chat after the migration so you can wire a `send-map-email` function next if desired.)

---

### Files changed

- `src/pages/MagnetAssess.tsx` — strip to single-field form, drop sticky progress bar + social-proof line + multi-step state.
- `src/components/magnet/MagnetBreakdown.tsx` — delete teaser/gate/blur/lock; render full reveal unconditionally; replace Section 8 CTAs with Calendly inline widget + "Email me this map" modal + "Copy share link".
- `src/pages/MagnetSite.tsx` — drop `firstName` / `email` references in `NavState` (websiteUrl only).
- New migration creating `magnet_map_emails`.

### Out of scope (called out for follow-up)

- Actual email-sending edge function for the optional save (just captures the request row for now).
- Adding a `share_token` separate from the slug. The slug is already an unguessable identifier; team-share by slug URL is sufficient until an explicit access-control story is needed.
- Visual logo wall — blocked on logo files for Madcraft / Calliope / SPR / AArete. When you drop SVG/PNG files into `/public/clients/`, I can add a verified-only logo strip to the form page.