## Sticky CTA collision fix

Make the sticky bottom "Add Your Firm" pill a true fallback. It hides whenever the user already has an inline equivalent on screen (in addition to the existing hero/footer rules).

### Mechanism

The sticky CTAs watch the DOM for any element tagged `data-cta="add-your-firm"`. An IntersectionObserver tracks how many of those are currently in viewport (threshold 0.5). Visibility becomes:

```
show = scrolled && !footerVisible && !inlineVisible
```

Two sticky implementations exist; both get the same treatment.

### Changes

**1. New shared hook: `src/hooks/useInlineCtaVisible.ts`**

```ts
// Returns true while ANY [data-cta="add-your-firm"] is intersecting.
// Uses MutationObserver to pick up CTAs that mount after first render
// (e.g., FAQ accordions, lazy sections).
export function useInlineCtaVisible(threshold = 0.5): boolean
```

Implementation:
- One IntersectionObserver, threshold 0.5.
- One MutationObserver on `document.body` (childList + subtree) to (re)observe newly-added tagged nodes and unobserve removed ones.
- Maintains a `Set` of currently-intersecting elements; setState only when set size crosses 0 ↔ N to avoid re-renders.
- SSR safe (guards `typeof window`).

**2. Wire the hook into both stickies**

- `src/pages/Discover.tsx` — `StickyCTA` component (lines 396-467). Add `const inlineVisible = useInlineCtaVisible();` and change `show` to `scrolled && !footerVisible && !inlineVisible`. Existing 200ms opacity transition + `pointer-events` toggle stays.
- `src/components/VerticalLanding/VerticalStickyCta.tsx`. Same change — used by all 8 vertical pages and `/awards` (via `VerticalLanding`/`Awards.tsx`).

Reduced motion: existing CSS transitions remain, but they fire instantly when the user has `prefers-reduced-motion` because we already use `transition: opacity 200ms ease` and the change is opacity-only — under `prefers-reduced-motion: reduce` browsers honor the user agent's reduced-transition behavior. (No new motion code added.)

**3. Tag every inline "Add Your Firm" CTA** with `data-cta="add-your-firm"`

Discovered inventory (verified via ripgrep):

| File | Line | Context |
|---|---|---|
| `src/components/discover/DiscoverHero.tsx` | 565 | Section 01 hero CTA |
| `src/components/discover/IndustryGrid.tsx` | 162 | Section 1.5 "Or stay general" CTA |
| `src/components/discover/ManuscriptAnchor.tsx` | 144 | Section 1.5 manuscript anchor |
| `src/components/discover/BetaReader.tsx` | 231 | Section 06 Early Access submit |
| `src/components/discover/MapSection.tsx` | 152 | Section 09 GTM Score CTA |
| `src/components/discover/FinalCta.tsx` | 124 | Section 14 final CTA |
| `src/components/VerticalLanding/VerticalLanding.tsx` | 554, 801, 866 | Vertical hero + 2 mid-page CTAs (covers all 8 verticals) |
| `src/components/awards/AwardsHero.tsx` | 149 | Awards hero CTA |
| `src/components/awards/AwardsCalendarCta.tsx` | 163 | Awards final CTA |
| `src/pages/Awards.tsx` | 156, 183 | Awards top-nav desktop + mobile |

**Excluded intentionally** (these are themselves sticky/fixed nav CTAs — tagging them would permanently hide the bottom sticky):
- `src/pages/Discover.tsx` lines 192-205 (TopNav desktop pill) and 288-299 (TopNav mobile menu)
- `src/components/VerticalLanding/VerticalNav.tsx` lines 239, 289 (vertical top-nav pills)

The two `Awards.tsx` entries (lines 156, 183) live inside the awards page top nav — they are also navigation, not inline body CTAs. **I will exclude these too** for the same reason. Final tagged count: 13 inline CTAs across discover + verticals + awards body sections.

### Behavior matrix

| Position | Hero | Footer | Inline CTA on screen | Sticky |
|---|---|---|---|---|
| At top (hero) | in view | — | — | hidden ✓ |
| Industries section | — | — | — | visible |
| "Or stay general" CTA on screen | — | — | yes | **hidden (new)** |
| Mid-body, no inline CTA | — | — | — | visible |
| Final CTA on screen | — | — | yes | **hidden (new)** |
| Footer | — | in view | — | hidden ✓ |

### Test plan (manual after ship)

1. `/discover`: scroll end-to-end. Sticky never appears alongside an inline pill at the same time.
2. `/consulting` and 1 other vertical: same scroll test through hero → mid CTAs → footer.
3. `/awards`: verify hero + calendar CTA hide the sticky.
4. Resize to 375px: same behavior, no double-pill.
5. With `prefers-reduced-motion: reduce`: visibility toggles cleanly.

### Files touched

- **NEW**: `src/hooks/useInlineCtaVisible.ts`
- **EDIT**: `src/pages/Discover.tsx` (StickyCTA logic only)
- **EDIT**: `src/components/VerticalLanding/VerticalStickyCta.tsx`
- **EDIT** (add `data-cta` attribute, no other changes): `DiscoverHero.tsx`, `IndustryGrid.tsx`, `ManuscriptAnchor.tsx`, `BetaReader.tsx`, `MapSection.tsx`, `FinalCta.tsx`, `VerticalLanding.tsx`, `AwardsHero.tsx`, `AwardsCalendarCta.tsx`

### One decision flagged

The two `Awards.tsx` CTAs at lines 156/183 are inside the page's own top-nav header (desktop pill + mobile menu link), not inline body content. Spec said "/awards page CTAs" generically. **Default: do NOT tag those two — they would behave like the discover/vertical top-nav pills and permanently suppress the sticky once nav becomes sticky.** Tell me if you want them tagged anyway.