// SECTION 01 - Your Research Profile
// Hero ported from DiscoverHero (the homepage hero) so the personalized site
// reads as the same product family. Two-column layout on desktop: text left,
// score ring + per-orbit bars right. Stacks on narrow viewports.

import { useState } from "react";
import type { ScoreBand } from "@/lib/magnetScoring";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { supabase } from "@/integrations/supabase/client";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { toast } from "sonner";

interface Props {
  firmName: string;
  primary: string;
  overall: number;
  band: ScoreBand;
  slug: string;
  onCorrected?: (newName: string) => void;
}

// Stroke palette per band, picks up the homepage rust/mustard while still
// signaling intensity. High borrows the FiveOrbitsViz green so the two
// surfaces agree on what "Strong" looks like.
const BAND_STROKE: Record<ScoreBand, string> = {
  low: "#BF461A",
  mid: "#A79014",
  high: "#2E7D32",
};
const BAND_LABEL: Record<ScoreBand, string> = {
  low: "Gap",
  mid: "Mixed",
  high: "Strong",
};

export default function PersonalizedHeader({
  firmName,
  primary,
  overall,
  band,
  slug,
  onCorrected,
}: Props) {
  const accent = `var(--brand-accent, ${primary || MABBLY_GOLD})`;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(firmName || "");
  const [saving, setSaving] = useState(false);
  const upperFirm = (firmName || "Your Firm").toUpperCase();
  // Length-bucketed scale. The default `.ph-firm` clamp is sized for short
  // single-word brands ("Acme") and overflows the column for 9+ char compound
  // names like "RENEWPAVE", which then wraps mid-character. Apply a tighter
  // clamp for long names so the firm stays on one line without the
  // word-break safety net firing.
  const firmLen = upperFirm.replace(/\s/g, "").length;
  const firmSizeClass =
    firmLen >= 14 ? "ph-firm--xl" : firmLen >= 9 ? "ph-firm--lg" : "";

  const submitCorrection = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > 120) {
      toast.error("Please enter a name between 1 and 120 characters.");
      return;
    }
    if (trimmed.toLowerCase() === (firmName || "").toLowerCase()) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.rpc("correct_magnet_firm_name", {
        _slug: slug,
        _corrected_name: trimmed,
        _visitor_fingerprint: null,
      });
      if (error) throw error;
      trackMagnetEvent(slug, "firm_name_corrected", {
        previous: firmName,
        corrected: trimmed,
      });
      onCorrected?.((data as string) || trimmed);
      toast.success("Thanks. Updated.");
      setEditing(false);
    } catch (e) {
      toast.error("Could not save the correction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Score ring geometry, r=86, circumference = 2π·86 ≈ 540.354.
  const RING_R = 86;
  const RING_C = 2 * Math.PI * RING_R;
  const clampedOverall = Math.max(0, Math.min(100, Math.round(overall)));
  const targetOffset = RING_C * (1 - clampedOverall / 100);
  const ringStroke = BAND_STROKE[band];
  const bandLabel = BAND_LABEL[band];

  return (
    <>
      <style>{`
        .ph-root {
          --kl-elevation: #EDF5EC;
          --kl-depth: #0F1E1D;
          --kl-care: #BF461A;
          --kl-energy: #FFBA1A;
          --kl-purpose: #A79014;
          --kl-olive: #CBD3CA;
          --kl-transparency: #D5DED4;
          /* Full-bleed: break out of MagnetBreakdown's max-w-[806px] column
             so the hero background and blobs span the entire viewport. */
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          background: var(--kl-elevation);
          overflow: hidden;
          font-family: 'Inter Tight', 'Arial Black', 'Helvetica Neue', Impact, system-ui, sans-serif;
        }

        .ph-hero {
          position: relative;
          padding: 96px 24px 88px;
          z-index: 2;
        }
        .ph-inner {
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          align-items: center;
          gap: 72px;
          text-align: left;
        }
        .ph-text { min-width: 0; }
        .ph-graphic {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 22px;
          opacity: 0;
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1500ms forwards;
        }

        /* Watermark blobs */
        .ph-blob {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .ph-blob.big {
          top: 50%; left: 30%;
          width: 1100px; height: 1100px;
          margin: -550px 0 0 -550px;
          opacity: 0.55;
          animation: phRotateBlob 90s linear infinite;
        }
        .ph-blob.small {
          top: 18%; right: -200px;
          width: 600px; height: 600px;
          opacity: 0.45;
          animation: phRotateBlob2 60s linear infinite;
        }

        /* Eyebrow chip */
        .ph-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(15,30,29,0.18);
          border-radius: 999px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--kl-depth);
          opacity: 0;
          margin: 0 0 28px;
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 200ms forwards;
        }
        .ph-eyebrow-dot {
          width: 8px; height: 8px;
          background: var(--kl-care);
          border-radius: 50%;
          animation: phPulseDot 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Headline */
        .ph-h1 {
          margin: 0 0 28px;
          font-weight: 900;
          font-size: clamp(40px, 6vw, 96px);
          line-height: 0.9;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: var(--kl-depth);
        }
        .ph-h1 .ph-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          animation: phWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin: 0 0.18em 0 0;
        }
        .ph-h1 .ph-word:last-child { margin-right: 0; }
        .ph-h1 .ph-word.w1 { animation-delay: 600ms; }
        .ph-h1 .ph-word.w2 { animation-delay: 700ms; }
        .ph-h1 .ph-word.w3 { animation-delay: 800ms; }
        .ph-h1 .ph-word.w4 { animation-delay: 900ms; }
        .ph-h1 .ph-word.w5 { animation-delay: 1100ms; }

        .ph-firm {
          position: relative;
          display: inline-block;
          font-size: clamp(48px, 7.4vw, 116px);
          letter-spacing: -0.03em;
          color: ${accent};
          background: linear-gradient(
            to top,
            color-mix(in srgb, ${accent} 22%, transparent) 22%,
            transparent 22%
          );
          padding: 0 0.12em;
          word-break: break-word;
        }
        /* Length-scaled overrides. 9-13 char brands (e.g. RENEWPAVE) and
           14+ char brands (e.g. CRAVATH SWAINE MOORE) get a tighter clamp
           so they fit the editorial column on one line. */
        .ph-firm.ph-firm--lg { font-size: clamp(40px, 5.4vw, 88px); }
        .ph-firm.ph-firm--xl { font-size: clamp(32px, 4.2vw, 68px); }
        .ph-period {
          color: var(--kl-care);
          font-weight: 900;
        }

        /* Subhead */
        .ph-sub {
          max-width: 56ch;
          margin: 0;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 18px;
          line-height: 1.55;
          letter-spacing: -0.025em;
          color: var(--kl-depth);
          opacity: 0;
          animation: phFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1300ms forwards;
        }
        .ph-sub-inner { opacity: 0.78; }
        .ph-hl {
          background: linear-gradient(to top, rgba(255, 186, 26, 0.45) 38%, transparent 38%);
          font-weight: 700;
        }

        /* ── Score ring card ─────────────────────────────────────────── */
        .ph-score-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(15,30,29,0.10);
          border-radius: 18px;
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(6px);
          box-shadow: 0 18px 40px -28px rgba(15,30,29,0.25);
        }
        .ph-score-label {
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--kl-depth);
          opacity: 0.6;
          margin: 0 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ph-score-label::before {
          content: '';
          width: 18px; height: 1.5px;
          background: ${ringStroke};
        }
        .ph-ring-wrap {
          position: relative;
          width: 200px;
          height: 200px;
        }
        .ph-ring-svg {
          width: 100%; height: 100%;
          transform: rotate(-90deg);
        }
        .ph-ring-track {
          fill: none;
          stroke: rgba(15,30,29,0.10);
          stroke-width: 12;
        }
        .ph-ring-progress {
          fill: none;
          stroke: ${ringStroke};
          stroke-width: 12;
          stroke-linecap: round;
          stroke-dasharray: ${RING_C.toFixed(3)};
          stroke-dashoffset: ${RING_C.toFixed(3)};
          animation: phRingDraw 1600ms cubic-bezier(0.16, 0.65, 0.3, 1) 1700ms forwards;
        }
        .ph-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .ph-ring-num {
          font-weight: 900;
          font-size: 64px;
          letter-spacing: -0.03em;
          color: var(--kl-depth);
        }
        .ph-ring-out {
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--kl-depth);
          opacity: 0.55;
          margin-top: 8px;
        }
        .ph-band-chip {
          margin-top: 14px;
          padding: 6px 14px;
          border-radius: 999px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          background: color-mix(in srgb, ${ringStroke} 10%, transparent);
          color: ${ringStroke};
          border: 1px solid color-mix(in srgb, ${ringStroke} 35%, transparent);
        }

        /* ── Results chart card (vertical bar chart) ────────────────── */
        .ph-chart-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(15,30,29,0.10);
          border-radius: 18px;
          padding: 22px 24px 18px;
          backdrop-filter: blur(6px);
          box-shadow: 0 18px 40px -28px rgba(15,30,29,0.25);
        }
        .ph-chart-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 16px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--kl-depth);
        }
        .ph-chart-title { opacity: 0.75; font-weight: 700; }
        .ph-chart-axis { opacity: 0.45; font-weight: 600; }
        .ph-chart-bars {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          align-items: end;
          height: 130px;
          padding: 0 2px 8px;
          border-bottom: 1px dashed rgba(15,30,29,0.15);
        }
        .ph-chart-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          gap: 6px;
          min-width: 0;
        }
        .ph-chart-val {
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          font-weight: 700;
          color: var(--kl-depth);
          opacity: 0.8;
          line-height: 1;
        }
        .ph-chart-bar-track {
          flex: 1;
          width: 100%;
          max-width: 32px;
          display: flex;
          align-items: flex-end;
          background: rgba(15,30,29,0.06);
          border-radius: 4px 4px 0 0;
          overflow: hidden;
        }
        .ph-chart-bar-fill {
          width: 100%;
          height: 0;
          background: ${ringStroke};
          border-radius: 4px 4px 0 0;
          animation: phChartBarRise 1100ms cubic-bezier(0.16, 0.65, 0.3, 1) forwards;
        }
        .ph-chart-labels {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          padding-top: 10px;
        }
        .ph-chart-label {
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--kl-depth);
          opacity: 0.55;
          text-align: center;
          line-height: 1.2;
        }
        @keyframes phChartBarRise {
          to { height: var(--ph-chart-h, 0%); }
        }

        /* Keyframes */
        @keyframes phFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes phWordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes phBlink {
          0%, 100% { opacity: 1; }
          80%      { opacity: 0.25; }
        }
        @keyframes phPulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.18); opacity: 0.5; }
        }
        @keyframes phRotateBlob  { to { transform: rotate(360deg); } }
        @keyframes phRotateBlob2 { to { transform: rotate(-360deg); } }
        @keyframes phRingDraw {
          to { stroke-dashoffset: ${targetOffset.toFixed(3)}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ph-chart-bar-fill { animation: none !important; height: var(--ph-chart-h, 0%) !important; }
        }

        /* Responsive */
        @media (max-width: 980px) {
          .ph-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 48px;
          }
          .ph-graphic { align-items: center; }
          .ph-sub { margin-left: auto; margin-right: auto; }
          .ph-blob.small { display: none; }
          .ph-blob.big { left: 50%; }
        }
        @media (max-width: 540px) {
          .ph-hero { padding: 72px 20px 64px; }
          .ph-h1 { font-size: clamp(36px, 11vw, 64px); }
          .ph-firm { font-size: clamp(44px, 13vw, 80px); }
          .ph-firm.ph-firm--lg { font-size: clamp(36px, 10vw, 64px); }
          .ph-firm.ph-firm--xl { font-size: clamp(28px, 8vw, 52px); }
          .ph-sub { font-size: 16px; }
          .ph-score-card { padding: 22px 22px 20px; width: 100%; max-width: 360px; }
          .ph-ring-wrap { width: 168px; height: 168px; }
          .ph-ring-num { font-size: 54px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ph-eyebrow, .ph-h1 .ph-word, .ph-sub, .ph-graphic,
          .ph-eyebrow-dot, .ph-period, .ph-blob.big, .ph-blob.small,
          .ph-ring-progress {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .ph-h1 .ph-word { opacity: 1; transform: none; }
          .ph-eyebrow, .ph-sub, .ph-graphic { opacity: 1; }
          .ph-ring-progress { stroke-dashoffset: ${targetOffset.toFixed(3)}; }
        }
      `}</style>

      <section
        id="v10-section-1"
        data-v10-section="1"
        className="ph-root border-b border-black/10"
        aria-label="Your Research Profile"
      >
        <div className="ph-hero">
          <svg
            className="ph-blob big"
            viewBox="0 0 576 610"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
              fill="#CBD3CA"
            />
          </svg>
          <svg
            className="ph-blob small"
            viewBox="0 0 576 610"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
              fill="#D5DED4"
            />
          </svg>

          <div className="ph-inner">
            <div className="ph-text">
              <h1 className="ph-h1">
                <span className="ph-word w1">Your</span>
                <span className="ph-word w2">Revenue</span>
                <span className="ph-word w3">Map</span>
                <span className="ph-word w4">For</span>
                <br />
                <span className={`ph-word w5 ph-firm ${firmSizeClass}`.trim()}>{upperFirm}</span>
                <span className="ph-period">.</span>
              </h1>

              <p className="ph-sub">
                <span className="ph-sub-inner">
                  You're inside our{" "}
                  <span className="ph-hl">30-firm research cohort</span>.{" "}
                  <span className="ph-hl">Clear opportunities</span> identified, let's build your plan.
                </span>
              </p>
            </div>

            <div className="ph-graphic">
              <div className="ph-score-card">
                <p className="ph-score-label">Overall Score</p>
                <div
                  className="ph-ring-wrap"
                  role="img"
                  aria-label={`Overall score ${clampedOverall} out of 100, ${bandLabel}`}
                >
                  <svg className="ph-ring-svg" viewBox="0 0 200 200" aria-hidden>
                    <circle className="ph-ring-track" cx="100" cy="100" r={RING_R} />
                    <circle
                      className="ph-ring-progress"
                      cx="100"
                      cy="100"
                      r={RING_R}
                    />
                  </svg>
                  <div className="ph-ring-center">
                    <span className="ph-ring-num">{clampedOverall}</span>
                    <span className="ph-ring-out">/ 100</span>
                  </div>
                </div>
                <span className="ph-band-chip">{bandLabel}</span>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
