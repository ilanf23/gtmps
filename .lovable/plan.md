

## Plan: Make site fully mobile responsive

The primary issue is `HeroSection.tsx` — it uses hardcoded inline styles with a fixed two-column grid, `120px` padding, and `76px` font size that break at 390px. All other sections already use Tailwind responsive classes and are mostly fine.

### Changes needed

**1. Rewrite HeroSection.tsx with responsive Tailwind classes**

The hero section needs these mobile fixes:
- **Grid**: Change from `gridTemplateColumns: "1fr 1fr"` to single column on mobile, two columns on `md+`
- **Padding**: Reduce from `120px` horizontal to `24px` on mobile
- **Headline font size**: Scale down from `76px` to ~`40px` on mobile using `clamp()` or responsive classes
- **CTA buttons**: Stack vertically on mobile instead of side-by-side; reduce `minWidth`
- **Stats row**: Reduce stat number font size from `52px` to ~`32px` on mobile
- **Book image**: Show below the text content on mobile (single column stacking)
- **Overall min-height**: Keep `100vh` but allow content to flow naturally

Convert inline styles to Tailwind classes where possible, or use CSS media queries within the inline style approach.

**2. Minor tweaks to other sections (if needed)**
- All other components already use `px-6 md:px-20`, `grid-cols-1 md:grid-cols-2`, `clamp()` font sizes — these are already responsive
- No changes expected for DefinitionBanner, SocialProofBar, MissionSection, EpisodeSection, BookSection, AuthorsSection, DeeperSection, ResultsSection, ApplySection, Footer

### Technical approach
- Replace the hero's inline `style` grid with Tailwind: `grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 px-6 md:px-[120px] py-20 md:py-20`
- Use responsive text classes: `text-[40px] md:text-[76px]`
- Stack CTA buttons: `flex flex-col sm:flex-row gap-4`
- Reduce stat numbers: `text-[32px] md:text-[52px]`
- Book image centered on mobile with `max-w-[280px] md:max-w-none md:w-[520px]`

