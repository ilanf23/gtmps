/**
 * Mabbly Design System — Canonical Tokens (v1.0, 2026-05-02)
 *
 * Single source-of-truth for design tokens. Tailwind config and src/index.css
 * read from this file; components import semantic tokens from here.
 *
 * Aesthetic: Editorial book-launch / restrained / sophisticated B2B.
 * Locked palette + fonts (no substitutions). See the audit page for spec details.
 */

// ============================================================================
// Brand palette (locked — never substitute)
// ============================================================================
export const brand = {
  ink:        "#0D1117",
  gold:       "#B8933A",
  sage:       "#3D5A4A",
  rust:       "#8B3A2A",
  slate:      "#5A6A7A",
  cream:      "#F5F1E8",
  warmWhite:  "#FFFFFF",
  softNavy:   "#1B3A6B",
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
  // Per-client (Magnet) — runtime injected by useClientTheme.
  // Falls back to brand accent if not set.
  client: {
    accent:   "var(--client-accent, var(--color-accent-primary))",
    accentOn: "var(--client-accent-on, var(--color-accent-primary-on))",
    // Sprint 2: split chrome bg from body bg to fix Cravath dark-bg failure.
    chromeBg:   "var(--client-chrome-bg, var(--color-surface-inverse))",
    chromeText: "var(--client-chrome-text, var(--color-text-inverse))",
    bodyBg:     "var(--client-body-bg, var(--color-surface-page))",
    bodyText:   "var(--client-body-text, var(--color-text-primary))",
  },
} as const;

// ============================================================================
// Typography — 7 semantic roles
// Each role names: font, weight, size, line-height, letter-spacing.
// ============================================================================
export const type = {
  display: {
    font:   "'Cormorant Garamond', Georgia, serif",
    weight: 500,
    size:   "clamp(3rem, 5vw + 1rem, 4.5rem)", // 48–72px
    line:   1.05,
    track:  "-0.015em",
  },
  headline: {
    font:   "'Cormorant Garamond', Georgia, serif",
    weight: 500,
    size:   "clamp(2rem, 3vw + 0.5rem, 2.5rem)", // 32–40px
    line:   1.15,
    track:  "-0.01em",
  },
  title: {
    font:   "'Inter Tight', system-ui, sans-serif",
    weight: 600,
    size:   "clamp(1.375rem, 1vw + 1rem, 1.5rem)", // 22–24px
    line:   1.3,
    track:  "-0.005em",
  },
  body: {
    font:   "'Instrument Sans', system-ui, sans-serif",
    weight: 400,
    size:   "1rem",
    line:   1.6,
    track:  "0",
  },
  bodyLarge: {
    font:   "'Instrument Sans', system-ui, sans-serif",
    weight: 400,
    size:   "1.125rem",
    line:   1.55,
    track:  "0",
  },
  label: {
    font:      "'DM Mono', ui-monospace, monospace",
    weight:    500,
    size:      "0.75rem",
    line:      1.4,
    track:     "0.12em",
    uppercase: true,
  },
  caption: {
    font:   "'Instrument Sans', system-ui, sans-serif",
    weight: 400,
    size:   "0.875rem",
    line:   1.5,
    track:  "0",
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
  prose:   "65ch",   // long-form reading
  content: "1040px", // default
  wide:    "1280px", // hero / wide sections
  page:    "1440px", // outer page bound
} as const;

// ============================================================================
// Radius
// ============================================================================
export const radius = {
  sm:   "0.25rem",
  md:   "0.5rem",
  lg:   "0.75rem",
  xl:   "1.25rem",
  full: "9999px",
} as const;

// ============================================================================
// Shadow — 4 steps + focus ring (light + dark variants in CSS)
// Editorial paper-edge depth, not Material elevation.
// ============================================================================
export const shadow = {
  sm:    "var(--shadow-sm)",
  md:    "var(--shadow-md)",
  lg:    "var(--shadow-lg)",
  xl:    "var(--shadow-xl)",
  focus: "var(--shadow-focus)",
} as const;

// ============================================================================
// Motion — durations + easings (reduced-motion overrides in CSS)
// ============================================================================
export const motion = {
  duration: {
    instant:   "80ms",
    fast:      "160ms",
    normal:    "240ms",
    slow:      "400ms",
    slower:    "600ms",
    cinematic: "1200ms", // polling theater stages, framework explainer
  },
  easing: {
    default:   "cubic-bezier(0.4, 0, 0.2, 1)",
    in:        "cubic-bezier(0.4, 0, 1, 1)",
    out:       "cubic-bezier(0, 0, 0.2, 1)",
    bounce:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
    editorial: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // existing MicrositeShell tab fade
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
// Per-vertical accent palettes (Sprint P1+ wires these into VerticalLanding)
// Each vertical stays inside the locked palette.
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
// Convenience export — single import, full token tree
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
