## /about Visual Enrichment — 5 Surgical Additions

All edits land in **`src/pages/About.tsx`** (single file). No new components, no asset uploads required — every asset already exists in the repo.

### Asset audit (verified)
- ✅ Audio file lives at `/public/s6e1-cold-open.mp3` (root, not `/audio/` subfolder — spec says `/public/audio/s6e1-cold-open.mp3` but the file is at root). I'll use the **actual path** `/s6e1-cold-open.mp3`.
- ✅ Book cover: `@/assets/book-cover-v2.png` (same image /discover ManuscriptAnchor uses)
- ✅ Adam's first book: `@/assets/science-of-story-cover.png` (already in /assets)
- ❌ Trophy: no image asset — the /awards hero is a CSS-built rotating ring sculpture. I'll recreate a **compact 200px version inline** so /about and /awards share the same visual language (true continuity).
- ❌ Adam + Richard candid photo: not in assets. Per spec, use **Option B fallback**: Science of Story cover thumbnail next to Adam, "AArete · A.T. Kearney" text marks next to Richard.

### Edits, in order

**1. Section 02 → after the Mission body, append the S6E1 audio block**
- Eyebrow `HEAR THE THESIS · 30 SECONDS` (DM Mono caps gold)
- Pull quote in Cormorant italic: *"Professional service firms deserve marketing as sophisticated as the work they sell."* (max-width 640, gold left border 4px)
- Native `<audio controls preload="metadata" src="/s6e1-cold-open.mp3">` wrapped in a dark cream-bordered card. Width: 100% up to 560px. Min height 56px (≥48px tap target). `aria-label="S6E1 cold open, 30 seconds"`.
- Caption below: `ADAM FRIDMAN · S6E1 OF GTM FOR PROFESSIONAL SERVICES` in DM Mono caps gold 11px.
- Container marginTop: 56px so it breathes from the body paragraph.

**2. Section 05 (Manuscript) → restructure to 50/50 split with book cover**
- Wrap content in a `display:grid; grid-template-columns: 240px 1fr; gap:64px; align-items:center;` (collapses to single column <768px with cover above text, centered, max-width 180px).
- Left column: `<img src={bookCover}>` at 240px desktop / 180px mobile, with:
  - `perspective: 1200px` on the wrapper
  - Book transform: `rotateY(-8deg)` default
  - Hover transition 600ms cubic-bezier(0.22, 1, 0.36, 1) to `rotateY(0deg)`
  - Box-shadow: `0 30px 60px -20px rgba(0,0,0,0.4), 0 0 80px -20px rgba(184,147,58,0.25)`
- Right column: existing eyebrow / h2 / body / outline CTA, unchanged copy.
- Import: `import bookCover from "@/assets/book-cover-v2.png";` at top of file.
- Reduced-motion: skip rotate, render flat.

**3. Three pull quote sections (new) — inserted between existing sections**

Add a small reusable inline component **inside `About.tsx`** (not a new file):
```tsx
const PullQuoteBlock = ({ tone, quote, attribution, id }: {...}) => { ... }
```
Renders: section with 96px vertical padding, alternating bg, max-width 720px centered figure with:
- Cormorant Garamond italic 24-36px (`clamp(24px, 3vw, 36px)`), line-height 1.55
- Gold left border 4px solid `#B8933A`, paddingLeft 24px
- Attribution below: 13px DM Mono caps gold opacity 0.7

