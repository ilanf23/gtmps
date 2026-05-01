# Lovable Prompt · Tighten Five Orbits Section Spacing

**Target file:** `src/components/magnet/MagnetBreakdown.tsx` (Section 02 · Your Five Orbits)
**Issue:** Excessive vertical dead space above and below the Five Orbits visualization on `/m/:slug`. There's roughly 400–600px of empty whitespace between the subheading ("Color reflects what we observed on your site...") and the start of the orbit rings, plus more empty space below the visualization before Section 03.
**Goal:** Tighten the spacing so the orbit chart sits in a comfortable visual rhythm with the rest of the page — no large empty fields, no awkward jumps, but also not crammed.

---

## Copy/paste prompt for Lovable

```
Edit the Five Orbits visualization section in src/components/magnet/MagnetBreakdown.tsx (this is Section 02 in the personalized MAP rendered at /m/:slug, the section labeled "02 · YOUR FIVE ORBITS" with the heading "Where your next client already orbits you.").

PROBLEM: There is excessive vertical dead space surrounding the orbit chart. Currently there is roughly 400–600px of empty whitespace between the subheading ("Color reflects what we observed on your site. Tap any orbit to read the full observation.") and the start of the SVG orbit rings, and additional empty space between the bottom of the orbit visualization and the start of Section 03 (Your Core).

FIX: Tighten the spacing so the orbit chart sits in a comfortable rhythm with the surrounding sections. Specifically:

1. Reduce the top margin/padding between the subheading paragraph and the orbit SVG container to a maximum of 32px on desktop (≥1024px) and 24px on mobile (<1024px).

2. Reduce the bottom margin/padding between the orbit SVG container and the next section divider to a maximum of 48px on desktop and 32px on mobile.

3. The orbit SVG container itself: set max-height equal to its computed natural height (no artificial min-height). If there is a min-height: 100vh, min-height: 800px, or any aspect-ratio padding hack creating empty vertical space around the SVG, remove it. The SVG should size to its content, not to a fixed viewport-height value.

4. The SVG viewBox and internal coordinate system MUST stay exactly as they are. Do not change viewBox values, radii of the orbit rings, label positions, or the trigonometric label-positioning logic.

5. Vertically center the SVG inside its tightened container. Horizontal centering stays as-is.

6. The orbit pulse animation (orbit-ring-pulse, the @keyframes orbit-pulse rule) MUST stay exactly as defined. Do not modify the animation timing, opacity, or stroke-width values.

7. Verify on screen sizes 375px, 414px, 768px, 1024px, 1280px, and 1920px after the change. The orbit chart must remain fully visible (no clipping) at every width and the spacing must look balanced at every width.

DO NOT do any of the following — these are explicit redundant guardrails:

- Do NOT regenerate the entire MagnetBreakdown.tsx component. Only edit the Section 02 spacing.
- Do NOT modify Section 01 (Your Research Profile / header), Section 03 (Your Core), or any other section.
- Do NOT change the orbit ring colors, the orbit label colors, the score band colors (Strong / Mixed / Gap), or the firm logo styling at the center of the chart.
- Do NOT change the orbit names, orbit numbers, the ⊙ symbol, the score values, or any text content inside Section 02.
- Do NOT change the SVG viewBox, ring radii, label angles, or the cos/sin label-positioning math.
- Do NOT change the orbit-pulse animation keyframes, duration (2.4s), easing (ease-in-out), or opacity values (0.85 to 1).
- Do NOT modify the "Read the observation →" tap-handlers or the modal/expansion behavior on click.
- Do NOT add any new npm dependencies or import any new libraries. Use only Tailwind utility classes already in the project, or inline style adjustments on the existing JSX.
- Do NOT install Framer Motion, GSAP, or any animation library if not already present. The build stack is locked: Framer Motion + tsparticles + Lenis only.
- Do NOT introduce CSS custom properties or design tokens that don't already exist in tailwind.config.ts or src/index.css.
- Do NOT change the responsive breakpoint values used elsewhere in the project (sm/md/lg/xl already defined).
- Do NOT touch src/components/discover/, src/components/aletheia/, src/components/microsite/, or any folder outside src/components/magnet/.
- Do NOT change the Supabase data fetch, the polling logic, the breakdown_data shape, or any TypeScript types in src/types/magnet.ts.
- Do NOT change the wait theater (MagnetWaitTheater) — that is a different component on a different render path.
- Do NOT touch the floating chat (MagnetChat.tsx) — that is its own component.
- Do NOT change the section heading "02 · YOUR FIVE ORBITS" eyebrow, the H2 "Where your next client already orbits you.", or the subheading paragraph wording.
- Do NOT add any console.log statements, debug code, or commented-out blocks.
- Do NOT introduce conditional rendering tied to score bands, vertical context, or any new prop. The change is purely CSS/layout.
- Do NOT change the section's z-index or stacking order relative to other elements.
- Do NOT change scroll-snap, sticky, or fixed positioning of any element.
- Do NOT add new aria-labels, aria-describedby, or accessibility attributes unless required by your change. Existing accessibility attributes must stay intact.
- Do NOT modify hover, focus, or active states of the orbit rings or labels.
- Do NOT change print styles or media queries beyond the desktop/mobile spacing rule above.
- Do NOT update package.json, tsconfig.json, vite.config.ts, or tailwind.config.ts.
- Do NOT run any build, test, or lint commands. Just make the edit.
- If you cannot find an obvious min-height or padding rule causing the dead space, INSPECT the rendered DOM tree of Section 02 and identify the offending CSS rule. Report back what you found before making any change other than the targeted spacing reduction.

VERIFICATION AFTER EDIT:
- The Five Orbits chart now appears within ~32px of the subheading on desktop.
- The chart bottom is within ~48px of the next section divider on desktop.
- All orbit rings render at correct radii.
- All orbit labels appear at correct angular positions.
- The pulse animation still runs on Orbit 03 (Dead Zone) at the same timing.
- The "Read the observation →" tap targets still work and open the orbit detail panel.
- Page renders correctly at 375px, 414px, 768px, 1024px, 1280px, and 1920px.
- No console errors after the change.

COMMIT MESSAGE (when committing the edit):
"Tighten Section 02 (Five Orbits) vertical spacing on /m/:slug — remove min-height dead space"
```

---

## Why the redundant guardrails

Lovable defaults to confident regeneration. When you give it a CSS-only task, it sometimes rewrites surrounding JSX, swaps libraries, or "improves" copy you never asked it to touch. The "DO NOT" list above is verbose on purpose — every line is an actual failure mode I'd expect against a less-disciplined prompt.

The most important guardrails (in order of how often they get violated):
1. **Do NOT regenerate the component** — keeps the edit surgical.
2. **Do NOT change orbit math** — protects the SVG geometry.
3. **Do NOT add dependencies** — preserves the locked free-tools build stack.
4. **Do NOT touch other sections** — prevents collateral damage.
5. **INSPECT before changing** — forces Lovable to find the actual offending rule rather than guess.

---

## After the edit

Verify visually at desktop and mobile, screenshot before/after, paste into the Notion ship log under the next day's entry. If the spacing looks off after the edit (too tight, too loose, asymmetric), iterate the 32px / 48px values up or down — those are starting targets, not absolutes.

EDITH out.
