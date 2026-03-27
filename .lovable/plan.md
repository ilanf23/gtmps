

## Rebuild Hero Section: Desktop-Only, Pixel-Perfect Spec

Complete rewrite of `src/components/HeroSection.tsx` to match the detailed spec. Two additional changes needed for fonts and the definition callout removal.

### Files to change

**1. `index.html` — Add Google Fonts**
- Add `Barlow+Condensed:wght@800` and `Libre+Baskerville:ital,wght@0,400;0,700;1,400` to the existing Google Fonts link

**2. `src/components/HeroSection.tsx` — Full rewrite**

The component will be rebuilt from scratch with these major structural changes:

- **Background**: `#0e0d0b` with SVG noise texture overlay at 3% opacity (reuse existing pattern)
- **Layout**: Single two-column CSS grid, equal `1fr 1fr` columns, 120px horizontal padding, 80px vertical padding, 80px gap, vertically centered, min-height 100vh
- **No mobile breakpoints** — everything targets 1280px+ only
- **Remove the definition callout block** at the bottom (it moves into the right page pullquote per spec)
- **Keep the `useCountUp` hook** and intersection observer for animated stats

**Left column contents (top-aligned, flex column, gap 32px):**
- Gold kicker: 28px gold line + "BOOK RESEARCH · LIMITED TO 50 SESSIONS" in Libre Baskerville 10px
- Headline: "The First GTM Book for Professional Services." in Barlow Condensed 800 weight, 76px, gold period
- Sessions badge: gold dot + "46 OF 50 SESSIONS REMAINING" in 10px #6b6560
- Two pill CTA buttons (primary gold #b8972e, secondary transparent with white border)
- Three stats with Playfair Display 52px numbers in #b8972e, separated by 1px #2a2720 vertical lines

**Right column — book mockup (complete rebuild, no cover image):**
- Two side-by-side page divs, each 280×392px, with 2px spine shadow between them
- Entire pair wrapped in a 3D transform: `perspective(1200px) rotateY(-6deg) rotateX(3deg)`
- Drop shadow: `0 40px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)`
- **Left page (cover)**: Built entirely in CSS/HTML — periodic table tile (100×100px, gold bg, "50"/"Gt"/"growth"), concentric SVG circles, title text, subtitle, author names, horizontal rule
- **Right page (interior)**: Chapter One header with gold line, "The founding problem" subtitle, "The Wrong Map" title, two body paragraphs, pullquote block with borders, page number "12"
- Keep the page-turn hover effect on the right page
- Edition label below: "Q4 2026 · MABBLY PRESS · FIRST EDITION"

**Key differences from current implementation:**
- No `bookCover` image import — the cover is rendered purely in HTML/CSS
- No responsive/mobile code — everything is fixed desktop sizing
- Spec-exact colors (#b8972e instead of #B8933A, #0e0d0b instead of #0D1117, #f5f0e2 pages)
- Spec-exact typography (Barlow Condensed for headline, Libre Baskerville for kicker/cover, Playfair Display for stats/titles, EB Garamond for body)
- Stats use Playfair Display at 52px instead of Inter Tight
- Definition callout block removed from bottom of section (content integrated into right page pullquote)

### Scope
- `index.html` — font link addition
- `src/components/HeroSection.tsx` — full rewrite

