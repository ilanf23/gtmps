

## Make Hero Section Responsive

The hero grid uses a fixed `gridTemplateColumns: "1fr 1fr"` and `padding: "64px 80px"` at all sizes, which breaks on tablet and mobile. The book has fixed `minHeight: 420px` that won't fit small screens. The stats strip and definition callout also need scaling.

### Changes in `src/components/HeroSection.tsx`

**1. Grid layout — stack on mobile, two columns on desktop**
- Replace the inline `gridTemplateColumns: "1fr 1fr"` with responsive approach:
  - Use className instead of inline style for the grid
  - Mobile (default): single column, `padding: 32px 20px`, `gap: 32px`, `minHeight: auto`
  - Tablet (md, 768px+): single column still, `padding: 48px 40px`
  - Desktop (lg, 1024px+): `grid-cols-2`, `padding: 64px 80px`, `min-h-screen`, `gap-12`
- On mobile, the left column (text) comes first, book below it

**2. Book mockup scaling**
- Change `maxWidth: 540` to `maxWidth: 400` on mobile, `540` on desktop (use a responsive class or clamp)
- Change `minHeight: 420` / `maxHeight: 480` on both pages to scale down on mobile: `minHeight: 280`, `maxHeight: 320` below lg
- Reduce book padding on mobile (chapter page padding from `32px 28px` to `20px 16px`)
- Scale down chapter page font sizes slightly on mobile

**3. Stats strip**
- Currently `flex` with `gap-0`. On mobile, wrap or stack: use `flex-wrap` and give each stat `min-width` so they wrap to 2+1 or stack vertically on very small screens
- Reduce stat number clamp lower bound

**4. CTA buttons**
- Already has `flex-col sm:flex-row` — good. Reduce padding on mobile from `17px 44px` to `14px 28px`

**5. Definition callout**
- Already has `mx-6 md:mx-auto` — good. Reduce padding on mobile from `36px 48px` to `24px 20px`

**6. Headline**
- Already uses `clamp(44px, 5.5vw, 76px)` — lower the minimum to `32px` for small screens

### Approach
- Convert the grid container from pure inline styles to a mix of Tailwind classes (for responsive breakpoints) and inline styles (for non-responsive values like maxWidth)
- Keep all existing desktop appearance identical
- Single file change: `src/components/HeroSection.tsx`

