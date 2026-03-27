

## Hide Book on Mobile, Maximize on Desktop

### Changes in `src/components/HeroSection.tsx`

**1. Hide the right column (book) on mobile, show only on lg+**
- On the right column wrapper (line 239), add `hidden lg:flex` so the book is completely removed on mobile/tablet
- This eliminates all mobile book sizing issues permanently

**2. Make the book much bigger on desktop**
- Change `lg:max-w-[580px]` to `lg:max-w-none` (line 296) so the book fills its grid column
- Remove the `max-w-[160px] sm:max-w-[220px]` classes since the book is hidden below lg
- Increase `maxHeight` from 480 to ~560 so the book can grow taller on large screens

**3. Grid adjustment**
- On mobile, since the book is hidden, the grid effectively becomes single column already (grid-cols-1 is the default). No change needed there.

### Scope
- Single file: `src/components/HeroSection.tsx`
- No content, color, typography, or CTA changes

