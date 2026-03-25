
Issue confirmed from the screenshot: the SocialProof bar renders, then the next section background appears but the Mission section content is hidden. This is still the scroll reveal system, not true empty spacing.

Why it is happening:
- `src/index.css` still hides content globally after JS adds `reveal-ready`.
- `src/components/MissionSection.tsx` applies `scroll-reveal` to nearly every visible block in the section.
- So if the observer callback is delayed or missed for that section, the whole panel becomes a blank white block.

Implementation plan:

1. Replace the global reveal model with per element reveal state.
- Update `src/hooks/useScrollReveal.ts` so each `.scroll-reveal` element is initialized individually.
- Add a `reveal-pending` class only to elements the hook is actively managing.
- Immediately mark items already in or near the viewport as `visible`.
- When an element reveals, remove `reveal-pending` and optionally unobserve it.

2. Update the CSS so only pending elements are hidden.
- In `src/index.css`, stop using `.reveal-ready .scroll-reveal`.
- Use a safer rule such as:
  - `.scroll-reveal` = visible baseline
  - `.scroll-reveal.reveal-pending:not(.visible)` = hidden and shifted down
  - `.scroll-reveal.visible` = shown
- Keep the same timing and stagger behavior.

3. Make the Mission section fail safe by design.
- In `src/components/MissionSection.tsx`, remove `scroll-reveal` from the highest impact content:
  - eyebrow block
  - main headline
  - subhead
  - divider
  - callout panel
- Keep motion only where it adds value and does not risk blanking the whole section, such as card hover states and count up stats.

4. Audit other sections that can blank entire blocks.
- Review `src/components/SocialProofBar.tsx`
- Review `src/components/ApplySection.tsx`
- Review `src/components/ResultsSection.tsx`
- Review `src/components/Footer.tsx`
- Remove `scroll-reveal` from any large wrapper where one missed observer event can hide the whole section.

5. Preserve the current visual direction.
- No redesign.
- Keep the visual storytelling cards, hover polish, and animated counters.
- This pass is strictly about reliability and readability so content is always present first, animated second.

Files to update:
- `src/hooks/useScrollReveal.ts`
- `src/index.css`
- `src/components/MissionSection.tsx`
- Possibly `src/components/SocialProofBar.tsx`
- Possibly `src/components/ApplySection.tsx`
- Possibly `src/components/ResultsSection.tsx`
- Possibly `src/components/Footer.tsx`
