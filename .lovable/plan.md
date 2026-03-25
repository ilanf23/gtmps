

# Mobile Responsive Issues Found

After reviewing all components, here are the issues and fixes:

## Issues

### 1. Hero stat strip overflows on mobile
The stat strip (`flex gap-8`) with three stats uses `flex-shrink-0` on each item, causing horizontal overflow on small screens. The 36px numbers and gap-8 spacing don't fit on 375px screens.

**Fix**: Change to `flex flex-wrap gap-6` or `grid grid-cols-3 gap-4`, remove `flex-shrink-0`, and reduce font size on mobile.

### 2. Book display in BookSection clips on small screens
The book display container is `maxWidth: 520, height: 300` with absolutely positioned images using `left: "10%"` and `right: "10%"`. On narrow screens (~375px), the 180px wide book images overlap or clip since 180px is nearly 50% of the viewport.

**Fix**: Scale down book images and container on mobile using responsive classes or a smaller maxWidth.

### 3. ResultsSection 2-column grid too tight on mobile
`grid-cols-2` on mobile with `p-8` padding and 48px font numbers creates cramped cards on small screens.

**Fix**: Change to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` and reduce padding on mobile.

### 4. Timeline labels overlap on mobile
The publication timeline in BookSection uses absolute positioning at 0%, 33%, 66%, 100% with `translateX(-50%)`. On narrow screens, the four label stacks overlap each other.

**Fix**: Switch to a vertical or stacked layout on mobile, or hide on very small screens.

### 5. Email capture input/button in DeeperSection
The email row uses `flex gap-0 w-full md:w-auto`. On mobile, the rounded-l and rounded-r buttons stack awkwardly if the container is too narrow.

**Fix**: Stack input and button vertically on mobile with full rounded corners on each.

### 6. Footer text-right div doesn't align well on mobile
The footer uses `flex-col` on mobile but the third div still has `text-right`, which looks odd when stacked.

**Fix**: Remove `text-right` on mobile using responsive classes.

## Files to modify
- `src/components/HeroSection.tsx` (stat strip)
- `src/components/BookSection.tsx` (book display, timeline)
- `src/components/ResultsSection.tsx` (grid)
- `src/components/DeeperSection.tsx` (email capture)
- `src/components/Footer.tsx` (alignment)

