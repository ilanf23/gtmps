import { useEffect, useState } from "react";

/**
 * Watches for the page footer (any element tagged `data-page-footer="true"`)
 * and returns true when it intersects the viewport. Used by sticky CTAs to
 * gracefully fade out once the visitor reaches conversion-irrelevant content.
 */
export function useFooterVisible(threshold = 0.05): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId = 0;

    const attach = () => {
      const el = document.querySelector('[data-page-footer="true"]');
      if (!el) {
        // Footer may mount after this hook (e.g., lazy section). Retry on next frame.
        rafId = requestAnimationFrame(attach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { threshold }
      );
      observer.observe(el);
    };

    attach();

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [threshold]);

  return visible;
}

export default useFooterVisible;
