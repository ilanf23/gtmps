# Unify nav + dropdown font

## The problem

In `src/components/VerticalLanding/VerticalNavBar.tsx`, the top-level nav links and dropdown items use two different font families, which is what's visible in the screenshot:

- Top nav links (`FOR YOUR FIRM`, `AWARDS`, `PODCAST`) and the `BUILD YOUR MAP` CTA → `'Mabbly Repro', 'Inter Tight', 'Arial Black', ...` (heavy sans).
- Dropdown items (`MANAGEMENT CONSULTING`, `LAW FIRMS`, ..., `SEE ALL VERTICALS`) and the `FOR YOUR FIRM` heading → `'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace` (the typewriter look).

That's why the dropdown reads as a different typeface than the nav above it.

## The fix

In the embedded `CSS` block at the bottom of `VerticalNavBar.tsx`, change the `font-family` on the dropdown classes from the mono stack to the same sans stack the nav links use, and tweak the now-too-tight letter-spacing so the rows still feel like nav items (not body copy).

Specifically:

1. **`.vnav-firm-row-label`** (the dropdown row labels — "MANAGEMENT CONSULTING", etc.)
   - `font-family` → `'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif`
   - `font-weight` → `900` (to match `.vnav-link`)
   - `letter-spacing` → `0.10em` (matches `.vnav-link`)
   - Keep size around `11px`, keep `text-transform: uppercase`.

2. **`.vnav-menu-heading`** (the small "FOR YOUR FIRM" header inside the panel, and the "Your Microsites" header)
   - Same sans family swap, `font-weight: 900`, `letter-spacing: 0.12em`. Keep the muted color and small size so it still reads as a section label rather than a row.

3. Leave everything else alone:
   - The "My Map" pill (`.vnav-mine-label`, `.vnav-mine-count`) keeps its mono treatment — that's an intentional pill style, not part of the dropdown the user is pointing at.
   - The URL pill on the microsite shells (DM Mono) is unrelated and stays.

## Out of scope

- No changes to the nav structure, items, colors, or spacing.
- No changes to other microsite top bars (`TopBar.tsx`, `PepperTopBar.tsx`, `SPRTopBar.tsx`) — the request is about the dropdown vs. nav mismatch on `/`.

## Files touched

- `src/components/VerticalLanding/VerticalNavBar.tsx` (CSS block only)
