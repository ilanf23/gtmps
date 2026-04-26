## Problem

In the Impact Model section of `/m/:slug`, the middle metric card — **YOUR DEAD ZONE VALUE** — currently renders as a light/tinted slab with a colored border (red on Idea2Result, gold on Mabbly default). Surrounded by the near‑black section background, it visually "pops out" of the row of three cards instead of feeling like a cohesive trio.

The user wants this middle card to share the same background as the surrounding section (i.e. transparent / matching the dark wrapper), so the three metric cards (Dormant Contacts / Dead Zone Value / Cost to Replace) read as a unified set.

## Root cause

`src/components/magnet/MagnetImpactModel.tsx` line 132:

```tsx
<div className="border-[#B8933A]/40 bg-[#B8933A]/5 border p-5">
```

- `bg-[#B8933A]/5` paints a 5% accent‑tinted fill on top of the dark section. On the Mabbly cream theme this is barely visible; on Idea2Result's `#0a0a0a` background with red accent, it reads as a noticeably lighter rectangle.
- The other two cards use `bg-white/5 border border-white/10` (line 46, `cardClass`) which is a near‑invisible neutral wash that recedes into the dark section.

## Fix

In `src/components/magnet/MagnetImpactModel.tsx`, change the middle card (line 132) so its background matches the surrounding section while keeping the accent border + accent number that makes it the visual focal point.

**One‑line change:**

```tsx
// BEFORE (line 132)
<div className="border-[#B8933A]/40 bg-[#B8933A]/5 border p-5">

// AFTER
<div className="border-[#B8933A]/40 bg-transparent border p-5">
```

Why `bg-transparent` and not `bg-white/5` like the siblings:

- The surrounding wrapper in `MagnetBreakdown.tsx` is `bg-[#120D05]` (which the override sheet remaps to `var(--ms-accent-fg)` per client). Using `bg-transparent` lets that exact section background show through, guaranteeing a perfect match on every brand — Idea2Result's near‑black, SPR's warm cream variant, Mabbly default, etc.
- We keep the accent border and the accent‑colored dollar amount so the card still reads as the centerpiece of the three; only the fill changes.

## Files changed

- **`src/components/magnet/MagnetImpactModel.tsx`** — single class change on line 132 (`bg-[#B8933A]/5` → `bg-transparent`).

## What this restores

- The three metric cards in the Impact Model section now share the same background, with the middle card distinguished only by its accent border + accent‑colored value (clean visual hierarchy without the "popped out" slab effect).
- Works across every client brand because it inherits the section background rather than layering a tint on top of it.
- No other changes — sliders, formula multiplier section, stat chips, and case studies are untouched.

---

### Bonus (optional, ask before applying)

If the user later wants the **WITH THE FORMULA** card (line 184) to match the same treatment (it currently uses `bg-[#B8933A]/10`, a stronger version of the same tint), we'd apply the identical fix there. Not changing it for now — that card is in a 2‑up grid with a clearly muted "WITHOUT" sibling, so the contrast reads as intentional rather than out of place. Mention it if you want it changed too.
