/**
 * Mabbly Design System — Canonical Tokens (v2.0, 2026-05-02)
 *
 * Single source-of-truth for design tokens. Tailwind config and src/index.css
 * mirror these values; components import semantic tokens from here.
 *
 * Aesthetic: Monocle meets McKinsey — organic, grounded, premium.
 * Heading rule: 900 weight + UPPERCASE. Body: 400 sentence case.
 * The 900↔400 contrast IS the brand.
 *
 * Source spec: docs/07-design-system.md (extracted from mabbly.com 2026-03-29).
 */

// ============================================================================
// Brand palette — locked spec values
// ============================================================================
//
// Old token names (ink/gold/sage/rust/slate/cream/warmWhite/softNavy) are
// retained as aliases so existing class strings keep compiling. The values
// behind those names now point to the new spec — all surfaces using them
// will visually shift to the new brand. Out-of-scope microsite surfaces
// override locally via their own component styles.
// ============================================================================
export const brand = {
  // New spec — primary
  deepForest:    "#0F1E1D",  // dark primary — hero / dark sections / headings on light
  sageLight:     "#EDF5EC",  // light primary — page bg / text on dark / Mabbly fallback
  oliveGold:     "#A8923A",  // PRIMARY ACCENT — links, borders, focus, decorative
  burntOrange:   "#BF461A",  // RESERVED — primary conversion CTAs only

  // New spec — secondary
  darkRust:      "#803402",  // H3 subheading color, secondary accent, hover
  sageMedium:    "#D5DED4",  // borders, dividers, secondary surfaces
  goldHighlight: "#FFBA1A",  // emphasis: labels, stat callouts, badge accents
  amber:         "#A79014",  // muted gold, secondary labels
  forestTeal:    "#225351",  // section accents, data viz secondary
  sageMuted:     "#A1A9A0",  // captions, footnotes, helper text
  warmWhite:     "#FAF9F5",  // alternate light surface
  charcoal:      "#141413",  // alternate dark, footer

  // New spec — extended
  ctaPurple:     "#491D89",  // waitlist CTA / product pages
  signalRed:     "#C02B0A",  // error / urgency

  // Card surface on dark — derived from spec ("slightly lighter forest").
  cardDark:      "#1A2B2A",

  // Backwards-compat aliases — point at new spec values.
  ink:        "#0F1E1D",  // → Deep Forest
  gold:       "#A8923A",  // → Olive Gold (primary accent)
  sage:       "#225351",  // → Forest Teal (most legacy uses are accents)
  rust:       "#803402",  // → Dark Rust
  slate:      "#A1A9A0",  // → Sage Muted (demoted to muted-text role)
  cream:      "#EDF5EC",  // → Sage Light
  softNavy:   "#1B3A6B",  // not in new spec — preserved for vertical landings (out of scope)
} as const;

// ============================================================================
// Color — semantic tokens (light mode default)
// Components consume these via CSS vars, not the brand palette directly.
// ============================================================================
export const color = {
  surface: {
    page:    "var(--color-surface-page)",
    raised:  "var(--color-surface-raised)",
    sunken:  "var(--color-surface-sunken)",
    inverse: "var(--color-surface-inverse)",
    overlay: "var(--color-surface-overlay)",
  },
  text: {
    primary:   "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    tertiary:  "var(--color-text-tertiary)",
    inverse:   "var(--color-text-inverse)",
    link:      "var(--color-text-link)",
    disabled:  "var(--color-text-disabled)",
  },
  border: {
    subtle:  "var(--color-border-subtle)",
    default: "var(--color-border-default)",
    strong:  "var(--color-border-strong)",
    focus:   "var(--color-border-focus)",
  },
  accent: {
    primary:       "var(--color-accent-primary)",
    primaryHover:  "var(--color-accent-primary-hover)",
    primaryActive: "var(--color-accent-primary-active)",
    primaryOn:     "var(--color-accent-primary-on)",
    secondary:     "var(--color-accent-secondary)",
    secondaryOn:   "var(--color-accent-secondary-on)",
    tertiary:      "var(--color-accent-tertiary)",
    tertiaryOn:    "var(--color-accent-tertiary-on)",
    highlight:     "var(--color-accent-highlight)",     // Gold #FFBA1A — emphasis only
    highlightOn:   "var(--color-accent-highlight-on)",
  },
  status: {
    success:    "var(--color-status-success)",
    successOn:  "var(--color-status-success-on)",
    warning:    "var(--color-status-warning)",
    warningOn:  "var(--color-status-warning-on)",
    error:      "var(--color-status-error)",
    errorOn:    "var(--color-status-error-on)",
    info:       "var(--color-status-info)",
    infoOn:     "var(--color-status-info-on)",
  },
  client: {
    accent:   "var(--client-accent, var(--color-accent-primary))",
    accentOn: "var(--client-accent-on, var(--color-accent-primary-on))",
    chromeBg:   "var(--client-chrome-bg, var(--color-surface-inverse))",
    chromeText: "var(--client-chrome-text, var(--color-text-inverse))",
    bodyBg:     "var(--client-body-bg, var(--color-surface-page))",
    bodyText:   "var(--client-body-text, var(--color-text-primary))",
  },
} as const;

