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
 */
const themeCache = new Map<string, ClientTheme>();

/**
 * Loads client branding for a microsite slug and returns a complete theme.
 * Falls back to the Mabbly default theme until data arrives or if no slug.
 *
 * On repeat mounts within the same session (e.g. tab navigation), the cached
 * theme is used as the initial state so the first paint is already branded —
 * no orange/beige flash before the dark theme reapplies.
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
    // Cache hit — apply synchronously and skip the network call entirely.
    if (themeCache.has(slug)) {
      setTheme(themeCache.get(slug)!);
      return;
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
      themeCache.set(slug, next);
      setTheme(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return theme;
}
