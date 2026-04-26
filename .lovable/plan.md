## Goal
Expand `src/pages/About.tsx` from 7 sections into a ~12-section orientation map. Keep existing Hero, Three Rooms, Founders, Origin, and Final CTA. Insert 7 new sections with strong cross-links to deeper destinations. Add a `SectionRail` for scroll navigation since the page becomes long.

## Final section order (top to bottom)

| # | Section | id | Bg | Source |
|---|---|---|---|---|
| 01 | Hero — operating system for relationship revenue | `hero` | dark | existing |
| 02 | The Mission — why we exist | `mission` | cream | NEW |
| 03 | What is GTM for PS — definition | `definition` | dark | NEW |
| 04 | The Three Rooms | `rooms` | cream | existing |
| 05 | The Manuscript — book + Copulsky validation | `manuscript` | dark | NEW |
| 06 | The Awards — 8 vertical-named awards | `awards` | cream | NEW |
| 07 | The Agency — mabbly.com | `agency` | dark | NEW |
| 08 | The Product — mabbly.ai | `product` | cream | NEW |
| 09 | Built For These Verticals — 8 chip grid | `verticals` | dark | NEW |
| 10 | The Vision — category becomes inevitable | `vision` | cream | NEW |
| 11 | The Founders — Adam + Richard | `founders` | dark | existing |
| 12 | Press + Contact | `press` | cream | NEW (replaces existing press section, slightly retitled) |
| 13 | Origin / Confession — "We kept making the same mistake" | `origin` | dark | existing (moves below press per spec) |
| 14 | Foreword — Copulsky | `foreword` | cream | existing (kept, repositioned) |
| 15 | Final CTA — "Ready to add your firm to the research?" | `cta` | dark | existing |

Note: spec says "After Founders, BEFORE the existing Origin / Confession section, insert Press + Contact." That places Press between Founders and Origin. Existing Foreword + existing Press will be consolidated — Foreword stays as a standalone section directly before the Final CTA so Copulsky's voice still anchors validation; the existing Press block is replaced by the new Press + Contact spec wording.

If you would prefer Foreword removed entirely to hit exactly 12 sections, say so on approval; otherwise it stays as a 13th supporting section since it adds editorial weight without competing with new content.

## Files to modify

### 1. `src/pages/About.tsx` — primary edit
- Add `SectionRail` import from `@/components/discover/SectionRail`.
- Add `id` to every section wrapper to enable scroll-spy.
- Reorder existing sections per the table above.
- Insert 7 new sections using the existing `eyebrowStyle` token, alternating `#1C1008` (dark) and `#FBF8F4` (cream) backgrounds, 96–144px vertical padding.
- Add `<SectionRail items={...} />` rendered once near the top of `<main>`.

### 2. New section content specs

**SECTION 02 — THE MISSION (cream, `id="mission"`)**
- Eyebrow: `WHY WE EXIST`
- Headline (Cormorant Garamond, ~48px): "Professional services firms deserve marketing as sophisticated as the work they sell."
- Body (Inter Tight, 17px, max-w 720): "Most growth playbooks are built for software. They reward speed, scale, and outbound volume. They do not work for relationship-driven firms. Mabbly exists to build the system that does."

**SECTION 03 — WHAT IS GTM FOR PS (dark, `id="definition"`)**
- Eyebrow: `A DEFINITION`
- Headline: "What is GTM for Professional Services?"
- Two paragraphs (Cormorant Garamond italic 22px for first paragraph as pull-quote; Inter Tight 17px for second clarifier paragraph) — copy verbatim from spec.
- No CTA.

**SECTION 05 — THE MANUSCRIPT (dark, `id="manuscript"`)**
- Eyebrow: `THE BOOK`
- Headline: "GTM for Professional Services: The Relationship Revenue OS."
- Body: "30 chapters. Three frameworks. Built from 500 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). The manuscript is in research validation now. Public launch Q3 2026."
- Secondary CTA (gold outline, not pill): "Read the manuscript before publication →" → `<Link to="/discover#beta-reader">` (anchor exists at `BetaReader` component).

**SECTION 06 — THE AWARDS (cream, `id="awards"`)**
- Eyebrow: `THE RECOGNITION`
- Headline: "Awards built for the firms that win unfairly."
- Body: per spec.
- Secondary CTA (gold outline): "See the awards →" → `<Link to="/awards">`.

**SECTION 07 — THE AGENCY (dark, `id="agency"`)**
- Eyebrow: `WHEN YOU NEED HANDS-ON HELP`
- Headline: "mabbly.com"
- Body: per spec.
- Primary-style outline CTA "Visit mabbly.com →" with `target="_blank" rel="noopener noreferrer"`.

**SECTION 08 — THE PRODUCT (cream, `id="product"`)**
- Eyebrow: `WHEN YOU NEED SCALE`
- Headline: "mabbly.ai"
- Body: per spec.
- Outline CTA "Visit mabbly.ai →" with new-tab rels.