**Pull quote A** (id `pq-a`, **dark** bg #1C1008) — between Section 03 (definition, dark) and Section 04 (rooms, cream). Since Section 03 is already dark, place pull quote A on **cream** instead so the rhythm stays alternating: dark→cream(quote)→cream(rooms) is bad. **Better**: place it on **dark** but with darker shade `#0A0807` for a quiet alcove feel between the two sections. *(Final call: cream bg #FBF8F4 — see "rhythm note" below.)*

**Pull quote B** (id `pq-b`, **dark** bg #1C1008) — between Section 06 (awards, cream) and Section 07 (agency, dark). Cream→dark(quote)→dark(agency): also breaks rhythm. Put quote B on **cream** so we get cream(awards)→cream-quote→dark(agency).

**Pull quote C** (id `pq-c`, **dark** bg #0A0807) — between Section 10 (vision, cream) and Section 11 (founders, dark #0A0807). cream→dark-quote→dark-founders: place quote on cream → cream(vision)→cream-quote→dark(founders). Clean.

**Rhythm note**: To preserve the established alternating rhythm and not put two same-tone sections back-to-back, all three pull quotes will use **cream backgrounds** (`#FBF8F4`). Each becomes a quiet editorial breath; the gold left border + italic serif is what distinguishes them from body sections, not background tone.

Quotes (verbatim from spec):
- A: *"The right person at the wrong moment is just another name in your CRM. The right person at the right moment is revenue."* — `Chapter 4 · Truth II`
- B: *"The Dead Zone is not a CRM problem. It is an avoidance problem. The contacts are there. The trust is there. The only thing missing is the willingness to pick up the phone."* — `Richard Ashbaugh · Chapter 7`
- C: *"Your next client already knows you. The relationships exist. The trust is built. The system to activate them did not."* — `Introduction`

**4. Section 06 (Awards) → restructure to text + trophy sculpture**
- Same 50/50 grid pattern: text column left, **inline CSS-sculpture column right**, gap 56px, collapses to single column <768px (sculpture above text on mobile).
- Sculpture is a wrapped `<Link to="/awards">` so the whole thumbnail clicks through.
- Recreate /awards hero sculpture compactly:
  - 200px desktop, 140px mobile circular wrapper
  - 3 concentric rings (1px gold borders at varying opacity 0.9 / 0.55 / 0.3) with the existing `ahSpin` rotation (60s/80s/100s), reversed for r2
  - Center radial-gradient dot, 2 satellite dots
  - `filter: drop-shadow(0 30px 60px rgba(184,147,58,0.3))`
  - Hover: `transform: scale(1.05)` over 400ms ease, no extra effects
- Reduced motion: rings static, no scale on hover (already covered by existing prefers-reduced-motion in shared style block).
- Inject the keyframes/CSS via a single `<style>` tag scoped under `.about-trophy-mini` so it doesn't collide with anything else.

**5. Section 11 (Founders) → add fallback humanizing marks (Option B)**

Inside the founders `.map(p => …)` render, after the bullets `<ul>`, conditionally render a small "marks" row keyed off the founder's name:

- **Adam**: small thumbnail of Science of Story book cover (60×90px, subtle shadow + 1px gold border at 0.25 opacity) with caption "Science of Story · 2014" in DM Mono caps gold opacity 0.6.
- **Richard**: two text marks on a single horizontal row, separated by a thin gold dot:
  - `AARETE · CMO` and `A.T. KEARNEY · GTM` in DM Mono caps 11px gold opacity 0.7
  - Each in a 1px gold-bordered chip, padding `6px 12px`, borderRadius 2px

This adds founder texture without requiring an unavailable photo. Easy upgrade later: replace this block with the candid photo when Adam provides it.

Import: `import scienceOfStory from "@/assets/science-of-story-cover.png";` at top.

### Animation pattern (visuals 1–5)

Reuse existing `useRevealRef` hook from `src/hooks/useRevealRef.ts` (already in repo). Each new visual element gets:
```tsx
const { ref, isVisible } = useRevealRef(200);
<div ref={ref} style={revealStyle(isVisible, 600)}>...</div>
```
- 200ms delay, 600ms duration, fade-up 20px → 0
- `useReducedMotion()` hook (already in repo) — when true, skip the transform, render at full opacity immediately

### Rail update

`railItems` array stays the same — pull quotes are quiet "alcoves" not destinations, so they don't get nav anchors. The 12 rail items continue to map to the 12 primary content sections.

### Out of scope / explicit non-changes
- No changes to TopNav, Footer, hero, three rooms grid, agency, product, verticals grid, vision, press, origin, foreword, or final CTA copy.
- No SectionRail changes.
- No new files. All visual additions inline in `About.tsx`.
- No changes to `/discover`, `/awards`, or any other route.
- No package additions.

### Files modified
- `src/pages/About.tsx` (only file touched)

### Verification checklist (after ship)
1. `/about` audio player renders inline below Mission section, plays `/s6e1-cold-open.mp3` on click, controls ≥48px tall on mobile (375px viewport).
2. Manuscript section shows book cover left of text on desktop ≥768px, above text on <768px. Cover sits at -8deg rotateY at rest, settles to 0deg on hover over 600ms.
3. Three pull quotes appear between sections 03↔04, 06↔07, and 10↔11. Each visually distinct (italic serif, gold left rule, attribution below).
4. Awards section shows compact rotating-ring trophy sculpture right of text on desktop, above on mobile. Whole sculpture is a clickable link to `/awards`. Hover scales 1.05.
5. Founders section: Adam shows Science of Story thumbnail + caption beneath bullets. Richard shows AArete + A.T. Kearney chip marks beneath bullets.
6. Page reads as editorial — visual rhythm now broken every 1–2 sections by either an image, audio, or pull quote. No more long uninterrupted text walls.
7. Reduced motion preference disables the book rotate, the sculpture spin, and the entry fade-ups.
8. 375px mobile: every visual stacks cleanly, no horizontal overflow, no clipped text.