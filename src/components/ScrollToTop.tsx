import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Resets scroll to top on every route change, unless:
 * - The navigation is a POP (back/forward) - `useScrollRestoration` will
 *   restore the saved position instead, so we must not fight it.
 * - The URL has a hash (#anchor) - let the browser/anchor handler resolve it
 * - The URL is the cold-email diagnostic deeplink (handled by page-level effects)
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "POP") return;
    if (hash) return;

    const params = new URLSearchParams(search);
    const isColdDiagnostic =
      params.get("utm_source") === "cold" &&
      params.get("utm_anchor") === "diagnostic";
    if (isColdDiagnostic) return;

    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search, hash, navType]);

  return null;
};

export default ScrollToTop;