**SECTION 09 — BUILT FOR THESE VERTICALS (dark, `id="verticals"`)**
- Eyebrow: `WHO THIS IS FOR`
- Headline: "Eight verticals. One framework."
- Lead line: "Same Dead Zone. Same Five Orbits. Different vocabulary, different signals, different cadence per industry."
- 4×2 desktop / 2×4 tablet / 1-col mobile grid. Each chip:
  - Lucide icon from `INDUSTRY_ICONS` (40px, `#B8933A`, strokeWidth 1.6).
  - Vertical name from `NAV_VERTICAL_LINKS[i].label` (Inter Tight 16px, `#F5EFE0`).
  - Native vocabulary tagline (Inter Tight 13px, `rgba(184,147,58,0.6)`):
    - consulting → "Practice Growth"
    - law → "Origination Strategy"
    - accounting → "Client Development"
    - msp → "GTM"
    - advisory → "Prospecting Strategy"
    - ae → "Business Development"
    - recruiting → "Mandate Origination"
    - agency → "New Business"
  - Card: `background: rgba(245,239,224,0.04)`, `border: 1px solid rgba(184,147,58,0.2)`, `padding: 28px`, `borderRadius: 6`, hover lifts and brightens border to `0.55`.
  - Wrapped in `<Link to="/${slug}">`.
- Taglines defined in a local `VERTICAL_TAGLINES: Record<VerticalSlug, string>` map at the top of `About.tsx` (no edits to `verticals.ts`).

**SECTION 10 — THE VISION (cream, `id="vision"`)**
- Eyebrow: `WHERE THIS GOES`
- Headline: "GTM for Professional Services becomes a category."
- Two paragraphs per spec (Cormorant Garamond italic 22px first, Inter Tight 17px second).
- No CTA.

**SECTION 12 — PRESS + CONTACT (cream, `id="press"`)**
- Eyebrow: `INQUIRIES`
- Headline (Cormorant 36px): "For press, partnerships, and bookings."
- Body line: "press@mabbly.com · Based in Chicago, Illinois" — `press@mabbly.com` is a `mailto:` link.
- No CTA.

### 3. Reusable secondary CTA pattern
Local helper or inline style for outline gold CTA used by sections 05, 06, 07, 08:
```css
display: inline-flex; align-items: center; gap: 8px;
font: 600 13px 'Inter Tight'; letter-spacing: 0.04em;
color: #B8933A; padding: 12px 22px; border-radius: 999px;
border: 1px solid rgba(184,147,58,0.55); background: transparent;
transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
/* hover */ background: rgba(184,147,58,0.12); color: #D4AE48; border-color: #D4AE48;
```
Primary gold-pill CTA stays exclusive to "Add Your Firm" in nav and final CTA.

### 4. SectionRail integration
Render once inside `<main>` with these items (matches new section ids):
```ts
const railItems = [
  { id: "hero", label: "01 · Mission" },
  { id: "mission", label: "02 · Why" },
  { id: "definition", label: "03 · Definition" },
  { id: "rooms", label: "04 · Three Rooms" },
  { id: "manuscript", label: "05 · The Book" },
  { id: "awards", label: "06 · The Awards" },
  { id: "agency", label: "07 · The Agency" },
  { id: "product", label: "08 · The Product" },
  { id: "verticals", label: "09 · Verticals" },
  { id: "vision", label: "10 · The Vision" },
  { id: "founders", label: "11 · Founders" },
  { id: "press", label: "12 · Press" },
];
```
`SectionRail` already gates visibility on `#hero` and `[data-page-footer="true"]`; existing `Footer` component sets `data-page-footer="true"`, so no Footer edits are needed.

## Out of scope / explicitly not changing
- `src/components/Footer.tsx`, `verticals.ts`, `industryIcons.ts`, top nav layout — none change.
- No new routes; no Supabase work.
- No edits to `Discover.tsx` / `Awards.tsx`; cross-links use existing `/discover#beta-reader`, `/awards`, `/${slug}` paths.

## Test plan (post-ship)
1. `/about` renders Hero → Mission → Definition → Three Rooms → Manuscript → Awards → Agency → Product → Verticals → Vision → Founders → Press → Origin → Foreword → Final CTA in order.
2. "Visit mabbly.com →" and "Visit mabbly.ai →" open in new tabs with `rel="noopener noreferrer"`.
3. All 8 vertical chips route to `/consulting`, `/law`, `/accounting`, `/msp`, `/advisory`, `/ae`, `/recruiting`, `/agency`.
4. "See the awards →" routes to `/awards`.
5. "Read the manuscript before publication →" routes to `/discover#beta-reader` and scrolls to the Beta Reader form (anchor verified at `src/components/discover/BetaReader.tsx:38`).
6. `SectionRail` is hidden over hero, visible through body sections, hidden over footer (≥1024px).
7. At 375px width every section stacks cleanly; vertical grid drops to 1 column; type stays inside viewport.
8. `document.title` remains "About · Mabbly".