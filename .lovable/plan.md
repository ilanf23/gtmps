

# 10x Impact + Mabbly.com Brand Alignment

## The Gap

The current page feels like an independent literary/publishing site. Mabbly.com is bold, cinematic, dark, with ultra-heavy typography and photography. The discover page uses parchment backgrounds, tiny monospace text, and serif headings that create zero visual connection to the parent brand.

## Key Brand Elements from mabbly.com

- **Nav**: Lowercase "mabbly" wordmark left, pill-shaped nav group center, rounded border CTA right
- **Typography**: Ultra-bold condensed sans-serif headlines (massive scale), monospace body
- **Colors**: Dark backgrounds (#0D1117 dominant), white text, olive/sage accents. Minimal light sections
- **CTAs**: Rounded pill buttons with white borders, not sharp rectangles
- **Layout**: Full-bleed sections, cinematic scale, generous whitespace
- **Credibility**: Client logos, award badges, testimonials
- **Energy**: Bold, confident, modern agency feel vs. current academic/literary tone

## Plan

### 1. Redesign StickyNav to match mabbly.com

- Lowercase "mabbly" wordmark (matching their font weight/style)
- Nav links inside a subtle rounded pill container (like mabbly.com's `Work | Capabilities | About Us`)
- CTA becomes rounded pill with white border: "LET'S TALK" style
- Add mobile hamburger menu (currently hidden on mobile with no alternative)

### 2. Hero Section overhaul

- Make headline dramatically larger and bolder using a condensed sans-serif weight to match mabbly.com's impact
- Shift from serif italic gold subhead to clean, confident white typography
- Make the book cover display larger and more prominent with a subtle float/glow animation
- Replace the stat strip with a cleaner, more impactful layout (larger numbers, less clutter)
- Add a subtle gradient or ambient light effect matching mabbly.com's cinematic feel
- Round the CTA buttons to match mabbly.com pill style

### 3. Eliminate parchment sections, go dark-dominant

- Convert MissionSection and AuthorsSection from `bg-parchment` to dark backgrounds (`#0D1117` or `#131820`) with white/grey text
- This creates visual continuity with mabbly.com which is almost entirely dark
- Keep one or two sections slightly lighter for rhythm but use dark olive/charcoal, not cream

### 4. Typography upgrade

- Add a bold/black weight font (e.g., `Inter Tight` or `Plus Jakarta Sans` in 800/900 weight) for section headlines to match mabbly.com's ultra-bold condensed style
- Keep `Cormorant Garamond` for pull quotes and italic accents only
- Increase headline sizes across all sections by ~30%

### 5. Add social proof bar

- Below hero or above footer: horizontal row of client/award logos (Workiva, Lactation Network, Tiger 21, etc.) matching mabbly.com's "IMPACTFUL OUTCOMES" section
- Add Telly Awards Silver, Clutch badge like mabbly.com shows

### 6. Author cards redesign

- Shift from white bordered cards to dark glass cards with subtle borders
- Make author photos larger (from 96px to 160px+)
- Add a cinematic overlay/gradient treatment

### 7. CTA/Apply section modernization

- Dark background instead of parchment
- Rounded input fields and button to match mabbly.com form aesthetics
- Fewer fields visible at once (consider a multi-step or accordion approach)
- Larger, more prominent submit button

### 8. Add micro-interactions and animations

- Smooth number counter animations for the stats (count up on scroll)
- Subtle parallax on the book cover display
- Hover effects on cards matching mabbly.com's polish (scale + shadow transitions)
- Staggered fade-in already exists but make it snappier

### 9. Results section upgrade

- Transform from a flat grid of numbers into a more visual layout with progress bars or radial charts
- Add client logos next to their respective results (matching mabbly.com's outcomes section)

### 10. Footer alignment

- Match mabbly.com footer structure and tone
- Add "READY TO ELEVATE YOUR BRAND?" style closing CTA section before footer

## Technical Details

**Files modified**: `StickyNav.tsx`, `HeroSection.tsx`, `MissionSection.tsx`, `EpisodeSection.tsx`, `BookSection.tsx`, `AuthorsSection.tsx`, `DeeperSection.tsx`, `ResultsSection.tsx`, `ApplySection.tsx`, `Footer.tsx`, `index.css`, `tailwind.config.ts`, `index.html` (for new font import)

**New font**: Add `Inter Tight` (or similar condensed bold sans) via Google Fonts for headlines

**New component**: `SocialProofBar.tsx` for client logos and awards

**Color system update**: Add dark surface variants (`--surface-dark: #131820`, `--surface-darker: #0D1117`) and reduce reliance on parchment/warm

**No hyphens rule**: Maintained throughout all new copy

