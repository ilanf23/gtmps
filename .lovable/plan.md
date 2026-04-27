## Wire S6E1 founder video into the post-CTA form page

Replace the placeholder `FounderVideoCard` in `src/pages/MagnetAssess.tsx` with a real video card that uses the existing S6E1 assets, styled as a small vertical phone frame above the 3-step form.

---

### Asset paths (already in `/public`)

- Video: `/s6e1-hero-vertical.mp4`
- Poster: `/s6e1-poster.jpg`
- Audio (currently unused; reserved for later): `/s6e1-cold-open.mp3`

### Behaviour

- **Persistent across all 3 steps** — sits in the existing slot above the form, not collapsed (form is already short; keeping it visible keeps Adam's presence as the trust anchor through email + URL fields).
- **Autoplay muted, looping, `playsInline`**, with poster visible until the first frame paints.
- **Tap-to-unmute** — gold circular play/sound button bottom-right of the phone screen. Toggles muted state and shows `Volume2` / `VolumeX` icons (lucide). On first unmute, also calls `play()` in case autoplay was blocked.
- **Auto-pause on form typing** — already wired via the existing `videoRef` + `pauseFounderVideo` in `onFocus` of each input; we keep that contract so no form changes are needed.
- **Reduced motion** — via `useReducedMotion()`: skip autoplay, render poster image only with a centered gold play button overlay; clicking it starts playback unmuted.
- **Caption below**: `ADAM FRIDMAN · WHY THIS RESEARCH EXISTS` in DM Mono, uppercase, gold (`#B8933A`), tracked at `0.22em`.

### Layout

- Vertical phone frame mockup, 9:16 aspect:
  - Desktop: `200px` wide (≈ 356px tall)
  - Mobile: `60vw` wide, capped at `220px`
  - Centered above the form (the existing `mt-8` slot)
- Frame styling matches `FloatingHeroVideo`: dark bezel gradient, rounded corners (`28px`), subtle gold border, dynamic island notch at top.
- Caption sits below the frame with `mt-3`.

### Technical details

- Edit only `src/pages/MagnetAssess.tsx`. Rewrite the `FounderVideoCard` component in-place.
  - Drop the existing `/founder/adam-intro.*` paths and the `hasAsset` 404 fallback (no longer needed — the S6E1 file exists).
  - Add local state `muted: boolean` (default `true`) for the tap-to-unmute control.
  - Use `useReducedMotion` from `@/hooks/useReducedMotion` (already used in `FloatingHeroVideo`).
  - Keep the `videoRef` prop signature so the parent's `pauseFounderVideo` keeps working unchanged.
- Inline `<style>` block scoped via a unique class prefix (`fvc-`) for the phone frame, so we don't pollute global CSS.
- Future swap: when Adam records the 20-second custom intro, change the two `const` paths at the top of `FounderVideoCard` and update the caption string to `ADAM FRIDMAN · 20 SECONDS · WHAT WE ANALYZE`. No other code changes required.

### Files changed

- `src/pages/MagnetAssess.tsx` (rewrite the `FounderVideoCard` component only; rest of the page untouched)

### Out of scope

- Audio fallback `s6e1-cold-open.mp3` is not wired (video already carries audio when unmuted).
- No changes to form fields, validation, submission, or progress bar.
- No changes to homepage `FloatingHeroVideo`.