import { useEffect, useRef, useState } from 'react';

const PATH_I_BODY =
  'Cold outreach. Conferences. Referrals by accident. 70% of your CRM sits untouched. Revenue comes in spikes. The pipeline is always a worry.';
const PATH_I_PULL = "You're building from scratch, every quarter.";

const PATH_II_BODY =
  'Systematic relationship reactivation. Your Dead Zone converts. Orbits I–II generate the majority of new revenue. The pipeline is a function, not a prayer.';
const PATH_II_PULL = "You're building on trust that already exists.";

export default function TheDecision() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const dragSplitRef = useRef(50);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reduced) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Entrance animation: 70 -> 50
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setSplit(50);
      return;
    }
    let raf = 0;
    const startAt = performance.now() + 350;
    const duration = 900;
    const from = 70;
    const to = 50;
    setSplit(from);
    const step = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(step);
        return;
      }
      const p = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setSplit(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);

  const clamp = (n: number) => Math.max(6, Math.min(94, n));

  const setFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(clamp(pct));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    handleRef.current?.focus();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragSplitRef.current = split;
    setFromClientX(e.clientX);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplit((s) => clamp(s - 2));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplit((s) => clamp(s + 2));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplit(6);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplit(94);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="decision"
      className={`td-section ${inView ? 'is-in' : ''}`}
      aria-labelledby="td-heading"
      style={{ ['--td-split' as string]: `${split}%` } as React.CSSProperties}
    >
      <style>{`
        .td-section {
          --td-ink: #0F1E1D;
          --td-ink-soft: rgba(248, 242, 229, 0.78);
          --td-ink-dim: rgba(248, 242, 229, 0.55);
          --td-rust: #8B3A2A;
          --td-rust-bright: #BF461A;
          --td-cream: #FCFAF4;
          --td-cream-deep: #F3EDD9;
          --td-gold: #B8933A;
          --td-gold-bright: #D6AD43;
          --td-sage: #3D5A4A;
          --td-depth-soft: #2C3A38;
          --td-mono: 'DM Mono', ui-monospace, Menlo, monospace;
          --td-display: 'Inter Tight', system-ui, sans-serif;
          --td-body: 'Inter Tight', system-ui, sans-serif;
          --td-serif: 'Cormorant Garamond', Georgia, serif;
          --td-ease: cubic-bezier(0.13, 0.28, 0.3, 1);

          position: relative;
          background:
            radial-gradient(ellipse 900px 500px at 50% 0%, rgba(184, 147, 58, 0.10), transparent 60%),
            #F5EFDD;
          padding: 96px 32px 104px;
          overflow: hidden;
        }

        .td-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .td-head {
          text-align: center;
          margin: 0 auto 44px;
          max-width: 820px;
        }
        .td-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--td-mono);
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--td-gold);
          margin: 0 0 22px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s var(--td-ease), transform 0.6s var(--td-ease);
        }
        .td-eyebrow::before,
        .td-eyebrow::after {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: rgba(184, 147, 58, 0.55);
        }
        .td-eyebrow .num { color: var(--td-ink); }
        .td-eyebrow .pip { color: var(--td-rust-bright); }
        .td-eyebrow .word { color: var(--td-gold); }

        .td-headline {
          font-family: var(--td-display);
          font-weight: 900;
          font-size: clamp(34px, 4.6vw, 60px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--td-ink);
          margin: 0;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.7s var(--td-ease) 0.12s, transform 0.7s var(--td-ease) 0.12s;
        }
        .td-headline em {
          font-style: italic;
          color: var(--td-rust-bright);
          font-weight: 800;
        }

        .td-subhead {
          font-family: var(--td-body);
          font-size: 16px;
          line-height: 1.55;
          color: rgba(15, 30, 29, 0.66);
          margin: 16px auto 0;
          max-width: 580px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s var(--td-ease) 0.28s, transform 0.6s var(--td-ease) 0.28s;
        }

        .td-hint {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--td-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--td-sage);
          margin: 22px 0 0;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.6s var(--td-ease) 0.45s, transform 0.6s var(--td-ease) 0.45s;
        }
        .td-hint svg { display: block; }

        .td-section.is-in .td-eyebrow,
        .td-section.is-in .td-headline,
        .td-section.is-in .td-subhead,
        .td-section.is-in .td-hint {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── COMPARATOR ──────────────────────────── */
        .td-comparator {
          position: relative;
          height: clamp(440px, 60vh, 600px);
          border-radius: 6px;
          overflow: hidden;
          touch-action: pan-y;
          user-select: none;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.08),
            0 30px 70px -24px rgba(15,30,29,0.40),
            0 60px 120px -40px rgba(15,30,29,0.28);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s var(--td-ease) 0.35s, transform 0.8s var(--td-ease) 0.35s;
        }
        .td-section.is-in .td-comparator { opacity: 1; transform: translateY(0); }

        .td-panel {
          position: absolute;
          inset: 0;
          display: grid;
          align-items: center;
        }

        /* Bottom layer — Path II (cream) */
        .td-panel-with {
          background:
            radial-gradient(ellipse 600px 360px at 100% 100%, rgba(184, 147, 58, 0.16), transparent 70%),
            linear-gradient(135deg, #FCFAF4 0%, #F3EDD9 100%);
          color: var(--td-ink);
          justify-items: end;
          padding: 48px clamp(36px, 6vw, 80px);
        }

        /* Top layer — Path I (dark), clipped */
        .td-panel-without {
          background:
            radial-gradient(ellipse 500px 320px at 0% 0%, rgba(139, 58, 42, 0.30), transparent 70%),
            linear-gradient(135deg, #0F1E1D 0%, #1A2B29 100%);
          color: var(--td-cream);
          justify-items: start;
          padding: 48px clamp(36px, 6vw, 80px);
          clip-path: inset(0 calc(100% - var(--td-split)) 0 0);
          will-change: clip-path;
        }

        .td-panel-content {
          position: relative;
          width: min(46%, 460px);
          z-index: 2;
        }
        .td-panel-without .td-panel-content { padding-right: 24px; }
        .td-panel-with .td-panel-content { padding-left: 24px; }

        .td-panel-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--td-mono);
          font-size: 10.5px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 0 0 22px;
          padding: 6px 12px;
          border-radius: 100px;
        }
        .td-panel-without .td-panel-eyebrow {
          color: var(--td-cream);
          background: rgba(139, 58, 42, 0.22);
          border: 1px solid rgba(139, 58, 42, 0.55);
        }
        .td-panel-with .td-panel-eyebrow {
          color: var(--td-ink);
          background: rgba(184, 147, 58, 0.14);
          border: 1px solid rgba(184, 147, 58, 0.50);
        }
        .td-panel-eyebrow .roman {
          font-family: var(--td-serif);
          font-style: italic;
          font-size: 14px;
          font-weight: 700;
        }
        .td-panel-without .td-panel-eyebrow .roman { color: #E89A6E; }
        .td-panel-with .td-panel-eyebrow .roman { color: var(--td-gold); }

        .td-panel-body {
          font-family: var(--td-body);
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.6;
          margin: 0 0 22px;
          font-weight: 500;
        }
        .td-panel-without .td-panel-body { color: var(--td-ink-soft); }
        .td-panel-with .td-panel-body { color: rgba(15, 30, 29, 0.78); }

        .td-panel-pull {
          font-family: var(--td-serif);
          font-style: italic;
          font-size: clamp(20px, 2.1vw, 28px);
          line-height: 1.25;
          margin: 0;
          padding: 14px 0 6px 18px;
          border-left: 2px solid;
        }
        .td-panel-without .td-panel-pull {
          color: #F1E4D2;
          border-color: var(--td-rust-bright);
        }
        .td-panel-with .td-panel-pull {
          color: var(--td-ink);
          border-color: var(--td-gold);
        }

        /* Roman numeral watermarks */
        .td-numeral {
          position: absolute;
          font-family: var(--td-serif);
          font-style: italic;
          font-weight: 600;
          font-size: clamp(180px, 26vw, 360px);
          line-height: 0.85;
          letter-spacing: -0.02em;
          pointer-events: none;
          z-index: 1;
        }
        .td-panel-without .td-numeral {
          right: clamp(12px, 4vw, 48px);
          bottom: -18px;
          color: rgba(139, 58, 42, 0.18);
          text-shadow: 0 0 60px rgba(139, 58, 42, 0.25);
        }
        .td-panel-with .td-numeral {
          left: clamp(12px, 4vw, 48px);
          bottom: -18px;
          color: rgba(184, 147, 58, 0.20);
          text-shadow: 0 0 60px rgba(184, 147, 58, 0.18);
        }

        /* Divider line */
        .td-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--td-split);
          width: 2px;
          background: linear-gradient(180deg, rgba(184, 147, 58, 0.0) 0%, var(--td-gold) 18%, var(--td-gold) 82%, rgba(184, 147, 58, 0.0) 100%);
          transform: translateX(-1px);
          pointer-events: none;
          z-index: 4;
          box-shadow:
            0 0 24px rgba(184, 147, 58, 0.45),
            0 0 1px rgba(15, 30, 29, 0.4);
        }

        /* Drag handle */
        .td-handle {
          position: absolute;
          top: 50%;
          left: var(--td-split);
          width: 56px;
          height: 56px;
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--td-ink);
          color: var(--td-gold);
          border: 2px solid var(--td-gold);
          border-radius: 50%;
          cursor: ew-resize;
          z-index: 5;
          box-shadow:
            0 14px 28px -8px rgba(15, 30, 29, 0.55),
            0 0 0 6px rgba(184, 147, 58, 0.10),
            inset 0 1px rgba(255, 255, 255, 0.10);
          transition: transform 220ms var(--td-ease), box-shadow 220ms var(--td-ease), background 220ms var(--td-ease);
          outline: none;
        }
        .td-handle:hover,
        .td-handle:focus-visible {
          background: var(--td-gold);
          color: var(--td-ink);
          transform: translate(-50%, -50%) scale(1.06);
          box-shadow:
            0 18px 36px -8px rgba(15, 30, 29, 0.60),
            0 0 0 8px rgba(184, 147, 58, 0.18),
            inset 0 1px rgba(255, 255, 255, 0.10);
        }
        .td-handle-arrow {
          display: inline-block;
          font-family: var(--td-display);
          font-weight: 700;
          font-size: 14px;
          line-height: 1;
          opacity: 0.85;
        }
        .td-handle-arrow.l { margin-right: 4px; }
        .td-handle-arrow.r { margin-left: 4px; }
        .td-handle-grip {
          width: 2px;
          height: 18px;
          background: currentColor;
          opacity: 0.85;
          border-radius: 2px;
          box-shadow: 4px 0 0 currentColor, -4px 0 0 currentColor;
        }

        /* Pulse indicator until first interaction */
        .td-handle::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px solid var(--td-gold);
          opacity: 0;
          animation: td-pulse 2.4s var(--td-ease) infinite;
        }
        @keyframes td-pulse {
          0%   { transform: scale(1); opacity: 0.55; }
          80%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        /* Side labels (subtle) */
        .td-side-label {
          position: absolute;
          top: 18px;
          font-family: var(--td-mono);
          font-size: 9.5px;
          letter-spacing: 0.30em;
          text-transform: uppercase;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 100px;
          z-index: 3;
          pointer-events: none;
        }
        .td-side-label.l {
          left: 18px;
          color: var(--td-cream);
          background: rgba(15, 30, 29, 0.55);
          border: 1px solid rgba(248, 242, 229, 0.18);
        }
        .td-side-label.r {
          right: 18px;
          color: var(--td-ink);
          background: rgba(252, 250, 244, 0.85);
          border: 1px solid rgba(15, 30, 29, 0.10);
        }

        /* Mobile stacked — hidden by default */
        .td-mobile { display: none; }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 760px) {
          .td-section { padding: 72px 20px 80px; }
          .td-comparator,
          .td-divider,
          .td-handle,
          .td-side-label { display: none; }

          .td-mobile {
            display: grid;
            gap: 16px;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.7s var(--td-ease) 0.3s, transform 0.7s var(--td-ease) 0.3s;
          }
          .td-section.is-in .td-mobile { opacity: 1; transform: translateY(0); }

          .td-card {
            position: relative;
            border-radius: 6px;
            overflow: hidden;
            padding: 36px 28px 32px;
            min-height: 260px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .td-card-without {
            background:
              radial-gradient(ellipse 360px 220px at 0% 0%, rgba(139, 58, 42, 0.30), transparent 70%),
              linear-gradient(135deg, #0F1E1D 0%, #1A2B29 100%);
            color: var(--td-cream);
          }
          .td-card-with {
            background:
              radial-gradient(ellipse 360px 220px at 100% 100%, rgba(184, 147, 58, 0.16), transparent 70%),
              linear-gradient(135deg, #FCFAF4 0%, #F3EDD9 100%);
            color: var(--td-ink);
          }
          .td-card .td-numeral {
            font-size: 200px;
            bottom: -28px;
            opacity: 1;
          }
          .td-card-without .td-numeral { right: 20px; }
          .td-card-with .td-numeral { left: 20px; }
          .td-card .td-panel-content {
            position: relative;
            width: 100%;
            padding: 0;
            z-index: 2;
          }
          .td-card .td-panel-body { font-size: 15px; }
          .td-card .td-panel-pull { font-size: 19px; }
        }

        @media (max-width: 1024px) and (min-width: 761px) {
          .td-panel-content { width: min(48%, 380px); }
          .td-panel-body { font-size: 14.5px; }
          .td-panel-pull { font-size: 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .td-section *,
          .td-section *::before,
          .td-section *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
          .td-section .td-handle::before { animation: none; opacity: 0; }
          .td-section .td-eyebrow,
          .td-section .td-headline,
          .td-section .td-subhead,
          .td-section .td-hint,
          .td-section .td-comparator,
          .td-section .td-mobile {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="td-inner">
        <header className="td-head">
          <p className="td-eyebrow">
            <span className="num">13</span>
            <span className="pip">·</span>
            <span className="word">The Decision</span>
          </p>
          <h2 id="td-heading" className="td-headline">
            Two firms. Same market. <em>Different systems.</em>
          </h2>
          <p className="td-subhead">
            This is the only decision that matters in PS GTM right now.
          </p>
          <p className="td-hint" aria-hidden>
            <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
              <path d="M5 5h12M5 5l3-3M5 5l3 3M17 5l-3-3M17 5l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Drag to compare
          </p>
        </header>

        <div
          ref={containerRef}
          className="td-comparator"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="td-side-label l" aria-hidden>Without</span>
          <span className="td-side-label r" aria-hidden>With</span>

          {/* Bottom layer · Path II */}
          <div className="td-panel td-panel-with" aria-label="Path II · With the map">
            <span className="td-numeral" aria-hidden>II</span>
            <div className="td-panel-content">
              <p className="td-panel-eyebrow">
                <span className="roman">II</span>
                Path II · With the Map
              </p>
              <p className="td-panel-body">{PATH_II_BODY}</p>
              <p className="td-panel-pull">{PATH_II_PULL}</p>
            </div>
          </div>

          {/* Top layer · Path I (clipped) */}
          <div className="td-panel td-panel-without" aria-label="Path I · Without the map">
            <span className="td-numeral" aria-hidden>I</span>
            <div className="td-panel-content">
              <p className="td-panel-eyebrow">
                <span className="roman">I</span>
                Path I · Without the Map
              </p>
              <p className="td-panel-body">{PATH_I_BODY}</p>
              <p className="td-panel-pull">{PATH_I_PULL}</p>
            </div>
          </div>

          <div className="td-divider" aria-hidden />

          <div
            ref={handleRef}
            className="td-handle"
            role="slider"
            tabIndex={0}
            aria-label="Reveal Path I (Without the Map) versus Path II (With the Map)"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(split)}
            onKeyDown={onKeyDown}
          >
            <span className="td-handle-arrow l" aria-hidden>‹</span>
            <span className="td-handle-grip" aria-hidden />
            <span className="td-handle-arrow r" aria-hidden>›</span>
          </div>
        </div>

        {/* Mobile stacked fallback */}
        <div className="td-mobile">
          <article className="td-card td-card-without">
            <span className="td-numeral" aria-hidden>I</span>
            <div className="td-panel-content">
              <p className="td-panel-eyebrow">
                <span className="roman">I</span>
                Path I · Without the Map
              </p>
              <p className="td-panel-body">{PATH_I_BODY}</p>
              <p className="td-panel-pull">{PATH_I_PULL}</p>
            </div>
          </article>
          <article className="td-card td-card-with">
            <span className="td-numeral" aria-hidden>II</span>
            <div className="td-panel-content">
              <p className="td-panel-eyebrow">
                <span className="roman">II</span>
                Path II · With the Map
              </p>
              <p className="td-panel-body">{PATH_II_BODY}</p>
              <p className="td-panel-pull">{PATH_II_PULL}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
