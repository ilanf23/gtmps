import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  buildClientTheme,
  MABBLY_DEFAULTS,
  type ClientTheme,
  type RawBranding,
} from "@/lib/clientTheme";

/**
 * Module-scoped cache of resolved themes, keyed by slug. Persists for the
 * lifetime of the SPA session so navigating between microsite tabs reuses
 * the branded theme synchronously instead of flashing the Mabbly defaults
 * while a fresh Supabase RPC round-trips.
 *
 * IMPORTANT: we only cache themes that contain real client branding. If the
 * RPC returns a row whose branding columns are still null (e.g. row was
 * written by an early enrichment error path before branding extraction
 * succeeded), we deliberately do NOT cache the resulting MABBLY_DEFAULTS —
 * otherwise the cache would lock the microsite into the orange/beige defaults
 * for the rest of the session, even after a successful re-enrichment writes
 * the real branding to the DB.
 */
const themeCache = new Map<string, ClientTheme>();

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const isHex = (v: unknown): v is string =>
  typeof v === "string" && HEX_RE.test((v as string).trim());

/**
 * A theme is "branded" once any extracted column / palette key made it
 * through. Used to decide whether the resolved theme is safe to cache and
 * whether a cache hit can short-circuit the network call.
 */
function isBrandedRow(row: Record<string, unknown> | null): boolean {
  if (!row) return false;
  const palette =
    (row.client_brand_profile as { palette?: Record<string, unknown> } | null)
      ?.palette ?? null;
  return Boolean(
    row.client_accent_color ||
      row.client_background_color ||
      row.client_text_color ||
      row.client_logo_url ||
      row.client_font_family ||
      row.client_company_name ||
      (palette &&
        (palette.primary ||
          palette.background ||
          palette.surface ||
          palette.text ||
          palette.textMuted)),
  );
}

/** Cheap diff so we only re-render when the visible theme actually changes. */
function themesDiffer(a: ClientTheme, b: ClientTheme): boolean {
  return (
    a.accent !== b.accent ||
    a.background !== b.background ||
    a.surface !== b.surface ||
    a.text !== b.text ||
    a.textMuted !== b.textMuted ||
    a.companyName !== b.companyName ||
    a.logoUrl !== b.logoUrl ||
    a.fontFamily !== b.fontFamily ||
    a.brandAccent !== b.brandAccent ||
    a.brandBackground !== b.brandBackground
  );
}

/**
 * Merge the rich palette stored in `client_brand_profile.palette` (the
 * 5-key structure produced by the AI extractor) on top of the flat brand
 * columns. The palette wins whenever it has a valid 6-digit hex — that way
 * the V10 page and the shell always agree on what "the brand" is.
 */
function rowToRawBranding(row: Record<string, unknown>): RawBranding {
  const palette =
    (row.client_brand_profile as { palette?: Record<string, unknown> } | null)
      ?.palette ?? null;

  const fromPalette = (key: string): string | null => {
    const v = palette?.[key];
    return isHex(v) ? (v as string).trim() : null;
  };

  // Dual-color mapping: brandAccent = palette.primary (highlight color),
  // brandBackground = palette.background (dark container color). If
  // background is missing or near-white, try palette.surface as a fallback.
  const isNearWhite = (hex: string | null): boolean => {
    if (!hex) return true;
    const m = hex.replace("#", "");
    if (m.length !== 6) return false;
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.9;
  };

  const paletteBg = fromPalette("background");
  const paletteSurface = fromPalette("surface");
  const brandBackground =
    paletteBg && !isNearWhite(paletteBg)
      ? paletteBg
      : paletteSurface && !isNearWhite(paletteSurface)
        ? paletteSurface
        : null;
  const brandAccent =
    fromPalette("primary") ?? ((row.client_accent_color as string | null) ?? null);

  return {
    client_logo_url: (row.client_logo_url as string | null) ?? null,
    client_company_name: (row.client_company_name as string | null) ?? null,
    client_brand_color:
      fromPalette("primary") ?? ((row as RawBranding).client_brand_color ?? null),
    client_accent_color:
      fromPalette("primary") ??
      ((row.client_accent_color as string | null) ?? null),
    client_background_color:
      fromPalette("background") ??
      ((row.client_background_color as string | null) ?? null),
    client_surface_color: fromPalette("surface"),
    client_text_color:
      fromPalette("text") ?? ((row.client_text_color as string | null) ?? null),
    client_text_muted_color: fromPalette("textMuted"),
    client_font_family: (row.client_font_family as string | null) ?? null,
    brand_accent: brandAccent,
    brand_background: brandBackground,
  };
}

/**
 * Loads client branding for a microsite slug and returns a complete theme.
 * Falls back to the Mabbly default theme until data arrives or if no slug.
 */
export function useClientTheme(slug: string | undefined | null): ClientTheme {
  const [theme, setTheme] = useState<ClientTheme>(() =>
    slug && themeCache.has(slug) ? themeCache.get(slug)! : MABBLY_DEFAULTS,
  );

  useEffect(() => {
    if (!slug) {
      setTheme(MABBLY_DEFAULTS);
      return;
    }
    if (themeCache.has(slug)) {
      setTheme(themeCache.get(slug)!);
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("get_magnet_breakdown_by_slug", {
        _slug: slug,
      });
      if (cancelled || error) return;
      const row = Array.isArray(data) ? data[0] : null;
      if (!row) return;

      const raw = rowToRawBranding(row as Record<string, unknown>);

      // Debug: surface what the extractor / palette actually wrote to the DB
      // so brand-color regressions are easy to diagnose from the console.
      if (typeof console !== "undefined") {
        const palette =
          ((row as Record<string, unknown>).client_brand_profile as {
            palette?: unknown;
          } | null)?.palette ?? null;
        // eslint-disable-next-line no-console
        console.log("[useClientTheme] raw palette for", slug, {
          palette,
          flat: {
            accent: (row as Record<string, unknown>).client_accent_color,
            background: (row as Record<string, unknown>).client_background_color,
            text: (row as Record<string, unknown>).client_text_color,
            logo: (row as Record<string, unknown>).client_logo_url,
            font: (row as Record<string, unknown>).client_font_family,
          },
          merged: raw,
        });
      }

      const next = buildClientTheme(raw);

      if (isBrandedRow(row as Record<string, unknown>)) {
        themeCache.set(slug, next);
      }

      setTheme((prev) => (themesDiffer(prev, next) ? next : prev));
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return theme;
}
