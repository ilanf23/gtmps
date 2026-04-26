# Plan: /about Page + GTM Literacy Fix + Footer About Link

Three coordinated additions to discover.mabbly.com.

---

## Part 1 — New `/about` Page

### Route
- Add `/about` route in `src/App.tsx`, importing `pages/About.tsx` (placed above the catch-all `*`).

### File: `src/pages/About.tsx`
A new page following the dark/cream alternating cinematic rhythm of `/discover`. Reuses the existing `TopNav` pattern (lifted from `Discover.tsx`) and the shared `Footer` component. **No** sticky CTA, **no** scroll progress rail. Uses the project's design tokens (`#1C1008` dark, cream vellum, gold `#B8933A`, Cormorant Garamond + Inter Tight + DM Mono).

To keep the nav consistent with the rest of the site without code duplication, extract the existing `TopNav` from `Discover.tsx` into a new shared component:

### File: `src/components/discover/DiscoverTopNav.tsx` (extracted)
Move the current `TopNav` component out of `Discover.tsx` into its own file. Then:
- `Discover.tsx` imports it.
- `About.tsx` imports the same component so the nav stays identical (logo wordmark "Discover · Mabbly", For Your Firm dropdown, Awards, Podcast, Add Your Firm CTA).

### Section A — HERO (dark `#1C1008`)
- Eyebrow (DM Mono, gold, 0.18em): `ABOUT MABBLY`
- Headline (Cormorant Garamond, `clamp(40px, 5.5vw, 72px)`, color `#F5EFE0`):
  > We are building the operating system for relationship revenue.
- Sub (Cormorant Garamond, 20px, `rgba(245,239,224,0.7)`, max 640px):
  > Mabbly began with one observation across hundreds of professional services firms: the next client almost always already knew them. The relationships existed. The trust was built. The system to activate them did not.
- Padded `padding: 144px 24px 96px` to clear the fixed nav.

### Section B — THE THREE ROOMS (cream `#FBF8F4` / vellum)
- Eyebrow: `HOW WE ARE BUILT`
- Headline (Cormorant, dark `#0D1117`): "Three rooms. One mission."
- Three cards in a responsive grid (1col mobile / 3col `md:`):
  1. **discover.mabbly.com** — `THE RESEARCH` — "The category authority hub. The book, the podcast, the diagnostic, the research cohort, the awards. Where we publish what we are learning."
  2. **mabbly.com →** (external, new tab) — `THE AGENCY` — "Hands-on GTM consulting and execution for professional services firms. Where we apply the framework end to end with named teams."
  3. **mabbly.ai →** (external, new tab) — `THE PRODUCT` — "The Lead Nurturing Agent. AI-powered relationship reactivation, signal detection, and human-reviewed outreach. Where the framework runs at scale."
- Card style: subtle 1px gold border at `rgba(184,147,58,0.25)`, padding 32px, gold eyebrow on top, room name in Inter Tight 18px semibold, body in Inter Tight 14px line-height 1.6.

### Section C — THE FOUNDERS (dark)
- Eyebrow: `WHO IS BUILDING THIS`
- Headline: "Built by practitioners, not researchers." (Cormorant)
- Two side-by-side blocks (`md:grid-cols-2`, gap 48px):
  - **Adam Fridman** — Co-Author + Founder, Mabbly
    - 140px circular photo from `@/assets/adam-fridman.png` with 3px gold ring.
    - Bullets (DM Mono, gold dots):
      - 500 practitioner interviews (Science of Story)
      - 180 podcast episodes on GTM for Professional Services
      - 2 yrs Inc. columnist
    - LinkedIn icon link → `https://linkedin.com/in/adamfridman` (lucide `Linkedin` icon, gold on hover).
  - **Richard Ashbaugh** — Co-Author + CEO, Mabbly
    - 140px circular photo from `@/assets/richard-ashbaugh.png`.
    - Bullets:
      - 26 years across 9 professional services firms
      - $125M AArete revenue as CMO
      - $1.2B A.T. Kearney scaled from $250M
    - LinkedIn icon link → `https://linkedin.com/in/richardfashbaugh`.

### Section D — THE ORIGIN (cream)
- Eyebrow: `WHY THIS BOOK EXISTS`
- Single column, max-width 720px, editorial prose.
- Pull quote (Cormorant italic, large `clamp(24px, 3vw, 36px)`, gold left border 2px), with proper typographic curly quotes (no em/en dashes per project rule):
  > "We kept making the same mistake. We would meet with a firm. They had 400 dormant contacts. We would ask 'have you called them?' The answer was always no. Not because they forgot. Because they had no system. No permission. No cadence."
- Attribution: `ADAM FRIDMAN · CO-AUTHOR` (DM Mono, gold)
- Closing paragraph below (Inter Tight, 16px, dark):
  > Mabbly exists to fix that. The book documents what we found. The agency applies it. The product runs it at scale.

### Section E — VALIDATION (dark)
- Eyebrow: `FOREWORD`
- Reuse the foreword content already shown in `AuthorityStrip.tsx` (Jonathan Copulsky block). To avoid duplication and keep this page lighter, render a self-contained version inline (since `AuthorityStrip` is a multi-column composite). Content:
  - Pull quote in Cormorant: a representative line from Copulsky's foreword (mirroring what already appears in `AuthorityStrip`; we will copy the exact quoted lines from that file verbatim during build to keep wording consistent).
  - Attribution: `JONATHAN COPULSKY` · "Former CMO, Deloitte · Senior Lecturer, Northwestern Kellogg".

