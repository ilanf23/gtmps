

## Fix Book Sizing: Bigger on Desktop, Smaller on Mobile

The book wrapper at line 296 currently uses `max-w-[360px] lg:max-w-[540px]`. At 1415px viewport with a 1fr/1fr grid, 540px is undersized for the right column. On mobile, 360px is too large relative to the screen.

### Changes in `src/components/HeroSection.tsx`

**1. Book wrapper responsive max-width (line 296)**
- Change `max-w-[360px] lg:max-w-[540px]` to `max-w-[280px] sm:max-w-[320px] lg:max-w-[580px]`
- This makes the book smaller on mobile (280px), moderate on tablet (320px), and larger on desktop (580px)

**2. Book page min-height scaling (lines 316, 380)**
- Change `minHeight: 280` to a responsive approach: use Tailwind classes or keep 280 but the wider max-width on desktop will naturally make the book taller via aspect ratio
- Alternatively, reduce mobile minHeight to `220` and keep desktop at `280` (the maxHeight 480 already caps it)

### Single file: `src/components/HeroSection.tsx`

