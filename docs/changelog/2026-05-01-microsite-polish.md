# Microsite Polish — 2026-05-01

Editorial and typography polish pass on the personalized `/m/:slug` Market Activation Profile microsite. Seven changes shipped in a single session, all surgical and scoped to the microsite render path. No schema changes, no new dependencies.

## 1. Client logo inside the Five Orbits center

The Section 02 orbits visualization now renders the client's extracted logo (`client_logo_url`) at the center of the rings instead of a generic anchor. Falls back gracefully when the logo is missing. No size or layout changes to surrounding characters.

- **Files**: `src/components/magnet/v10/FiveOrbitsViz.tsx`, `src/components/magnet/MagnetBreakdown.tsx` (passes `clientLogoUrl` prop).

## 2. Light beige background for Sections 3 + 4

Core Analysis and Proof Analysis now share a paired "diagnostic block" tint to set them apart from neighboring sections. The tint extends edge-to-edge of the viewport using the standard breakout pattern (`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen`) and content stays centered via an inner `max-w-[806px] mx-auto` wrapper.

- **Color**: `#F7F1E6`.
- **Files**: `src/components/magnet/v10/CoreAnalysisSection.tsx`, `src/components/magnet/v10/ProofAnalysisSection.tsx`.

## 3. Adam Fridman profile photo replaces "AF" initials

Section 07 (Value in Their Words) credibility anchor now ships Adam's actual headshot, bundled into `/public/adam-fridman.png` so it loads from the production build artifact with no external CDN. Used as a 20x20 rounded avatar with a gold border.

- **Files**: `public/adam-fridman.png` (new), `src/components/magnet/v10/ValueInTheirWords.tsx`.

## 4. Section 06 redesign — dark cinematic credibility break

"Why This Research Matters" was a barely-tinted block; now it is a full-width dark editorial band that anchors the middle of the page and matches the cinematic identity of the main Discover site.

- **Background**: `#1C1008` (`MABBLY_DARK`), full viewport width via the same breakout pattern as Sections 3 + 4.
- **Imagery layers** (all `pointer-events-none`, behind content):
  1. Soft gold radial spotlight (upper-right) via inline `radial-gradient`.
  2. `TopographicBackground` component at `opacity={0.06}`.
  3. SVG fractal-noise film-grain at `opacity-[0.04]`, `mix-blend-overlay`.
  4. Bottom-edge dark fade for depth.
- **Editorial stat tiles**: Three large gold serif numerals (`30` / `500` / `26`) with cream small-caps labels (PS Firms / Interviews / Years), separated by a hairline `border-white/10` rule from the body copy below.
- **Text inversion**: Body in cream `#FBF8F4` at ~78% opacity, gold accents preserved, cohort firm strip recolored to read on the dark ground.
- **Files**: `src/components/magnet/v10/WhyResearchMatters.tsx`.

## 5. Removed two microlines under the Calendly embed (Section 08)

Per request, dropped the two bullets immediately below the inline Calendly:

- "Adam typically has 4 to 6 slots open this week."
- "30 minutes. No pitch. No commitment."

- **Files**: `src/components/magnet/v10/FullCtaSection.tsx` (removed lines 164-169).

## 6. Removed all em-dashes and en-dashes from the microsite

Project memory rule: never use hyphens, em-dashes, or en-dashes in content text. Two-pronged fix.

### 6a. Runtime sanitizer (catches LLM output for every personalized page)

In `src/components/magnet/MagnetBreakdown.tsx`, replaced the previous single-purpose `sanitizedAction` block with a reusable `sanitizeLLM` helper:

- Strips invented dollar figures (existing behavior, preserved).
- Removes em/en dashes:
  - ` — ` or ` – ` (with spaces) becomes `. ` (sentence break).
  - Bare dashes between word chars (`5M–100M`, `0–40`) become `5M to 100M`.
  - Any remaining `—` or `–` becomes `,`.
- Applied to `action_1`, `gtm_profile_observed`, `gtm_profile_assessment`, and each of `orbit_01..05`. Sanitized values are passed down to `FiveOrbitsViz`, `CoreAnalysisSection`, `ProofAnalysisSection`, and `HighestLeverageMove`.

### 6b. Static source string replacements (~16 files)

Replaced dashes in user-visible JSX and string literals across:

- `src/content/verticals.ts` (deadZoneTooltip + rrosTooltip × 8 verticals)
- `src/content/verticalFlow.ts` (shareTemplate × 9)
- `src/content/industryStats.ts` (`$5M–$100M` → `$5M to $100M`)
- `src/components/microsite/SpectrumBar.tsx`, `MicrositeShell.tsx`
- `src/components/magnet/v10/`: `ManuscriptShareSave.tsx`, `ValueInTheirWords.tsx`, `ProofAnalysisSection.tsx`, `HighestLeverageMove.tsx`, `CoreAnalysisSection.tsx`, `PersonalizedHeader.tsx`, `DeeperFindings.tsx`
- `src/components/magnet/`: `BookChat.tsx`, `MagnetChat.tsx`, `MagnetLoadingScene.tsx`, `MagnetWaitTheater.tsx`

Code comments left untouched (not rendered).

### Replacement cheat sheet

| Original | Replacement |
|---|---|
| ` — ` between clauses | `. ` |
| ` — ` introducing attribution | drop dash, keep attribution |
| `5M–100M` numeric range | `5M to 100M` |
| `0–40` numeric range | `0 to 40` |
| `—` in a title separator | `\|` (pipe) |
| Any other bare dash | `,` |

## 7. Microsite content column widened by 20%

The main content column was constrained to `max-w-2xl` (672px); widened to `max-w-[806px]` (672 × 1.2). Horizontal padding (`px-6`) unchanged. Headlines and inner blocks that also used `max-w-2xl` got widened to match so wrapping stays consistent.

- **Files**: `MagnetBreakdown.tsx`, `CoreAnalysisSection.tsx`, `ProofAnalysisSection.tsx`, `WhyResearchMatters.tsx`, `ShareAttributionBanner.tsx`, `FiveOrbitsViz.tsx`, `ManuscriptShareSave.tsx`, `HighestLeverageMove.tsx`, `FullCtaSection.tsx`.

## Out of scope this session

- No changes to the main Discover page, `/pepper-group`, `/spr`, `/launchpadlab`, or other microsites.
- No copy edits beyond dash removal and the two microlines deleted in change #5.
- No font, palette, or scoring logic changes.
- No backend, schema, or edge-function changes.
