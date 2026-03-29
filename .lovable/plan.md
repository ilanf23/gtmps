

## Plan: Fix iPad and tablet responsive issues

### Problem identified
The Tailwind `md:` breakpoint fires at exactly 768px (iPad portrait). Several components apply desktop-width styles too early, causing layout breakage.

### Critical issues

**1. HeroSection — broken at 768px**
- `md:px-[120px]` applies 240px of horizontal padding on a 768px screen, leaving only ~528px for content
- `md:w-[520px]` on the book image exceeds the available column width
- `md:text-[76px]` headline is too large for the remaining space
- **Fix**: Add `lg:` breakpoint (1024px) for the aggressive styles. Use gentler values at `md:`:
  - Padding: `px-6 md:px-10 lg:px-[120px]`
  - Grid gap: `gap-10 md:gap-12 lg:gap-20`
  - Headline: `text-[40px] sm:text-[56px] md:text-[60px] lg:text-[76px]`
  - Book image: `max-w-[280px] sm:max-w-[360px] md:w-[380px] lg:w-[520px]`
  - Stats numbers: `text-[28px] sm:text-[36px] md:text-[40px] lg:text-[52px]`

**2. StickyNav — cramped pill nav at 768px**
- Desktop nav (pill + CTA) shows at `md:` but the 5 nav links + CTA barely fit at 768px
- **Fix**: Change nav visibility from `md:` to `lg:` so tablet gets the hamburger menu instead

**3. Other sections — minor padding tweaks**
- Most sections use `md:px-20` which is fine at 768px
- `MissionSection` callout box has `padding: "32px 36px"` inline — fine
- `DeeperSection` email capture has `padding: "32px 40px"` inline — reduce on small tablets
- No critical breaks in BookSection, AuthorsSection, ResultsSection, ApplySection, Footer

### Files to edit
1. `src/components/HeroSection.tsx` — add `lg:` tier for large desktop styles
2. `src/components/StickyNav.tsx` — change `md:` to `lg:` for desktop nav visibility

### Technical details
- Tailwind breakpoints: `sm:` = 640px, `md:` = 768px, `lg:` = 1024px
- iPad portrait = 768px, iPad landscape = 1024px
- The fix introduces a proper 3-tier responsive: mobile → tablet (768–1023) → desktop (1024+)

