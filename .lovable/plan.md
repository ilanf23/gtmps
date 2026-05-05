# Fix step numbering across pages

## What's wrong today

### Homepage (`/discover`)

Actual render order vs. the number that appears in each section's eyebrow:

| # rendered in DOM | Component | Eyebrow text shown |
|---|---|---|
| 1 | `DiscoverHero` | (no number) |
| 2 | `IndustryGrid` | "The Verticals" (no number) |
| 3 | Inline "The Book" block in `Discover.tsx` | "The Book" (no number) |
| 4 | `AuthorityStrip` | "The Authors" (no number) |
| 5 | `DeadZone` | (no number) |
| 6 | `WhyNow` | "Why Now" (no number) |
| 7 | `BetaReader` | **"15 · Early Access · Open"** |
| 8 | `Results` | **"Section 12 · Proof"** |
| 9 | `TheDecision` | **"13 · ..."** |
| 10 | `Faq` | **"16 · Common Questions"** |
| 11 | `FinalCta` | **"17 · BEGIN"** |

So the user sees 15 → 12 → 13 → 16 → 17. That's why "13 is listed, but 14 and 15 are missing" (15 actually appears, but earlier than 13, and 14 is nowhere).

The `SectionRail` in `src/pages/Discover.tsx` (lines 157–169) is also wrong: it jumps 04 → 08, includes a "12 · Manuscript" entry even though `Manuscript` is not rendered on this page, and ends at 14 while the in-section eyebrows go up to 17.

### Awards (`/awards`)

Eyebrows present: `02 · The Eight Awards`, `03 · How It Works`, `04 · Calendar`. The hero (section 01) shows `Inaugural · 2026` instead of `01 · Hero` style, so the sequence visibly starts at 02.

### Verticals template (`/consulting`, `/law`, etc.) and Aletheia (`/aletheia`)

Already consistent (01–10 sections, 01–11 fields). No changes needed.

## Proposed renumbering

Eleven rendered sections on `/discover`. Renumber the eyebrows to 01–11 in DOM order, and rebuild the rail to match.

| New # | Component | Eyebrow change |
|---|---|---|
| 01 | `DiscoverHero` | add `01 · Hero` style chip (or leave as-is and skip in rail) |
| 02 | `IndustryGrid` | `02 · The Verticals` |
| 03 | Inline "The Book" block | `03 · The Book` |
| 04 | `AuthorityStrip` | `04 · The Authors` |
| 05 | `DeadZone` | `05 · The Dead Zone` |
| 06 | `WhyNow` | `06 · Why Now` |
| 07 | `BetaReader` | `07 · Early Access` (was 15) |
| 08 | `Results` | `08 · Proof` (was 12) |
| 09 | `TheDecision` | `09 · The Decision` (was 13) |
| 10 | `Faq` | `10 · Common Questions` (was 16) |
| 11 | `FinalCta` | `11 · Begin` (was 17) |

`SectionRail` in `Discover.tsx` becomes 01–11 with matching ids and labels. Drop the stale `manuscript` rail entry (no section renders).

For Awards: change `AwardsHero` eyebrow from `Inaugural · 2026` to `01 · Inaugural 2026` so the page sequence reads 01, 02, 03, 04. (Or shift the others down; using 01 on hero is the smaller change and matches the verticals/aletheia pattern.)

Also delete the unused `13 · THE AUTHORS` string in `src/components/discover/Authors.tsx` (file is not rendered anywhere on Discover, but the stale number is misleading if the file is later wired in). Leave the file otherwise intact.

## Files touched

- `src/pages/Discover.tsx` (rewrite `railItems`, optional eyebrow on inline Book block)
- `src/components/discover/DiscoverHero.tsx` (add `01 · Hero` to existing `kl-eyebrow`)
- `src/components/discover/IndustryGrid.tsx` (prepend `02 · ` to `ind-eyebrow`)
- `src/components/discover/AuthorityStrip.tsx` (prepend `04 · `)
- `src/components/discover/DeadZone.tsx` (add `05 · The Dead Zone` eyebrow)
- `src/components/discover/WhyNow.tsx` (prepend `06 · `)
- `src/components/discover/BetaReader.tsx` (15 → 07)
- `src/components/discover/Results.tsx` (Section 12 → 08)
- `src/components/discover/TheDecision.tsx` (13 → 09)
- `src/components/discover/Faq.tsx` (16 → 10)
- `src/components/discover/FinalCta.tsx` (17 → 11)
- `src/components/discover/EarlyAccessReminder.tsx` (default `sectionRef` "15 · Reminder" → drop or align, this is a sticky reminder, safest is just remove the visible number)
- `src/components/discover/Authors.tsx` (kill stale "13 · THE AUTHORS" — unused file)
- `src/components/awards/AwardsHero.tsx` (eyebrow → `01 · Inaugural 2026`)

No backend or routing changes. Pure copy/eyebrow edits.