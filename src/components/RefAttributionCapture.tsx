import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureRefFromUrl } from "@/lib/refAttribution";

/** Mounted once at the App root. Captures ?ref= / ?utm_* on every route. */
export default function RefAttributionCapture() {
  const location = useLocation();
  useEffect(() => {
    captureRefFromUrl();
  }, [location.pathname, location.search]);
  return null;
}
