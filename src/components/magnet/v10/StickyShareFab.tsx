// Sticky share FAB - bottom-right floating button.
//
// - 56px on desktop, 48px on mobile.
// - Visible after the user scrolls past Section 2.
// - Hidden when Section 11 (full Share + Save) is in viewport.
// - Click → calls onClick (parent owns the share dialog).

import { useEffect, useState } from "react";
import { MABBLY_GOLD, MABBLY_DARK } from "@/lib/mabblyAnchors";

interface Props {
  onClick: () => void;
}

export default function StickyShareFab({ onClick }: Props) {
  const [pastSection2, setPastSection2] = useState(false);
  const [section11Visible, setSection11Visible] = useState(false);
  const [s2Ready, setS2Ready] = useState(false);
  const [s11Ready, setS11Ready] = useState(false);

  // Track when user has scrolled past Section 2 (top edge of S2 above viewport top)
  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    let rafId = 0;
    const attach = () => {
      const el = document.querySelector('[data-v10-section="2"]');
      if (!el) {
        rafId = requestAnimationFrame(attach);
        return;
      }
      obs = new IntersectionObserver(
        ([entry]) => {
          const past = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
          setPastSection2(past);
          setS2Ready(true);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      obs.observe(el);
    };
    attach();
    return () => {
      cancelAnimationFrame(rafId);
      obs?.disconnect();
    };
  }, []);

  // Track Section 11 visibility (hide FAB when full share section is on screen)
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
        ([entry]) => {
          setSection11Visible(entry.isIntersecting);
          setS11Ready(true);
        },
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

  // Don't render until both observers have produced their first reading.
  // Prevents the sub-second window where the FAB exists in the DOM but is
  // invisible/non-interactive.
  if (!s2Ready || !s11Ready) return null;

  const visible = pastSection2 && !section11Visible;
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Share this map"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-opacity duration-200"
      style={{
        width: 56,
        height: 56,
        borderRadius: 9999,
        backgroundColor: MABBLY_DARK,
        border: `2px solid ${MABBLY_GOLD}`,
        color: MABBLY_GOLD,
        boxShadow: "0 6px 18px -4px rgba(0,0,0,0.35)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx={18} cy={5} r={3} />
        <circle cx={6} cy={12} r={3} />
        <circle cx={18} cy={19} r={3} />
        <line x1={8.59} y1={13.51} x2={15.42} y2={17.49} />
        <line x1={15.41} y1={6.51} x2={8.59} y2={10.49} />
      </svg>
      <style>{`
        @media (max-width: 640px) {
          button[aria-label="Share this map"] {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </button>
  );
}
