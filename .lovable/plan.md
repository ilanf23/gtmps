

## Maximize Book Size on Desktop

The book is currently capped at `maxHeight: 560` and the wrapper doesn't stretch to fill the column. At 1415px viewport, there's significant unused space around the book.

### Changes in `src/components/HeroSection.tsx`

**1. Remove maxHeight cap on the book container (line 316)**
- Change `maxHeight: 560` to `maxHeight: 680` — this lets the book grow much taller while the aspect ratio keeps proportions correct
- At 1415px with a 2-column grid and ~80px padding, each column is roughly 600px wide. With aspect ratio 2.15:1, the book height would be ~280px at 600px width. The constraint is actually the width, not the height. So we need to ensure the wrapper fills horizontal space.

**2. Ensure the BookMockup wrapper fills the column**
- The wrapper at line 296 already has `w-full` — good
- The parent at line 239 has `hidden lg:flex items-center justify-center` — this centers but doesn't stretch. The book's `w-full` should fill it, but `justify-center` with `items-center` may constrain it. This is fine since `w-full` on the child fills the flex container.

**3. Increase grid gap and adjust alignment for visual balance**
- The grid container uses `gap-8 lg:gap-12`. The book should use the full column width. Currently `mx-auto` on the BookMockup wrapper may constrain it. Remove `mx-auto` so the book stretches to the full column width.
- Optionally increase the right column to give more space: change grid from equal `1fr 1fr` to `1fr 1.2fr` so the book column gets more room.

**4. Summary of actual changes:**
- Line 121 grid: change `grid-cols-1 lg:grid-cols-2` to `grid-cols-1 lg:grid-cols-[1fr_1.1fr]` to give the book column slightly more space
- Line 296 BookMockup wrapper: keep `w-full`, remove `mx-auto`
- Line 316: increase `maxHeight` from `560` to `700`

### Scope
- Single file: `src/components/HeroSection.tsx`
- No content, color, or typography changes

