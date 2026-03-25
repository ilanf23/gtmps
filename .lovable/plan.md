

# Lighten the Page: Alternating Section Backgrounds

## Problem
Every section uses near-black backgrounds (#0D1117 or #131820) with low-opacity white text. The result is hard to read and monotonous with zero visual contrast between sections.

## Approach
Introduce an alternating warm light / deep navy rhythm. Light sections use cream/off-white backgrounds with dark text. Dark sections use a softer navy (not pure black) with brighter text. This creates clear visual breaks and much better readability.

## Section Color Map

```text
Section          Current         New Background      Text Color
─────────────────────────────────────────────────────────────────
Hero             #0D1117         #0D1117 (keep dark)  white (keep)
SocialProofBar   #0D1117         #F5F0E8 (cream)      dark
Mission          #131820         #FFFFFF (white)       dark
Episode          #0D1117         #1A2332 (soft navy)   white
Book             #131820         #F5F0E8 (cream)       dark
Authors          #0D1117         #FFFFFF (white)       dark
Deeper           #131820         #1A2332 (soft navy)   white
Results          #0D1117         #F5F0E8 (cream)       dark
Apply            #131820         #1A2332 (soft navy)   white
Footer CTA       #131820         #F5F0E8 (cream)       dark
Footer           #0D1117         #1A2332 (soft navy)   white
Nav              rgba dark       rgba dark (keep)      white (keep)
```

## Changes Per File

**index.css**
- Add CSS variables for the new palette: `--cream: #F5F0E8`, `--warm-white: #FFFFFF`, `--soft-navy: #1A2332`
- Add a `.glass-card-light` variant for light backgrounds (subtle border, light shadow instead of the dark glass effect)

**SocialProofBar.tsx** — Cream background, dark logo text

**MissionSection.tsx** — White background, dark text (#1A1A1A), dark body text. Pillar cards get light card styling (soft border, light shadow). The existing cream callout box stays but gets a subtle border to distinguish from white bg.

**EpisodeSection.tsx** — Soft navy (#1A2332), keep light text but bump opacity for readability

**BookSection.tsx** — Cream background, dark text. Chapter cards get light card styling. Timeline dots/text go dark.

**AuthorsSection.tsx** — White background, dark text. Author cards get light card styling with subtle borders. Credential pills go dark border/text.

**DeeperSection.tsx** — Soft navy, keep light text with higher opacity. Article cards stay glass style. Email capture box stays dark glass.

**ResultsSection.tsx** — Cream background, dark text. Result cards get light styling.

**ApplySection.tsx** — Soft navy, keep light text but bump opacity. Form inputs stay dark-on-dark (works well on navy). Gold CTA stays.

**Footer.tsx** — CTA band goes cream with dark text. Footer bar goes soft navy.

**StickyNav.tsx** — Keep dark (it floats over everything, dark nav works universally)

## Key Design Rules
- Light sections: heading text `#1A1A1A`, body text `#4A4A4A`, eyebrow gold stays `#B8933A`
- Dark sections: use `#1A2332` instead of `#0D1117`, text opacity bumped from 0.55 to 0.7
- Glass cards on light backgrounds: `background: white`, `border: 1px solid rgba(0,0,0,0.08)`, `box-shadow: 0 4px 20px rgba(0,0,0,0.06)`
- Gold accent color unchanged throughout
- No hyphens in any text (existing rule)

