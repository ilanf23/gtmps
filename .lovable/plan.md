# Microsite Fix Pass — V10 Hardening

Six surgical fixes to the post-CTA microsite. No structural rewrites.

---

## Fix 1 — Kill Fabricated Logos Permanently

**Root cause found:**
- `src/components/magnet/MagnetShell.tsx` (lines 103–177) renders whatever `theme.companyName` and `theme.logoUrl` come back from extraction. When the extractor misreads the page (e.g. a hosted Griffith Foods asset, or when the prospect *is* Mabbly), it dumps the wrong wordmark plus a hardcoded `× Mabbly` chip — that's the source of the "MABBLY × MABBLY" duplicate and stray third-party names.
- The Section 6 "verified-only" strip in `src/components/magnet/v10/WhyResearchMatters.tsx` is already a hardcoded constant `["Madcraft", "Calliope", "SPR", "AArete"]` — that one is safe.

**Changes:**
1. **`MagnetShell.tsx`** — Add hardcoded duplicate guard:
   - If `theme.companyName?.toLowerCase().includes("mabbly")` → suppress the `× Mabbly` chip entirely (no self-pairing).
   - Add a `KNOWN_BAD_COMPANY_NAMES` block list (case-insensitive: "griffith foods", "griffith", "untitled", "image"). If the extracted name matches → render the neutral "Mabbly · GTM" fallback instead.
   - Remove the `× Mabbly` chip when no logo file (logo-less fallback no longer pairs).
2. **`WhyResearchMatters.tsx`** — Convert `VERIFIED_CLIENTS` to a frozen const + add a runtime `Object.freeze` and a code comment marking it as the only allowed list. Strip any future prop-driven override path (none exists today, lock it in).
3. **No new logo wall is added anywhere.** Logo strip remains text-only (no image files exist for these firms).

**Test:** Page source for `/m/:slug` must return zero matches for `Griffith` and `MABBLY × MABBLY`.

---

## Fix 2 — Brand Palette Quality Threshold + Mabbly Anchors

**A. Quality threshold in `src/lib/clientTheme.ts`**