### Section F — CONTACT + PRESS (cream)
- Eyebrow: `PRESS + INQUIRIES`
- Email line (Inter Tight 18px): `press@mabbly.com` (mailto link, hover gold).
- Location (Inter Tight 14px, muted): "Based in Chicago, Illinois."

### Section G — FINAL CTA (dark)
- Single line (Cormorant, `clamp(28px, 3.5vw, 44px)`): "Ready to add your firm to the research?"
- Single CTA button (matches existing `Add Your Firm` gold pill style used in nav/hero): `Add Your Firm →` linking to `/assess`.
- Centered, generous vertical padding 128px.

### Footer
- Render shared `<Footer />` (the same one used on `/discover`).

### Behavior
- Page mounts at top (the global `ScrollToTop` component already handles this — no extra logic).
- No sticky bottom CTA, no scroll progress rail.
- All external links use `target="_blank" rel="noopener noreferrer"`.
- Mobile-first: cards stack 1-col, founders stack, hero padding compresses on narrow viewports.
- Respects `prefers-reduced-motion` (no scroll-reveal staggers needed; static fades only).

---

## Part 2 — `/discover` Hero Eyebrow Update

### File: `src/components/discover/DiscoverHero.tsx`
**Line 554** — change the inner text only:
- From: `GTM Research for Professional Services Firms`
- To:   `The First Research on How PS Firms Grow`

(Display style stays uppercase via the existing `text-transform: uppercase` rule on `.dh-industry`, so the on-page rendering reads `THE FIRST RESEARCH ON HOW PS FIRMS GROW`.)

Nothing else on `/discover` changes. Body, sub copy, Section 04 "The Relationship Revenue OS", and Section 09 "The GTM Score" remain intact. Vertical pages are untouched (they have native vocabulary already per the brief).

---

## Part 3 — Footer "About" Link (Bottom Strip)

Add an internal `About` link into the bottom strip of both footer components. Style matches Privacy/Terms (12px, gold `rgba(184,147,58,0.7)`, hover `#F5EFE0`).

### File: `src/components/Footer.tsx`
In the bottom-strip legal row (currently `Privacy Policy · Terms of Service`), prepend an `About` link as the first item:
- `About` (uses `react-router-dom` `<Link to="/about">`, no new tab — internal route)
- ` · ` separator
- `Privacy Policy` (existing)
- ` · ` separator
- `Terms of Service` (existing)

Note: `Footer.tsx` currently uses bare `<a>` tags with no router import. We will import `Link` from `react-router-dom` for the new About entry so client-side navigation works without a full page reload. The order in the bottom strip per the brief: `© 2026 Mabbly LLC · About · Privacy Policy · Terms of Service` — the `©` line stays on its own row above the legal row (matching current layout); within the legal row the order becomes `About · Privacy · Terms`.

### File: `src/components/VerticalLanding/VerticalFooter.tsx`
Same change in `.vf-legal-row`: prepend `<Link to="/about" className="vf-legal">About</Link>` followed by the existing `·` separators and Privacy/Terms links. Import `Link` is already present in the file.

### Constraints respected
- About is **not** added to the top nav (no change to `navItems` in `Discover.tsx` or `VerticalNav.tsx`).
- About is **not** added to the Across Mabbly grid.
- Bottom-strip only.

---

## Files Touched

**New**
- `src/pages/About.tsx`
- `src/components/discover/DiscoverTopNav.tsx` (extracted from `Discover.tsx` for shared use)

**Edited**
- `src/App.tsx` — register `/about` route + import.
- `src/pages/Discover.tsx` — replace inline `TopNav` definition with import from new shared file (no behavior change).
- `src/components/discover/DiscoverHero.tsx` — line 554 eyebrow text swap.
- `src/components/Footer.tsx` — add About link in bottom strip + import `Link`.
- `src/components/VerticalLanding/VerticalFooter.tsx` — add About link in bottom strip.

## QA Checklist (post-build)
1. `/about` renders all 7 sections top-to-bottom, anchors at top of hero on load.
2. `/about` shows the same `Footer` (Across Mabbly grid + bottom strip) as `/discover`.
3. `/about` has no sticky bottom CTA, no scroll progress rail.
4. `/discover` hero eyebrow now reads `THE FIRST RESEARCH ON HOW PS FIRMS GROW`. Sub copy and all other sections unchanged.
5. Footer bottom strip on every page (`/discover`, `/awards`, all 8 verticals, `/about`) shows `About · Privacy Policy · Terms of Service`.
6. `About` link routes via React Router (no full reload) to `/about`.
7. `About` does **not** appear in top nav or Across Mabbly grid anywhere.
8. External links (mabbly.com, mabbly.ai, podcast, LinkedIn) open in new tab on `/about`.
9. Mobile (≤767px): three-rooms cards stack, founders stack, hero padding compresses, footer bottom strip stacks center-aligned.
10. No hyphens / em-dashes / en-dashes in any new copy (per project memory).
