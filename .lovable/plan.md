

## Plan: Fix hero layout at 768px (iPad)

### Problem
At 768px, the two-column grid activates via `md:grid-cols-2`, giving each column only ~364px. The book image is set to `md:w-[380px]` which overflows, and the CTA buttons get cut off.

### Fix
Move the two-column layout from `md:` (768px) to `lg:` (1024px). At 768px, the hero stays single-column (stacked) like mobile, which fits the content properly.

### Changes in `src/components/HeroSection.tsx`

- Grid: `grid-cols-1 md:grid-cols-2` → `grid-cols-1 lg:grid-cols-2`
- Gap: `md:gap-12 lg:gap-20` → `lg:gap-20`
- Padding: `md:px-10 lg:px-[120px]` stays (fine for single column at 768)
- Column order: `md:order-1` / `md:order-2` → `lg:order-1` / `lg:order-2`
- Headline: `md:text-[60px]` → keep `sm:text-[56px]`, add `lg:text-[76px]`
- Book image: `md:max-w-none md:w-[380px] lg:w-[520px]` → `lg:max-w-none lg:w-[520px]`, use `md:max-w-[420px]` for tablet single-column
- Stats: `md:text-[40px]` → `lg:text-[52px]`, keep `sm:text-[36px]` for tablet

This ensures iPad portrait (768px) gets a clean stacked layout, and the two-column split only happens at 1024px+ where there's enough room.

