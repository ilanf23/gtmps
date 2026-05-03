/* ─────────────────────────────────────────────────────────────────
   AFTER THE MAP - two-paths comparison (mabbly.ai · mabbly.com)
   The disambiguation layer between seeing the map and taking action.
   ───────────────────────────────────────────────────────────────── */

const PODCAST_S6E1_HREF = "https://www.youtube.com/@GTMforPS";
const MABBLY_AI_HREF = "https://mabbly.ai";
const MABBLY_COM_HREF = "https://mabbly.com/contact";

/* tiny check icon */
const Check = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2 6.4 L4.8 9 L10 3.4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ToolFeatures = [
  "Auto signal detection",
  "Contextual outreach drafts",
  "Real-time alerts & queues",
  "Human approval workflow",
  "CRM-native integrations",
  "Custom dashboards & reports",
];

const PartnerServices = [
  "Discovery audit + RROS map",
  "Vertical-specific playbook",
  "Full GTM implementation",
  "Weekly cadence + reviews",
  "Named practitioners on your team",
  "Ongoing partnership, not a project",
];

const ToolSteps = [
  {
    title: "Connect your CRM",
    body: "HubSpot, Salesforce, Close, Pipedrive - ingest the relationships you've already built.",
  },
  {
    title: "AI scans for signals",
    body: "Job changes, funding events, content shifts - anywhere your dormant contacts re-enter the buying window.",
  },
  {
    title: "Approve & send",
    body: "Contextual outreach drafts land in your queue. You review. We send. They reply.",
  },
];

const PartnerSteps = [
  {
    title: "Discovery audit",
    body: "90-minute call. Map your CRM's Dead Zone. Quantify the dormant pipeline. No deck - a working session.",
  },
  {
    title: "Design the playbook",
    body: "RROS map customized to your vertical. Cohort segmentation. Reactivation sequences. Reviewed by Adam & Richard.",
  },
  {
    title: "Run it together",
    body: "Implementation, weekly reviews, ongoing partnership. We don't hand off and disappear. We stay through the rebuild.",
  },
];

const TableRows: Array<{ label: string; tool: string; partner: string }> = [
  { label: "Format", tool: "SaaS · Self-serve software", partner: "Agency · Done-with-you" },
  { label: "Onboarding", tool: "14-day free pilot", partner: "Discovery audit" },
  { label: "Time to value", tool: "Days", partner: "Weeks to months" },
  { label: "Owner", tool: "Your team", partner: "Mabbly's team + your team" },
  { label: "Audience", tool: "Broad B2B · 100+ CRM contacts", partner: "PS firms $5M–$100M" },
  { label: "Commitment", tool: "Month-to-month · No contract", partner: "Long-term partnership" },
];

