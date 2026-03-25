
The screenshot is not showing extra spacing. It is showing a section whose content is hidden while the background still renders.

What I found:
- `src/index.css` hides every `.scroll-reveal` by default with `opacity: 0` and `translateY(20px)`.
- `src/hooks/useScrollReveal.ts` only reveals elements after `IntersectionObserver` fires with `threshold: 0.12`.
- Multiple important sections depend on this, including large wrappers in `HeroSection.tsx`, plus content throughout `SocialProofBar`, `MissionSection`, `BookSection`, and `ApplySection`.
- That means if the observer misses, delays, or fails for any section, the user sees a full blank panel in that section. The dark screenshot matches that failure mode exactly.

Implementation plan:
1. Make reveal animations fail safe, not content blocking.
   - Update `src/index.css` so `.scroll-reveal` is visible by default.
   - Only apply the hidden pre animation state after the reveal system is confirmed ready, using a root class set by the hook.
2. Harden the reveal hook.
   - Update `src/hooks/useScrollReveal.ts` to add a page level ready class after observers are attached.
   - Ensure elements already in view on load become visible immediately.
3. Remove brittle wrapper level reveals from critical hero content.
   - In `src/components/HeroSection.tsx`, stop using `scroll-reveal` on the entire left column wrapper.
   - Keep reveals on smaller child elements if needed so one observer miss cannot blank the whole hero.
4. Audit other high risk sections for the same pattern.
   - Prioritize `SocialProofBar`, `MissionSection`, `BookSection`, and `ApplySection`.
   - Remove `scroll-reveal` from any container whose failure would create a large empty block.
5. Preserve the current design.
   - Keep all fonts, spacing, colors, layout, and animation style.
   - This is a reliability fix only, not a redesign.

Files to update:
- `src/index.css`
- `src/hooks/useScrollReveal.ts`
- `src/components/HeroSection.tsx`
- Possibly small cleanup in `src/components/SocialProofBar.tsx`, `src/components/MissionSection.tsx`, `src/components/BookSection.tsx`, and `src/components/ApplySection.tsx` if they still use large wrapper level reveals
