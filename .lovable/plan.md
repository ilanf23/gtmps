# Why the background extraction is failing for idea2result.com

I fetched the live site and its CSS bundle. The site is a SPA with an empty `<body>` — no `theme-color` meta, no inline body styles. All branding lives in this single CSS rule:

```css
:root {
  --background: 0 0% 4%;       /* near-black */
  --foreground: 0 0% 100%;     /* white */
  --primary:    0 100% 50%;    /* red */
  --accent:     0 100% 50%;    /* red */
}
body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
```

This is the standard shadcn/Tailwind pattern: **raw HSL triplets stored as variables, wrapped in `hsl()` at usage**. Our current extractor in `supabase/functions/_shared/extract-branding.ts`:

1. **`extractAllColors()` only matches `#hex` and `rgb()/rgba()`** — it never sees `hsl()` values or the bare HSL triplets like `0 0% 4%`. So the brand red, the black background, and the white text are all invisible to the frequency map.
2. **The `body { background-color: ... }` regex matches the rule but the value is `hsl(var(--background))`** — both `normalizeHex` and `rgbStringToHex` return null. Background stays unset.
3. With no background found, the loop on lines 417-421 then picks `#ffffff` (the most-frequent neutral) as the fallback background → microsite renders cream.

So the visible symptom ("text-only theming, no black background, no red") is one bug: **we cannot read shadcn/Tailwind HSL CSS variables.** Fixing it unlocks dark sites in general.

---

# Plan

## 1. Teach `extract-branding.ts` to read HSL and CSS variables

In `supabase/functions/_shared/extract-branding.ts`:

- **Add `hslStringToHex(s)`** that accepts both `hsl(0, 100%, 50%)` and the bare triplet form `0 100% 50%` (with optional `/ alpha`), converts via standard HSL→RGB math, and returns hex.
- **Extend `extractAllColors()`** with a regex pass for `hsl(...)` and `hsla(...)`.
- **Add a CSS-variables pass `extractCssVariables(css)`** that scans `:root`, `html`, `body`, and `[data-theme="dark"]` blocks for `--name: value;` declarations, normalizing each value through hex / rgb / hsl / bare-HSL parsers. Build a `varMap: Record<string,string>`.
- **Resolve `var(--name)` references**: when a `body { background-color: ... }` (or `html { ... }`) value contains `hsl(var(--background))` or `var(--background)`, look up the var in `varMap` and substitute before parsing. Same for body color.
- **Prioritize semantic var names** when picking accent / background / text:
  - background ← `--background`, `--bg`, `--page-bg`
  - text ← `--foreground`, `--text`, `--body-text`
  - accent ← `--primary`, `--accent`, `--brand`
  These take precedence over frequency-based heuristics.

## 2. Layered, confidence-ranked background detection

Before the existing frequency loop, try high-confidence signals in order and stop at the first hit:

1. `<meta name="theme-color">` (already used — keep, but only treat as background when it is dark; light theme-colors are usually browser chrome, not page bg).
2. `<meta name="color-scheme" content="dark">` → set background to `#0a0a0a` if no other signal exists.
3. Inline `style="background:..."` on `<html>` or `<body>`.
4. CSS variable `--background` (resolved via step 1).
5. `body { background-color: ... }` (resolved via step 1).
6. Class-keyword scan: presence of `dark` / `bg-black` / `theme-dark` on `<html>` or `<body>` → bias toward dark fallback.
7. Existing neutral-frequency loop (last resort).

Mirror the same chain for `textColor` (`--foreground`, body color, then frequency).

## 3. Contrast guard in `src/lib/clientTheme.ts`

After building the theme:

- Compute WCAG contrast ratio between `text` and `background`.
- If ratio < **3.5**, override `text` to `#FFFFFF` when bg luminance < 0.5, else `#0F0F0F`. This protects against partial extractions (e.g. background found but text not).
- Pick `accentForeground` the same way against `accent`. (Already done — keep.)
- Recompute `surface`, `textMuted`, `border` from the corrected `text` so opacities still read on dark backgrounds.

## 4. Dark-mode UI rules in the microsite shell + override sheet

- **`src/components/magnet/MagnetShell.tsx`**: compute `isDark = relLuminance(theme.background) < 0.35` and add `data-ms-dark` on the wrapper alongside the existing `data-ms-themed`.
- **`src/styles/microsite-theme.css`**: add a small dark-mode block under `[data-ms-themed][data-ms-dark]` that:
  - Strengthens borders (`color-mix` with text at 18% instead of 10%) so dividers don't disappear on black.
  - Bumps surface tints (text at 8% instead of 5%) so chat bubbles and cards remain visible.
  - Forces `prose` link/strong colors to white-tinted variants.
  - Inverts the `bg-black/5` and `text-black/30` utility remaps to use the white-tinted text token instead (already partially handled by the `var(--ms-text)` remap — verify under a black bg).
- This reuses the existing override architecture, no component rewrites.

## 5. Re-enrich the affected magnets

A SQL migration to nullify `client_background_color`, `client_text_color`, `client_accent_color`, `client_brand_color` for rows whose extraction looks wrong:

```sql
UPDATE public.magnet_breakdowns
SET client_background_color = NULL,
    client_text_color       = NULL,
    client_accent_color     = NULL,
    client_brand_color      = NULL
WHERE client_background_color IS NULL
   OR client_text_color IS NULL
   OR client_brand_color IS NULL
   OR client_brand_color ILIKE '#ffffff'
   OR client_background_color ILIKE '#ffffff';
```

Then trigger `enrich-magnet` for the idea2result submission so the new extractor populates correct values.

## 6. Quick sanity test

Add a tiny Deno test fixture that feeds the extractor the actual idea2result CSS snippet captured above and asserts:
- `backgroundColor === "#0a0a0a"` (4% lightness)
- `textColor === "#ffffff"`
- `accentColor === "#ff0000"`

Catches regressions if anyone simplifies the extractor later.

---

# Files touched

- `supabase/functions/_shared/extract-branding.ts` — HSL parsing, CSS var resolution, layered background detection.
- `src/lib/clientTheme.ts` — contrast guard + dark-derivation of muted/border/surface.
- `src/components/magnet/MagnetShell.tsx` — `data-ms-dark` flag.
- `src/styles/microsite-theme.css` — dark-mode rule block.
- New migration: nullify mis-extracted branding rows.
- New test: `supabase/functions/_shared/extract-branding.test.ts`.

After approval, the idea2result microsite will render with a near-black background, white body text, and red accents — matching their actual brand.