

# SPR MAP Page Improvements

A comprehensive update to the `/spr` page covering content accuracy, framework alignment, and visual polish. Organized by priority.

## Phase 1 — P0: Critical Bugs

### B1. Fix dark void / excessive spacing
Inspect `SPRGroup.tsx` and each tab component for the reported massive dark gaps between sections. The `space-y-20` on each tab component creates ~80px gaps — likely the issue combined with any dark-background sections bleeding. Reduce to `space-y-12` or `space-y-16` where appropriate.

### B2. Tab scroll-to-top
Already implemented in `SPRGroup.tsx` (`window.scrollTo({ top: 0, behavior: "smooth" })`). Verify it works — may need `top: 0` with `instant` instead of `smooth` to avoid landing in middle of content.

## Phase 2 — P1: Content Accuracy (6 changes)

### A1.1 — Fix dormancy stat
`SPROverview.tsx` line 101: Already shows `2 yrs`. ✅ No change needed.

### A1.4 — Soften headline
`SPROverview.tsx` line 33-35: Change "Zero Systems Activating It" → "No System Compounding It"

### A3.1 — Fix Spectrum scale (0-4, not 0-5)
- `SPROrbits.tsx` line 4: Change "1.5–2.0 out of 5" → "1.5–2.0 out of 4"
- `SPRSpectrumBar.tsx`: Update scale labels to 0-4 (remove "5 — Compounding"), update marker position from 35% to ~43% (1.75/4)

### A3.2 — Restore Orbit 04: Warm Adjacency
`SPROrbitMap.tsx`: Rename "Anderson" ring to "Warm Adjacency" with sub-detail "Anderson's 10 firms feed this ring". Keep 5 rings with correct locked names: Core Proof, Active, Dead Zone, Warm Adjacency, New Gravity.

### A3.3 — Add ⊙ symbols to orbit labels
`SPROrbitMap.tsx`: Prepend `⊙ 01`, `⊙ 02`, etc. to each orbit label in the RINGS array and SVG text.

### A4.2 — Fix "Kristin" → "Kristen"
`SPRSignals.tsx` line 180: Change "Kristin" to "Kristen"
`SPRPilotLookback.tsx` line 74, 112: Change "Kristin Rosa" to "Kristen Rosa" and all references
`SPRRoadmap.tsx` line 67: "Scale Kristin's" → "Scale Kristen's"
`SPRPathForward.tsx` lines 68, 103, 112: All "Kristin" → "Kristen"

### A3.4 — Fix activation percentage
`SPROrbits.tsx`: Update the activation bar to show both: "150 of 59,000 total CRM (0.25%)" and "150 of ~10,000 dormant (1.5%)"

### A3.5 — Flag revenue calculator assumptions
`SPRDeadZoneCalc.tsx`: Add note below "Avg Engagement Value" label: "Estimated — validate with Tom's team"

## Phase 3 — P2: Framework Alignment (5 additions)

### A1.2 — Add The Three Laws
`SPROverview.tsx`: Add a styled navy card with gold accents after the hero section displaying the three laws (Proof before pitch, Relationships before revenue, Signal before message).

### A1.3 — Add The Five Truths
`SPROverview.tsx`: Add a section between Discovery Insights and Company Profile with Roman numeral list, deep navy left border, gold numerals.

### A1.5 — Add locked book definition
`SPROverview.tsx`: Add callout: "GTM for professional services is a system for activating the market you already own."

### A2.1 — Add Core Diagnostic + A2.2 ICP Lock + A2.3 Beachhead
`SPRIdentity.tsx`: Add three new sections — The Core diagnostic (Purpose + Niche not yet locked), ICP Lock (IT in mid-to-enterprise), Beachhead Segment (TBD).

### A6.2 — Add MAP Completion Grid
`SPRContentEngine.tsx`: Add 4×3 grid of 12 MAP fields with completion badges (COMPLETE/PARTIAL/INCOMPLETE).

## Phase 4 — P3: Visual Polish (5 improvements)

### A5.2 — Add "layers not phases" note
`SPRRoadmap.tsx`: Add small note under quarterly heading.

### B5 — Stats bar styling
`SPROverview.tsx`: Make stat numbers larger/bolder, improve visual hierarchy.

### B7 — Orbit map improvements
`SPROrbitMap.tsx`: Use book color scheme (gold center, navy rings), improve pulse animation on Dead Zone.

### B8 — Revenue calculator drama
`SPRDeadZoneCalc.tsx`: Make result number larger (48-64px serif), add count-up animation using PepperAnimatedCounter.

### B9 — Email mockup styling
`SPRSignals.tsx`: Add Gmail-like chrome to the email mockup (To/From/Subject header bar).

### B13 — RROS Progress tracker
`SPROverview.tsx`: Make the DISCOVER/PROVE/DESIGN/ACTIVATE/COMPOUND bar larger and more visually prominent.

## Phase 5 — P4: Nice to Have

### B3 — Sticky header condensing
Consider making only the tab bar sticky after scroll, or condensing the top bar.

### B10 — First Week timeline
`SPRSignals.tsx`: Restyle Day 1-5 as cards with prominent day numbers and team initials.

### B12 — LinkedIn post mockup
`SPRContentEngine.tsx`: Add LinkedIn UI chrome (avatar, like/comment/share).

### B14/B15 — Typography and color consistency audit
Verify all headings, subheadings, quotes use consistent fonts/colors across all 8 tabs.

### B16 — Mobile responsiveness audit
Verify tab bar scroll, orbit SVG scaling, calculator touch usability, table horizontal scroll.

## Files Modified

~10 files across all phases:
- `src/components/spr/SPROverview.tsx` — headline, Three Laws, Five Truths, locked definition, stats styling, RROS tracker
- `src/components/spr/SPRIdentity.tsx` — Core diagnostic, ICP Lock, Beachhead
- `src/components/spr/SPROrbits.tsx` — spectrum scale, activation %, orbit heading
- `src/components/spr/SPROrbitMap.tsx` — ring names, ⊙ symbols, colors
- `src/components/spr/SPRSpectrumBar.tsx` — scale 0-4
- `src/components/spr/SPRDeadZoneCalc.tsx` — assumption note, larger result, count-up
- `src/components/spr/SPRSignals.tsx` — Kristen spelling, email styling, timeline cards
- `src/components/spr/SPRRoadmap.tsx` — Kristen spelling, layers note
- `src/components/spr/SPRContentEngine.tsx` — MAP completion grid, LinkedIn chrome
- `src/components/spr/SPRPilotLookback.tsx` — Kristen spelling
- `src/components/spr/SPRPathForward.tsx` — Kristen spelling
- `src/pages/SPRGroup.tsx` — spacing/gap fixes

## Implementation Order

Due to scope, this will be built across multiple messages:
1. **P0 + P1**: Bug fixes + content accuracy (~10 edits)
2. **P2**: Framework additions (Three Laws, Five Truths, Core diagnostic, MAP grid)
3. **P3 + P4**: Visual polish and nice-to-haves