Extend `buildClientTheme()` with a guard. If extracted accent fails any check → fall back to `MABBLY_DEFAULTS.accent` (#B8933A) and log the reason via `console.warn("[brand-fallback]", reason, slug)`:

- WCAG contrast ratio of accent vs. background < 4.5 → fallback.
- Accent equals background (or near-identical, ΔE < 10) → fallback.
- Accent is pure white/black/grayscale (saturation < 5%) → fallback.

(We don't have "5 distinct colors" or "0.7 confidence" exposed from the extractor — these gates approximate the same intent using what the row already gives us.)

**B. Mabbly anchors locked across all v10 sections**

Introduce `src/lib/mabblyAnchors.ts` exporting:
```ts
export const MABBLY_GOLD = "#B8933A";
export const MABBLY_DARK = "#1C1008";
export const MABBLY_CREAM = "#F5EFE0";
```

Replace `style={{ color: primary }}` / `backgroundColor: primary` with `MABBLY_GOLD` in these specific places ONLY (everything else continues to use the firm's extracted `primary`):

- All eyebrow tags (`01 ·`, `02 ·`, … `11 ·`) — sections 1–11.
- All eyebrow hairline `<span className="h-px w-6">` rules.
- Manuscript pull quote `border-t` rules in `PersonalizedHeader`, `HighestLeverageMove`, `ManuscriptShareSave`.
- `ValueInTheirWords` Adam-anchor circle border.
- `MagnetShell` "× Mabbly" / "Mabbly · GTM" wordmark color.

The firm's `primary` keeps coloring: hero firm-name highlight, CTA buttons, orbit accent dots, share/save buttons, primary section H2 accents.

---

## Fix 3 — Section Progress Navigation

Reuse `src/components/discover/SectionRail.tsx` (already gated on `#hero` + `[data-page-footer]`).

**Changes:**
1. Mount `<SectionRail items={…} />` from `MagnetBreakdown.tsx` with the 11 v10 section ids and short labels:
   - `v10-section-1` "Profile", `…2` "Orbits", `…3` "Core", `…4` "Proof", `…5` "Skip ahead", `…6` "Research", `…7` "Voices", `…8` "Book Adam", `…9` "Leverage", `…10` "Deeper", `…11` "Share".
2. Update `SectionRail` gating to also accept `#v10-section-1` (the microsite has no `#hero` id) — extend the existing observer to watch *either* selector. Also accept `[data-v10-section="11"]` as the bottom-gate anchor (Section 11 is full Share+Save) so the rail hides when bottom-share is visible per the spec.
3. **Mobile bottom progress bar:** Add a new component `src/components/magnet/v10/MobileProgressBar.tsx` — fixed bottom, 3px tall, full width, gold fill (#B8933A) bound to `window.scrollY / scrollHeight`. Visible only `< 1024px`, hidden when `[data-v10-section="11"]` is in view.

---

## Fix 4 — Sticky Share Button (FAB)

New component `src/components/magnet/v10/StickyShareFab.tsx`.

- Fixed `bottom-6 right-6`, 56px desktop / 48px mobile, gold border + share icon.
- Visible after user scrolls past `#v10-section-2` (IntersectionObserver on the section).
- Hidden when `#v10-section-11` is in view (same observer pattern).
- Click → opens the same share modal logic in `ManuscriptShareSave`. Easiest path: lift the share/save dialog state out of `ManuscriptShareSave` into `MagnetBreakdown` (or use a tiny Zustand-free global via a custom event `window.dispatchEvent(new CustomEvent("v10:open-share"))` that both components listen to).
- Selected approach: shared state in `MagnetBreakdown` — pass `onOpenShare` to both the FAB and `ManuscriptShareSave`, and lift the dialog rendering up so the FAB and Section 11 button both open the same `Dialog`.

---

## Fix 5 — Verify V10 Elements Live

Audit confirmed (already shipped):
1. Section 5 compact CTA card with "Skip ahead. Book Adam now." + smooth scroll to Section 8 ✓ (`CompactCtaCard.tsx`)
2. Section 6 Why This Research Matters: 30 firms, Copulsky, Kellogg ✓ (`WhyResearchMatters.tsx`)
3. Section 7 Value in Their Words: Madcraft, Calliope, SPR + Adam anchor ✓ (`ValueInTheirWords.tsx`)
4. Section 8 Full CTA + score-adaptive headline + variant copy A/B/C/D + Calendly + microline ✓ (`FullCtaSection.tsx`)
5. Vertical context flow: `useVerticalFlow(vertical)` wired through; `?vertical=law` propagates and updates eyebrow/calendar CTA/email subject ✓ (`MagnetBreakdown.tsx` + `MagnetSite.tsx`)

No work needed on this fix — confirming green.

---

## Fix 6 — Typography Discipline

Add a global override in `src/styles/microsite-theme.css` (already loaded by `MagnetShell` via `data-ms-themed` attribute):

```css
[data-ms-themed] [data-v10-section] h1,
[data-ms-themed] [data-v10-section] h2,
[data-ms-themed] [data-v10-section] h3,
[data-ms-themed] [data-v10-section] blockquote {
  font-family: 'Cormorant Garamond', Georgia, serif !important;
}
[data-ms-themed] [data-v10-section] p,
[data-ms-themed] [data-v10-section] li,
[data-ms-themed] [data-v10-section] button {
  font-family: 'Inter Tight', system-ui, sans-serif;
}
[data-ms-themed] [data-v10-section] [class*="uppercase"][class*="tracking-"] {
  font-family: 'DM Mono', ui-monospace, monospace;
}
```

This locks fonts even if `useGoogleFont(theme.fontFamily)` injects an extracted family — the extracted font is applied to body/UI chrome via `--ms-font` only, never overrides editorial type.

---

## Files to Add

- `src/lib/mabblyAnchors.ts` — locked color constants.
- `src/components/magnet/v10/MobileProgressBar.tsx` — bottom scroll progress bar.
- `src/components/magnet/v10/StickyShareFab.tsx` — bottom-right floating share button.

## Files to Edit

- `src/components/magnet/MagnetShell.tsx` — duplicate-name guard, suppress self-pairing `× Mabbly`, lock wordmark to MABBLY_GOLD.
- `src/components/magnet/v10/WhyResearchMatters.tsx` — frozen verified list.
- `src/lib/clientTheme.ts` — palette quality threshold + fallback logging.
- `src/components/discover/SectionRail.tsx` — accept `v10-section-1` as the hero gate, accept `[data-v10-section="11"]` as the footer gate.
- `src/components/magnet/MagnetBreakdown.tsx` — mount SectionRail with 11 items, mount StickyShareFab + MobileProgressBar, lift share dialog state.
- `src/components/magnet/v10/PersonalizedHeader.tsx`, `FiveOrbitsViz.tsx`, `CoreAnalysisSection.tsx`, `ProofAnalysisSection.tsx`, `CompactCtaCard.tsx`, `WhyResearchMatters.tsx`, `ValueInTheirWords.tsx`, `FullCtaSection.tsx`, `HighestLeverageMove.tsx`, `DeeperFindings.tsx`, `ManuscriptShareSave.tsx` — swap eyebrow + manuscript-border colors from `primary` to `MABBLY_GOLD`. Keep `primary` for everything else.
- `src/styles/microsite-theme.css` — typography lock for v10 sections.

## Test Checklist

1. View source on `/m/:slug` → zero `Griffith`, zero `MABBLY × MABBLY`.
2. Section 6 strip shows only Madcraft / Calliope / SPR / AArete.
3. Desktop ≥ 1024px: 11-dot left rail visible from Section 2 onward, hidden on Section 1 and Section 11.
4. Mobile < 1024px: 3px gold bottom progress bar replaces rail.
5. Sticky share FAB appears after scrolling past Section 2; hides when Section 11 in viewport. Opens same dialog as Section 11 share button.
6. All 11 eyebrows render in #B8933A regardless of extracted brand color.
7. Manuscript quote borders use #B8933A.
8. Test 3 prospect URLs (a law firm, an MSP, an agency): each gets a distinct primary color; eyebrows + Mabbly wordmark stay gold.
9. Confirm vertical flow: `?vertical=law` shows law-specific calendar CTA in Section 8 eyebrow + email subject in Section 11.
10. Mobile 375px: no horizontal overflow, FAB doesn't obscure text, bottom progress bar doesn't overlap Section 8 CTA.
