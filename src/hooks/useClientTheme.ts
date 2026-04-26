import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  buildClientTheme,
  MABBLY_DEFAULTS,
  type ClientTheme,
  type RawBranding,
} from "@/lib/clientTheme";

/**
 * Loads client branding for a microsite slug and returns a complete theme.
 * Falls back to the Mabbly default theme until data arrives or if no slug.
 */
export function useClientTheme(slug: string | undefined | null): ClientTheme {
  const [theme, setTheme] = useState<ClientTheme>(MABBLY_DEFAULTS);

  useEffect(() => {
    if (!slug) {
      setTheme(MABBLY_DEFAULTS);
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
      setTheme(buildClientTheme(row as unknown as RawBranding));
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return theme;
}
