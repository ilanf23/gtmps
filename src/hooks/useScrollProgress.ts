import { RefObject, useEffect, useState } from "react";

/**
 * Returns 0..1 progress as the referenced element travels through the viewport.
 *
 * mode "through": 0 when the element's top hits the bottom of the viewport,
 *                 1 when its bottom leaves the top of the viewport.
 *
 * mode "pin":     intended for a tall outer wrapper that contains a sticky
 *                 inner — 0 when the wrapper's top hits the top of the viewport,
 *                 1 when the wrapper's bottom hits the bottom of the viewport.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T>,
  mode: "through" | "pin" = "through"
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      let p = 0;
      if (mode === "through") {
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        p = traveled / total;
      } else {
        // pin: progress through the wrapper while it occupies the viewport
        const total = Math.max(rect.height - vh, 1);
        const traveled = -rect.top;
        p = traveled / total;
      }
      setProgress(Math.max(0, Math.min(1, p)));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, mode]);

  return progress;
}
