// Locked Mabbly identity colors. These are NEVER overridden by client brand
// extraction. Use them anywhere the microsite needs to anchor in Mabbly trust
// signals: eyebrow tags, hairline rules, manuscript pull-quote borders, the
// Adam credibility anchor, and the "Mabbly" wordmark.
//
// For everything else (firm name highlight, CTA buttons, orbit accent, share
// buttons, primary section H2 accents) keep using the firm's extracted
// `primary` color from `clientTheme`.
//
// Updated 2026-05-02 to Mabbly brand v2 (docs/07-design-system.md): olive
// gold replaces the warmer legacy gold; Deep Forest replaces the near-black
// ink; Sage Light replaces the warm cream.

export const MABBLY_GOLD = "#A8923A";   // Olive Gold - primary brand accent
export const MABBLY_DARK = "#0F1E1D";   // Deep Forest - dark anchor
export const MABBLY_CREAM = "#EDF5EC";  // Sage Light - light anchor
