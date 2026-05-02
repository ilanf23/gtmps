import { useEffect, useState } from "react";

/**
 * Watches the DOM for any element tagged `data-cta="add-your-firm"` and
 * returns true while one or more of them are intersecting the viewport.
 *
 * Used by the sticky bottom "Get MY Map" pill to suppress itself when
 * the user already has an inline equivalent on screen.
 */
const SELECTOR = '[data-cta="add-your-firm"]';

export function useInlineCtaVisible(threshold = 0.5): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const visibleSet = new Set<Element>();
    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        let changed = false;
        const wasEmpty = visibleSet.size === 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!visibleSet.has(entry.target)) {
              visibleSet.add(entry.target);
              changed = true;
            }
          } else if (visibleSet.has(entry.target)) {
            visibleSet.delete(entry.target);
            changed = true;
          }
        });
        if (!changed) return;
        const isEmpty = visibleSet.size === 0;
        if (wasEmpty !== isEmpty) setVisible(!isEmpty);
      },
      { threshold }
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    observeAll();

    // Pick up CTAs that mount after first render (lazy sections, accordions).
    const mo = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          if (el.matches?.(SELECTOR) || el.querySelector?.(SELECTOR)) needsScan = true;
        });
        m.removedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          // Drop any tracked nodes that were removed.
          if (visibleSet.has(el)) {
            visibleSet.delete(el);
            if (visibleSet.size === 0) setVisible(false);
          }
          el.querySelectorAll?.(SELECTOR).forEach((child) => {
            if (visibleSet.has(child)) {
              visibleSet.delete(child);
              if (visibleSet.size === 0) setVisible(false);
            }
          });
        });
      }
      if (needsScan) observeAll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [threshold]);

  return visible;
}

export default useInlineCtaVisible;
