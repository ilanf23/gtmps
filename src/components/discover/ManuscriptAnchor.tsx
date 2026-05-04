import { useEffect, useRef, useState } from 'react';
import { scrollToHero } from '@/lib/scrollToHero';

export default function ManuscriptAnchor() {
  const ref = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setIsIn(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);

    const t = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsIn(true);
      }
    }, 100);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const handleAdd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHero();
  };

  const arrow11 = (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const arrow9 = (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section
      ref={ref}
      id="manuscript"
      className={`manuscript-v2${isIn ? ' is-in' : ''}`}
    >
      <style>{`
        .manuscript-v2 {
          --depth: #0F1E1D;
          --depth-soft: #2C3A38;
          --depth-line: rgba(15, 30, 29, 0.10);
          --care: #BF461A;
          --care-bright: #E5582B;
          --energy: #FFBA1A;
          --purpose: #A79014;
          --purpose-soft: #C9AC2A;
          --cream: #F8F2E5;
          --cream-card: #FCFAF4;
          --cream-book: #F4ECDB;
          --cream-border: #E5E0CF;
          --cream-line: #ECE6D5;
          --muted: #6B7370;
          --muted-soft: #9AA09C;
          --m-display: 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
          --m-mono: 'DM Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
          --m-body: 'Instrument Sans', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          --m-serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
          --m-ease: cubic-bezier(0.13, 0.28, 0.3, 1);

          position: relative;
          background: var(--cream);
          color: var(--depth);
          padding: 44px 32px 56px;
          font-family: var(--m-body);
        }

        .manuscript-v2 .frame-top,
        .manuscript-v2 .frame-bottom {
          position: absolute;
          left: 32px;
          right: 32px;
          height: 1px;
          background: var(--cream-border);
          pointer-events: none;
        }
        .manuscript-v2 .frame-top { top: 18px; }
        .manuscript-v2 .frame-bottom { bottom: 18px; }

        .manuscript-v2 .running-head {
          position: absolute;
          top: 22px;
          font-family: var(--m-mono);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted-soft);
          margin: 0;
        }
        .manuscript-v2 .running-head.left { left: 32px; }
        .manuscript-v2 .running-head.right { right: 32px; }

        .manuscript-v2 .section {
          max-width: 1180px;
          margin: 0 auto;
          padding-top: 24px;
          position: relative;
        }

        .manuscript-v2 .section-head {
          text-align: center;
          margin-bottom: 36px;
        }
        .manuscript-v2 .meta-row {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--m-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--purpose);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .manuscript-v2.is-in .meta-row {
          opacity: 1;
          transform: none;
        }
        .manuscript-v2 .meta-row .hairline {
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--cream-border);
        }
        .manuscript-v2 .meta-row .num { color: var(--depth); }
        .manuscript-v2 .meta-row .pip {
          color: var(--care);
          margin: 0 4px;
        }

        .manuscript-v2 .grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: 56px;
          align-items: center;
        }

        /* ── BOOK COLUMN ── */
        .manuscript-v2 .book-col {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 460px;
          padding: 24px 0;
        }
        .manuscript-v2 .book-halo {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(167, 144, 20, 0.10) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 60%, rgba(15, 30, 29, 0.06) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 1.0s ease;
          transition-delay: 0.30s;
        }
        .manuscript-v2.is-in .book-halo { opacity: 1; }

        .manuscript-v2 .book-stage {
          opacity: 0;
          transform: translateY(28px) scale(0.97);
          transition: opacity 0.9s var(--m-ease), transform 0.9s var(--m-ease);
          transition-delay: 0.20s;
        }
        .manuscript-v2.is-in .book-stage {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .manuscript-v2 .book-float {
          animation: bookFloat 5.6s ease-in-out infinite alternate;
        }
        @keyframes bookFloat {
          from { transform: translateY(0); }
          to   { transform: translateY(-6px); }
        }

        .manuscript-v2 .book {
          width: 280px;
          aspect-ratio: 280 / 410;
          background: var(--cream-book);
          border-radius: 2px;
          padding: 26px 32px 24px;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.04),
            0 22px 44px -22px rgba(15, 30, 29, 0.18),
            0 40px 80px -40px rgba(15, 30, 29, 0.16);
          position: relative;
          transition: transform 0.4s var(--m-ease), box-shadow 0.4s var(--m-ease);
        }
        .manuscript-v2 .book::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1px;
          background: rgba(167, 144, 20, 0.18);
        }
        .manuscript-v2 .book:hover {
          transform: translateY(-4px) rotate(-0.4deg);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.06),
            0 30px 56px -22px rgba(15, 30, 29, 0.22),
            0 50px 100px -44px rgba(15, 30, 29, 0.18);
        }

        .manuscript-v2 .book-eyebrow {
          font-family: var(--m-mono);
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 16px;
          text-align: left;
        }

        .manuscript-v2 .book-logo {
          width: 38px;
          height: 38px;
          border: 1.2px solid var(--purpose);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 0;
          margin-bottom: 28px;
          position: relative;
        }
        .manuscript-v2 .book-logo .logo-num {
          position: absolute;
          top: 2px;
          left: 4px;
          font-family: var(--m-mono);
          font-size: 5.5px;
          color: var(--purpose);
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .manuscript-v2 .book-logo .logo-mark {
          font-family: var(--m-serif);
          font-size: 17px;
          color: var(--purpose);
          letter-spacing: -0.02em;
          line-height: 1;
          font-weight: 500;
        }
        .manuscript-v2 .book-logo .logo-mark em { font-style: italic; }
        .manuscript-v2 .book-logo .logo-cap {
          font-family: var(--m-serif);
          font-style: italic;
          font-size: 4.5px;
          color: var(--purpose);
          margin-top: 1px;
          letter-spacing: 0.02em;
          line-height: 1;
          white-space: nowrap;
        }

        .manuscript-v2 .book-title {
          font-family: var(--m-serif);
          font-style: italic;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.16;
          letter-spacing: -0.005em;
          color: var(--depth);
          margin: 0 0 18px;
        }
        .manuscript-v2 .book-emph {
          font-family: var(--m-serif);
          font-style: italic;
          font-size: 22px;
          font-weight: 600;
          line-height: 1.16;
          letter-spacing: -0.005em;
          color: var(--purpose);
          margin: 8px 0 0;
        }
        .manuscript-v2 .book-rule {
          display: block;
          width: 38px;
          height: 1px;
          background: var(--purpose);
          margin: 12px 0 14px;
          border: 0;
        }
        .manuscript-v2 .book-os {
          font-family: var(--m-mono);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--purpose);
          margin: 0;
        }
        .manuscript-v2 .book-authors {
          margin-top: auto;
          padding-top: 28px;
        }
        .manuscript-v2 .book-authors p {
          font-family: var(--m-mono);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--depth);
          line-height: 1.6;
          margin: 0;
        }

        /* ── CONTENT COLUMN ── */
        .manuscript-v2 .content-col {
          padding-right: 24px;
        }
        .manuscript-v2 .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--m-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--purpose);
          margin: 0 0 18px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 0.40s;
        }
        .manuscript-v2.is-in .eyebrow { opacity: 1; transform: none; }
        .manuscript-v2 .eyebrow .lead-rule {
          display: inline-block;
          width: 22px;
          height: 1px;
          background: var(--purpose);
        }
        .manuscript-v2 .eyebrow .pulse {
          position: relative;
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--care);
          margin-left: 2px;
        }
        .manuscript-v2 .eyebrow .pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--care);
          animation: livePulse 2.4s ease-out infinite;
        }
        @keyframes livePulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.6); opacity: 0;   }
        }

        .manuscript-v2 .headline {
          font-family: var(--m-display);
          font-weight: 900;
          font-size: clamp(34px, 4.6vw, 52px);
          letter-spacing: -0.03em;
          line-height: 0.98;
          color: var(--depth);
          margin: 0 0 24px;
        }
        .manuscript-v2 .headline .period { color: var(--care); }
        .manuscript-v2 .word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 0.98;
        }
        .manuscript-v2 .word-inner {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 0.7s var(--m-ease);
        }
        .manuscript-v2.is-in .word-inner { transform: translateY(0); }
        .manuscript-v2 .word-mask:nth-of-type(1) .word-inner { transition-delay: 0.50s; }
        .manuscript-v2 .word-mask:nth-of-type(2) .word-inner { transition-delay: 0.56s; }
        .manuscript-v2 .word-mask:nth-of-type(3) .word-inner { transition-delay: 0.62s; }
        .manuscript-v2 .word-mask:nth-of-type(4) .word-inner { transition-delay: 0.68s; }
        .manuscript-v2 .word-mask:nth-of-type(5) .word-inner { transition-delay: 0.74s; }
        .manuscript-v2 .word-mask:nth-of-type(6) .word-inner { transition-delay: 0.80s; }

        .manuscript-v2 .lede {
          font-family: var(--m-body);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.55;
          color: var(--depth-soft);
          max-width: 480px;
          margin: 0 0 28px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 1.00s;
        }
        .manuscript-v2.is-in .lede { opacity: 1; transform: none; }
        .manuscript-v2 .lede strong {
          color: var(--depth);
          font-weight: 600;
        }

        .manuscript-v2 .inside {
          border-top: 1px solid var(--cream-line);
          padding-top: 16px;
          margin-bottom: 24px;
        }
        .manuscript-v2 .inside-label {
          font-family: var(--m-mono);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--depth);
          margin: 0 0 10px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          transition-delay: 1.10s;
        }
        .manuscript-v2.is-in .inside-label { opacity: 1; transform: none; }

        .manuscript-v2 .inside-row {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px dashed var(--cream-line);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.5s ease, transform 0.5s ease, background 0.25s ease, padding-left 0.25s ease;
        }
        .manuscript-v2.is-in .inside-row { opacity: 1; transform: none; }
        .manuscript-v2 .inside-row:nth-of-type(1) { transition-delay: 1.18s, 1.18s, 0s, 0s; }
        .manuscript-v2 .inside-row:nth-of-type(2) { transition-delay: 1.25s, 1.25s, 0s, 0s; }
        .manuscript-v2 .inside-row:nth-of-type(3) { transition-delay: 1.32s, 1.32s, 0s, 0s; }
        .manuscript-v2 .inside-row:hover {
          background: var(--cream-card);
          padding-left: 6px;
        }
        .manuscript-v2 .inside-num {
          font-family: var(--m-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--care);
          padding-top: 1px;
        }
        .manuscript-v2 .inside-name {
          font-family: var(--m-display);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--depth);
          margin: 0;
        }
        .manuscript-v2 .inside-desc {
          font-family: var(--m-body);
          font-size: 11.5px;
          line-height: 1.4;
          color: var(--muted);
          margin: 2px 0 0;
        }

        .manuscript-v2 .authors {
          font-family: var(--m-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          line-height: 1.6;
          margin: 0 0 22px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 1.45s;
        }
        .manuscript-v2.is-in .authors { opacity: 1; transform: none; }
        .manuscript-v2 .authors strong {
          color: var(--depth);
          font-weight: 700;
        }
        .manuscript-v2 .authors .pip {
          color: var(--muted-soft);
          margin: 0 6px;
        }

        .manuscript-v2 .cta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 1.55s;
        }
        .manuscript-v2.is-in .cta-row { opacity: 1; transform: none; }

        .manuscript-v2 .cta-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--m-display);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--cream);
          background: var(--care);
          border: 1px solid var(--care);
          padding: 12px 22px;
          border-radius: 28px;
          text-decoration: none;
          overflow: hidden;
          box-shadow: 0 8px 22px -10px rgba(191, 70, 26, 0.55);
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease,
                      transform 0.25s ease, box-shadow 0.25s ease;
        }
        .manuscript-v2 .cta-pill svg {
          transition: transform 0.25s var(--m-ease);
        }
        .manuscript-v2 .cta-pill:hover {
          background: var(--depth);
          border-color: var(--depth);
          color: var(--cream);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -10px rgba(15, 30, 29, 0.40);
        }
        .manuscript-v2 .cta-pill:hover svg { transform: translateX(3px); }

        .manuscript-v2 .cta-pill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -60%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.30), transparent);
          transform: skewX(-20deg);
          animation: shimmer 4.8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          60%  { left: 140%; }
          100% { left: 140%; }
        }

        .manuscript-v2 .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--m-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--depth);
          text-decoration: none;
          padding: 4px 0;
          border-bottom: 1px solid var(--depth-line);
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .manuscript-v2 .cta-secondary svg {
          transition: transform 0.25s var(--m-ease);
        }
        .manuscript-v2 .cta-secondary:hover {
          color: var(--care);
          border-bottom-color: var(--care);
        }
        .manuscript-v2 .cta-secondary:hover svg { transform: translateX(3px); }

        @media (max-width: 919px) {
          .manuscript-v2 { padding: 36px 22px 48px; }
          .manuscript-v2 .frame-top, .manuscript-v2 .frame-bottom { left: 22px; right: 22px; }
          .manuscript-v2 .frame-top { top: 16px; }
          .manuscript-v2 .running-head { top: 22px; }
          .manuscript-v2 .running-head.left { left: 22px; }
          .manuscript-v2 .running-head.right { right: 22px; }
          .manuscript-v2 .grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .manuscript-v2 .book-col { min-height: 0; padding: 12px; }
          .manuscript-v2 .book { width: 240px; }
          .manuscript-v2 .content-col { padding-right: 0; text-align: left; }
        }

        @media (max-width: 479px) {
          .manuscript-v2 .meta-row .hairline { width: 18px; }
          .manuscript-v2 .headline { font-size: 30px; }
          .manuscript-v2 .lede { font-size: 13px; }
          .manuscript-v2 .cta-row { gap: 14px; }
          .manuscript-v2 .cta-pill {
            padding: 10px 18px;
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .manuscript-v2 *,
          .manuscript-v2 *::before,
          .manuscript-v2 *::after {
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
          }
          .manuscript-v2 .word-inner,
          .manuscript-v2 .meta-row,
          .manuscript-v2 .book-stage,
          .manuscript-v2 .book-halo,
          .manuscript-v2 .eyebrow,
          .manuscript-v2 .lede,
          .manuscript-v2 .inside-label,
          .manuscript-v2 .inside-row,
          .manuscript-v2 .authors,
          .manuscript-v2 .cta-row {
            opacity: 1 !important;
            transform: none !important;
          }
          .manuscript-v2 .book-float { animation: none !important; }
        }
      `}</style>

      <div className="frame-top" aria-hidden />
      <p className="running-head left">Discover Mabbly</p>
      <p className="running-head right">Section 14 · The Manuscript</p>

      <div className="section">
        <div className="section-head">
          <span className="meta-row">
            <span className="hairline" />
            <span>
              <span className="num">14</span>
              <span className="pip">·</span>
              <span>The Manuscript</span>
            </span>
            <span className="hairline" />
          </span>
        </div>

        <div className="grid">
          <div className="book-col">
            <div className="book-halo" aria-hidden />
            <div className="book-stage">
              <div className="book-float">
                <div className="book" role="img" aria-label="GTM for Professional Services manuscript cover">
                  <p className="book-eyebrow">GTM for Professional Services</p>

                  <div className="book-logo" aria-hidden="true">
                    <span className="logo-num">31</span>
                    <span className="logo-mark">G<em>m</em></span>
                    <span className="logo-cap">go to market</span>
                  </div>

                  <p className="book-title">
                    The go to market system for firms that sell expertise,
                  </p>
                  <p className="book-emph">not products.</p>

                  <hr className="book-rule" />
                  <p className="book-os">The Relationship Revenue OS</p>

                  <div className="book-authors">
                    <p>Adam Fridman</p>
                    <p>Richard Ashbaugh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-col">
            <p className="eyebrow">
              <span className="lead-rule" aria-hidden />
              <span>Available Now</span>
              <span className="pulse" aria-hidden />
            </p>

            <h2 className="headline">
              <span className="word-mask"><span className="word-inner">30&nbsp;</span></span>
              <span className="word-mask"><span className="word-inner">chapters.&nbsp;</span></span>
              <br />
              <span className="word-mask"><span className="word-inner">Three&nbsp;</span></span>
              <span className="word-mask"><span className="word-inner">frameworks.&nbsp;</span></span>
              <br />
              <span className="word-mask"><span className="word-inner">One&nbsp;</span></span>
              <span className="word-mask"><span className="word-inner">playbook<span className="period">.</span></span></span>
            </h2>

            <p className="lede">
              The first published account of how relationship-driven firms turn dormant CRM into a revenue line. Two years of field research across <strong>30 mid-market firms</strong> and <strong>500 practitioner interviews</strong> - now in long form, in early access today.
            </p>

            <div className="inside">
              <p className="inside-label">Inside the Manuscript</p>

              <div className="inside-row">
                <span className="inside-num">01</span>
                <div>
                  <p className="inside-name">GTM Score</p>
                  <p className="inside-desc">Diagnose your firm's dormancy in 90 seconds. The free entry to the system.</p>
                </div>
              </div>

              <div className="inside-row">
                <span className="inside-num">02</span>
                <div>
                  <p className="inside-name">The MAP</p>
                  <p className="inside-desc">Build the playbook for your highest-leverage Dead Zone - the activation chapter.</p>
                </div>
              </div>

              <div className="inside-row">
                <span className="inside-num">03</span>
                <div>
                  <p className="inside-name">Discovery</p>
                  <p className="inside-desc">Run the system inside your firm or with the cohort. Where partnership begins.</p>
                </div>
              </div>
            </div>

            <p className="authors">
              <strong>Adam Fridman</strong> &amp; <strong>Richard Ashbaugh</strong>
              <span className="pip">·</span>
              Foreword by <strong>David Copulsky</strong>
              <span className="pip">·</span>
              Northwestern Kellogg
            </p>

            <div className="cta-row">
              <a className="cta-pill" href="#hero" onClick={handleAdd}>
                Build Your Map
                {arrow11}
              </a>
              <a className="cta-secondary" href="#">
                Read sample chapter
                {arrow9}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="frame-bottom" aria-hidden />
    </section>
  );
}
