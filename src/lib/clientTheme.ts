/**
 * Centralized client-theme helpers shared by every microsite page.
 *
 * The microsite is built around a "warm editorial" Mabbly default. When a
 * client's branding is extracted during enrichment, we inject CSS variables
 * scoped to a wrapper div so the entire microsite (header, body, accents,
 * loading screen, chat, reader, feedback) re-skins in one place.
 */

export type ClientTheme = {
  logoUrl: string | null;
  companyName: string | null;
  accent: string;
  accentHover: string;
  accentForeground: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  fontFamily: string | null;
  /**
   * Dual-color brand pair, distinct from `accent`/`background` which control
   * the page chrome. `brandAccent` is the highlight/text color (links, CTAs,
   * orbit bars). `brandBackground` is the dark container color (CTA buttons,
   * orbit number badges, sticky header). Always present — defaults to a
   * sensible industry fallback when extraction fails or returns near-white.
   */
  brandAccent: string;
  brandBackground: string;
};

/** Default dark container when extracted background is near-white. */
export const INDUSTRY_FALLBACK_BG = "#1B3A6B"; // consulting navy

export const MABBLY_DEFAULTS: ClientTheme = {
  logoUrl: null,
  companyName: null,
  accent: "#B8933A",
  accentHover: "#a07c2e",
  accentForeground: "#120D05",
  background: "#FBF8F4",
  surface: "#F2EBDC",
  text: "#1C1008",
  textMuted: "rgba(28,16,8,0.6)",
  border: "rgba(28,16,8,0.1)",
  fontFamily: null,
  brandAccent: "#B8933A",
  brandBackground: INDUSTRY_FALLBACK_BG,
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isHex(v: unknown): v is string {
  return typeof v === "string" && HEX_RE.test(v.trim());
}

function expandHex(hex: string): string {
  const h = hex.trim();
  if (h.length === 4) {
    return "#" + h.slice(1).split("").map((c) => c + c).join("");
  }
  return h.toLowerCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = expandHex(hex);
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function relLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function darken(hex: string, amount = 0.12): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pickForeground(bg: string): string {
  return relLuminance(bg) > 0.55 ? "#1A1108" : "#FFFFFF";
}

export interface RawBranding {
  client_logo_url?: string | null;
  client_company_name?: string | null;
  client_brand_color?: string | null;
  client_accent_color?: string | null;
  client_background_color?: string | null;
  client_surface_color?: string | null;
  client_text_color?: string | null;
  client_text_muted_color?: string | null;
  client_font_family?: string | null;
}

/**
 * Build a safe, complete theme from the raw branding columns. Any field that
 * is missing or invalid falls back to the Mabbly default — so existing
 * microsites without extracted branding still look right.
 */
/** WCAG contrast ratio between two hex colors (1–21). */
function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** RGB → HSL saturation 0..1 (used to detect grayscale accents). */
function saturation(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return 0;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

export function buildClientTheme(raw: RawBranding | null | undefined): ClientTheme {
  if (!raw) return MABBLY_DEFAULTS;

  const accentRaw = raw.client_accent_color ?? raw.client_brand_color;
  let accent = isHex(accentRaw) ? expandHex(accentRaw) : MABBLY_DEFAULTS.accent;

  const background = isHex(raw.client_background_color)
    ? expandHex(raw.client_background_color)
    : MABBLY_DEFAULTS.background;

  // ── Palette quality threshold ───────────────────────────────────────────
  // Valid extracted hex must take priority over Mabbly defaults. We only
  // fall back when the accent is structurally broken (grayscale or equal to
  // the background) — NOT just because contrast is below 4.5. Brand colors
  // are often softer than Mabbly gold and we still want them to ship.
  const sat = saturation(accent);
  let fallbackReason: string | null = null;
  if (accent.toLowerCase() === background.toLowerCase()) fallbackReason = "accent-equals-bg";
  else if (sat < 0.05) fallbackReason = "grayscale-accent";

  if (fallbackReason && raw.client_accent_color) {
    if (typeof console !== "undefined") {
      console.warn("[brand-fallback]", fallbackReason, {
        extracted: accent,
        background,
        company: raw.client_company_name ?? null,
      });
    }
    accent = MABBLY_DEFAULTS.accent;
  }

  const bgIsDark = relLuminance(background) < 0.5;

  let text = isHex(raw.client_text_color)
    ? expandHex(raw.client_text_color)
    : bgIsDark
      ? "#FFFFFF"
      : MABBLY_DEFAULTS.text;

  // Contrast guard: if extracted text doesn't read against the extracted bg,
  // override with high-contrast white/near-black so the microsite stays
  // legible. WCAG AA large-text threshold is 3.0; we aim higher (3.5+).
  if (contrastRatio(text, background) < 3.5) {
    text = bgIsDark ? "#FFFFFF" : "#0F0F0F";
  }

  const accentForeground = pickForeground(accent);

  // Honor explicitly-extracted surface / textMuted hex when present;
  // otherwise derive a tinted surface and a 60%-opacity muted variant.
  const surface = isHex(raw.client_surface_color)
    ? expandHex(raw.client_surface_color)
    : rgba(text, bgIsDark ? 0.08 : 0.06);

  const textMuted = isHex(raw.client_text_muted_color)
    ? expandHex(raw.client_text_muted_color)
    : rgba(text, 0.6);

  return {
    logoUrl: raw.client_logo_url ?? null,
    companyName: raw.client_company_name ?? null,
    accent,
    accentHover: darken(accent, 0.14),
    accentForeground,
    background,
    surface,
    text,
    textMuted,
    border: rgba(text, bgIsDark ? 0.18 : 0.12),
    fontFamily: raw.client_font_family?.trim() || null,
  };
}

/**
 * Convert a theme into CSS variables that any microsite component can read.
 * Use these on a wrapper element via `style={themeStyle(theme)}`.
 *
 * Emits both the legacy `--ms-*` tokens (consumed by the older microsite
 * override stylesheet) and the newer `--client-*` aliases that the V10
 * sections read directly from CSS so each component can re-skin without
 * needing the theme object as a prop.
 */
export function themeStyle(theme: ClientTheme): React.CSSProperties {
  return {
    "--ms-accent": theme.accent,
    "--ms-accent-hover": theme.accentHover,
    "--ms-accent-fg": theme.accentForeground,
    "--ms-bg": theme.background,
    "--ms-surface": theme.surface,
    "--ms-text": theme.text,
    "--ms-text-muted": theme.textMuted,
    "--ms-border": theme.border,
    "--client-primary": theme.accent,
    "--client-primary-fg": theme.accentForeground,
    "--client-background": theme.background,
    "--client-surface": theme.surface,
    "--client-text": theme.text,
    "--client-text-muted": theme.textMuted,
    "--client-border": theme.border,
    backgroundColor: theme.background,
    color: theme.text,
    ...(theme.fontFamily ? { fontFamily: `${theme.fontFamily}, system-ui, sans-serif` } : {}),
  } as React.CSSProperties;
}