// ============================================================================
// Typography — heading rule: 900 + UPPERCASE. Body: 400, sentence case.
//
// Heading stack: Mabbly Repro (custom, not yet loaded) → Arial Black (system)
//                → Verdana → sans-serif. Arial Black is the doc-sanctioned
//                substitute that preserves the heavy / editorial register.
// Body stack:    Mabbly Repro → Instrument Sans (closer to spec than Verdana
//                visually until Mabbly Repro arrives).
// Editorial face: Cormorant Garamond — retained ONLY for decorative numerals
//                 and italic pull quotes per Q3 lock-in.
// ============================================================================
export const FONT_HEADING = "'Mabbly Repro', 'Arial Black', Verdana, Helvetica, sans-serif";
export const FONT_BODY    = "'Mabbly Repro', 'Instrument Sans', system-ui, sans-serif";
export const FONT_SERIF_EDITORIAL = "'Cormorant Garamond', Georgia, serif"; // numerals + pull quotes only
export const FONT_MONO    = "'Mabbly Repro Mono', 'DM Mono', 'Trebuchet MS', ui-monospace, monospace";

export const type = {
  display: {
    font:      FONT_HEADING,
    weight:    900,
    size:      "clamp(3rem, 5vw + 1rem, 4.5rem)", // 48–72px
    line:      1.05,
    track:     "-0.005em",
    uppercase: true,
  },
  headline: {
    font:      FONT_HEADING,
    weight:    900,
    size:      "clamp(2rem, 3vw + 0.5rem, 2.5rem)", // 32–40px
    line:      1.15,
    track:     "0",
    uppercase: true,
  },
  title: {
    // H3 per spec: 900 UPPERCASE, color = Dark Rust (#803402).
    font:      FONT_HEADING,
    weight:    900,
    size:      "clamp(1.375rem, 1vw + 1rem, 1.5rem)", // 22–24px
    line:      1.3,
    track:     "0.01em",
    uppercase: true,
    color:     "var(--color-accent-tertiary)", // Dark Rust per spec
  },
  body: {
    font:   FONT_BODY,
    weight: 400,
    size:   "1rem",
    line:   1.6,
    track:  "0",
  },
  bodyLarge: {
    font:   FONT_BODY,
    weight: 400,
    size:   "1.125rem",
    line:   1.55,
    track:  "0",
  },
  label: {
    font:      FONT_HEADING,
    weight:    900,
    size:      "0.75rem",
    line:      1.4,
    track:     "0.12em",
    uppercase: true,
  },
  caption: {
    font:   FONT_BODY,
    weight: 400,
    size:   "0.875rem",
    line:   1.5,
    track:  "0",
  },
  // Editorial register: decorative chapter numerals + italic pull quotes.
  // Not used for headings.
  editorial: {
    font:   FONT_SERIF_EDITORIAL,
    weight: 400,
    size:   "1rem",
    line:   1.4,
    track:  "0",
    italic: true,
  },
} as const;

