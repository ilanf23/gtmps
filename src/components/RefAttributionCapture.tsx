import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureRefFromUrl } from "@/lib/refAttribution";
import { supabase } from "@/integrations/supabase/client";
import {
  getOrCreateSessionId,
  getOrCreateVisitorFingerprint,
} from "@/lib/magnetAttribution";
import { track } from "@/lib/posthog";

const HOME_VIEW_SLUG = "__home__";
const LOGGED_KEY = "mabbly:home:viewLogged";

/** Mounted once at the App root. Captures ?ref= / ?utm_* on every route. */
export default function RefAttributionCapture() {
  const location = useLocation();
  useEffect(() => {
    captureRefFromUrl();

    // Log a "channel landing" view row whenever a UTM-tagged or ref-tagged
    // URL hits ANY route (homepage, vertical landings, microsites, magnet
    // sub-routes). Skip /m/:slug because MagnetShell already inserts a
    // properly slugged row for that surface. Deduped per (path, utm) per tab.
    const path = location.pathname;
    if (path.startsWith("/m/")) return;

    try {
      const params = new URLSearchParams(location.search);
      const utmS = params.get("utm_source");
      const utmM = params.get("utm_medium");
      const utmC = params.get("utm_campaign");
      const ref = params.get("ref");
      if (!utmS && !utmM && !utmC && !ref) return;

      const dedupeKey = `${path}|${utmS ?? ""}|${utmM ?? ""}|${utmC ?? ""}|${ref ?? ""}`;
      const prev = sessionStorage.getItem(LOGGED_KEY);
      if (prev === dedupeKey) return;
      sessionStorage.setItem(LOGGED_KEY, dedupeKey);

      const referrerUrl =
        typeof document !== "undefined" ? document.referrer || null : null;

      void supabase.from("magnet_views").insert({
        slug: HOME_VIEW_SLUG,
        utm_source: utmS,
        utm_medium: utmM,
        utm_campaign: utmC,
        session_id: getOrCreateSessionId(),
        visitor_fingerprint: getOrCreateVisitorFingerprint(),
        referrer_url: referrerUrl,
      });

      // Layer 4: PostHog mirror so the funnel has a backstop if Supabase fails.
      try {
        track("channel_view", {
          path,
          utm_source: utmS,
          utm_medium: utmM,
          utm_campaign: utmC,
          ref_code: ref,
          referrer_url: referrerUrl,
        });
      } catch {
        /* ignore */
      }
    } catch {
      /* ignore */
    }
  }, [location.pathname, location.search]);
  return null;
}
