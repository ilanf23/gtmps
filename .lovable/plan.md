## Remove section labels from the homepage

Remove three visible section labels while keeping layout, spacing, and surrounding elements intact.

### Changes

1. **`src/components/discover/AuthorityStrip.tsx`**
   - Remove the eyebrow row containing `02 · Built By` (lines ~725-728): delete the `<div className="au-eyebrow-row">…</div>` block (the bar + `<p className="au-eyebrow">02 · Built By</p>`).
   - Remove the `03 / 03` position label on the Author card (line ~843): delete `<span className="au-card-pos">03 / 03</span>`.
   - Leave `01 / 03` (Foreword) and `02 / 03` (Practitioner) untouched, since the user only called out `03 / 03`.

2. **`src/components/discover/ReceiptsStrip.tsx`**
   - Remove `<p className="rcpt-num">03 · Receipts</p>` (line ~640) inside the `rcpt-head` header. Keep the `rcpt-rule` divider, `rcpt-h2` headline, and `rcpt-sub` subtitle.

### Not changing

- `src/pages/Discover.tsx` rail items (`02 · Built By`, `03 · Receipts`) are labels for the floating `SectionRail` navigation, not section headers in the page itself. Leaving these in place so the side rail keeps working. If you want those removed from the rail too, say the word and I'll strip them.

### QA

- Visually verify the Built By section, Author rolodex card, and Receipts header all render cleanly with no leftover empty spacing artifacts. If a removed eyebrow leaves an awkward gap, tighten the adjacent margin.
