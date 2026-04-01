

# Fix Choppy Live Signals Formula Layout

## Problem
The formula cards (Signal + Proof + Context = Result) use `flex-wrap` with fixed `w-56` cards and inline `+`/`=` operators. On most viewports this wraps awkwardly — the `+` signs sit between cards inconsistently, the Result card drops to a second row misaligned, and the whole section feels fragmented.

## Solution
Redesign as a clean 3-column grid for the input cards, with the `+` operators as visual connectors between columns, and the `= Result` card centered below — creating a clear visual hierarchy instead of a choppy inline wrap.

### Layout structure
```text
┌──────────┐     ┌──────────┐     ┌──────────┐
│  SIGNAL  │  +  │  PROOF   │  +  │ CONTEXT  │
└──────────┘     └──────────┘     └──────────┘
                      =
                ┌──────────┐
                │  RESULT  │
                └──────────┘
```

### Changes in `PepperSignals.tsx` (formula section, lines 23-65):

1. **3-column grid** for the three input cards: `grid grid-cols-3 gap-6` on desktop, stacking on mobile
2. **`+` operators** rendered as small centered elements between grid columns using pseudo-positioning or absolute overlays
3. **Result card** placed below the grid, centered, with an `=` above it
4. **Wider cards** — remove fixed `w-56`, let them fill grid columns naturally
5. **Mobile**: stack vertically with `+` between each card, `=` before result

This eliminates the flex-wrap choppiness and creates a deliberate, editorial composition.

