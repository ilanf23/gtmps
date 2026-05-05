import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureRefFromUrl } from "@/lib/refAttribution";
import { supabase } from "@/integrations/supabase/client";
import {
  getOrCreateSessionId,
  getOrCreateVisitorFingerprint,
} from "@/lib/magnetAttribution";

const HOME_VIEW_SLUG = "__home__";
const LOGGED_KEY = "mabbly:home:viewLogged";

/** Mounted once at the App root. Captures ?ref= / ?utm_* on every route. */
export default function RefAttributionCapture() {
  const location = useLocation();
  useEffect(() => {
    captureRefFromUrl();

    // Log a homepage visit row keyed by UTMs so the per-channel funnel
    // counts homepage traffic. Only fires on root-ish paths and only once
    // per tab session per UTM combo, to keep volume bounded.
    const path = location.pathname;
    if (path !== "/" && path !== "/discover") return;

    try {
      const params = new URLSearchParams(location.search);
      const utmS = params.get("utm_source");
      const utmM = params.get("utm_medium");
      const utmC = params.get("utm_campaign");
      if (!utmS && !utmM && !utmC) return;

      const dedupeKey = `${utmS ?? ""}|${utmM ?? ""}|${utmC ?? ""}`;
      const prev = sessionStorage.getItem(LOGGED_KEY);
      if (prev === dedupeKey) return;
      sessionStorage.setItem(LOGGED_KEY, dedupeKey);

      void supabase.from("magnet_views").insert({
        slug: HOME_VIEW_SLUG,
        utm_source: utmS,
        utm_medium: utmM,
        utm_campaign: utmC,
        session_id: getOrCreateSessionId(),
        visitor_fingerprint: getOrCreateVisitorFingerprint(),
        referrer_url:
          typeof document !== "undefined" ? document.referrer || null : null,
      });
    } catch {
      /* ignore */
    }
  }, [location.pathname, location.search]);
  return null;
}
