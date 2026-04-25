import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Counts from 0 to `target` over `duration`ms once `trigger` becomes true.
 * Uses an exponential ease-out by default; pass a custom easing fn to override.
 */
export function useCountUp(
  target: number,
  duration: number,
  trigger: boolean,
  delay = 0,
  easing: (t: number) => number = (t) => 1 - Math.pow(1 - t, 4)
): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;

    if (reduced) {
      setValue(target);
      return;
    }

    const id = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        setValue(easing(p) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);

    return () => window.clearTimeout(id);
  }, [trigger, target, duration, delay, reduced, easing]);

  return value;
}

/** Convenience: returns visibility flag for an element via IntersectionObserver. */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}
