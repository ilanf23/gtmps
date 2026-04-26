import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to top on every route change, unless:
 * - The URL has a hash (#anchor) — let the browser/anchor handler resolve it
 * - The URL is the cold-email diagnostic deeplink (handled by page-level effects)
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    const params = new URLSearchParams(search);
    const isColdDiagnostic =
      params.get("utm_source") === "cold" &&
      params.get("utm_anchor") === "diagnostic";
    if (isColdDiagnostic) return;

    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
