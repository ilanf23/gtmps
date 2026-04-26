## Footer restructure

### Files touched
1. `src/components/Footer.tsx` — used by `/` and `/discover`
2. `src/components/VerticalLanding/VerticalFooter.tsx` — used by `/awards` and all 8 vertical pages

No new files. No route or page-level changes. The `data-page-footer="true"` hook stays so the sticky CTA / SectionRail visibility logic keeps working.

---

### `src/components/Footer.tsx` (main: /, /discover)

Replace entire body with one unified block:

**Container**
- Background: `bg-soft-navy` (unchanged)
- Padding: `80px 24px 40px` desktop, `48px 24px 32px` mobile
- `max-w-[1100px] mx-auto`
- Keep `data-page-footer="true"` on the `<footer>`

**Row 1 — ACROSS MABBLY (4-column primary grid)**
- Eyebrow `ACROSS MABBLY`: DM Mono, 11px, `letter-spacing: 0.18em`, color `#B8933A`, margin-bottom 24px
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, gap 32px
- Four items, each = stacked `<a>` (or span for current page) + descriptor, 8px gap:
  1. **discover.mabbly.com** — Inter Tight, 18px, white, gold underline (`border-bottom: 1px solid rgba(184,147,58,0.6)`), no arrow, no link. Descriptor: `Research + the book.`
  2. **mabbly.com →** — `https://mabbly.com`, target `_blank`, rel `noopener noreferrer`. Descriptor: `Agency. GTM for professional services firms.`
  3. **mabbly.ai →** — `https://mabbly.ai`, target `_blank`, rel `noopener noreferrer`. Descriptor: `Product. Activate dormant relationships at scale.`
  4. **The Podcast →** — `https://www.youtube.com/@GTMforPS`, target `_blank`, rel `noopener noreferrer`. Descriptor: `500 practitioner interviews on YouTube.`
- Item URL style: Inter Tight, 18px, `rgba(245,239,224,0.92)`, font-weight 500
- Descriptor style: Inter Tight, 13px, `rgba(245,239,224,0.55)`, line-height 1.5, max-width 240px
- Hover (links only): URL → `#B8933A`; descriptor opacity → 0.4. Transition 180ms ease. Reuse the existing `.am-link` / `.am-desc` `<style>` block pattern, scoped via a unique class to avoid leaks.

**Row 2 — Hairline divider**
- 1px high, full width, background `rgba(184,147,58,0.2)`
- `margin: 56px 0 28px`

**Row 3 — Bottom strip**
- Flex row on `md+`, stacked + center-aligned on mobile
- Left (`max-width: 320px`):
  - Wordmark `mabbly`: 16px, white, font-weight 600, font-display
  - Tagline: 13px, `rgba(245,239,224,0.45)`, `GTM for the market you already own.`, margin-top 6px
- Right (`max-width: 480px`, right-aligned on `md+`):
  - `© 2026 Mabbly LLC` — 12px, `rgba(245,239,224,0.45)`
  - Inline beside or below: `Privacy Policy · Terms of Service`
    - Each link 12px, `rgba(184,147,58,0.7)`, hover `#F5EFE0`
    - Separator `·` color `rgba(245,239,224,0.25)`
    - Privacy: `https://mabbly.com/privacy`, Terms: `https://mabbly.com/terms`, both `_blank`

**Removed from current `Footer.tsx`**
- The standalone `#footer-podcast` band with the "Watch on YouTube" pill (Podcast now lives as Item 4 of Across Mabbly).
- The 3-column section (wordmark / Across Mabbly / copyright). Replaced by the new structure above.

---

### `src/components/VerticalLanding/VerticalFooter.tsx` (/awards + 8 vertical pages)

Keep its existing `<style>` scoping pattern (`.vf-*` classes). Restructure into:

