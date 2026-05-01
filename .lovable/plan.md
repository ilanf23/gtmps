# Brand palette contrast guard + local panel text colors

## Why the Idea2Result microsite is unreadable

I checked the database row. Idea2Result extracted a dark theme:

```
primary    #ff0000   (red)
background #0a0a0a   (near-black)
surface    #1a1a1a
text       #ffffff   (white)
textMuted  #b0b0b0
```

`MagnetBreakdown.tsx` paints the page with `backgroundColor: brand.background` and `color: brand.text`, so the page is black with white text by default. That works for sections that respect the brand. The problem is that **multiple v10 sections hardcode a cream panel background** (`bg-[#FBF8F4]`) without setting a local text color, so they inherit the white parent color and render white text on cream cards (invisible). The screenshots confirm exactly this:

- Sections 3, 4, 10 (`ObservedHypothesisQuestion`): `bg-[#FBF8F4]` panels with inherited white body text.
- Section 7 (`ValueInTheirWords`): `bg-[#FBF8F4]` quote cards on the dark Section 6 backdrop, white text.
- Section 10 (`DeeperFindings`): same pattern.
- Section 11 (`ManuscriptShareSave`): same pattern.
- Section 1 (`PersonalizedHeader`): the "Your Revenue Map for" overline uses an opacity, but the firm-name display uses `brand.primary`. Idea2Result's gold defaults already look fine, but the rest of the page is borderline.

There are two layers to fix, and both should ship.

## Fix 1 — Palette contrast guard (data layer, scalable)

A new helper `assertReadableBrand(brand)` in `src/lib/clientTheme.ts` runs once in `MagnetBreakdown.tsx` after the palette is derived. It:

1. Computes WCAG contrast ratio between `text` and `background`. If below 4.5:1, **reject the extracted palette** and fall back to the safe Mabbly defaults (`bg #FBF8F4`, `text #1C1008`). The brand `primary` (accent) is preserved so the firm's color identity survives.
2. Computes contrast between `primary` and `background`. If primary becomes invisible (ratio < 3.0 against the background), darken or lighten `primary` toward `MABBLY_GOLD` enough to meet 3.0:1. (For Idea2Result this would keep red but nudge it toward a darker red on a cream background.)
3. Returns `{ brand, paletteRejected: boolean, originalBrand }` so the page can optionally surface a tiny dev-mode badge ("brand auto adjusted for legibility"). No user-facing badge in production. We log a `console.warn` so future failures are visible during QA.

Why fall back to cream-on-ink instead of trying to make the dark theme work: every v10 panel is designed around the cream surface (the OHQ panels, the quote cards, the Manuscript anchor). Trying to invert each one introduces 6+ branching code paths with their own contrast risks. Falling back to the validated cream palette is one decision that fixes every section at once.

## Fix 2 — Self-contained panel text colors (defensive belt-and-braces)

Even with the palette guard, hardcoded cream panels should never depend on inherited color. Add an explicit `text-[#1C1008]` (Mabbly dark) class to every panel that hardcodes `bg-[#FBF8F4]`. This way, if a future palette slips past the guard, the panels still read.

Files touched:

- `src/components/magnet/v10/ObservedHypothesisQuestion.tsx` — both `<div className="bg-[#FBF8F4] p-5">` panels and the question panel: add `text-[#1C1008]`.
- `src/components/magnet/v10/ValueInTheirWords.tsx` line 61: add `text-[#1C1008]`.
- `src/components/magnet/v10/DeeperFindings.tsx` line 77: add `text-[#1C1008]`.
- `src/components/magnet/v10/ManuscriptShareSave.tsx` lines 143 and 189: add `text-[#1C1008]`.

The Adam anchor block in `ValueInTheirWords` and the dialog content already declare explicit colors, so they are safe.

## Fix 3 — Same guard for the OG/share image generator

`supabase/functions/og-pepper-group/index.ts` and any future OG functions read the palette directly. Out of scope for this pass since OG cards already use Mabbly dark defaults, but worth flagging in a TODO comment in `clientTheme.ts`.

## Files

1. `src/lib/clientTheme.ts` — add `assertReadableBrand` and WCAG helpers (or extend existing helpers if present).
2. `src/components/magnet/MagnetBreakdown.tsx` — call `assertReadableBrand` after building `brand`.
3. `src/components/magnet/v10/ObservedHypothesisQuestion.tsx` — add explicit panel text color.
4. `src/components/magnet/v10/ValueInTheirWords.tsx` — same.
5. `src/components/magnet/v10/DeeperFindings.tsx` — same.
6. `src/components/magnet/v10/ManuscriptShareSave.tsx` — same.

## Out of scope

- No prompt changes to the LLM brand extraction (the AI palette prompt already requests 4.5:1 text contrast against background; Idea2Result's site simply confused it). The runtime guard is the durable fix.
- No new database migration, no schema changes, no edge function redeploy.
- Existing well-behaved palettes (Madcraft, SPR, Calliope, etc.) are unaffected since their text/background ratios already exceed 4.5:1.

## What the fix does for the user

- Idea2Result and any other dark-themed extraction renders as cream + ink (readable), with the firm's red preserved as the accent on eyebrows, hairlines, and CTAs.
- A `console.warn` fires once on load when the guard rejects a palette, surfacing the issue during QA so it can be tightened later if needed.
- All future microsites are protected from the same class of bug, regardless of how exotic the extracted palette is.
