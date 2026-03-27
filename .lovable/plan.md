

## Fix Hero Layout, Cover, Spine, and Book Height

### Changes in `src/components/HeroSection.tsx`

**1. Restore two-column layout (line 124, 131, 244)**
- Left column: change `lg:w-[45%]` to `lg:flex-1 lg:min-w-0` so it takes remaining space
- Right column: change `w-[55%]` to `lg:w-[560px] lg:max-w-[560px] lg:flex-shrink-0` so it's capped at 560px and never overflows

**2. Remove inner white card on cover (lines 324-364)**
- The left page currently renders an `<img>` with `objectFit: cover`. The cover image itself has a cream background baked in, so this should already work. The issue the user sees is likely the `<img>` not fully covering due to aspect ratio. Change the left page container background to `#F5EDD8` so any gap shows cream, not white/gray.

**3. Thin the spine (lines 367-374)**
- Change width from `14` to `10`
- Change background from gradient to solid `#2A1200`
- Update left/right page widths from `calc(50% - 7px)` to `calc(50% - 5px)` to account for 10px spine

**4. Constrain book max-height (line 309-321)**
- Remove the fixed `height: h` (380/280) from the inner book div
- Add `maxHeight: 480` to the inner book div for large, keep `280` for mobile
- Add `aspectRatio: "2.2 / 1"` so the book maintains a natural open-book ratio within the height constraint

### Files
- `src/components/HeroSection.tsx` — single file

