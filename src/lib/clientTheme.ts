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
};

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
  client_text_color?: string | null;
  client_font_family?: string | null;
}

/**
 * Build a safe, complete theme from the raw branding columns. Any field that
 * is missing or invalid falls back to the Mabbly default — so existing
 * microsites without extracted branding still look right.
 */
export function buildClientTheme(raw: RawBranding | null | undefined): ClientTheme {
  if (!raw) return MABBLY_DEFAULTS;

  const accentRaw = raw.client_accent_color ?? raw.client_brand_color;
  const accent = isHex(accentRaw) ? expandHex(accentRaw) : MABBLY_DEFAULTS.accent;

  const background = isHex(raw.client_background_color)
    ? expandHex(raw.client_background_color)
    : MABBLY_DEFAULTS.background;

  const text = isHex(raw.client_text_color)
    ? expandHex(raw.client_text_color)
    : relLuminance(background) > 0.55
      ? MABBLY_DEFAULTS.text
      : "#F5EFE6";

  const accentForeground = pickForeground(accent);

  return {
    logoUrl: raw.client_logo_url ?? null,
    companyName: raw.client_company_name ?? null,
    accent,
    accentHover: darken(accent, 0.14),
    accentForeground,
    background,
    surface: rgba(text, 0.06),
    text,
    textMuted: rgba(text, 0.6),
    border: rgba(text, 0.12),
    fontFamily: raw.client_font_family?.trim() || null,
  };
}

/**
 * Convert a theme into CSS variables that any microsite component can read.
 * Use these on a wrapper element via `style={themeStyle(theme)}`.
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
    backgroundColor: theme.background,
    color: theme.text,
    ...(theme.fontFamily ? { fontFamily: `${theme.fontFamily}, system-ui, sans-serif` } : {}),
  } as React.CSSProperties;
}
