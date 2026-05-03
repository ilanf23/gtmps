// useFocusOnRouteChange - moves keyboard / screen-reader focus to the
// page's <main id="main-content"> element when the route changes via
// PUSH or REPLACE navigation. Skips POP (back/forward) so the existing
// scroll-restoration UX isn't disrupted by an unwanted focus jump.
//
// WCAG 2.4.3 (focus order) and the "Skip link + lang='en' + focus
// management on tab change" carry-over from the v2 audit.

import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function useFocusOnRouteChange() {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "POP") return;
    const target = document.getElementById("main-content");
    if (target) {
      // tabIndex=-1 lets us programmatically focus a non-interactive element.
      target.focus({ preventScroll: true });
    }
  }, [location.pathname, navType]);
}
