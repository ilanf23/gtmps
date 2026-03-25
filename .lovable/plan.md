

# Lighter Callout Box with Book Reference

## Problem
The callout box referencing "The Science of Story" sits on a near-black background with low-opacity white text, making it very hard to read.

## Changes

**MissionSection.tsx — Callout box (lines 67-79)**

Redesign the callout box with:
- **Lighter background**: Warm off-white/cream (`#F5F0E8` or similar) instead of the dark transparent gold
- **Dark text**: Near-black body text for strong contrast
- **Horizontal flex layout**: Book cover thumbnail on the left (~80px wide), text + Amazon link on the right
- **Book thumbnail**: `<img>` using the uploaded Science of Story cover saved as `src/assets/science-of-story-cover.png`
- **Amazon link**: Gold colored "View on Amazon →" link opening in new tab, styled in mono font
- **Rounded corners, subtle shadow**: To give it a "card" feel that pops off the dark section background
- **No gold left border**: Replace with the lighter card treatment so it feels cohesive

The rest of the MissionSection stays dark. This creates a deliberate contrast moment that draws the eye.

## Technical Details

- Save uploaded image `user-uploads://Screenshot_2026-03-25_at_8.31.19_AM.png` → `src/assets/science-of-story-cover.png`
- Update callout box in `src/components/MissionSection.tsx` lines 67-79
- Amazon link: `https://www.amazon.com/Science-Story-Brand-Reflection-Culture/dp/0999876503`
- No hyphens in any text

