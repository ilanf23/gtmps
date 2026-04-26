## Goal
Make every `/m/[slug]` microsite visually feel like it was designed for that specific firm by applying a 5-color brand palette (primary, background, surface, text, textMuted) extracted from the firm's website and refined by GPT.

## Current state
- `supabase/functions/_shared/extract-branding.ts` already extracts hex/rgb/hsl color candidates, ranks them, and returns `accentColor`, `backgroundColor`, `textColor`, `fontFamily`, plus `raw.candidateColors[]`. This runs in `enrich-magnet/index.ts` and is stored in `magnet_breakdowns` columns (`client_brand_color`, `client_accent_color`, `client_background_color`, `client_text_color`, `client_font_family`, `client_brand_profile`).
- The breakdown RPC `get_magnet_breakdown_by_slug` already returns these columns.
- However, `MagnetBreakdown.tsx` only reads `client_logo_url` and `client_company_name` — it ignores all color fields and renders with the hardcoded cream/gold Mabbly palette (`#FBF8F4`, `#1C1008`, `#B8933A`).
- `MagnetImpactModel.tsx` is also fully hardcoded.

## Plan

### Part 1 — Edge function: have GPT refine candidates into a 5-key palette

`supabase/functions/enrich-magnet/index.ts`

1. We already have `branding.raw.candidateColors` (top scored candidates) from the existing `extractBrandProfile()` call. **Reuse those** rather than re-fetching raw HTML — this avoids a duplicate fetch, respects the careful HSL/CSS-var parsing already in `extract-branding.ts`, and keeps the rate-limiting friendly to firms' sites.
2. Inject the candidates into the user message so the AI can pick:
   ```
   === COLOR CANDIDATES EXTRACTED FROM WEBSITE ===
   <comma-separated hexes from branding.raw.candidateColors, or "none found">
   Heuristic primary so far: <branding.accentColor or "none">
   Heuristic background: <branding.backgroundColor or "none">
   === END COLOR CANDIDATES ===
   ```
3. Append a `BRANDING EXTRACTION` block to `SYSTEM_PROMPT` (after the COPY FORMULAS section, before "Return ONLY valid JSON") spelling out the selection rules and per-vertical inference fallback (consulting=navy, creative=vibrant, legal=dark gold, tech=blue, financial=green) exactly as the user specified.
4. Update the JSON schema instruction to require a `branding` object with the 5 hex keys: `primary`, `background`, `surface`, `text`, `textMuted`.
5. After parsing the AI response, validate each branding hex with `/^#[0-9a-fA-F]{6}$/`. Drop any malformed value (so the frontend default kicks in). Merge AI palette over the heuristic palette as fallback per-key:
   - `primary` ← AI.primary || branding.accentColor
   - `background` ← AI.background || branding.backgroundColor
   - `surface` ← AI.surface (no heuristic equivalent today)
   - `text` ← AI.text || branding.textColor
   - `textMuted` ← AI.textMuted
6. Persist the resulting palette inside the existing `client_brand_profile` JSONB column under a new `palette` key (e.g. `client_brand_profile.palette = { primary, background, surface, text, textMuted }`). No DB migration needed — `client_brand_profile` is already `jsonb`.

### Part 2 — Surface palette to the frontend

`get_magnet_breakdown_by_slug` already returns `client_brand_profile` — no migration needed. The frontend will read `data.client_brand_profile?.palette`.

`src/components/magnet/MagnetBreakdown.tsx`
1. Extend `BreakdownRow`:
   ```ts
   client_brand_profile?: {
     palette?: {
       primary?: string;
       background?: string;
       surface?: string;
       text?: string;
       textMuted?: string;
     } | null;
   } | null;
   ```
2. At the top of the render, derive a `brand` object with safe defaults that match today's look (so untouched / older submissions don't change visually):
   ```ts
   const p = data.client_brand_profile?.palette ?? {};
   const brand = {
     primary:    isHex(p.primary)    ? p.primary    : '#B8933A',  // current gold
     background: isHex(p.background) ? p.background : '#FBF8F4',  // current cream
     surface:    isHex(p.surface)    ? p.surface    : '#FFFFFF',
     text:       isHex(p.text)       ? p.text       : '#1C1008',
     textMuted:  isHex(p.textMuted)  ? p.textMuted  : '#1C1008',  // used at opacity
   };
   ```
   Use a small `isHex(v)` regex guard so malformed values fall through.

### Part 3 — Apply colors in `MagnetBreakdown.tsx`

