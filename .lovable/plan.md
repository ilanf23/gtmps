## Diagnosis

Branding extraction is working correctly. The DB confirms it:

| Slug | Accent | Background | Text | Font | Logo |
|---|---|---|---|---|---|
| Maverich | `#f5a623` orange | `#ffffff` | `#000000` | Inter | ✅ |
| Idea2Result | `#dc2626` red | `#ffffff` | `#9ca3af` | Inter | ✅ |

The problem is **the microsite components don't actually consume these tokens**. Only ~4 hex strings are remapped via CSS in `microsite-theme.css`, but `MagnetBreakdown.tsx`, `FeedbackForm.tsx`, `BookChat.tsx`, `BookReader.tsx`, and `MagnetChat.tsx` use:

- **Opacity variants** (`bg-[#B8933A]/15`, `border-[#B8933A]/30`, `text-[#B8933A]/40`) — not remapped
- **Black-based utilities** (`bg-black/5`, `border-black/10`, `text-black/20`) — not remapped, so they stay neutral grey instead of becoming tinted by the client's text color
- **Their own wrapper bg** (`bg-[#FBF8F4]`) inside the shell that fights the shell's themed wrapper
- **Font family** is set on the shell's outer div but Tailwind's `font-*` defaults on inner elements override it
- **Logo** is shown only as a tiny mark next to "Mabbly · GTM" in the nav — not prominently

Net result: Maverich's microsite *should* be orange/white/black with Inter, but it still reads as warm cream/gold because most of the inner UI uses unmapped colors.

## The fix: 3 layers

### 1. Replace hex literals with CSS variables in microsite components

Refactor these files to use `var(--ms-accent)`, `var(--ms-bg)`, `var(--ms-text)`, `var(--ms-surface)`, `var(--ms-border)` directly via inline styles or a small set of utility classes — instead of hardcoded `#B8933A`, `#FBF8F4`, `#1C1008`, `#120D05`, `bg-black/5`, etc.

Files to refactor:
- `src/components/magnet/MagnetBreakdown.tsx` (24 hex usages + many `bg-black/*`)
- `src/components/magnet/FeedbackForm.tsx` (16 hex usages)
- `src/components/magnet/BookChat.tsx` (10 hex usages)
- `src/components/magnet/BookReader.tsx` (10 hex usages)
- `src/components/magnet/MagnetChat.tsx` (14 hex usages)
- `src/components/magnet/MagnetLoadingScene.tsx` (already uses CSS vars in SVG, but final wrapper text still hardcoded — fix)

Strategy: introduce a small set of theme-aware utility classes in `microsite-theme.css`:
```
.ms-text { color: var(--ms-text); }
.ms-text-muted { color: var(--ms-text-muted); }
.ms-text-accent { color: var(--ms-accent); }
.ms-bg { background-color: var(--ms-bg); }
.ms-surface { background-color: var(--ms-surface); }
.ms-accent-bg { background-color: var(--ms-accent); color: var(--ms-accent-fg); }
.ms-border { border-color: var(--ms-border); }
.ms-border-accent { border-color: var(--ms-accent); }
```
Then replace `text-[#B8933A]` → `ms-text-accent`, `bg-black/5` → `ms-surface`, `border-black/10` → `ms-border`, etc. Reads identical when no theme is set (defaults preserved).

### 2. Apply the client font to ALL microsite content

Currently `themeStyle()` sets `fontFamily` on the outer wrapper, but Tailwind's `font-display`/`font-sans` inside resets it. Fix:

- In `MagnetShell.tsx`, when `theme.fontFamily` is set, inject a `<style>` tag scoped to the shell wrapper that overrides Tailwind's body/heading fonts to the client font (with a graceful fallback)
- For Google Fonts, also inject a `<link rel="stylesheet">` to actually load the font — extraction already detects `fonts.googleapis.com` links, so we know the family is hosted there
- Update extractor to also store the **Google Fonts URL** when found, not just the family name

### 3. Show the client logo prominently

Currently the logo is a 24px mark in the nav. Change to:

- **Nav**: Replace "Mabbly · GTM" with the client logo at h-7, with a hairline divider, then a small "Powered by Mabbly" mark on the right side of the nav (so it stays Mabbly-credentialed but client-first)
- **Breakdown hero**: Add the client logo above the welcome message at h-10 to anchor the page in client brand

### 4. Backfill existing microsites

After the refactor, no DB change needed for existing microsites — they already have branding stored. They will re-skin automatically on next page load.

### 5. Verify against Maverich and Idea2Result

After the refactor, load `/m/ilan_daqqws4q7l` (Maverich) and confirm:
- Orange (`#f5a623`) replaces every gold accent (buttons, dividers, callouts, chat bubbles)
- White bg replaces cream
- Black text replaces brown
- Inter font on all headings and body
- Maverich logo visible in nav and hero
- Loading scene compass + orbits render in orange-on-white

Then load `/m/ilan_ycumtrcpmh` (Idea2Result) and confirm the same in red/white.

## Out of scope

- Not changing the breakdown content/structure
- Not changing the loading animation choreography (already redesigned)
- Not touching the Pepper/SPR/LaunchPad standalone microsites — those have their own fixed designs
