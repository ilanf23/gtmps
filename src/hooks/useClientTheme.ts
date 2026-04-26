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

/**
 * A theme is "branded" once any extracted column made it through. Used to
 * decide whether the resolved theme is safe to cache and whether a cache
 * hit can short-circuit the network call.
 */
function isBrandedRow(row: Record<string, unknown> | null): boolean {
  if (!row) return false;
  return Boolean(
    row.client_brand_color ||
      row.client_accent_color ||
      row.client_background_color ||
      row.client_text_color ||
      row.client_logo_url ||
      row.client_font_family ||
      row.client_company_name,
  );
}

/** Cheap diff so we only re-render when the visible theme actually changes. */
function themesDiffer(a: ClientTheme, b: ClientTheme): boolean {
  return (
    a.accent !== b.accent ||
    a.background !== b.background ||
    a.text !== b.text ||
    a.companyName !== b.companyName ||
    a.logoUrl !== b.logoUrl ||
    a.fontFamily !== b.fontFamily
  );
}

/**
 * Loads client branding for a microsite slug and returns a complete theme.
 * Falls back to the Mabbly default theme until data arrives or if no slug.
 *
 * Behaviour:
 *  - Cache hit -> use cached branded theme synchronously (no flash).
 *  - Always re-fetches in the background and updates if the DB has a newer
 *    branding profile (e.g. enrichment finished after the cache was seeded).
 *  - Never caches a default-only resolution — that would lock the session.
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
    // Cache hit — apply synchronously, but still re-fetch in the background
    // so a newer branding write in the DB eventually wins.
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

      const next = buildClientTheme(row as unknown as RawBranding);

      // Only cache when real branding came back. This is what stops a stale
      // pre-enrichment fetch from poisoning the rest of the SPA session.
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
