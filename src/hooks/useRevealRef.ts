import { useCallback, useRef, useState } from "react";

/**
 * Ref-based scroll-reveal hook for microsite components.
 * Returns a ref callback to attach to any element and a boolean indicating visibility.
 * Once visible, stays visible (no re-hiding on scroll away).
 *
 * @param delay - Optional delay in ms before the reveal triggers (for stagger effects)
 */
export function useRevealRef(delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => setIsVisible(true), delay);
            } else {
              setIsVisible(true);
            }
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      observerRef.current.observe(node);
    },
    [delay]
  );

  return { ref, isVisible };
}

/** Style object for a reveal-animated element */
export function revealStyle(isVisible: boolean, duration = 600): React.CSSProperties {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  };
}
