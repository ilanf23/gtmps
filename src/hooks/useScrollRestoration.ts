import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Saves the page's scroll position per location key on navigate-away,
 * and restores it when the user navigates back/forward (POP).
 *
 * Forward (PUSH/REPLACE) navigations are left alone so that ScrollToTop
 * can do its usual top-of-page reset. The two hooks are designed to
 * coexist: ScrollToTop short-circuits when a hash is present and resets
 * to top otherwise; this hook overrides that reset only on POP by
 * scrolling back to the saved position one tick after the route renders.
 *
 * Storage:
 * - Per-tab: a sessionStorage map keyed by `location.key`. We avoid
 *   pathname keys so two visits to the same path keep distinct scrolls.
 *
 * Caveats:
 * - We restore once per POP. If the page renders content asynchronously
 *   (e.g. Magnet polling), the saved position may be past the current
 *   document height and the browser will clamp to the bottom; this is
 *   expected and matches native browser behaviour.
 */
const STORAGE_KEY = "scrollRestoration:v1";

type ScrollMap = Record<string, number>;

function readMap(): ScrollMap {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ScrollMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: ScrollMap) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage may be unavailable (private mode, quota); fail silently.
  }
}

const useScrollRestoration = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const previousKeyRef = useRef<string | null>(null);

  // Disable the browser's native scrollRestoration so we own the
  // behaviour deterministically across navigations.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = prev;
      }
    };
  }, []);

  // Save scroll position for the location we're leaving, restore on POP.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentKey = location.key || "default";
    const previousKey = previousKeyRef.current;

    // Save the previous location's scroll position as we leave it.
    if (previousKey && previousKey !== currentKey) {
      const map = readMap();
      map[previousKey] = window.scrollY || 0;
      writeMap(map);
    }
    previousKeyRef.current = currentKey;

    if (navType === "POP") {
      const map = readMap();
      const saved = map[currentKey];
      if (typeof saved === "number" && saved > 0) {
        // Defer one frame so the new route paints before we scroll.
        const handle = window.requestAnimationFrame(() => {
          window.scrollTo({ top: saved, left: 0 });
        });
        return () => window.cancelAnimationFrame(handle);
      }
    }
    // PUSH / REPLACE: do nothing here - let ScrollToTop reset to top.
  }, [location.key, navType]);

  // Save on unload as well, so the active tab's last position survives
  // a refresh that lands on the same key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPersist = () => {
      const key = location.key || "default";
      const map = readMap();
      map[key] = window.scrollY || 0;
      writeMap(map);
    };
    window.addEventListener("pagehide", onPersist);
    return () => window.removeEventListener("pagehide", onPersist);
  }, [location.key]);
};

export default useScrollRestoration;
