## Goal

Transform the `/m/:slug` loading state from a flat status bar into an inspirational, cinematic "building your map" sequence that feels worth waiting 60–90s for. Stays inside the locked Mabbly palette (`#FBF8F4`, `#1C1008`, `#B8933A`) and respects `prefers-reduced-motion`.

## Where it lives

`src/pages/MagnetSite.tsx` — replaces the current "Processing UI (pending | processing)" block (lines ~224-263). The `loading`, `complete`, and `error` branches are untouched. No changes to polling logic, `MagnetShell`, or any data flow.

## The composition (single full-bleed canvas, layered)

A centered ~640px square stage on desktop, full-width on mobile, with five layers stacked via absolute positioning:

**Layer 1 — Constellation field (back)**
- ~40 small gold dots (`#B8933A`) scattered on a deterministic seeded grid so it looks intentional, not random.
- Each dot fades in over the first ~6s in staggered waves (3 waves of ~13 dots), then gently breathes (opacity 0.3 → 0.7) on a 4s loop with per-dot phase offset.
- Represents "your relationship orbits being discovered."

**Layer 2 — Orbit rings (middle)**
- Five concentric SVG rings, hairline (`1px`, `#1C1008` at 8% opacity), drawn with `stroke-dasharray` + `stroke-dashoffset` animating from invisible to fully drawn — each ring takes ~3s, staggered 1.2s apart, so all five complete by ~9s.
- Once drawn, each ring rotates very slowly (60s, 90s, 120s, 150s, 180s — different speeds for parallax depth).
- Maps directly to the Five Orbits framework (Inner Circle → New Gravity), reinforcing the brand promise visually.

**Layer 3 — Tracing arc (middle-front)**
- A single brighter gold arc (`#B8933A`, 1.5px, opacity 0.6) sweeps continuously around one of the rings (8s loop), like a radar trace finding signals.
- When it crosses a constellation dot, that dot briefly pulses brighter (100% opacity, 400ms). Achieved with CSS `animation-delay` per dot rather than JS so it stays cheap.

**Layer 4 — Center seal (front)**
- Small editorial mark in the dead center: hairline gold circle (~64px), with the rotating step number inside in `Cormorant Garamond` italic (`01` → `05`), changing every ~14s in sync with the step copy.
- Subtle scale pulse (1.0 → 1.04 → 1.0) on a 3s loop — gives the composition a heartbeat.

**Layer 5 — Editorial text block (overlay, below the stage)**
- Eyebrow: `BUILDING YOUR MAP` in DM Mono caps gold, locked in place.
- Headline (unchanged copy, restyled): `Hey {firstName} — we're mapping your revenue universe.` Falls back to "Mapping your revenue universe." Cormorant Garamond italic, 28-36px clamp, `#1C1008`.
- Step line (existing 5 STEPS array, unchanged copy): rotates every 14s (slowed from 4s — the new visual carries the "something is happening" signal, so the words can breathe). Crossfades in/out at 500ms.
- Below step line: a much thinner progress bar — `1px` gold, with a soft glow (`box-shadow: 0 0 12px rgba(184,147,58,0.6)`), filling 0→100 across each 14s step rather than 4s.
- Final micro-line in DM Mono caps `#1C1008` at 40%: `THIS USUALLY TAKES 60–90 SECONDS` — sets expectation, reduces abandonment anxiety.

## Motion timing summary

| Element | Duration | Behavior |
|---|---|---|
| Constellation fade-in | 6s | Staggered 3-wave reveal |
| Constellation breathing | 4s loop | Per-dot phase offset |
| Orbit rings draw | 9s | Stroke-dashoffset, staggered |
| Orbit rings rotate | 60–180s | Parallax, perpetual |
| Tracing arc sweep | 8s loop | Continuous radar |
| Center seal pulse | 3s loop | Scale 1 → 1.04 |
| Step copy + bar | 14s per step | Crossfade 500ms |

All loops use `cubic-bezier(0.4, 0, 0.2, 1)`.

## Reduced motion fallback

When `prefers-reduced-motion: reduce`:
- Rings render fully drawn, no rotation.
- Constellation renders at static 50% opacity, no breathing.
- Tracing arc hidden.
- Center seal static, no pulse.
- Step copy still rotates (it's information, not decoration), but bar fills without animation.

Implemented via the existing `useReducedMotion` hook (already in repo at `src/hooks/useReducedMotion.ts`).

## Implementation notes

- All animation via CSS keyframes inside a single `<style>` block scoped to the loading screen — no new dependencies, no Framer Motion needed.
- SVG for rings + arc + dots (single inline SVG, ~3KB), so it scales cleanly and stays crisp at any viewport.
- Center seal step number derived from the existing `stepIndex` state — no new state needed.
- Mobile: stage scales to `min(90vw, 480px)`. Constellation count drops to ~28 dots to keep it from looking busy at 375px.
- Accessibility: stage gets `aria-hidden="true"` (decorative). Live region (`aria-live="polite"`) wraps the step copy so screen readers announce progress.

## What does NOT change

- Polling logic, status states, error UI, complete UI, `MagnetShell`, routing, copy in the `STEPS` array.
- No new files. Single edit to `src/pages/MagnetSite.tsx`.

## Verification after ship

1. Visit `/m/<any-slug-mid-processing>` — see constellation fade in, rings draw in sequence, arc sweep continuously.
2. Step copy rotates every ~14s with bar filling underneath.
3. Center seal shows 01–05 italic numerals in sync with steps.
4. Toggle OS reduced-motion → all loops freeze, content still reads.
5. Mobile 375px → stage fills width, no horizontal scroll, dots not crowded.
6. `complete` and `error` states render exactly as before.