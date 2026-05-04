import { useEffect, useRef, useState } from 'react';

// Slot 03 - ReceiptsStrip.
//
// Madcraft hero-card on the left + 2x2 supporting grid (Outcomes / Long-term
// Partners) on the right. Numeric stats count up via IntersectionObserver
// when the section first enters the viewport.

interface NumericStat {
  target: number;
  prefix?: string;
  suffix?: string;
  isFloat?: boolean;
}

function CountUpStat({
  active,
  stat,
  className,
  startDelay = 200,
}: {
  active: boolean;
  stat: NumericStat;
  className?: string;
  startDelay?: number;
}) {
  const [display, setDisplay] = useState(`${stat.prefix ?? ''}0${stat.suffix ?? ''}`);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const duration = 1600;
    const start = performance.now() + startDelay;

    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      const val = stat.isFloat
        ? (eased * stat.target).toFixed(1)
        : Math.round(eased * stat.target).toString();
      setDisplay(`${stat.prefix ?? ''}${val}${stat.suffix ?? ''}`);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, stat.target, stat.prefix, stat.suffix, stat.isFloat, startDelay]);

  return <span className={className}>{display}</span>;
}

export default function ReceiptsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="receipts"
      ref={sectionRef}
      data-revealed={revealed ? 'true' : 'false'}
      style={{
        background: '#F5F1E8',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 56px',
      }}
    >
      <style>{`
        :root {
          --rcpt-elevation: #EDF5EC;
          --rcpt-cream: #F5F1E8;
          --rcpt-card: #fdfbf6;
          --rcpt-depth: #0F1E1D;
          --rcpt-care: #BF461A;
          --rcpt-energy: #FFBA1A;
          --rcpt-purpose: #A79014;
          --rcpt-olive: #CBD3CA;
          --rcpt-trans: #D5DED4;
        }

        .rcpt-section { position: relative; z-index: 1; }
        .rcpt-blob {
          position: absolute;
          bottom: -200px;
          right: -180px;
          width: 720px;
          height: auto;
          opacity: 0.35;
          pointer-events: none;
          animation: blobRotate 90s linear infinite;
          z-index: 0;
        }
        @keyframes blobRotate {
          to { transform: rotate(360deg); }
        }

        .rcpt-shell { max-width: 1240px; margin: 0 auto; position: relative; z-index: 2; }

        .rcpt-head { text-align: center; padding: 0 32px 32px; }
        .rcpt-num {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--rcpt-purpose);
          margin: 0;
          opacity: 0;
          transform: translateY(12px);
        }
        [data-revealed="true"] .rcpt-num {
          animation: rcptFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
        }
        .rcpt-rule {
          display: block;
          width: 64px;
          height: 2px;
          background: var(--rcpt-purpose);
          margin: 18px auto 28px;
          transform: scaleX(0);
          transform-origin: left;
        }
        [data-revealed="true"] .rcpt-rule {
          animation: rcptDrawLine 800ms cubic-bezier(0.45, 0, 0.2, 1) 400ms forwards;
        }
        .rcpt-h2 {
          font-family: 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 7.6vw, 124px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          color: var(--rcpt-depth);
          margin: 0 0 22px;
        }
        .rcpt-h2 .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          margin-right: 0.25em;
        }
        .rcpt-h2 .word:last-child { margin-right: 0; }
        [data-revealed="true"] .rcpt-h2 .w1 {
          animation: rcptWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 600ms forwards;
        }
        [data-revealed="true"] .rcpt-h2 .w2 {
          animation: rcptWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 750ms forwards;
        }
        [data-revealed="true"] .rcpt-h2 .w3 {
          animation: rcptWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) 900ms forwards;
        }
        .rcpt-h2 .period { color: var(--rcpt-care); }
        .rcpt-sub {
          font-family: 'Instrument Sans', 'Inter Tight', system-ui, sans-serif;
          font-size: 21px;
          line-height: 1.45;
          color: var(--rcpt-depth);
          opacity: 0;
          transform: translateY(12px);
          margin: 0 auto;
          max-width: 60ch;
        }
        [data-revealed="true"] .rcpt-sub {
          animation: rcptFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1100ms forwards;
        }

        /* Receipts row */
        .rcpt-row {
          display: grid;
          grid-template-columns: 1.15fr 1.4fr;
          gap: 32px;
          margin-top: 56px;
        }
        @media (max-width: 1100px) {
          .rcpt-row { grid-template-columns: 1fr; }
        }

        .rcpt-card {
          background: var(--rcpt-card);
          border: 1px solid rgba(15, 30, 29, 0.12);
          border-radius: 14px;
          padding: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition:
            transform 300ms cubic-bezier(0.13, 0.28, 0.3, 1),
            border-color 300ms ease,
            box-shadow 300ms ease;
          opacity: 0;
          transform: translateY(24px);
        }
        .rcpt-card:hover {
          transform: translateY(-4px);
          border-color: var(--rcpt-care);
          box-shadow: 0 16px 32px -16px rgba(15, 30, 29, 0.15);
        }

        /* Hero card */
        .rcpt-hero {
          padding: 36px 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-height: 100%;
        }
        [data-revealed="true"] .rcpt-hero {
          animation: rcptCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1300ms forwards;
        }
        .rcpt-hero:hover {
          box-shadow: 0 24px 48px -24px rgba(15, 30, 29, 0.18);
        }
        .rcpt-hero-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .firm-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rcpt-depth);
          opacity: 0.85;
        }
        .firm-tag::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--rcpt-care);
          animation: pulseDot 1.6s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.15); opacity: 0.5; }
        }
        .rcpt-rank {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rcpt-purpose);
          text-align: right;
        }

        .stopwatch {
          position: absolute;
          top: 70px;
          right: 32px;
          width: 120px;
          height: 130px;
          opacity: 0;
          transform: translateY(12px);
        }
        [data-revealed="true"] .stopwatch {
          animation: rcptFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1700ms forwards;
        }
        .stopwatch .hand {
          transform-origin: 60px 64px;
          animation: tickHand 7s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @keyframes tickHand {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1100px) {
          .stopwatch { width: 90px; height: 98px; top: 64px; right: 24px; }
        }

        .rcpt-hero-stat {
          font-family: 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(80px, 9vw, 168px);
          line-height: 0.85;
          letter-spacing: -0.04em;
          color: var(--rcpt-purpose);
          margin: 0;
          font-variant-numeric: tabular-nums;
          /* Reserve space on the right so the absolutely-positioned
             stopwatch (top:70/right:32/width:120) never overlaps the
             "$400K" glyphs. Match stopwatch width + right inset + gap. */
          padding-right: clamp(116px, 14vw, 168px);
        }
        @media (max-width: 1100px) {
          .rcpt-hero-stat { padding-right: clamp(96px, 12vw, 124px); }
        }
        .rcpt-hero-stat-sub {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rcpt-depth);
          opacity: 0.7;
          margin: 8px 0 0;
        }
        .rcpt-hero-narrative {
          font-family: 'Instrument Sans', 'Inter Tight', system-ui, sans-serif;
          font-size: 19px;
          line-height: 1.5;
          color: var(--rcpt-depth);
          opacity: 0.88;
          max-width: 38ch;
          margin: 0;
        }
        .hl-mustard {
          background: linear-gradient(to top, rgba(167, 144, 20, 0.32) 38%, transparent 38%);
          padding: 0 0.05em;
        }
        .hl-care {
          background: linear-gradient(to top, rgba(191, 70, 26, 0.28) 38%, transparent 38%);
          padding: 0 0.05em;
        }

        .rcpt-hero-timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin-top: 4px;
          padding: 18px 0 4px;
          border-top: 1px solid rgba(15, 30, 29, 0.08);
          position: relative;
        }
        .rcpt-hero-timeline::before {
          content: '';
          position: absolute;
          top: 38px;
          left: 12%;
          right: 12%;
          height: 1px;
          background: repeating-linear-gradient(
            to right,
            rgba(15, 30, 29, 0.22) 0,
            rgba(15, 30, 29, 0.22) 4px,
            transparent 4px,
            transparent 9px
          );
        }
        .tl-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .tl-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--rcpt-card);
          border: 2px solid var(--rcpt-depth);
          margin-top: 8px;
        }
        .tl-step.tl-end .tl-dot {
          background: var(--rcpt-care);
          border-color: var(--rcpt-care);
          box-shadow: 0 0 0 4px rgba(191, 70, 26, 0.18);
        }
        .tl-step.tl-mid .tl-dot {
          background: var(--rcpt-card);
          border-color: var(--rcpt-depth);
          opacity: 0.45;
        }
        .tl-eyebrow {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rcpt-depth);
          opacity: 0.55;
        }
        .tl-step.tl-end .tl-eyebrow { color: var(--rcpt-care); opacity: 1; }
        .tl-label {
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: var(--rcpt-depth);
          line-height: 1.25;
        }
        .tl-step.tl-mid .tl-label { opacity: 0.7; }

        .rcpt-hero-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: auto;
          padding-top: 12px;
        }
        .practitioner {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b89870, #6d4c2c);
          border: 1.5px solid var(--rcpt-purpose);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .avatar svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .practitioner-name {
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--rcpt-depth);
          margin: 0;
          line-height: 1.25;
        }
        .practitioner-role {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--rcpt-depth);
          opacity: 0.6;
          margin: 2px 0 0;
        }

        .pill-care {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1.5px solid var(--rcpt-care);
          background: transparent;
          color: var(--rcpt-care);
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-decoration: none;
          cursor: pointer;
          transition:
            background 220ms ease,
            color 220ms ease;
        }
        .pill-care .arrow {
          display: inline-block;
          transition: transform 280ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .pill-care:hover {
          background: var(--rcpt-care);
          color: var(--rcpt-elevation);
        }
        .pill-care:hover .arrow { transform: translateX(4px); }

        /* Tier blocks */
        .tier-block + .tier-block { margin-top: 28px; }
        .tier-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0 0 14px;
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--rcpt-purpose);
        }
        .tier-line {
          flex: 1;
          height: 1px;
          background: var(--rcpt-purpose);
          opacity: 0.4;
        }
        .tier-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 720px) {
          .tier-row { grid-template-columns: 1fr; }
        }

        .rcpt-card-sm { padding: 24px; }
        [data-revealed="true"] .rcpt-card-sm.delay-1 {
          animation: rcptCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1500ms forwards;
        }
        [data-revealed="true"] .rcpt-card-sm.delay-2 {
          animation: rcptCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1650ms forwards;
        }
        [data-revealed="true"] .rcpt-card-sm.delay-3 {
          animation: rcptCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1800ms forwards;
        }
        [data-revealed="true"] .rcpt-card-sm.delay-4 {
          animation: rcptCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1950ms forwards;
        }

        .card-firm {
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rcpt-depth);
          opacity: 0.75;
          margin: 0 0 14px;
          position: relative;
          display: inline-block;
        }
        .card-firm::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -3px;
          height: 1.5px;
          background: var(--rcpt-care);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 350ms cubic-bezier(0.13, 0.28, 0.3, 1);
        }
        .rcpt-card:hover .card-firm::after { transform: scaleX(1); }
        .card-stat {
          font-family: 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(36px, 4vw, 56px);
          letter-spacing: -0.03em;
          color: var(--rcpt-purpose);
          margin: 0 0 10px;
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }
        .card-stat.qualitative {
          font-size: clamp(28px, 3vw, 40px);
        }
        .card-sub {
          font-family: 'Instrument Sans', 'Inter Tight', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: var(--rcpt-depth);
          opacity: 0.75;
          margin: 0 0 18px;
        }
        .card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
          font-family: 'DM Mono', 'IBM Plex Mono', Menlo, monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--rcpt-depth);
          opacity: 0.7;
        }
        .card-foot .arrow {
          color: var(--rcpt-care);
          opacity: 0;
          transform: translateX(-4px);
          transition:
            opacity 280ms ease,
            transform 280ms ease;
        }
        .rcpt-card:hover .card-foot .arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Section footer */
        .rcpt-foot {
          margin-top: 56px;
          padding-top: 28px;
          border-top: 1px solid rgba(15, 30, 29, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          opacity: 0;
          transform: translateY(12px);
        }
        [data-revealed="true"] .rcpt-foot {
          animation: rcptFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2200ms forwards;
        }
        .rcpt-foot p {
          margin: 0;
          font-family: 'Instrument Sans', 'Inter Tight', system-ui, sans-serif;
          font-size: 15px;
          color: var(--rcpt-depth);
          opacity: 0.78;
          max-width: 56ch;
        }
        .rcpt-foot p strong {
          color: var(--rcpt-depth);
          opacity: 1;
          font-weight: 700;
        }
        .pill-depth {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 999px;
          background: var(--rcpt-depth);
          color: var(--rcpt-elevation);
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-decoration: none;
          white-space: nowrap;
          transition:
            background 220ms ease,
            transform 200ms ease;
        }
        .pill-depth:hover {
          background: var(--rcpt-care);
          transform: translateY(-1px);
        }
        @media (max-width: 720px) {
          .rcpt-foot { flex-direction: column; align-items: flex-start; }
        }

        /* Keyframes */
        @keyframes rcptFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rcptDrawLine {
          to { transform: scaleX(1); }
        }
        @keyframes rcptWordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rcptCardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 720px) {
          .rcpt-section[id="receipts"],
          section[id="receipts"] { padding: 72px 24px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rcpt-num,
          .rcpt-rule,
          .rcpt-h2 .word,
          .rcpt-sub,
          .rcpt-card,
          .rcpt-hero,
          .rcpt-card-sm,
          .stopwatch,
          .rcpt-foot,
          .rcpt-blob,
          .stopwatch .hand,
          .firm-tag::before {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .rcpt-num,
          .rcpt-sub,
          .rcpt-card,
          .rcpt-hero,
          .rcpt-card-sm,
          .stopwatch,
          .rcpt-foot { opacity: 1; transform: none; }
          .rcpt-rule { transform: scaleX(1); }
          .rcpt-h2 .word { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Background blob */}
      <svg
        className="rcpt-blob"
        viewBox="0 0 576 610"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
          fill="#CBD3CA"
        />
      </svg>

      <div className="rcpt-shell">
        <header className="rcpt-head">
          <span className="rcpt-rule" aria-hidden />
          <h2 className="rcpt-h2">
            <span className="word w1">Receipts</span>{' '}
            <span className="word w2">beat</span>{' '}
            <span className="word w3">
              claims<span className="period">.</span>
            </span>
          </h2>
          <p className="rcpt-sub">
            Five named firms. Hard outcomes. The same playbook, now in the book.
          </p>
        </header>

        <div className="rcpt-row">
          {/* Hero card - Madcraft */}
          <article className="rcpt-card rcpt-hero">
            <div className="rcpt-hero-top">
              <span className="firm-tag">Madcraft · Verified</span>
              <span className="rcpt-rank">The Marquee Story</span>
            </div>

            {/* Stopwatch SVG */}
            <svg
              className="stopwatch"
              viewBox="0 0 120 130"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="52" y="6" width="16" height="10" rx="2" fill="#0F1E1D" />
              <line x1="60" y1="0" x2="60" y2="6" stroke="#0F1E1D" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="64" r="50" fill="#fdfbf6" stroke="#0F1E1D" strokeWidth="2.5" />
              <circle cx="60" cy="64" r="46" fill="none" stroke="#0F1E1D" strokeWidth="0.6" opacity="0.3" />
              <g stroke="#0F1E1D" strokeWidth="2" strokeLinecap="round">
                <line x1="60" y1="20" x2="60" y2="28" />
                <line x1="100" y1="64" x2="92" y2="64" />
                <line x1="60" y1="108" x2="60" y2="100" />
                <line x1="20" y1="64" x2="28" y2="64" />
              </g>
              <g stroke="#0F1E1D" strokeWidth="1" strokeLinecap="round" opacity="0.55">
                <line x1="80" y1="29" x2="77" y2="33" />
                <line x1="91" y1="44" x2="87" y2="47" />
                <line x1="91" y1="84" x2="87" y2="81" />
                <line x1="80" y1="99" x2="77" y2="95" />
                <line x1="40" y1="99" x2="43" y2="95" />
                <line x1="29" y1="84" x2="33" y2="81" />
                <line x1="29" y1="44" x2="33" y2="47" />
                <line x1="40" y1="29" x2="43" y2="33" />
              </g>
              <text
                x="92"
                y="50"
                fontFamily="Arial Black, Helvetica, sans-serif"
                fontWeight={900}
                fontSize="13"
                fill="#BF461A"
                textAnchor="middle"
              >
                7
              </text>
              <g className="hand">
                <line x1="60" y1="64" x2="60" y2="22" stroke="#BF461A" strokeWidth="2.6" strokeLinecap="round" />
              </g>
              <line x1="60" y1="64" x2="84" y2="50" stroke="#0F1E1D" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="64" r="4" fill="#0F1E1D" />
              <circle cx="60" cy="64" r="1.5" fill="#fdfbf6" />
              <g stroke="#BF461A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
                <path d="M 110 24 Q 115 20, 118 16" />
                <path d="M 112 32 L 118 28" />
              </g>
            </svg>

            <div>
              <CountUpStat
                active={revealed}
                stat={{ target: 400, prefix: '$', suffix: 'K' }}
                className="rcpt-hero-stat"
              />
              <p className="rcpt-hero-stat-sub">Reactivated in 7 minutes</p>
            </div>

            <p className="rcpt-hero-narrative">
              The proposal sat <span className="hl-mustard">9 months silent</span>. One outreach
              lifted the Dead Zone - the reply came back in{' '}
              <span className="hl-care">7 minutes</span>.
            </p>

            <div className="rcpt-hero-timeline" aria-label="Reactivation timeline">
              <div className="tl-step">
                <span className="tl-eyebrow">Day 0</span>
                <span className="tl-dot" aria-hidden />
                <span className="tl-label">Proposal sent</span>
              </div>
              <div className="tl-step tl-mid">
                <span className="tl-eyebrow">Day 270</span>
                <span className="tl-dot" aria-hidden />
                <span className="tl-label">Dead Zone — silent</span>
              </div>
              <div className="tl-step tl-end">
                <span className="tl-eyebrow">+ 7 min</span>
                <span className="tl-dot" aria-hidden />
                <span className="tl-label">Replied · $400K reactivated</span>
              </div>
            </div>

            <div className="rcpt-hero-foot">
              <div className="practitioner">
                <div className="avatar">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="40" height="40" fill="#3d2f24" />
                    <circle cx="20" cy="15" r="7" fill="#c4946e" />
                    <path d="M5 40 C 5 30, 12 24, 20 24 C 28 24, 35 30, 35 40 Z" fill="#5a4226" />
                    <path d="M14 12 Q 20 10, 26 12 L 26 14 L 14 14 Z" fill="#2a1d0f" />
                  </svg>
                </div>
                <div>
                  <p className="practitioner-name">Stephen Cuccio</p>
                  <p className="practitioner-role">Founder · Madcraft</p>
                </div>
              </div>
              <a className="pill-care" href="#">
                Read the Case <span className="arrow">→</span>
              </a>
            </div>
          </article>

          {/* Supporting tiers */}
          <div>
            <section className="tier-block">
              <p className="tier-label">
                Outcomes · Operator Track Record
                <span className="tier-line" aria-hidden />
              </p>
              <div className="tier-row">
                <article className="rcpt-card rcpt-card-sm delay-1">
                  <p className="card-firm">AArete</p>
                  <p className="card-stat">
                    <CountUpStat
                      active={revealed}
                      stat={{ target: 125, prefix: '$', suffix: 'M' }}
                      startDelay={1700}
                    />
                  </p>
                  <p className="card-sub">Revenue scaled as CMO over the tenure.</p>
                  <p className="card-foot">
                    <span>Richard Ashbaugh · CMO</span>
                    <span className="arrow" aria-hidden>→</span>
                  </p>
                </article>
                <article className="rcpt-card rcpt-card-sm delay-2">
                  <p className="card-firm">A.T. Kearney</p>
                  <p className="card-stat">
                    <CountUpStat
                      active={revealed}
                      stat={{ target: 1.2, prefix: '$', suffix: 'B', isFloat: true }}
                      startDelay={1850}
                    />
                  </p>
                  <p className="card-sub">From $250M, scaled as practitioner.</p>
                  <p className="card-foot">
                    <span>Richard Ashbaugh · Practitioner</span>
                    <span className="arrow" aria-hidden>→</span>
                  </p>
                </article>
              </div>
            </section>

            <section className="tier-block">
              <p className="tier-label">
                Long-term Partners · Active GTM Relationships
                <span className="tier-line" aria-hidden />
              </p>
              <div className="tier-row">
                <article className="rcpt-card rcpt-card-sm delay-3">
                  <p className="card-firm">SPR</p>
                  <p className="card-stat qualitative">150 dormants</p>
                  <p className="card-sub">
                    Identified · 43 sent through 3-layer review · 3 replies.
                  </p>
                  <p className="card-foot">
                    <span>Kyle Gams</span>
                    <span className="arrow" aria-hidden>→</span>
                  </p>
                </article>
                <article className="rcpt-card rcpt-card-sm delay-4">
                  <p className="card-firm">Workiva</p>
                  <p className="card-stat qualitative">167% more SQOs</p>
                  <p className="card-sub">After shifting from job-title to challenge-based outreach. Long-term advisory engagement, ongoing.</p>
                  <p className="card-foot">
                    <span>Discover Mabbly · Active</span>
                    <span className="arrow" aria-hidden>→</span>
                  </p>
                </article>
              </div>
            </section>
          </div>
        </div>

        <div className="rcpt-foot">
          <p>
            <strong>30 firms</strong> in the research cohort.{' '}
            <strong>500 practitioner interviews.</strong> The full case index lives in Chapter 1.
          </p>
        </div>
      </div>
    </section>
  );
}
