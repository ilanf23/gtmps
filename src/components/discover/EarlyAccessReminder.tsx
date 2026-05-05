import { useEffect, useState } from "react";

type Variant = "inline" | "sticky";

interface EarlyAccessReminderProps {
  variant?: Variant;
  href?: string;
  sectionRef?: string;
  /** sessionStorage key used by the sticky variant's dismiss button. */
  dismissKey?: string;
}

const SCROLL_TARGET_ID = "hero";

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function EarlyAccessReminder({
  variant = "inline",
  href = "#hero",
  sectionRef = "15 · Reminder",
  dismissKey = "earlyAccessReminder.dismissed",
}: EarlyAccessReminderProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (variant !== "sticky") return;
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(dismissKey) === "1") {
        setDismissed(true);
      }
    } catch {
      /* sessionStorage unavailable - render normally */
    }
  }, [variant, dismissKey]);

  if (dismissed) return null;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href.slice(1) || SCROLL_TARGET_ID);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(dismissKey, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`ear-wrap ear-${variant}`} role="region" aria-label="Early Access reminder">
      <style>{`
        .ear-wrap {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(16px);
          animation: earSlideIn 600ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
        }
        .ear-sticky {
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translate(-50%, 16px);
          z-index: 50;
          padding: 0 16px;
          animation: earSlideInSticky 600ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
        }

        .ear-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 12px;
          position: relative;
        }
        @media (max-width: 720px) {
          .ear-grid { grid-template-columns: 1fr; }
        }

        .ear-box {
          background: #fdfbf6;
          border: 1px solid rgba(15, 30, 29, 0.1);
          border-radius: 16px;
          padding: 18px 22px;
          transition:
            transform 280ms cubic-bezier(0.13, 0.28, 0.3, 1),
            box-shadow 280ms,
            border-color 280ms;
        }

        /* Info box */
        .ear-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }
        .ear-info:hover {
          transform: translateY(-2px);
          border-color: rgba(15, 30, 29, 0.18);
          box-shadow: 0 8px 24px -10px rgba(15, 30, 29, 0.15);
        }
        .ear-status-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ear-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: rgba(41, 207, 157, 0.12);
          border: 1px solid rgba(41, 207, 157, 0.4);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #137a59;
          font-weight: 600;
        }
        .ear-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #29CF9D;
          box-shadow: 0 0 6px rgba(41, 207, 157, 0.7);
          animation: earPulseDot 1.6s ease-in-out infinite;
        }
        .ear-section-num {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A79014;
          font-weight: 600;
        }
        .ear-headline {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.015em;
          color: #0F1E1D;
          margin: 0;
        }
        .ear-period { color: #BF461A; }
        .ear-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: #0F1E1D;
          opacity: 0.62;
          margin: 0;
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ear-sep {
          color: #BF461A;
          font-weight: 700;
          opacity: 0.95;
        }

        /* CTA box */
        .ear-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          outline: none;
        }
        .ear-cta:hover,
        .ear-cta:focus-visible {
          transform: translateY(-2px);
          border-color: #BF461A;
          box-shadow: 0 12px 32px -10px rgba(191, 70, 26, 0.3);
        }
        .ear-cta:focus-visible {
          box-shadow:
            0 12px 32px -10px rgba(191, 70, 26, 0.3),
            0 0 0 3px rgba(255, 186, 26, 0.55);
        }

        .ear-cta-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #BF461A;
          color: #F8F2E5;
          border: 2px solid #BF461A;
          padding: 12px 24px;
          border-radius: 999px;
          font-family: 'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          transition: background 300ms cubic-bezier(0.13, 0.28, 0.3, 1), border-color 300ms cubic-bezier(0.13, 0.28, 0.3, 1), transform 300ms cubic-bezier(0.13, 0.28, 0.3, 1), box-shadow 300ms cubic-bezier(0.13, 0.28, 0.3, 1);
          box-shadow: 0 10px 28px -10px rgba(191, 70, 26, 0.45);
        }
        .ear-cta-pill::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(237, 245, 236, 0.25),
            transparent
          );
          animation: earShimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .ear-cta:hover .ear-cta-pill,
        .ear-cta:focus-visible .ear-cta-pill {
          background: #0F1E1D;
          border-color: #0F1E1D;
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -10px rgba(15,30,29,0.45);
        }
        .ear-cta-arrow {
          display: inline-block;
          transition: transform 350ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .ear-cta:hover .ear-cta-arrow,
        .ear-cta:focus-visible .ear-cta-arrow {
          transform: translateX(4px);
        }
        .ear-cta-trust {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: #0F1E1D;
          opacity: 0.6;
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Sticky dismiss */
        .ear-dismiss {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0F1E1D;
          color: #EDF5EC;
          border: 1px solid rgba(237, 245, 236, 0.35);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
          line-height: 1;
          z-index: 2;
          box-shadow: 0 4px 10px -4px rgba(15, 30, 29, 0.45);
        }
        .ear-dismiss:hover { background: #BF461A; }

        @keyframes earSlideIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes earSlideInSticky {
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes earPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes earShimmer {
          0%   { left: -100%; }
          50%  { left: 200%; }
          100% { left: 200%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ear-wrap,
          .ear-sticky,
          .ear-pulse,
          .ear-cta-pill::before {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
          .ear-wrap { opacity: 1; transform: none; }
          .ear-sticky { transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="ear-grid">
        {variant === "sticky" && (
          <button
            type="button"
            className="ear-dismiss"
            aria-label="Dismiss Early Access reminder"
            onClick={handleDismiss}
          >
            ×
          </button>
        )}

        <div className="ear-box ear-info">
          <div className="ear-status-row">
            <span className="ear-status-pill">
              <span className="ear-pulse" aria-hidden />
              <span>Early Access · Open</span>
            </span>
            <span className="ear-section-num">{sectionRef}</span>
          </div>
          <h4 className="ear-headline">
            Get this system 90 days before launch
            <span className="ear-period">.</span>
          </h4>
          <p className="ear-meta">
            <span>30 chapters</span>
            <span className="ear-sep">·</span>
            <span>3 frameworks</span>
            <span className="ear-sep">·</span>
            <span>By application</span>
          </p>
        </div>

        <a
          href={href}
          className="ear-box ear-cta"
          onClick={handleCtaClick}
          data-cta="add-your-firm"
          aria-label="Add Your Firm - apply for Early Access"
        >
          <span className="ear-cta-pill">
            Add Your Firm
            <span className="ear-cta-arrow" aria-hidden>→</span>
          </span>
          <p className="ear-cta-trust">
            <span>Free</span>
            <span className="ear-sep">·</span>
            <span>48hr decisions</span>
          </p>
        </a>
      </div>
    </div>
  );
}