3a. Move the outermost wrapper from `bg-[#FBF8F4] text-[#1C1008]` to inline style + CSS variables on the root div:
```tsx
<div
  style={{
    '--brand-primary': brand.primary,
    '--brand-bg': brand.background,
    '--brand-surface': brand.surface,
    '--brand-text': brand.text,
    '--brand-text-muted': brand.textMuted,
    backgroundColor: brand.background,
    color: brand.text,
  } as React.CSSProperties}
  className="min-h-screen"
>
```

3b. Targeted inline-style additions (keep existing Tailwind classes for layout/spacing — only override colors):
- **All gold accent rules / labels** (`bg-[#B8933A]` rule, `text-[#B8933A]` labels): add `style={{ backgroundColor: brand.primary }}` / `style={{ color: brand.primary }}`.
- **Section headings (`h1`, `h2`)**: add `style={{ color: brand.primary }}` for the firm-name H1 and the orange-accent H2 within sections (currently relying on inherited `text-[#1C1008]`). Per spec, brand primary on headings.
- **Snapshot strip cards** (the 3-column firm/layer/sections block) and other `bg-[#FBF8F4]` panels (orbit cards, action cards, manuscript stat strip): inline `style={{ backgroundColor: brand.surface }}` so they sit slightly above `brand.background`.
- **Formula "Observed" card** (`bg-black/[0.04]`): inline `style={{ backgroundColor: brand.primary + '0D' }}` (~5% tint) so it stays subtle but takes the brand hue.
- **Formula "Assessment" card** (`bg-[#B8933A]/10 border-[#B8933A]/30`): `style={{ backgroundColor: brand.primary + '1A', borderColor: brand.primary + '4D' }}` and the inner left bar `style={{ backgroundColor: brand.primary }}`.
- **Orbit symbol badges** (the `⊙01`–`⊙05` chips): `style={{ backgroundColor: brand.primary + '26', color: brand.primary, borderColor: brand.primary + '4D' }}`.
- **Layer progression** active pill, "Why X first" callout box, "WALK THROUGH IT" outline button, manuscript callout cards (border + ✦ icon + left rule): all switch from `#B8933A` references to `brand.primary` via inline style.
- **Section dividers** (`border-b border-black/10`): unchanged — they read fine on light or dark backgrounds.
- **Primary CTA** ("Map Your Activation Sequence →") at the bottom: `style={{ backgroundColor: brand.primary, color: '#FFFFFF' }}` and remove the hardcoded `bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05]` color classes (keep layout classes).
- **Section 8 wrapper**: currently uses `text-[#FBF8F4]` against transparent (broken in light mode but pre-existing). Switch to `style={{ color: brand.text }}` so it reads against the brand background.
- **Loading + error fallback states** (lines 204–223): also switch from hardcoded cream/ink to `brand.background` / `brand.text` — but only when `data` is loaded. Pre-load they default to the current cream palette since `brand` isn't computed yet.

### Part 4 — `MagnetImpactModel.tsx`

1. Add `primaryColor?: string` to `MagnetImpactModelProps` (default `'#B8933A'`).
2. Replace the hardcoded `#B8933A` references with `primaryColor` via inline styles for: section labels, dormant card label, Dead Zone card border + value, Formula multiplier "WITH" card border + value + label, multiplier text, and the gold `h-2 bg-[#B8933A]` bar fill.
3. The neutral cards (`bg-black/[0.03]`, `border-black/10`) stay as they are — they read against any background that has enough contrast. 
4. From `MagnetBreakdown.tsx`, pass `primaryColor={brand.primary}` to `<MagnetImpactModel ... />`.

### Part 5 — Defensive guards

- `isHex()` validator drops any malformed AI output silently.
- All `?? defaults` keep the existing Mabbly palette intact when `branding.palette` is absent (every existing `/m/[slug]` row continues to render unchanged).
- The accent-opacity tints use 8-digit hex (`brand.primary + '1A'`) so any browser ignores them gracefully if `brand.primary` is malformed.

## Files touched
- `supabase/functions/enrich-magnet/index.ts` — add color candidates to user message, BRANDING block in system prompt, parse + validate `branding` object, persist into `client_brand_profile.palette`.
- `src/components/magnet/MagnetBreakdown.tsx` — extend `BreakdownRow`, derive `brand`, apply CSS variables + targeted inline styles, pass `primaryColor` to impact model.
- `src/components/magnet/MagnetImpactModel.tsx` — accept and apply `primaryColor` prop.

## What is NOT changed
- No DB migration (palette piggybacks on existing `client_brand_profile` jsonb).
- No change to logo, font extraction, or company-name handling — already working.
- No change to `MagnetChat` (the chat now lives on a dedicated `/m/:slug/chat` page per the existing comment, not as a floating bubble in this component).
- No change to scoring or extraction in `extract-branding.ts` — only consumed.
- No change to validation or routing of the `/m/[slug]` page itself.