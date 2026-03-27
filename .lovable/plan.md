

## Fix: Make the Interior Page Visible

The interior page exists in the code but is invisible because:
1. It's positioned at `left: 0` with only `translateX(16px)` — the cover completely overlaps it
2. `translateZ(-16px)` pushes it behind the cover, but at the current shallow rotation angle (~18deg), only ~5px of horizontal offset is created — not enough to see past the 290px-wide cover

### Fix in `src/components/HeroSection.tsx`

**Change the interior page positioning** (around line 552):
- Move it further right: `translateX(40px)` instead of `16px` so more of the right edge is visible past the cover
- Alternatively, set `left: 20px` in addition to the translateX so the page clearly extends beyond the cover's right edge
- Give it a slightly larger z-offset: `translateZ(-20px)` for better depth separation
- Add a `zIndex: -1` to ensure proper layering if preserve-3d isn't handling it

**Also check the parent container** has `position: relative` and `transformStyle: preserve-3d` so the Z-axis translations actually work. If the parent doesn't preserve 3D, the `translateZ` does nothing and both elements render flat on top of each other.

### Expected result
The chapter page will visibly fan out from behind the right edge of the cover, showing enough content to read "Chapter One" and "The Wrong Map" headers.

