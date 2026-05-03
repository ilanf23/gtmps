// SECTION 01 - Your Research Profile
// Stripped-down centered type-only hero. The firm name is the focal point;
// everything else (eyebrow, sublines, divider, manuscript quote) is supporting
// structure. Three continuous motions (firm glow, hand-drawn underline drop
// shadow, ambient gradient drift) keep the page alive after entry.

import { MANUSCRIPT_OPENING } from "@/content/manuscriptQuotes";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  firmName: string;
  primary: string;
}

export default function PersonalizedHeader({ firmName, primary }: Props) {
  // Per-microsite accent flows through `--brand-accent` (set on the breakdown
  // column wrapper). Fall back to Mabbly olive gold if the variable is missing.
  const accent = `var(--brand-accent, ${primary || MABBLY_GOLD})`;

  return (
    <section
      id="v10-section-1"
      data-v10-section="1"
      className="relative isolate overflow-hidden border-b border-black/10"
      style={{
        textAlign: "center",
        padding: "clamp(72px, 9vw, 96px) 16px",
      }}
    >
      <div className="ph-ambient" aria-hidden="true" />

      <div className="relative z-[1] mx-auto" style={{ maxWidth: 880 }}>
        <p className="ph-eyebrow font-mono">
          <span className="ph-eyebrow-line" aria-hidden="true" />
          01 · Your Research Profile
        </p>

        <h1 className="ph-headline font-display">
          <span className="ph-word ph-word-1">Your</span>{" "}
          <span className="ph-word ph-word-2">Revenue</span>{" "}
          <span className="ph-word ph-word-3">Map</span>{" "}
          <span className="ph-word ph-word-4">for</span>
          <span className="ph-firm-wrap">
            <span className="ph-firm">{firmName}</span>
          </span>
        </h1>

        <div className="ph-sublines">
          <p className="ph-sub-1">You are part of our 30-firm research cohort.</p>
          <p className="ph-sub-2">
            Clear opportunities identified. Let's build your plan.
          </p>
        </div>

        <div className="ph-divider" aria-hidden="true" />

        <p className="ph-quote font-serif">
          &ldquo;{MANUSCRIPT_OPENING.text}&rdquo;
        </p>
        <p className="ph-cite font-mono">
          <span>Chapter 4</span>
          <span className="ph-cite-sep">·</span>
          <span>Truth I</span>
        </p>
      </div>

      <style>{`
        /* ── Ambient drifting glow behind the hero ───────────────────── */
        .ph-ambient {
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            color-mix(in srgb, ${accent} 14%, transparent) 0%,
            transparent 60%
          );
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
          animation: phAmbientDrift 18s ease-in-out infinite;
        }
        @keyframes phAmbientDrift {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.85; }
          50%      { transform: translate(-46%, -52%) scale(1.08); opacity: 1; }
        }

        /* ── Eyebrow ─────────────────────────────────────────────────── */
        .ph-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: ${accent};
          opacity: 0;
          margin: 0 0 28px;
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms forwards;
        }
        .ph-eyebrow-line {
          display: inline-block;
          width: 28px;
          height: 1.5px;
          background-color: ${accent};
          transform: scaleX(0);
          transform-origin: left center;
          animation: phDrawLine 700ms cubic-bezier(0.45, 0, 0.2, 1) 200ms forwards;
        }

        /* ── Headline + firm name ────────────────────────────────────── */
        .ph-headline {
          font-weight: 900;
          font-size: clamp(40px, 5.6vw, 80px);
          line-height: 1.0;
          letter-spacing: -0.025em;
          color: var(--client-text, currentColor);
          margin: 0;
          word-break: break-word;
        }
        .ph-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
        }
        .ph-word-1 { animation: phFadeUp 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 400ms forwards; }
        .ph-word-2 { animation: phFadeUp 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 500ms forwards; }
        .ph-word-3 { animation: phFadeUp 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 600ms forwards; }
        .ph-word-4 { animation: phFadeUp 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 700ms forwards; }

        .ph-firm-wrap {
          display: block;
          position: relative;
          margin-top: 6px;
        }
        .ph-firm {
          display: inline-block;
          font-weight: 900;
          font-size: clamp(48px, 6.6vw, 92px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: ${accent};
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          animation: phFirmIn 1100ms cubic-bezier(0.16, 0.65, 0.3, 1) 900ms forwards;
        }

        /* ── Sublines ────────────────────────────────────────────────── */
        .ph-sublines {
          margin-top: 36px;
        }
        .ph-sub-1, .ph-sub-2 {
          font-size: 17px;
          line-height: 1.5;
          color: var(--client-text, currentColor);
          margin: 0 auto;
          max-width: 560px;
          opacity: 0;
          transform: translateY(12px);
        }
        .ph-sub-1 {
          animation: phFadeUpToMuted 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1300ms forwards;
        }
        .ph-sub-2 {
          margin-top: 6px;
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1450ms forwards;
        }

        /* ── Divider ─────────────────────────────────────────────────── */
        .ph-divider {
          height: 1px;
          background-color: var(--client-text, currentColor);
          opacity: 0.15;
          margin: 48px auto 32px;
          max-width: 0;
          animation: phDrawDivider 1000ms cubic-bezier(0.45, 0, 0.2, 1) 1700ms forwards;
        }

        /* ── Quote + cite ────────────────────────────────────────────── */
        .ph-quote {
          font-style: italic;
          font-weight: 500;
          font-size: clamp(20px, 1.8vw, 24px);
          line-height: 1.4;
          color: var(--client-text, currentColor);
          margin: 0 auto;
          max-width: 600px;
          opacity: 0;
          transform: translateY(12px);
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2000ms forwards;
        }
        .ph-cite {
          margin-top: 16px;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${accent};
          opacity: 0;
          transform: translateY(12px);
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2200ms forwards;
        }
        .ph-cite-sep {
          display: inline-block;
          margin: 0 8px;
          opacity: 0.5;
        }

        /* ── Keyframes ───────────────────────────────────────────────── */
        @keyframes phFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes phFadeUpToMuted {
          to { opacity: 0.6; transform: translateY(0); }
        }
        @keyframes phDrawLine {
          to { transform: scaleX(1); }
        }
        @keyframes phFirmIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes phDrawDivider {
          to { max-width: 560px; }
        }

        /* ── Mobile tuning ───────────────────────────────────────────── */
        @media (max-width: 720px) {
          .ph-ambient { width: 500px; height: 500px; }
        }

        /* ── Reduced motion ──────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ph-ambient,
          .ph-eyebrow,
          .ph-eyebrow-line,
          .ph-word,
          .ph-firm,
          .ph-sub-1,
          .ph-sub-2,
          .ph-divider,
          .ph-quote,
          .ph-cite {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .ph-eyebrow,
          .ph-word,
          .ph-firm,
          .ph-sub-2,
          .ph-quote,
          .ph-cite { opacity: 1; transform: none; }
          .ph-sub-1 { opacity: 0.6; transform: none; }
          .ph-eyebrow-line { transform: scaleX(1); }
          .ph-divider { max-width: 560px; }
        }
      `}</style>
    </section>
  );
}