export default function TwoPaths() {
  return (
    <section
      id="two-paths"
      className="atm-section"
      style={{
        position: "relative",
        background: "#EDF5EC",
        borderTop: "1px solid rgba(15, 30, 29, 0.08)",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* ── tokens ────────────────────────────────── */
        .atm-section {
          --color-elevation: #EDF5EC;
          --color-cream:     #F5F1E8;
          --color-card:      #fdfbf6;
          --color-depth:     #0F1E1D;
          --color-care:      #BF461A;
          --color-energy:    #FFBA1A;
          --color-purpose:   #A79014;
          --color-olive:     #CBD3CA;
          --color-voyage:    #225351;
          --ai-deep:    #1A0533;
          --ai-dark:    #241447;
          --ai-surface: #2E1050;
          --ai-mid:     #3F0F6B;
          --ai-muted:   #511688;
          --ai-violet:  #7821BF;
          --ai-light:   #9665DE;
          --ai-gold:    #FFBA1A;
          --ai-green:   #29CF9D;
          --atm-mono: 'DM Mono', ui-monospace, Menlo, monospace;
          --atm-display: 'Inter Tight', system-ui, sans-serif;
          --atm-body: 'Inter Tight', system-ui, sans-serif;
          --atm-ai-body: 'DM Sans', 'Inter', system-ui, -apple-system, 'Helvetica Neue', sans-serif;
        }

        /* ── background blob ──────────────────────── */
        .atm-blob {
          position: absolute;
          top: -240px; left: -200px;
          width: 800px; height: auto;
          opacity: 0.28;
          z-index: 0;
          animation: atm-blob-rotate 110s linear infinite;
          transform-origin: 60% 40%;
          pointer-events: none;
        }
        @keyframes atm-blob-rotate {
          to { transform: rotate(360deg); }
        }

        .atm-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 96px 32px 24px 32px;
        }

        /* ── header ───────────────────────────────── */
        .atm-eyebrow {
          font-family: var(--atm-mono);
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--color-purpose);
          margin: 0;
          font-weight: 500;
          opacity: 0;
          animation: atm-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms forwards;
        }
        .atm-rule {
          width: 56px;
          height: 2px;
          background: var(--color-energy);
          margin: 16px 0 28px;
          transform-origin: left center;
          transform: scaleX(0);
          animation: atm-drawLine 800ms cubic-bezier(0.45, 0, 0.2, 1) 400ms forwards;
        }
        .atm-headline {
          font-family: var(--atm-display);
          font-weight: 900;
          font-size: clamp(56px, 7.6vw, 124px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          color: var(--color-depth);
          margin: 0;
          max-width: 1100px;
        }
        .atm-headline .w {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          animation: atm-wordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin-right: 0.28em;
        }
        .atm-headline .w:last-child { margin-right: 0; }
        .atm-headline .w1 { animation-delay: 600ms; }
        .atm-headline .w2 { animation-delay: 750ms; }
        .atm-headline .w3 { animation-delay: 900ms; }
        .atm-headline .w4 { animation-delay: 1050ms; }
        .atm-period-violet { color: var(--ai-violet); }
        .atm-period-care { color: var(--color-care); }

        .atm-subline {
          font-family: var(--atm-body);
          font-size: 21px;
          line-height: 1.45;
          color: rgba(15, 30, 29, 0.72);
          margin: 28px 0 0;
          max-width: 760px;
          font-weight: 400;
          opacity: 0;
          animation: atm-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1200ms forwards;
        }
        .atm-subline .hl {
          background: linear-gradient(to top, rgba(255, 186, 26, 0.32) 38%, transparent 38%);
          padding: 0 2px;
        }

        /* ── junction ─────────────────────────────── */
        .atm-junction {
          position: relative;
          height: 180px;
          margin: 56px 0 8px;
          opacity: 0;
          animation: atm-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1400ms forwards;
        }
        .atm-pill {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-depth);
          color: var(--color-elevation);
          padding: 9px 18px;
          border-radius: 100px;
          font-family: var(--atm-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 28px -10px rgba(15,30,29,0.45);
          z-index: 2;
        }
        .atm-pill-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--ai-gold);
          box-shadow: 0 0 12px rgba(255,186,26,0.7);
          animation: atm-pulseDot 1.6s ease-in-out infinite;
        }
        @keyframes atm-pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.2); opacity: 0.5; }
        }
        .atm-junction-svg {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
        }
        .atm-path-stroke {
          fill: none; stroke-width: 2.5; stroke-linecap: round;
          stroke-dasharray: 800; stroke-dashoffset: 800;
          animation: atm-drawPath 1400ms cubic-bezier(0.45, 0, 0.2, 1) 1700ms forwards;
        }
        .atm-path-stroke.left  { stroke: var(--ai-violet); }
        .atm-path-stroke.right { stroke: var(--color-care); }
        @keyframes atm-drawPath { to { stroke-dashoffset: 0; } }

        .atm-path-flow {
          fill: none; stroke-width: 1.6; stroke-dasharray: 4 6; opacity: 0;
          animation: atm-flowIn 600ms ease-out 3000ms forwards, atm-dashShift 6s linear 3000ms infinite;
        }
        .atm-path-flow.left  { stroke: var(--ai-violet); }
        .atm-path-flow.right { stroke: var(--color-care); }
        @keyframes atm-flowIn { to { opacity: 0.85; } }
        @keyframes atm-dashShift { to { stroke-dashoffset: -100; } }

        /* ── grid ─────────────────────────────────── */
        .atm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 0 24px 48px;
        }
        @media (max-width: 1100px) {
          .atm-grid { grid-template-columns: 1fr; padding: 0 0 40px; }
        }

        /* ── card base ────────────────────────────── */
        .atm-card {
          position: relative;
          border-radius: 22px;
          padding: 44px 40px;
          overflow: hidden;
          opacity: 0;
          display: flex;
          flex-direction: column;
          transition: transform 300ms cubic-bezier(0.13, 0.28, 0.3, 1),
                      border-color 300ms ease,
                      box-shadow 300ms ease;
        }

        /* tool card (mabbly.ai) */
        .atm-card.tool {
          background: linear-gradient(180deg, var(--ai-deep) 0%, var(--ai-dark) 100%);
          color: var(--color-elevation);
          border: 1px solid rgba(255, 186, 26, 0.18);
          box-shadow:
            0 24px 60px -16px rgba(120, 33, 191, 0.45),
            0 0 60px -16px rgba(218, 164, 38, 0.18),
            inset 0 1px rgba(255, 255, 255, 0.08);
          font-family: var(--atm-ai-body);
          animation: atm-cardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1900ms forwards;
        }
        .atm-card.tool::before {
          content: ""; position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(120, 33, 191, 0.4) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .atm-card.tool::after {
          content: ""; position: absolute;
          bottom: -80px; left: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(41, 207, 157, 0.18) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .atm-card.tool > * { position: relative; z-index: 1; }
        .atm-card.tool:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 186, 26, 0.4);
          box-shadow:
            0 32px 72px -16px rgba(120, 33, 191, 0.6),
            0 0 80px -16px rgba(218, 164, 38, 0.25),
            inset 0 1px rgba(255, 255, 255, 0.1);
        }

        /* partner card (mabbly.com) */
        .atm-card.partner {
          background: var(--color-card);
          color: var(--color-depth);
          border: 1px solid rgba(15, 30, 29, 0.1);
          font-family: var(--atm-body);
          animation: atm-cardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2100ms forwards;
        }
        .atm-card.partner:hover {
          transform: translateY(-6px);
          border-color: var(--color-care);
          box-shadow: 0 28px 56px -28px rgba(191, 70, 26, 0.35);
        }

        /* ── chips & headers ──────────────────────── */
        .atm-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--atm-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 100px;
          font-weight: 500;
        }
        .atm-tag.tool {
          color: var(--ai-gold);
          border: 1px solid rgba(255,186,26,0.35);
          background: rgba(255,186,26,0.08);
        }
        .atm-tag.partner {
          color: var(--color-care);
          border: 1px solid rgba(191,70,26,0.32);
          background: rgba(191,70,26,0.05);
        }
        .atm-tag.partner::before {
          content: "";
          width: 7px; height: 7px;
          border-radius: 50%;
          background: currentColor;
          display: inline-block;
        }

        .atm-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .atm-domain {
          font-family: var(--atm-display);
          font-weight: 900;
          font-size: clamp(48px, 5.4vw, 84px);
          line-height: 0.92;
          letter-spacing: -0.03em;
          text-transform: lowercase;
          margin: 28px 0 12px;
        }

        .atm-product-line {
          font-family: var(--atm-mono);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          margin: 0 0 18px;
        }
        .atm-product-line.tool    { color: var(--ai-green); }
        .atm-product-line.partner { color: var(--color-purpose); }

        .atm-tagline {
          font-family: var(--atm-display);
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.01em;
          line-height: 1.22;
          margin: 0 0 16px;
        }

        .atm-desc {
          font-size: 15px;
          line-height: 1.55;
          margin: 0 0 32px;
          opacity: 0.82;
        }

        /* ── subsection (numbered) ────────────────── */
        .atm-sub {
          padding-top: 24px;
          margin-top: 24px;
          border-top: 1px solid;
        }
        .atm-card.tool .atm-sub    { border-color: rgba(150, 101, 222, 0.22); }
        .atm-card.partner .atm-sub { border-color: rgba(15, 30, 29, 0.1); }

        .atm-sub-head {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--atm-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 500;
          margin: 0 0 18px;
        }
        .atm-num {
          width: 22px; height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center; justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .atm-card.tool .atm-num {
          background: rgba(120, 33, 191, 0.35);
          color: var(--ai-gold);
          border: 1px solid rgba(255, 186, 26, 0.4);
        }
        .atm-card.partner .atm-num {
          background: rgba(191, 70, 26, 0.1);
          color: var(--color-care);
          border: 1px solid rgba(191, 70, 26, 0.3);
        }

        /* steps */
        .atm-steps { display: grid; gap: 14px; }
        .atm-step {
          display: grid;
          grid-template-columns: 26px 1fr;
          gap: 12px;
          align-items: start;
        }
        .atm-step-num {
          width: 22px; height: 22px;
          border-radius: 5px;
          display: inline-flex;
          align-items: center; justify-content: center;
          font-family: var(--atm-mono);
          font-size: 11px;
          font-weight: 700;
          margin-top: 2px;
        }
        .atm-card.tool .atm-step-num {
          background: var(--ai-violet);
          color: #fff;
          box-shadow: 0 0 16px rgba(120, 33, 191, 0.5);
        }
        .atm-card.partner .atm-step-num {
          background: var(--color-care);
          color: var(--color-card);
        }
        .atm-step-title {
          font-weight: 700;
          font-size: 15px;
          margin: 0 0 3px;
        }
        .atm-step-body {
          font-size: 13px;
          line-height: 1.45;
          opacity: 0.7;
          margin: 0;
        }

        /* features grid */
        .atm-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
        }
        @media (max-width: 600px) {
          .atm-features { grid-template-columns: 1fr; }
        }
        .atm-feature {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          line-height: 1.4;
        }
        .atm-feature-check {
          flex: 0 0 auto;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center; justify-content: center;
        }
        .atm-card.tool .atm-feature-check {
          background: rgba(41, 207, 157, 0.15);
          border: 1px solid rgba(41, 207, 157, 0.4);
        }
        .atm-card.partner .atm-feature-check {
          background: rgba(191, 70, 26, 0.08);
          border: 1px solid rgba(191, 70, 26, 0.3);
        }

        /* engagement (partner only) */
        .atm-engage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .atm-engage-cell {
          padding: 10px 12px 10px 14px;
          border-left: 2px solid var(--color-care);
          background: rgba(191, 70, 26, 0.03);
        }
        .atm-engage-label {
          font-family: var(--atm-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.5);
          margin: 0 0 4px;
        }
        .atm-engage-val {
          font-size: 13px;
          font-weight: 600;
          margin: 0;
          color: var(--color-depth);
        }

        /* best for callout */
        .atm-callout {
          padding: 14px 16px;
          border-radius: 6px;
          border-left: 3px solid;
        }
        .atm-card.tool .atm-callout {
          border-color: var(--ai-green);
          background: rgba(41, 207, 157, 0.08);
        }
        .atm-card.partner .atm-callout {
          border-color: var(--color-care);
          background: rgba(191, 70, 26, 0.05);
        }
        .atm-callout-label {
          font-family: var(--atm-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 0 0 6px;
          opacity: 0.7;
        }
        .atm-callout-text {
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }

        /* footer */
        .atm-card-foot {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .atm-card.tool .atm-card-foot    { border-color: rgba(150, 101, 222, 0.22); }
        .atm-card.partner .atm-card-foot { border-color: rgba(15, 30, 29, 0.1); }

        .atm-meta {
          font-family: var(--atm-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.6;
        }

        .atm-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 100px;
          font-family: var(--atm-display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 300ms ease, color 300ms ease, transform 200ms ease, box-shadow 300ms ease;
          border: none;
          cursor: pointer;
        }
        .atm-cta-arrow {
          display: inline-block;
          transition: transform 350ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .atm-cta:hover .atm-cta-arrow { transform: translateX(5px); }

        .atm-cta.tool {
          background: var(--ai-violet);
          color: #fff;
          box-shadow:
            0 8px 24px -8px rgba(120, 33, 191, 0.6),
            inset 0 0 0 1px rgba(255, 186, 26, 0.2);
        }
        .atm-cta.tool:hover {
          background: var(--ai-light);
          box-shadow:
            0 12px 32px -8px rgba(120, 33, 191, 0.7),
            inset 0 0 0 1px rgba(255, 186, 26, 0.4);
        }
        .atm-cta.partner {
          background: var(--color-care);
          color: var(--color-card);
        }
        .atm-cta.partner:hover {
          background: var(--color-depth);
          transform: translateY(-1px);
        }

        @keyframes atm-cardIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── card icons (radar / diamond) ─────────── */
        .atm-card-icon {
          width: 88px; height: 88px;
          flex: 0 0 auto;
        }
        .atm-radar-arc {
          transform-origin: center;
          transform-box: fill-box;
          animation: atm-radarPulse 2.4s ease-out infinite;
        }
        .atm-radar-arc.r1 { animation-delay: 0s; }
        .atm-radar-arc.r2 { animation-delay: 0.6s; }
        .atm-radar-arc.r3 { animation-delay: 1.2s; }
        @keyframes atm-radarPulse {
          0%   { opacity: 0.9; transform: scale(0.5); }
          100% { opacity: 0;   transform: scale(1.4); }
        }
        .atm-sparkle {
          transform-origin: center;
          transform-box: fill-box;
          animation: atm-sparkleFlash 2.8s ease-in-out infinite;
        }
        .atm-sparkle.s1 { animation-delay: 0s; }
        .atm-sparkle.s2 { animation-delay: 0.7s; }
        .atm-sparkle.s3 { animation-delay: 1.4s; }
        .atm-sparkle.s4 { animation-delay: 2.1s; }
        @keyframes atm-sparkleFlash {
          0%, 90%, 100% { opacity: 0; transform: scale(0.5); }
          20%, 50%      { opacity: 1; transform: scale(1); }
        }

        /* ── glance table ─────────────────────────── */
        .atm-glance-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--atm-mono);
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--color-purpose);
          margin: 24px 0 18px;
          padding: 0 24px;
          font-weight: 500;
        }
        .atm-glance-eyebrow::after {
          content: "";
          flex: 1 1 auto;
          height: 1px;
          background: rgba(167, 144, 20, 0.4);
        }
        .atm-table-wrap {
          margin: 0 24px;
          background: var(--color-card);
          border: 1px solid rgba(15, 30, 29, 0.08);
          border-radius: 14px;
          overflow: hidden;
          opacity: 0;
          animation: atm-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2400ms forwards;
        }
        @media (max-width: 1100px) {
          .atm-table-wrap, .atm-glance-eyebrow { margin: 0; }
        }
        .atm-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--atm-body);
        }
        .atm-table thead th {
          font-family: var(--atm-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 18px 20px;
          text-align: left;
        }
        .atm-table th.label-col {
          background: rgba(15, 30, 29, 0.04);
          color: rgba(15, 30, 29, 0.55);
          width: 24%;
        }
        .atm-table th.tool-col {
          background: linear-gradient(180deg, rgba(120, 33, 191, 0.08), rgba(120, 33, 191, 0.02));
          color: var(--ai-violet);
        }
        .atm-table th.partner-col {
          background: linear-gradient(180deg, rgba(191, 70, 26, 0.08), rgba(191, 70, 26, 0.02));
          color: var(--color-care);
        }
        .atm-table tbody td {
          padding: 16px 20px;
          font-size: 14px;
          border-top: 1px solid rgba(15, 30, 29, 0.06);
          vertical-align: top;
        }
        .atm-table td.label-cell {
          font-family: var(--atm-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.55);
          font-weight: 500;
          background: rgba(15, 30, 29, 0.02);
        }
        .atm-table td.tool-cell {
          color: var(--ai-violet);
          font-weight: 600;
        }
        .atm-table td.partner-cell {
          color: var(--color-care);
          font-weight: 600;
        }

        /* ── final pill ───────────────────────────── */
        .atm-final {
          display: flex;
          justify-content: center;
          margin: 36px 24px 0;
          opacity: 0;
          animation: atm-fadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2700ms forwards;
        }
        .atm-final-line {
          font-family: var(--atm-body);
          font-size: 14px;
          color: rgba(15, 30, 29, 0.78);
          line-height: 1.4;
          margin: 0;
          text-align: center;
        }
        .atm-final-link {
          color: #BF461A;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid #BF461A;
          padding-bottom: 1px;
          transition: color 200ms ease, border-color 200ms ease;
        }
        .atm-final-link:hover {
          color: var(--color-depth);
          border-bottom-color: var(--color-depth);
        }

        /* ── shared keyframes ─────────────────────── */
        @keyframes atm-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes atm-drawLine {
          to { transform: scaleX(1); }
        }
        @keyframes atm-wordIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── responsive ───────────────────────────── */
        @media (max-width: 720px) {
          .atm-inner { padding: 72px 20px 24px; }
          .atm-card { padding: 32px 26px; }
          .atm-card-head { flex-direction: column; align-items: flex-start; }
          .atm-card-icon { width: 64px; height: 64px; }
          .atm-card-foot { flex-direction: column; align-items: flex-start; }
          .atm-table thead th, .atm-table tbody td { padding: 12px 14px; font-size: 13px; }
          .atm-features { grid-template-columns: 1fr; }
          .atm-engage { grid-template-columns: 1fr; }
        }

        /* ── reduced motion ───────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .atm-section *,
          .atm-section *::before,
          .atm-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .atm-section .atm-headline .w,
          .atm-section .atm-eyebrow,
          .atm-section .atm-subline,
          .atm-section .atm-junction,
          .atm-section .atm-table-wrap,
          .atm-section .atm-final,
          .atm-section .atm-card { opacity: 1; transform: none; }
          .atm-section .atm-rule { transform: scaleX(1); }
          .atm-section .atm-path-stroke { stroke-dashoffset: 0; }
          .atm-section .atm-path-flow { opacity: 0.85; }
        }
      `}</style>

      {/* background scribble blob */}
      <svg className="atm-blob" viewBox="0 0 576 610" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
          fill="#CBD3CA"
        />
      </svg>

      <div className="atm-inner">
        {/* HEADER */}
        <p className="atm-eyebrow">After the Map</p>
        <div className="atm-rule" aria-hidden />
        <h2 className="atm-headline">
          <span className="w w1">A</span>
          <span className="w w2">
            tool<span className="atm-period-violet">.</span>
          </span>
          <span className="w w3">Or</span>
          <span className="w w4">
            a partner<span className="atm-period-care">.</span>
          </span>
        </h2>
        <p className="atm-subline">
          Same framework. <span className="hl">Two ways to act</span> on what your map shows. Choose the side that fits how your firm wants to work.
        </p>

        {/* JUNCTION */}
        <div className="atm-junction" aria-hidden>
          <div className="atm-pill">
            <span className="atm-pill-dot" />
            <span>Your Map</span>
          </div>
          <svg className="atm-junction-svg" viewBox="0 0 1000 180" preserveAspectRatio="none">
            <path className="atm-path-stroke left"  d="M 500 36 C 500 90, 320 90, 200 160" />
            <path className="atm-path-stroke right" d="M 500 36 C 500 90, 680 90, 800 160" />
            <path className="atm-path-flow left"    d="M 500 36 C 500 90, 320 90, 200 160" />
            <path className="atm-path-flow right"   d="M 500 36 C 500 90, 680 90, 800 160" />
          </svg>
        </div>

        {/* CARDS */}
        <div className="atm-grid">
          {/* ── TOOL · mabbly.ai ─────────────────────── */}
          <article className="atm-card tool">
            <div className="atm-card-head">
              <div>
                <span className="atm-tag tool">The Tool · SaaS</span>
                <h3 className="atm-domain">
                  <span style={{ color: "var(--color-elevation)" }}>mabbly</span>
                  <span style={{ color: "var(--ai-light)" }}>.ai</span>
                </h3>
                <p className="atm-product-line tool">NurtureOS · Signal Activated Growth</p>
              </div>
              <svg className="atm-card-icon" viewBox="0 0 96 96" aria-hidden>
                <circle cx="48" cy="48" r="44" fill="none" stroke="#9665DE" strokeWidth="1" opacity="0.3" />
                <circle cx="48" cy="48" r="34" fill="none" stroke="#9665DE" strokeWidth="1" opacity="0.4" />
                <circle cx="48" cy="48" r="22" fill="none" stroke="#9665DE" strokeWidth="1.5" opacity="0.6" />
                <circle className="atm-radar-arc r1" cx="48" cy="48" r="22" fill="none" stroke="#FFBA1A" strokeWidth="2" />
                <circle className="atm-radar-arc r2" cx="48" cy="48" r="22" fill="none" stroke="#FFBA1A" strokeWidth="2" />
                <circle className="atm-radar-arc r3" cx="48" cy="48" r="22" fill="none" stroke="#FFBA1A" strokeWidth="2" />
                <circle cx="48" cy="48" r="6" fill="#FFBA1A" />
                <circle cx="48" cy="48" r="2.5" fill="#1A0533" />
                <circle cx="72" cy="32" r="4" fill="#29CF9D" />
                <line x1="48" y1="48" x2="72" y2="32" stroke="#29CF9D" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
              </svg>
            </div>

            <p className="atm-tagline">Wake dormant relationships. Automatically.</p>
            <p className="atm-desc">
              Software that watches your CRM for buying signals, drafts contextual outreach, and routes hot leads back
              to your inbox the moment a forgotten relationship lights up. Human-approved. Always on.
            </p>

            {/* 01 How It Works */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">01</span>
                How It Works
              </p>
              <div className="atm-steps">
                {ToolSteps.map((s, i) => (
                  <div key={s.title} className="atm-step">
                    <span className="atm-step-num">{i + 1}</span>
                    <div>
                      <p className="atm-step-title">{s.title}</p>
                      <p className="atm-step-body">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 02 Core Features */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">02</span>
                Core Features
              </p>
              <div className="atm-features">
                {ToolFeatures.map((f) => (
                  <div key={f} className="atm-feature">
                    <span className="atm-feature-check">
                      <Check color="#29CF9D" />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 Best For */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">03</span>
                Best For
              </p>
              <div className="atm-callout">
                <p className="atm-callout-label" style={{ color: "var(--ai-green)" }}>Audience</p>
                <p className="atm-callout-text">
                  B2B sales, RevOps and ops teams with 100+ CRM contacts who want a tool - not a vendor relationship.
                </p>
              </div>
            </div>

            <div className="atm-card-foot">
              <span className="atm-meta">Founded 2024 · Adam Fridman</span>
              <a className="atm-cta tool" href={MABBLY_AI_HREF} target="_blank" rel="noopener noreferrer">
                Start Free Pilot <span className="atm-cta-arrow">→</span>
              </a>
            </div>
          </article>

          {/* ── PARTNER · mabbly.com ─────────────────── */}
          <article className="atm-card partner">
            <div className="atm-card-head">
              <div>
                <span className="atm-tag partner">The Partner · Agency</span>
                <h3 className="atm-domain">
                  <span style={{ color: "var(--color-depth)" }}>mabbly</span>
                  <span style={{ color: "var(--color-care)" }}>.com</span>
                </h3>
                <p className="atm-product-line partner">GTM for Professional Services · Done with you</p>
              </div>
              <svg className="atm-card-icon" viewBox="0 0 96 96" aria-hidden>
                <g fill="none" stroke="#0F1E1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 14 22 L 14 32 M 14 22 L 24 22" />
                  <path d="M 82 22 L 82 32 M 82 22 L 72 22" />
                  <path d="M 14 74 L 14 64 M 14 74 L 24 74" />
                  <path d="M 82 74 L 82 64 M 82 74 L 72 74" />
                </g>
                <g transform="translate(48 48)">
                  <path
                    d="M -22 -8 L 0 -28 L 22 -8 L 12 22 L -12 22 Z"
                    fill="#BF461A" stroke="#0F1E1D" strokeWidth="2" strokeLinejoin="round"
                  />
                  <path
                    d="M -22 -8 L 22 -8 M -12 22 L 0 -28 L 12 22 M -22 -8 L -6 -8 L 0 -28 M 22 -8 L 6 -8 L 0 -28"
                    fill="none" stroke="#0F1E1D" strokeWidth="1.4" opacity="0.85"
                  />
                </g>
                <g fill="#BF461A">
                  <path className="atm-sparkle s1" d="M 22 18 L 24 22 L 28 24 L 24 26 L 22 30 L 20 26 L 16 24 L 20 22 Z" />
                  <path className="atm-sparkle s2" d="M 76 30 L 77 33 L 80 34 L 77 35 L 76 38 L 75 35 L 72 34 L 75 33 Z" />
                  <path className="atm-sparkle s3" d="M 18 70 L 19 72 L 21 73 L 19 74 L 18 76 L 17 74 L 15 73 L 17 72 Z" />
                  <path className="atm-sparkle s4" d="M 78 68 L 79 71 L 82 72 L 79 73 L 78 76 L 77 73 L 74 72 L 77 71 Z" />
                </g>
              </svg>
            </div>

            <p className="atm-tagline">A team to run the playbook. With you.</p>
            <p className="atm-desc">
              GTM for professional services, run by Mabbly's team. We build your map, run the playbook with you, and
              stay through the rebuild - alongside the named practitioners from the book.
            </p>

            {/* 01 How It Works */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">01</span>
                How It Works
              </p>
              <div className="atm-steps">
                {PartnerSteps.map((s, i) => (
                  <div key={s.title} className="atm-step">
                    <span className="atm-step-num">{i + 1}</span>
                    <div>
                      <p className="atm-step-title">{s.title}</p>
                      <p className="atm-step-body">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 02 Core Services */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">02</span>
                Core Services
              </p>
              <div className="atm-features">
                {PartnerServices.map((f) => (
                  <div key={f} className="atm-feature">
                    <span className="atm-feature-check">
                      <Check color="#BF461A" />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 Engagement */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">03</span>
                Engagement
              </p>
              <div className="atm-engage">
                <div className="atm-engage-cell">
                  <p className="atm-engage-label">Format</p>
                  <p className="atm-engage-val">Custom retainer</p>
                </div>
                <div className="atm-engage-cell">
                  <p className="atm-engage-label">Onboarding</p>
                  <p className="atm-engage-val">Discovery audit</p>
                </div>
                <div className="atm-engage-cell">
                  <p className="atm-engage-label">Cadence</p>
                  <p className="atm-engage-val">Weekly working session</p>
                </div>
                <div className="atm-engage-cell">
                  <p className="atm-engage-label">Cohort</p>
                  <p className="atm-engage-val">30-firm research</p>
                </div>
              </div>
            </div>

            {/* 04 Best For */}
            <div className="atm-sub">
              <p className="atm-sub-head">
                <span className="atm-num">04</span>
                Best For
              </p>
              <div className="atm-callout">
                <p className="atm-callout-label" style={{ color: "var(--color-care)" }}>Audience</p>
                <p className="atm-callout-text">
                  PS firms $5M–$100M - managing partners, CMOs, founders - that want a partner running the playbook
                  with them, not software running it for them.
                </p>
              </div>
            </div>

            <div className="atm-card-foot">
              <span className="atm-meta">By application · Confidential</span>
              <a className="atm-cta partner" href={MABBLY_COM_HREF} target="_blank" rel="noopener noreferrer">
                Book a Discovery <span className="atm-cta-arrow">→</span>
              </a>
            </div>
          </article>
        </div>

        {/* AT A GLANCE */}
        <p className="atm-glance-eyebrow">At a Glance</p>
        <div className="atm-table-wrap">
          <table className="atm-table">
            <thead>
              <tr>
                <th className="label-col" />
                <th className="tool-col">mabbly.ai · The Tool</th>
                <th className="partner-col">mabbly.com · The Partner</th>
              </tr>
            </thead>
            <tbody>
              {TableRows.map((r) => (
                <tr key={r.label}>
                  <td className="label-cell">{r.label}</td>
                  <td className="tool-cell">{r.tool}</td>
                  <td className="partner-cell">{r.partner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FINAL PILL */}
        <div className="atm-final">
          <p className="atm-final-line">
            Want to learn more about GTM for PS?{' '}
            <a
              className="atm-final-link"
              href={PODCAST_S6E1_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check out recent episode
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
