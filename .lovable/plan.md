## Goal
Make every microsite section (`/m/:slug`, `/m/:slug/chat`, `/m/:slug/read`, `/m/:slug/feedback`, and `/book`) render the same footer used on `/discover`.

## Current state
- `/discover` (`src/pages/Discover.tsx`) renders `<Footer />` from `src/components/Footer.tsx` — a self‑contained dark "Across Mabbly" footer with cross‑links and legal row.
- All microsite pages wrap their content in `MagnetShell` (`src/components/magnet/MagnetShell.tsx`). The shell renders a sticky top nav and `<main>` — but **no footer**.
- A separate `VerticalLanding/VerticalFooter.tsx` exists for vertical pages — we are **not** touching that one.

## Change
**Single edit** to `src/components/magnet/MagnetShell.tsx`:
1. Import the existing footer: `import Footer from "@/components/Footer";`
2. Render `<Footer />` immediately after the closing `</main>` tag (still inside the flex column wrapper, so it sits at the bottom of the page on short content).

That's it — because every microsite route already goes through `MagnetShell`, this single change covers MAP, Talk to the Book, Read, Feedback, and the standalone `/book` route in one shot.

## Why no other changes
- `Footer.tsx` already carries `data-page-footer="true"`, so `useFooterVisible` (used by sticky CTAs in the microsite) will correctly detect it and fade out CTAs at the bottom.
- The footer is intentionally dark (`bg-soft-navy`) and self‑contained. It will read as a deliberate brand band at the bottom of light‑themed microsites, matching the way it sits at the bottom of `/discover`.
- No new component, no duplication, no styling fork — one source of truth keeps both surfaces in lockstep going forward.

## Files touched
- **Edit**: `src/components/magnet/MagnetShell.tsx` (add import + render `<Footer />` after `<main>`)

No DB, edge function, routing, or content changes required.