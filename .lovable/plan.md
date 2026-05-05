# MAP page typography + button consistency patch

A targeted, scoped patch to fix the three issues you flagged on the MAP page (`/m/:slug`). Not a full design-system overhaul — that's a separate sprint task.

## Issues to fix

1. **"Email Forward" and "Email Me This Map" buttons render at different visible sizes.** They use the same `.mss-cta-pill` class but the labels read differently because of capitalization + character count. The actual button height/padding is identical; the visual mismatch is from inconsistent label casing and a slight icon-size difference.
2. **"Did we get this right? / Send us your feedback." chip + link are too small** to be a comfortable click target on desktop (currently 10px mono in a 18px-radius pill, link is 13px italic serif).
3. **No documented type/button scale** — flagged as a follow-up, not fixed here.

## Changes

### 1. Normalize the two MAP CTAs
File: `src/components/magnet/v10/ManuscriptShareSave.tsx`

- Rename "Email Forward" → "Email This Map" (matches the sibling "Email Me This Map" pattern, both become 3-word imperatives at the same case).
- Use Title Case on both labels (the CSS already applies `text-transform: uppercase`, so the rendered output is consistent regardless, but the JSX strings should match).
- Standardize both arrow icons to `width="11" height="11"` (currently the Share card icon is 11px, which is correct; just verifying parity).

Visual outcome: both pill buttons read at the same width-feel and identical height (already 12px/22px padding, 11px font, 25px radius).

### 2. Bump the feedback chip + link to a comfortable click target
Files: `src/components/magnet/v10/ResearchCard.css`, `src/components/magnet/v10/DeeperFindings.css`

In both files, update the `.{rc|df}-feedback-chip` and `.{rc|df}-feedback-link` / `.{rc|df}-feedback-question` rules:

- Chip: `padding: 8px 16px` → `10px 20px`; `font-size: 10px` → `12px` (rc) / `9.5px` → `11.5px` (df). Border-radius bumped to `22px` so the taller chip still looks like a pill.
- Pulse dot: `6px` → `7px`.
- Question text: `font-size: 13px` → `15px` (rc) / `12.5px` → `14px` (df). Keeps the italic serif register.
- Feedback link: inherits the new question size, so the click target grows in step.

This brings the chip to ~36px tall (WCAG 2.5.5 recommends 24px minimum, Apple/Material recommend 44px; 36px is the right register for this editorial layout without breaking the visual hierarchy).

### 3. Defer the broader type-scale work

Out of scope for this patch:

- Cross-site type scale audit
- Button height/size variants (sm/md/lg) standardization
- A documented `docs/07-design-system.md` button section

I'll log this as a follow-up task rather than ship a half-finished system inside this patch.

## Files touched

- `src/components/magnet/v10/ManuscriptShareSave.tsx` — 2 label changes
- `src/components/magnet/v10/ResearchCard.css` — chip + link sizing
- `src/components/magnet/v10/DeeperFindings.css` — chip + link sizing

No new components, no new tokens, no schema changes.
