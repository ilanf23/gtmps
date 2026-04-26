## Problem

The Idea2Result microsite at `/m/ilan_920u38vzdk` is rendering with the **Mabbly defaults** (cream `#FBF8F4` background, gold `#B8933A` accent) instead of the client's branding (near‑black `#0a0a0a` background, red `#ff0000` accent).

### Root cause

I confirmed the database has the correct branding stored for this slug:

| field | value |
|---|---|
| `client_company_name` | `Idea2Result` |
| `client_background_color` | `#0a0a0a` |
| `client_accent_color` | `#ff0000` |
| `client_text_color` | `#ffffff` |
| `client_font_family` | `Inter` |

…and `get_magnet_breakdown_by_slug('ilan_920u38vzdk')` returns the row correctly. So the back‑end and the override CSS sheet (`src/styles/microsite-theme.css`) are fine.

The bug lives in the theme cache I added to `src/hooks/useClientTheme.ts` to fix the previous "1‑second flash" issue. The cache is too eager:

```ts
const next = buildClientTheme(row as unknown as RawBranding);
themeCache.set(slug, next);   // ← caches *whatever* came back
setTheme(next);
```

`buildClientTheme` falls back silently to `MABBLY_DEFAULTS` for any field that is null. So if the hook fetches the row at a moment when branding columns are still null (e.g. right after submission, or after an AI error path that wrote a partial row without the branding upsert), it stores `MABBLY_DEFAULTS` in the cache — and the cache is keyed by slug and never invalidated for the lifetime of the SPA session. After enrichment finishes and the branding columns are populated, **subsequent visits within the same session keep serving the stale defaults** because of the early `if (themeCache.has(slug)) return;` short‑circuit.

### Secondary cosmetic bug (same component)

`MagnetBreakdown.tsx` line 357 wraps the Impact Model section in `bg-[#120D05]` (Mabbly's near‑black accent foreground). This class is **not** in the override sheet — only the matching `text-[#120D05]` is. On Idea2Result's already‑near‑black page background, this hardcoded slab disappears into the surroundings; on a light brand it would be a jarring dark band.

---

## Fix

### 1. Stop caching default themes — `src/hooks/useClientTheme.ts`

- Treat the row as "branded" only when at least one of `client_brand_color`, `client_accent_color`, `client_background_color`, `client_text_color`, `client_logo_url`, `client_font_family`, or `client_company_name` is non‑null.
- Only insert into `themeCache` when that test passes.
- When a cached entry exists, still apply it synchronously (preserves the no‑flash behaviour) — but if the cached value is the defaults sentinel, do a re‑fetch in the background on every mount so a later‑arriving branding row eventually wins.
- Always re‑fetch in the background even on a cache hit, but only update state + cache when the new value actually differs from what's already shown (cheap shallow compare on accent + background + companyName + logoUrl). This guarantees that once branding lands in the DB, every navigation reflects it within one round‑trip without ever flashing.

### 2. Remap the one missing utility — `src/styles/microsite-theme.css`

Add the bg form of the accent‑foreground token so the Impact Model wrapper and any future use of the same class re‑skins to the client palette:

```css
& .bg-\[\#120D05\]  { background-color: var(--ms-accent-fg) !important; }
```

This is consistent with how `text-[#120D05]` is already remapped to `var(--ms-accent-fg)` and gives the dark slab in Section 4 the right "inverted accent" surface across both warm and dark brands.

### 3. Drop the now-redundant inline override in `MagnetBreakdown.tsx`

Replace `bg-[#120D05]` on line 357 with a token‑driven utility that the existing override sheet already handles (no further class additions needed). The inner `MagnetImpactModel` already paints itself with `text-[#B8933A]` accents that map correctly.

---

## Files changed

- **`src/hooks/useClientTheme.ts`** — never cache the defaults; background re‑fetch on every mount with cheap diff.
- **`src/styles/microsite-theme.css`** — add `bg-[#120D05]` → `var(--ms-accent-fg)` remap.
- *(no behavioural change to)* `src/components/magnet/MagnetBreakdown.tsx` — same wrapper class, just now properly themed by the override sheet above.

## What this restores

- `/m/ilan_920u38vzdk` and every other branded microsite render with the client's extracted background, text, accent and font on the very first paint (cache hit) **and** correct themselves in‑place if branding lands later in the same session (background refetch).
- Unbranded slugs still fall back to the Mabbly warm‑editorial defaults (no regression on `/discover`, `/book`, or any pre‑enrichment loading state).
- No flash of orange/beige before the dark theme reapplies — the original "1 second delay" fix is preserved because cache hits still apply synchronously.
