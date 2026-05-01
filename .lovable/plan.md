# Strip all em/en dashes from the microsite

Project memory rule: never use hyphens, em-dashes, or en-dashes in content text. The `/m/:slug` microsite still has them in two places: (1) hardcoded source strings, and (2) LLM-generated fields (`action_1`, `gtm_profile_observed`, `gtm_profile_assessment`, `orbit_01..05`) which is where the user's example came from.

## Approach

### 1. Runtime sanitizer (catches LLM output for all current and future personalized pages)

In `src/components/magnet/MagnetBreakdown.tsx`, replace the existing single-purpose `sanitizedAction` block with a reusable `sanitizeLLM` helper that:

- Strips invented dollar figures (existing behavior).
- Removes em/en dashes using these rules:
  - ` — ` or ` – ` (with surrounding spaces) becomes `. ` (sentence break).
  - Bare dashes between word chars like `5M–100M` or `0–40` become `5M to 100M`.
  - Any remaining `—` or `–` becomes `,`.
  - Collapses double spaces and trims.

Apply it to `action_1`, `gtm_profile_observed`, `gtm_profile_assessment`, and each of `orbit_01..05`. Pass the sanitized values down to `FiveOrbitsViz`, `CoreAnalysisSection`, `ProofAnalysisSection`, and `HighestLeverageMove`.

### 2. Static source string replacements (user-visible JSX/strings only, NOT code comments)

Replace dashes in user-visible strings across these files (comments untouched since they aren't rendered):

- `src/content/verticals.ts` — 8 `deadZoneTooltip` + 8 `rrosTooltip` strings: replace ` — ` with `. `.
- `src/content/verticalFlow.ts` — 9 `shareTemplate` strings: replace ` — ` with `. `.
- `src/content/industryStats.ts` — 8 `label` strings: replace `$5M–$100M` with `$5M to $100M`.
- `src/content/ctaVariants.ts` — section comments only (no user-visible dashes); skip.
- `src/components/microsite/SpectrumBar.tsx` lines 13-15: `"0 — Relationship Dependent"` becomes `"0. Relationship Dependent"`, etc.
- `src/components/microsite/MicrositeShell.tsx` line 31: title separator `${name} — Market Activation Profile` becomes `${name} | Market Activation Profile`.
- `src/components/magnet/v10/ManuscriptShareSave.tsx`:
  - Line 58 toast: `"Link copied — share it..."` becomes `"Link copied. Share it..."`.
  - Line 70 subject: `${emailSubject} — ${customerName}` becomes `${emailSubject}: ${customerName}`.
  - Line 73 signature: `— ${fromName}` becomes `${fromName}` (signature line, just the name).
  - Line 136 attribution `— {attribution}` becomes plain `{attribution}` on its own line (or prefix with `By `).
  - Line 158 body: `findings — with your name` becomes `findings, with your name`.
  - Line 235 body: `follow-up sequence — just the map` becomes `follow-up sequence. Just the map`.
- `src/components/magnet/v10/ValueInTheirWords.tsx`:
  - Line 76, 101 attribution `— {attr}` becomes plain attribution prefixed with a styled spacer or just removed dash.
- `src/components/magnet/v10/ProofAnalysisSection.tsx` line 35: `What proof you already own — and what's missing.` becomes `What proof you already own. And what's missing.`. Line 46 hypothesis: `like Madcraft did — $400K dormant proposal reactivated` becomes `like Madcraft did. $400K dormant proposal reactivated`.
- `src/components/magnet/v10/HighestLeverageMove.tsx`:
  - Line 20: `7-minute signal — same play Madcraft ran.` becomes `7-minute signal. Same play Madcraft ran.`.
  - Line 78 attribution `— {attribution}` becomes plain attribution.
  - Plus any other body strings in that file (re-scan).
- `src/components/magnet/v10/CompactCtaCard.tsx`, `FullCtaSection.tsx`, `FiveOrbitsViz.tsx`, `PersonalizedHeader.tsx`, `MobileProgressBar.tsx`, `StickyShareFab.tsx`, `DeeperFindings.tsx`, `WhyResearchMatters.tsx`, `CoreAnalysisSection.tsx`: re-scan each for user-visible dashes (most matches are in code comments) and replace any user-visible ones with periods/commas.
- `src/components/magnet/MagnetChat.tsx`, `MagnetWaitTheater.tsx`, `MagnetShell.tsx`, `MagnetLoadingScene.tsx`, `BookReader.tsx`, `BookChat.tsx`: same re-scan; replace user-visible dashes only.

### 3. Skip (intentional)

- All `// comment` lines remain untouched (not rendered).
- `src/lib/magnetScoring.ts` is comments-only matches; skip.
- `src/content/manuscriptQuotes.ts` line 3 is a comment; skip. The actual quote strings are verbatim research artifacts and will be re-scanned; if any quote contains a dash, leave it (these are direct quotes per the "Keep attribution exact" rule).

### Replacement cheat sheet

| Original | Replacement |
|---|---|
| ` — ` between clauses | `. ` |
| ` — ` introducing attribution | drop dash, keep attribution |
| `5M–100M` numeric range | `5M to 100M` |
| `0–40` numeric range | `0 to 40` |
| `—` in a title separator | `\|` (pipe) |
| Any other bare dash | `,` |

## Files touched

Runtime: 1 file.
Source string edits: ~15 files.
Total: ~16 files. No new dependencies, no schema changes, no behavior changes besides text rendering.