**Row 0 (kept) — "FOR YOUR FIRM" cross-link row**
- Per the user choice: keep a compact horizontal row above Across Mabbly so vertical cross-nav survives.
- Eyebrow: `FOR YOUR FIRM` (DM Mono, 10px, gold, letter-spacing 0.32em)
- Links: all 8 entries from `NAV_VERTICAL_LINKS`, rendered as inline-flex wrap, 24px gap, `Inter Tight 13px rgba(245,239,224,0.7)`, hover `#B8933A`
- Padding-bottom 40px, then a hairline `rgba(245,239,224,0.08)` 1px rule
- Drop the current `1.2fr 1fr 1fr 0.8fr` 4-column grid (brand blurb + 2 vertical columns + Across Mabbly). Brand blurb merges into the bottom strip; YouTube button goes away (Podcast is in Across Mabbly now).

**Row 1 — ACROSS MABBLY** (identical structure to main Footer)
- Same eyebrow, 4-item grid, same 4 items + descriptors + arrows + hover behavior.
- Use `.vf-am-*` classes already in the file for current-page indicator + descriptor + hover; extend with `.vf-am-grid` for the 4-col layout (`1fr` mobile, `1fr 1fr` md, `repeat(4, 1fr)` lg) with 32px gap.
- Replace the current `.vf-am-list` (vertical) layout with the horizontal grid.

**Row 2 — Hairline divider**
- 1px, `rgba(184,147,58,0.2)`, margin 56px 0 28px.

**Row 3 — Bottom strip**
- Flex row on md+, stacked center on mobile.
- Left: `mabbly` wordmark (Inter Tight 16px, white, 600) + tagline `GTM for the market you already own.` (13px, 45% opacity). The current `.vf-blurb` long sentence about research is dropped (it duplicates Item 1's descriptor).
- Right: `© {currentYear} Mabbly LLC` + `Privacy Policy · Terms of Service`, same styling/links as main Footer.

**Removed from current `VerticalFooter.tsx`**
- The big brand blurb column ("The largest research on GTM in Professional Services…") — superseded by Across Mabbly Item 1 + bottom-strip tagline.
- The standalone "Watch the Podcast" YouTube pill button — Podcast is now Item 4.
- The "More Verticals" split column — collapsed into one "For Your Firm" row of all 8.
- The "Mabbly · Relationship Revenue OS / © year · All rights reserved" footer line — replaced by `© 2026 Mabbly LLC` + legal links.

---

### Responsive behavior
- **lg (≥1024px)**: 4-col Across Mabbly, bottom strip horizontal (left + right edges)
- **md (768–1023px)**: 2-col Across Mabbly, bottom strip horizontal
- **<768px**: 1-col Across Mabbly stacked, bottom strip stacked + center-aligned (both left and right blocks centered, descriptors max-width auto and centered)
- All touch targets stay ≥44px (link line-height + padding satisfies)
- `prefers-reduced-motion`: hover opacity transitions become instant (no extra work; CSS transitions are 180ms and degrade gracefully — explicitly add a `@media (prefers-reduced-motion: reduce)` block that zeros transition durations on `.am-link`, `.am-desc`, `.vf-am-link`, `.vf-am-desc`).

### Verification checklist (after implementation)
1. `/discover` and `/`: footer is one block; no separate Podcast band above; 4 items in Across Mabbly; thin bottom strip with brand + legal.
2. `/awards` and any vertical page (e.g. `/accounting`): cross-link "For Your Firm" row at top, then 4-col Across Mabbly, then bottom strip. No duplicate Podcast button. No long brand blurb column.
3. External links (mabbly.com, mabbly.ai, Podcast, Privacy, Terms) open in new tab; discover.mabbly.com is unlinked + gold-underlined.
4. Hover on URL turns gold, descriptor fades.
5. Mobile (375px): everything stacks single column; bottom strip centered; all interactive targets ≥44px.
6. Sticky CTA + SectionRail logic still toggle correctly because `data-page-footer="true"` is preserved on `<footer>`.