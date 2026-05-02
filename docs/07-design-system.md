# Discover Mabbly Design System

> **Source of truth.** Extracted from [mabbly.com](https://mabbly.com) on **March 29, 2026** (production CSS). This is the single source of truth for all content, slides, social, and collateral across `mabbly.com`, `mabbly.ai`, and `discover.mabbly.com`.
>
> Today's `discover.mabbly.com` palette and typography do **not yet** match this spec. See [§7 Implementation in `discover.mabbly.com`](#7-implementation-in-discovermabblycom--migration-map-and-instructions) for the migration map and the phased rollout plan.

---

## Table of contents

1. [Color palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Visual language](#3-visual-language)
4. [Application: LinkedIn carousel slides](#4-application-linkedin-carousel-slides)
5. [Application: social media](#5-application-social-media)
6. [Brand guardrails](#6-brand-guardrails)
7. [Implementation in `discover.mabbly.com` — migration map and instructions](#7-implementation-in-discovermabblycom--migration-map-and-instructions)
8. [Verification + sign-off checklist](#8-verification--sign-off-checklist)

---

## 1. Color palette

### 1.1 Primary colors

| Role | Name | Hex | RGB | Usage |
| --- | --- | --- | --- | --- |
| Dark Primary | Deep Forest | `#0F1E1D` | 15, 30, 29 | Hero backgrounds, dark sections, primary text on light |
| Light Primary | Sage Light | `#EDF5EC` | 237, 245, 236 | Page backgrounds, light text on dark, primary light surface |
| Accent Primary | Burnt Orange | `#BF461A` | 191, 70, 26 | CTAs, links, accent highlights, interactive elements |

### 1.2 Secondary colors

| Role | Name | Hex | RGB | Usage |
| --- | --- | --- | --- | --- |
| Secondary Dark | Dark Rust | `#803402` | 128, 52, 2 | H3 subheadings, secondary accent, hover states |
| Secondary Light | Sage Medium | `#D5DED4` | 213, 222, 212 | Borders, dividers, secondary backgrounds, subtle cards |
| Highlight | Gold | `#FFBA1A` | 255, 186, 26 | Emphasis, labels, stat callouts, badge accents |
| Dark Gold | Amber | `#A79014` | 167, 144, 20 | Muted gold, secondary labels |
| Teal Accent | Forest Teal | `#225351` | 34, 83, 81 | Section accents, data viz secondary |
| Muted Text | Sage Muted | `#A1A9A0` | 161, 169, 160 | Captions, footnotes, helper text |
| Off White | Warm White | `#FAF9F5` | 250, 249, 245 | Alternate light backgrounds |
| Near Black | Charcoal | `#141413` | 20, 20, 19 | Alternate dark, footer |

### 1.3 Extended palette (waitlist / product)

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| CTA Purple | Deep Purple | `#491D89` | Waitlist CTA, product pages, feature highlights |
| Alert Red | Signal Red | `#C02B0A` | Error states, urgency, validation |

---

## 2. Typography

### 2.1 Font families

- **Primary:** Mabbly Repro (custom). Fallback stack: `Verdana, Helvetica, sans-serif`.
- **Monospace:** Mabbly Repro Mono (custom). Fallback stack: `'Trebuchet MS', monospace`.

**Slide / document substitutes** (when Mabbly Repro is unavailable):
- Headings: **Arial Black** — matches the 900 / uppercase style.
- Body: **Calibri** — clean, neutral sans-serif.
- Alternate heading: **Trebuchet MS Bold**.

### 2.2 Type scale and styles

| Element | Weight | Transform | Notes |
| --- | --- | --- | --- |
| H1 (Hero) | 900 (Black) | UPPERCASE | Massive scale, editorial impact |
| H2 (Section) | 900 (Black) | UPPERCASE | Section headers |
| H3 (Subheading) | 900 (Black) | UPPERCASE | Color: Dark Rust `#803402` |
| H4 (Supporting) | 400 (Regular) | None | Softer complement to heavy headings |
| Body | 400 (Regular) | None | Color: Deep Forest `#0F1E1D` |
| Caption / Muted | 400 (Regular) | None | Color: Sage Muted `#A1A9A0` |

### 2.3 Key typography rules

- Headings are **always heavy (900) and uppercase**. This is the most distinctive visual signature of the brand.
- Body is **light (400) and sentence case**. The contrast against headlines is the brand.
- **Never** use medium weights (500 / 600) for headings.
- The tension between 900 and 400 is the brand. Don't soften it.

---

## 3. Visual language

### 3.1 Backgrounds

- Dark sections: Deep Forest `#0F1E1D` ground / Sage Light `#EDF5EC` text.
- Light sections: Sage Light `#EDF5EC` ground / Deep Forest `#0F1E1D` text.
- Alternate light sections: Warm White `#FAF9F5`.
- Cards on dark backgrounds: a slightly lighter forest tone — approximately `#1A2B2A` — or subtle transparency over Deep Forest.

#### 3.1.1 Alt-light page with Sage Light cards

Where a section anchors a *grouped index* (e.g. the homepage industry grid), invert the default surface stack: page band uses **Warm White `#FAF9F5`** as the ground, and the cards inside use **Sage Light `#EDF5EC`** as the lifted tile. Card text stays Deep Forest `#0F1E1D`; card border tint stays Olive Gold (`rgba(168, 146, 58, 0.18)`).

**When to use:** the section is structurally a directory or chooser (8+ peer items the reader scans laterally) AND nothing else on the page uses the same Warm White ground in the same scroll region. Avoid in editorial sections where the cream-on-cream subtlety drains energy.

**First implementation:** `src/components/discover/IndustryGrid.tsx` (the "Find Your Industry" section on `/discover`).

### 3.2 Buttons and CTAs

- **Primary CTA:** Burnt Orange `#BF461A` background, Sage Light `#EDF5EC` text.
- **Border radius:** 25 px (pill-shaped).
- **Text transform:** UPPERCASE.
- **Secondary CTA:** transparent background with a 1 px border, text colored to match the surface.

### 3.3 Brand personality

The visual identity is **organic, grounded, and premium**. Sage greens and deep forest tones evoke trust and growth. Burnt orange supplies energy without aggression. Gold accents signal value and confidence.

The reference register is *a high-end editorial magazine for business leaders*, **not** a SaaS dashboard. **Monocle meets McKinsey.**

### 3.4 Visual content voice

- Clean, high contrast, generous breathing room.
- No clutter. No gradients. Flat, confident color blocks.
- Uppercase headings establish authority.
- Earth tones ground the message.
- Burnt orange draws the eye to what matters.

---

## 4. Application: LinkedIn carousel slides

| Slot | Token / value |
| --- | --- |
| Background | Deep Forest `#0F1E1D` |
| Primary text | Sage Light `#EDF5EC` |
| Section labels | Gold `#FFBA1A`, uppercase, tracked spacing |
| Accent bars | Burnt Orange `#BF461A` |
| Card backgrounds | `#1A2B2A` (slightly lighter forest) |
| CTA buttons | Burnt Orange `#BF461A` |
| Headings | Arial Black, uppercase |
| Body | Calibri |

Slide aspect: 1080 × 1350 (LinkedIn native carousel).

---

## 5. Application: social media

- Profile + banner colors: Deep Forest / Sage Light / Burnt Orange triad only.
- Text overlays on images: Deep Forest at **85% opacity** with Sage Light text.
- Hashtag and link color: Burnt Orange.
- **Never** use pure black `#000000` or pure white `#FFFFFF` in Mabbly-branded content. Use Deep Forest and Sage Light instead.

---

## 6. Brand guardrails

- The 900 / 400 weight tension is non-negotiable — no medium-weight headings.
- The accent (Burnt Orange) is the only color that should ever interrupt a Deep Forest / Sage Light field for an interactive element. Don't introduce alternative accents per surface.
- Gold (`#FFBA1A`) is for emphasis (labels, stats, badges) — not for primary CTAs.
- Dark Rust (`#803402`) is the only sanctioned color for H3 subheadings.
- Card surfaces on dark backgrounds may use `#1A2B2A` *or* transparency — don't introduce additional card tones.
- Pure black / pure white are forbidden in branded content.

---

## 7. Implementation in `discover.mabbly.com` — migration map and instructions

> **Status (2026-05-02):** the live `discover.mabbly.com` palette and typography do **not** match this spec. The site uses ink/gold/sage/rust/cream and Inter Tight / Cormorant Garamond / Instrument Sans / DM Mono. This section maps the gap and proposes a phased rollout. **No code change should be inferred from this doc alone** — migration is its own scoped initiative.

### 7.1 Where tokens live today

| Concern | File | Notes |
| --- | --- | --- |
| Tailwind brand colors | `tailwind.config.ts` (`theme.extend.colors`) | Defines `ink`, `gold`, `sage`, `rust`, `slate`, `cream`, `warm-white`, `soft-navy`, plus shadcn `sidebar` group and semantic `ds-*` groups bound to CSS vars. |
| CSS custom properties | `src/index.css` (`:root`, `[data-theme="dark"]`, `.dark`) | ~57 semantic tokens (`--color-surface-*`, `--color-text-*`, `--color-accent-*`, `--shadow-*`, `--duration-*`, `--easing-*`) plus brand-scoped vars (`--ink`, `--gold`, `--cream`, etc.). |
| Canonical TS tokens | `src/lib/tokens.ts` | Exports `brand`, `color`, `type`, `space`, `maxWidth`, `radius`, `shadow`, `motion`, `breakpoint`, `verticalPalette`. **This is the file to evolve toward this spec.** |
| Per-client dynamic theme | `src/lib/clientTheme.ts`, `src/hooks/useClientTheme.ts` | Emits `--brand-accent`, `--brand-bg`, `--brand-bg-fg`. Used by `MagnetShell`, `MagnetBreakdown`, `FiveOrbitsViz`, `MagnetSite`. |
| Font loading | `index.html` (Google Fonts link tag) | Loads Inter Tight / Cormorant Garamond / Instrument Sans / DM Mono. |

### 7.2 Token migration map (old → new)

| Today's token | Today's hex | Proposed mapping | New hex | Notes |
| --- | --- | --- | --- | --- |
| `ink` | `#0D1117` | Deep Forest | `#0F1E1D` | Replace as the dark primary. |
| `cream` (CSS var) | warm cream | Sage Light | `#EDF5EC` | New light primary. Warm White `#FAF9F5` becomes the alternate. |
| `gold` | `#B8933A` | **Split:** Burnt Orange (CTAs) + Gold (accent) | `#BF461A` / `#FFBA1A` | The old `gold` token did double duty (CTA + emphasis). The new system splits those — most live `gold` references (~350 hex, 68 Tailwind classes) point at CTAs and should become Burnt Orange; a smaller subset (stat callouts, badges) becomes the new Gold `#FFBA1A`. Audit per-usage during migration. |
| `rust` | `#8B3A2A` | Dark Rust | `#803402` | Re-tone slightly; re-purpose as the H3 subheading color per §2.2. |
| `sage` | `#3D5A4A` | Forest Teal *or* Sage Medium | `#225351` / `#D5DED4` | The old `sage` was a single mid-green; the new system has two roles (Forest Teal for accents, Sage Medium for borders/dividers). Disambiguate at migration time. |
| `slate` | `#5A6A7A` | Sage Muted | `#A1A9A0` | Demote to muted-text role only. |
| `warm-white` | `#FAF9F5` | Warm White | `#FAF9F5` | No change. |
| `soft-navy` | varies | (deprecate) | — | Not in the new palette. Either remove or keep behind a feature-flagged surface. |

### 7.3 Typography migration

- **Primary font:** Mabbly Repro is **custom and not currently loaded in the repo**. Until the font files are available:
  1. Document the intended `font-family` stack: `'Mabbly Repro', Verdana, Helvetica, sans-serif`.
  2. Keep the existing Google-loaded fonts as the visible default (Inter Tight is the closest substitute already present).
  3. When Mabbly Repro files arrive, add an `@font-face` block to `src/index.css` (under `@layer base`) and update the `--font-display` / `--font-sans` CSS vars + the Tailwind `fontFamily` entries.
- **Mono:** Mabbly Repro Mono → fallback `'Trebuchet MS', monospace`. DM Mono can stay until the custom mono lands.
- **Heading weight rule:** the spec demands 900 / UPPERCASE. The current site mixes Cormorant Garamond serif headings with sans heads in editorial blocks. Migration must:
  - Add an H1/H2/H3 style preset to `src/lib/tokens.ts` (`type.display`, `type.headline`, `type.title`) with `fontWeight: 900` and `textTransform: 'uppercase'`.
  - Audit `src/components/discover/` (31 components) and `src/components/magnet/v10/` (16 components) for Cormorant uses that should flip to the new heading style.
  - Cormorant Garamond may still earn a role in editorial pull-quotes, but it is **not** the primary heading face under the new spec.

### 7.4 Per-client theme integration

The Magnet flow extracts a per-firm accent color and emits `--brand-accent` / `--brand-bg` / `--brand-bg-fg`. After migration:
- The **default** for `--brand-accent` (when extraction fails) becomes Burnt Orange `#BF461A` instead of the current ink-derived fallback.
- Contrast validation in `src/lib/clientTheme.ts` should pin button text against Sage Light `#EDF5EC` or Deep Forest `#0F1E1D` rather than today's ink/cream.
- Per-vertical accent palettes in `src/lib/tokens.ts` (`verticalPalette`) need to be re-evaluated against the new brand spec — most should likely fold into the new accent rather than diverge.

### 7.5 Hex-literal codemod scope

A grep of `src/**/*.{ts,tsx,css}` turned up **1,585 inline hex literals**, with the top five being `#B8933A` (350×, old gold), `#C65D3E` (165×), `#1C1008` (145×), `#2D2A26` (130×), `#6B6560` (102×). Most of those should be replaced by token references (`var(--color-*)` or Tailwind classes). The migration should be codemod-driven, not hand-edited:
1. Build a mapping table of literal → semantic token.
2. Run `jscodeshift` or a Tailwind-class transform to swap `#B8933A` → the new accent-or-gold token based on context (CTA vs label).
3. Reserve one PR per phase (see §7.7) so review stays tractable.

### 7.6 File-by-file impact (high level)

The components most affected by the migration:
- `src/components/discover/` — `DiscoverHero`, `AuthorityStrip`, `FinalCta`, `Authors`, `BetaReader`, `WhyNow`, `WarStory`, `TheBook`, `FiveOrbitsDiagram`, `Faq`, etc. (31 total).
- `src/components/magnet/v10/` — `PersonalizedHeader`, `CompactCtaCard`, `FullCtaSection`, `FiveOrbitsViz`, `CoreAnalysisSection`, `DeeperFindings`, `HighestLeverageMove`, `ManuscriptShareSave`, `StickyShareFab`, etc. (16 total).
- `src/components/magnet/MagnetShell.tsx` — central per-client theming consumer.
- `src/components/microsite/` — shared `MicrositeShell` for `/pepper-group`, `/google`.
- `src/components/awards/`, `src/components/aletheia/`, `src/components/spr/`, `src/pages/Manuscript.tsx` — bespoke surfaces; each carries its own register that may legitimately diverge or fold in.

### 7.7 Phased rollout

| Phase | Scope | Effort | Owner-facing description |
| --- | --- | --- | --- |
| 0 — Doc lock | Land this file. Communicate the spec internally. | S | Doc only. No code changes. |
| 1 — Token foundation | Add new color names to `src/lib/tokens.ts` (alongside old ones, not replacing). Add new CSS vars under `:root` (e.g. `--color-accent-burnt-orange`, `--color-surface-deep-forest`). Add Tailwind aliases (e.g. `deep-forest`, `sage-light`, `burnt-orange`, `dark-rust`, `gold-highlight`). | S–M | New tokens become available; no visible change. |
| 2 — Font loading scaffold | When Mabbly Repro files land, add `@font-face` in `src/index.css`, update `--font-display` / `--font-sans` vars, update `tailwind.config.ts` `fontFamily` entries. While files are pending, document the intended stack in `src/lib/tokens.ts` comments and keep current fonts. | S (when fonts arrive) | Custom font loads; visible only after CSS-var swap. |
| 3 — Hero + CTA migration | `DiscoverHero`, `FinalCta`, `AuthorityStrip`, primary CTAs across `/`. Replace old `gold`-as-CTA with Burnt Orange. Apply 900 / uppercase to H1/H2. | M | First visible brand shift. |
| 4 — Remaining `discover/` surfaces | Walk the 31 components in `src/components/discover/`. Codemod hex literals; replace ad-hoc font sizes with `text-display` / `text-headline` / etc. tokens. | M–L | Homepage feels coherent under the new brand. |
| 5 — Magnet + microsite surfaces | `MagnetShell`, `MagnetBreakdown`, `FiveOrbitsViz`, `MicrositeShell`, per-client theme defaults. Re-tune per-client accent fallbacks against the new accent. | M–L | Per-firm pages align to the new brand without losing per-client accents. |
| 6 — Cleanup | Delete unused old tokens (`ink`, `gold` legacy, `slate`, `soft-navy` if deprecated) once all references are migrated. Update `docs/02-architecture.md` to reflect the new state. | S | Repo state matches the doc. |

### 7.8 Open questions for migration

- Are Mabbly Repro and Mabbly Repro Mono font files licensed for use on `discover.mabbly.com`? If yes, source path?
- Does Cormorant Garamond keep an editorial role (pull-quotes, manuscript page) or get fully retired?
- For the Magnet per-client flow: does the firm's extracted accent override Burnt Orange, or compose alongside it?
- Are vertical-specific palettes (`verticalPalette` in `src/lib/tokens.ts`) deprecated under the new brand?

These should be resolved before phase 1 ships.

---

## 8. Verification + sign-off checklist

Before declaring a Mabbly-branded surface "on spec," confirm all of:

- [ ] No pure `#000000` or `#FFFFFF` anywhere on the surface (or in exported assets).
- [ ] All H1/H2/H3 use weight 900, UPPERCASE.
- [ ] H3 specifically uses Dark Rust `#803402`.
- [ ] Body text is weight 400, sentence case, Deep Forest `#0F1E1D` on light surfaces / Sage Light `#EDF5EC` on dark.
- [ ] Primary CTA is Burnt Orange `#BF461A` background with Sage Light `#EDF5EC` text, pill radius 25 px, UPPERCASE.
- [ ] Cards on dark surfaces use `#1A2B2A` or transparent — no other card tone.
- [ ] Gold `#FFBA1A` appears only on emphasis (labels, stat callouts, badges) — never on primary CTAs.
- [ ] Captions / muted text use Sage Muted `#A1A9A0` or Charcoal `#141413`, never slate-blue tones.
- [ ] Border / divider color is Sage Medium `#D5DED4` on light, or a Deep-Forest-derived line on dark.
- [ ] Tracked-spacing (letter-spacing) is applied to uppercase section labels.

---

## Changelog

- **2026-05-02** · Doc created. Captures the mabbly.com brand spec extracted on 2026-03-29 plus a migration map for `discover.mabbly.com`.
