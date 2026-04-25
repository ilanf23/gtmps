import { RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Returns a {x, y} offset (in pixels, clamped to ±max) based on the cursor
 * position relative to the referenced element's center. Disabled on touch
 * devices, below `minWidth`, and when prefers-reduced-motion is set.
 */
export function useCursorParallax<T extends HTMLElement>(
  ref: RefObject<T>,
  max = 6,
  minWidth = 1024
): { x: number; y: number } {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < minWidth) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setOffset({
          x: Math.max(-1, Math.min(1, dx)) * max,
          y: Math.max(-1, Math.min(1, dy)) * max,
        });
      });
    };

    const onLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, max, minWidth, reduced]);

  return offset;
}
