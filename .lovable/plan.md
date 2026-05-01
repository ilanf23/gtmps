## What changes

In the microsite, the three-column **Observed / Hypothesis / Question** block (used in Section 3 Core, Section 4 Proof, and Section 10 Deeper Findings) sometimes renders one column much longer than the others, creating the lopsided layout in the screenshot. We will clamp any column whose body text would exceed **10 lines** and add a per-column **Show more / Show less** toggle.

## File modified

Only one file: `src/components/magnet/v10/ObservedHypothesisQuestion.tsx`. No other component, routing, edge function, Supabase schema, or design token is touched.

## Behavior

- Each column body text is rendered through a new internal `ClampableParagraph` helper.
- On mount (and on resize), the helper measures the natural rendered height against `lineHeight × 10`.
- If the text overflows the 10-line cap, the paragraph is clamped via `display: -webkit-box; -webkit-line-clamp: 10; overflow: hidden` and a "Show more" button appears underneath.
- Clicking "Show more" expands the paragraph to its full height; the button toggles to "Show less".
- If the text fits in 10 lines or fewer, no button is rendered (column behaves exactly as today).
- The toggle button is colored to match the column accent (gold for Observed/Hypothesis, magenta for Question) and uses the existing eyebrow-style typography (uppercase, 12/13px, 0.12em tracking) so it reads as part of the system, not a generic UI control.

## Why measure rather than just count characters

Line count depends on column width, which changes between mobile (single column, wide) and desktop (3 columns, narrow). A character-count heuristic would be wrong on one viewport. Measuring `scrollHeight` against `lineHeight × 10` keeps the threshold accurate at every breakpoint and re-runs through a `ResizeObserver`.

## Visual / accessibility details

- Button uses `aria-expanded` so screen readers announce state.
- 10-line cap is defined as a constant (`LINE_CLAMP = 10`) at the top of the file for easy tuning later.
- Italic styling on the Question column is preserved when expanded and collapsed.
- Feedback link beneath the grid is unchanged.

## Out of scope

- No copy changes.
- No spacing or grid-layout changes (columns still use the existing `grid-cols-1 md:grid-cols-2/3` and `p-5` padding).
- No changes to other long-text sections (Five Orbits cards, Why Research Matters, etc.). If you want the same treatment elsewhere, that would be a separate scoped pass.
