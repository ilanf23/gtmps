import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capturePageview } from "@/lib/posthog";

export default function PostHogPageview() {
  const location = useLocation();
  useEffect(() => {
    capturePageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}