// ============================================================================
// Spacing — 8pt-based with editorial extensions
// ============================================================================
export const space = {
  0:  "0",
  1:  "0.25rem", // 4
  2:  "0.5rem",  // 8
  3:  "0.75rem", // 12
  4:  "1rem",    // 16
  5:  "1.5rem",  // 24
  6:  "2rem",    // 32
  7:  "3rem",    // 48
  8:  "4rem",    // 64
  9:  "6rem",    // 96
  10: "8rem",    // 128
  11: "12rem",   // 192
  12: "16rem",   // 256
} as const;

// ============================================================================
// Layout — max widths
// ============================================================================
export const maxWidth = {
  prose:   "65ch",
  content: "1040px",
  wide:    "1280px",
  page:    "1440px",
} as const;

// ============================================================================
// Radius — primary CTA is 25px pill per spec §3.2
// ============================================================================
export const radius = {
  sm:   "0.25rem",
  md:   "0.5rem",
  lg:   "0.75rem",
  xl:   "1.25rem",
  pill: "25px",      // primary CTA per spec
  full: "9999px",
} as const;

// ============================================================================
// Shadow
// ============================================================================
export const shadow = {
  sm:    "var(--shadow-sm)",
  md:    "var(--shadow-md)",
  lg:    "var(--shadow-lg)",
  xl:    "var(--shadow-xl)",
  focus: "var(--shadow-focus)",
} as const;

// ============================================================================
// Motion
// ============================================================================
export const motion = {
  duration: {
    instant:   "80ms",
    fast:      "160ms",
    normal:    "240ms",
    slow:      "400ms",
    slower:    "600ms",
    cinematic: "1200ms",
  },
  easing: {
    default:   "cubic-bezier(0.4, 0, 0.2, 1)",
    in:        "cubic-bezier(0.4, 0, 1, 1)",
    out:       "cubic-bezier(0, 0, 0.2, 1)",
    bounce:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
    editorial: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
} as const;

// ============================================================================
// Breakpoints
// ============================================================================
export const breakpoint = {
  sm:   "375px",
  md:   "768px",
  lg:   "1024px",
  xl:   "1280px",
  "2xl": "1536px",
} as const;

// ============================================================================
// Per-vertical accent palettes — OUT OF SCOPE for v2.0 brand migration.
// Vertical landings (/consulting, /law, etc.) keep their existing palettes.
// Values below intentionally reference brand aliases that now point at
// new-spec values; verticals were not migrated as part of this pass.
// ============================================================================
export type VerticalPalette = {
  bg:        string;
  accent:    string;
  ctaBg:     string;
  ctaText:   string;
  headerBg:  string;
};

export const verticalPalette: Record<string, VerticalPalette> = {
  consulting: { bg: brand.cream,     accent: brand.gold,     ctaBg: brand.gold,     ctaText: brand.ink,    headerBg: brand.ink },
  law:        { bg: brand.cream,     accent: brand.softNavy, ctaBg: brand.softNavy, ctaText: brand.cream,  headerBg: "#0F2545" },
  accounting: { bg: brand.cream,     accent: brand.sage,     ctaBg: brand.sage,     ctaText: brand.cream,  headerBg: "#2A3F33" },
  msp:        { bg: brand.warmWhite, accent: brand.softNavy, ctaBg: brand.softNavy, ctaText: brand.cream,  headerBg: brand.ink },
  advisory:   { bg: brand.cream,     accent: brand.rust,     ctaBg: brand.rust,     ctaText: brand.cream,  headerBg: brand.ink },
  ae:         { bg: brand.warmWhite, accent: brand.slate,    ctaBg: brand.ink,      ctaText: brand.cream,  headerBg: "#3F4A55" },
  recruiting: { bg: brand.cream,     accent: brand.gold,     ctaBg: brand.gold,     ctaText: brand.ink,    headerBg: brand.ink },
  agency:     { bg: brand.cream,     accent: brand.rust,     ctaBg: brand.rust,     ctaText: brand.cream,  headerBg: brand.ink },
};

// ============================================================================
// Convenience export
// ============================================================================
export const tokens = {
  brand,
  color,
  type,
  space,
  maxWidth,
  radius,
  shadow,
  motion,
  breakpoint,
  verticalPalette,
} as const;

export type Tokens = typeof tokens;
export default tokens;
