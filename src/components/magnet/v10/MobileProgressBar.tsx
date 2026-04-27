// Mobile-only bottom scroll progress bar for the v10 microsite.
// Replaces the desktop SectionRail under 1024px.
//
// Behavior:
//   - Fixed at bottom, 3px tall, full width.
//   - Gold (#B8933A) fill grows with scroll position.
//   - Hidden on >= 1024px (rail handles desktop).
//   - Hidden once the final v10 Section 11 enters the viewport — same gating
//     intent as the rail.

import { useEffect, useState } from "react";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

export default function MobileProgressBar() {
  const [pct, setPct] = useState(0);
  const [hidden, setHidden] = useState(false);

  // Scroll progress
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight || 1;
        setPct(Math.max(0, Math.min(1, window.scrollY / max)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Hide when Section 11 enters viewport
  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    let rafId = 0;
    const attach = () => {
      const el = document.querySelector('[data-v10-section="11"]');
      if (!el) {
        rafId = requestAnimationFrame(attach);
        return;
      }
      obs = new IntersectionObserver(
        ([entry]) => setHidden(entry.isIntersecting),
        { threshold: 0.2 }
      );
      obs.observe(el);
    };
    attach();
    return () => {
      cancelAnimationFrame(rafId);
      obs?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="lg:hidden"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        backgroundColor: "rgba(184,147,58,0.12)",
        zIndex: 50,
        opacity: hidden ? 0 : 1,
        transition: "opacity 200ms ease",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          backgroundColor: MABBLY_GOLD,
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}
