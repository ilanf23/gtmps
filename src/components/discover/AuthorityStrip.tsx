import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';

/* ───────────────────────────────────────────────────────────────────────────
   AuthorityStrip — v3 Mabbly brand spec (docs/07-design-system.md).
   Two-column layout: compressed header rail (left) + 3D rolodex card flipper
   (right) cycling Foreword → Practitioner → Author. Auto-advances every 7s,
   pauses on interaction, resumes after 4s idle. Motion preserved per face:
   count-up + ignite underline, magnetic stat hover, vertical quote bar grow,
   pulsing dot, blinking caret.
   ─────────────────────────────────────────────────────────────────────────── */

type StatCard = {
  target?: number;
  float?: number;
  prefix?: string;
  suffix?: string;
  display: string;
  label: string;
};

const PRACTITIONER_STATS: StatCard[] = [
  { target: 26, display: '26', label: 'years across 9 professional services firms' },
  { target: 125, prefix: '$', suffix: 'M', display: '$125M', label: 'AArete revenue as CMO' },
  { float: 1.2, prefix: '$', suffix: 'B', display: '$1.2B', label: 'A.T. Kearney, scaled from $250M' },
];

const AUTHOR_STATS: StatCard[] = [
  { target: 500, display: '500', label: 'interviews, The Science of Story' },
  { target: 180, display: '180', label: 'podcast episodes on GTM for PS' },
  { target: 2, suffix: ' yrs', display: '2 yrs', label: 'Inc. columnist' },
];

const CARD_LABELS = ['Foreword', 'Practitioner', 'Author'] as const;
const AUTO_INTERVAL_MS = 7000;
const RESUME_AFTER_MS = 4000;

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

function countUp(
  el: HTMLElement,
  target: number | null,
  floatTarget: number | null,
  prefix: string,
  suffix: string,
  duration: number,
  onComplete?: () => void,
) {
  const start = performance.now();
  function tick(now: number) {
    const p = Math.min((now - start) / duration, 1);
    const e = easeOutCubic(p);
    const display = floatTarget !== null
      ? (e * floatTarget).toFixed(1)
      : Math.round(e * (target ?? 0)).toString();
    el.textContent = prefix + display + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else {
      el.textContent = prefix + (floatTarget !== null ? floatTarget.toFixed(1) : String(target)) + suffix;
      onComplete?.();
    }
  }
  el.textContent = prefix + (floatTarget !== null ? '0.0' : '0') + suffix;
  requestAnimationFrame(tick);
}

export default function AuthorityStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(((idx % 3) + 3) % 3);
  }, []);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % 3), []);
  const prev = useCallback(() => setActiveIndex((i) => (i + 2) % 3), []);

  const pauseAndScheduleResume = useCallback(() => {
    setPaused(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, []);

  // Scroll trigger
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setActive(true);
        obs.disconnect();
      }
    }, { threshold: 0.18 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!active || paused) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(next, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [active, paused, next]);

  // Per-face count-up retrigger — runs each time the active card changes
  useEffect(() => {
    if (!active) return;
    const node = sectionRef.current;
    if (!node) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Reset all stat-lit underlines so re-entering a card re-ignites them
    node.querySelectorAll('.au-card .au-stat').forEach((c) => c.classList.remove('au-stat--lit'));

    const card = node.querySelector<HTMLElement>('.au-card[data-active="true"]');
    if (!card) return;
    const nums = card.querySelectorAll<HTMLElement>('.au-stat-num');
    nums.forEach((el, i) => {
      const target = el.dataset.target ? parseInt(el.dataset.target, 10) : null;
      const floatTarget = el.dataset.float ? parseFloat(el.dataset.float) : null;
      const prefix = el.dataset.prefix ?? '';
      const suffix = el.dataset.suffix ?? '';
      const finish = () => el.closest('.au-stat')?.classList.add('au-stat--lit');
      if (reduced) {
        el.textContent = prefix + (floatTarget !== null ? floatTarget.toFixed(1) : String(target)) + suffix;
        finish();
        return;
      }
      window.setTimeout(() => countUp(el, target, floatTarget, prefix, suffix, 1400, finish), 700 + i * 130);
    });
  }, [active, activeIndex]);

  // Magnetic tilt on stat cards
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const cards = node.querySelectorAll<HTMLElement>('.au-stat');
    const handlers: { el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }[] = [];
    cards.forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--tx', `${x * 6}px`);
        el.style.setProperty('--ty', `${y * 6}px`);
        el.style.setProperty('--rx', `${-y * 3}deg`);
        el.style.setProperty('--ry', `${x * 4}deg`);
      };
      const leave = () => {
        el.style.setProperty('--tx', `0px`);
        el.style.setProperty('--ty', `0px`);
        el.style.setProperty('--rx', `0deg`);
        el.style.setProperty('--ry', `0deg`);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      handlers.push({ el, move, leave });
    });
    return () => handlers.forEach(({ el, move, leave }) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  }, [activeIndex]);

  // Cleanup resume timer
  useEffect(() => () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  }, []);

  // Keyboard nav within the flipper
  const onFlipperKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
      pauseAndScheduleResume();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
      pauseAndScheduleResume();
    }
  };

  // rotateY relative to active index. Active = 0deg, next = -180deg, prev = 180deg.
  const rotationFor = (idx: number) => {
    const diff = (idx - activeIndex + 3) % 3;
    if (diff === 0) return 0;
    if (diff === 1) return -180;
    return 180;
  };

  const renderStatCard = (stat: StatCard, key: string, idx: number) => (
    <div key={key} className="au-stat" style={{ animationDelay: `${idx * 110}ms` }}>
      <div className="au-stat-glow" aria-hidden />
      <div className="au-stat-row">
        <span
          className="au-stat-num"
          data-target={stat.target ?? undefined}
          data-float={stat.float ?? undefined}
          data-prefix={stat.prefix ?? ''}
          data-suffix={stat.suffix ?? ''}
        >
          {stat.display}
        </span>
        <span className="au-stat-label">{stat.label}</span>
      </div>
      <span className="au-stat-ignite" aria-hidden />
    </div>
  );

  return (
    <>
      <style>{`
        :root {
          --au-deep:    #0F1E1D;
          --au-sage:    #EDF5EC;
          --au-care:    #BF461A;
          --au-rust:    #803402;
          --au-gold:    #FFBA1A;
          --au-amber:   #A79014;
          --au-teal:    #225351;
          --au-muted:   #A1A9A0;
          --au-medium:  #D5DED4;
          --au-card:    #1A2B2A;
        }

        /* ── Root ── */
        .au-root {
          position: relative;
          width: 100%;
          background: var(--au-deep);
          color: var(--au-sage);
          padding: clamp(64px, 9vw, 144px) 24px clamp(56px, 8vw, 128px);
          overflow: hidden;
          font-family: 'Inter Tight', 'Mabbly Repro', Verdana, Helvetica, sans-serif;
        }
        @media (min-width: 768px) {
          .au-root { padding-left: 40px; padding-right: 40px; }
        }

        /* Atmosphere */
        .au-atmos { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .au-glow-a, .au-glow-b {
          position: absolute; border-radius: 50%; filter: blur(80px);
          opacity: 0; transition: opacity 1800ms ease-out; will-change: transform, opacity;
        }
        .au-active .au-glow-a { opacity: 0.32; }
        .au-active .au-glow-b { opacity: 0.22; }
        .au-glow-a {
          top: -10%; left: -8%; width: 620px; height: 620px;
          background: radial-gradient(circle, var(--au-teal) 0%, transparent 65%);
          animation: auDriftA 28s ease-in-out infinite alternate;
        }
        .au-glow-b {
          bottom: -15%; right: -10%; width: 560px; height: 560px;
          background: radial-gradient(circle, var(--au-care) 0%, transparent 65%);
          animation: auDriftB 36s ease-in-out infinite alternate;
        }
        .au-grain {
          position: absolute; inset: 0; opacity: 0.06; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>");
        }
        @keyframes auDriftA { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(80px, 60px) scale(1.15); } }
        @keyframes auDriftB { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-70px, -40px) scale(1.1); } }

        /* Curtain */
        .au-curtain {
          position: absolute; top: 0; left: 0; width: 0; height: 3px;
          background: linear-gradient(90deg, var(--au-care) 0%, var(--au-gold) 100%);
          transition: width 900ms cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 4;
        }
        .au-active .au-curtain { width: 100%; }

        /* ── 2-col grid: header rail | flipper ── */
        .au-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .au-inner {
            grid-template-columns: 38% 1fr;
            gap: 72px;
            align-items: center;
          }
        }

        /* ── Left rail ── */
        .au-rail {
          position: relative;
        }
        .au-eyebrow-row {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 600ms ease 250ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) 250ms;
        }
        .au-active .au-eyebrow-row { opacity: 1; transform: translateY(0); }
        .au-eyebrow-bar { width: 24px; height: 1px; background: var(--au-gold); }
        .au-eyebrow {
          font-family: 'DM Mono', 'Trebuchet MS', monospace;
          font-size: 12px; letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--au-gold); margin: 0; font-weight: 500;
        }

        .au-title {
          font-family: 'Inter Tight', 'Mabbly Repro', 'Arial Black', sans-serif;
          font-weight: 900;
          font-size: clamp(38px, 4.6vw, 68px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: var(--au-sage);
          margin: 22px 0 18px;
          max-width: 14ch;
        }
        .au-title .word {
          display: inline-block; margin-right: 0.2em;
          opacity: 0; transform: translateY(40%) scaleY(0.78); filter: blur(8px);
        }
        .au-active .au-title .word { animation: auWordIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .au-active .au-title .word.w1 { animation-delay: 380ms; }
        .au-active .au-title .word.w2 { animation-delay: 460ms; }
        .au-active .au-title .word.w3 { animation-delay: 540ms; }
        .au-active .au-title .word.w4 { animation-delay: 620ms; }
        .au-active .au-title .word.w5 { animation-delay: 700ms; }
        .au-active .au-title .word.w6 { animation-delay: 780ms; }
        .au-title .accent { color: var(--au-care); }
        @keyframes auWordIn {
          0%   { opacity: 0; transform: translateY(40%) scaleY(0.78); filter: blur(8px); }
          50%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }

        .au-deck {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: var(--au-muted);
          line-height: 1.5;
          margin: 0;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 700ms ease 1000ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 1000ms;
        }
        .au-active .au-deck { opacity: 1; transform: translateY(0); }
        .au-deck strong { color: var(--au-sage); font-weight: 900; text-transform: uppercase; letter-spacing: -0.005em; }

        /* ── Right: flipper ── */
        .au-flipper {
          position: relative;
          perspective: 1400px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 800ms ease 600ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 600ms;
        }
        .au-active .au-flipper { opacity: 1; transform: translateY(0); }

        .au-stage {
          position: relative;
          transform-style: preserve-3d;
          min-height: 420px;
        }
        @media (min-width: 1024px) {
          .au-stage { min-height: 460px; }
        }

        /* Faint stacked-cards shadow behind active card */
        .au-stack-shadow {
          position: absolute;
          left: 8px; right: 8px; top: 8px; bottom: -8px;
          border-radius: 14px;
          background: var(--au-card);
          opacity: 0.35;
          transform: translateY(8px);
          z-index: 0;
        }
        .au-stack-shadow.deeper {
          left: 16px; right: 16px; top: 16px; bottom: -16px;
          opacity: 0.18;
          transform: translateY(16px);
        }

        .au-card {
          position: absolute; inset: 0;
          background: var(--au-card);
          border: 1px solid rgba(213, 222, 212, 0.10);
          border-radius: 14px;
          padding: clamp(24px, 3vw, 40px);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 600ms ease,
                      border-color 600ms ease;
          will-change: transform;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }
        .au-card[data-active="true"] {
          z-index: 2;
          box-shadow:
            0 30px 60px -28px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(191, 70, 26, 0.18) inset;
          border-color: rgba(191, 70, 26, 0.32);
        }

        /* Per-face eyebrow */
        .au-card-eyebrow {
          display: flex; align-items: center; gap: 12px; margin: 0 0 22px;
        }
        .au-card-dot {
          width: 6px; height: 6px;
          background: var(--au-care); border-radius: 50%;
          box-shadow: 0 0 12px var(--au-care);
          animation: auPulseDot 1.8s ease-in-out infinite;
        }
        @keyframes auPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.3); }
        }
        .au-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.32em;
          text-transform: uppercase; color: var(--au-gold); font-weight: 500;
        }
        .au-card-pos {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em; color: var(--au-muted);
          margin-left: auto;
        }

        /* Foreword quote */
        .au-quote {
          position: relative;
          padding-left: 28px;
          margin: 0 0 28px;
          flex: 1;
        }
        .au-quote::before {
          content: '';
          position: absolute;
          left: 0; top: 4px; width: 3px; height: 0;
          background: linear-gradient(180deg, var(--au-care), var(--au-gold));
          transition: height 1100ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .au-card[data-active="true"] .au-quote::before {
          height: calc(100% - 4px);
          transition-delay: 400ms;
        }
        .au-quote-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: -0.01em;
          color: var(--au-sage);
          margin: 0;
        }
        .au-quote-text .qmark {
          color: var(--au-care);
          font-weight: 900;
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 1.2em; line-height: 0.6; margin-right: 0.05em;
        }

        /* Attribution */
        .au-attr-name {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: clamp(20px, 1.8vw, 24px);
          font-weight: 900; text-transform: uppercase; letter-spacing: -0.01em;
          color: var(--au-sage); margin: 0 0 4px;
        }
        .au-attr-line {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px; color: var(--au-muted);
          letter-spacing: 0.04em; margin: 0; font-weight: 400;
        }
        .au-affil {
          display: flex; align-items: center; gap: 16px; margin-top: 18px; flex-wrap: wrap;
        }
        .au-affil-mark {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-weight: 900; font-size: 16px; line-height: 1;
          letter-spacing: -0.01em; color: var(--au-amber); text-transform: uppercase;
        }
        .au-affil-mark.kellogg { font-style: italic; letter-spacing: 0.02em; text-transform: none; font-weight: 700; }
        .au-affil-dot { color: rgba(167, 144, 20, 0.5); }

        /* Author / Practitioner header */
        .au-name {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: clamp(26px, 2.2vw, 32px);
          font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em;
          color: var(--au-sage); margin: 0; line-height: 1;
        }
        .au-role-row {
          display: flex; align-items: center; gap: 10px;
          margin: 8px 0 24px; flex-wrap: wrap;
        }
        .au-role {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px; color: var(--au-muted); letter-spacing: 0.04em;
          margin: 0; font-weight: 400; text-transform: uppercase;
        }
        .au-li {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          color: var(--au-care);
          border: 1px solid rgba(191,70,26,0.4);
          border-radius: 50%;
          transition: color 200ms ease, background 200ms ease, transform 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease;
        }
        .au-li:hover { color: var(--au-sage); background: var(--au-care); border-color: var(--au-care); transform: scale(1.08) rotate(-6deg); }
        .au-li:focus-visible { outline: 2px solid var(--au-gold); outline-offset: 3px; }

        /* Stats */
        .au-stats {
          display: flex; flex-direction: column; gap: 12px;
          perspective: 1000px;
        }
        .au-stat {
          --tx: 0px; --ty: 0px; --rx: 0deg; --ry: 0deg;
          position: relative;
          background: rgba(15, 30, 29, 0.55);
          border: 1px solid rgba(213, 222, 212, 0.08);
          border-radius: 8px;
          padding: 16px 20px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 250ms ease,
            background 250ms ease,
            box-shadow 350ms ease;
        }
        .au-card[data-active="true"] .au-stat {
          animation: auStatIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: inherit;
        }
        @keyframes auStatIn {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .au-stat:hover {
          background: rgba(15, 30, 29, 0.85);
          border-color: rgba(191,70,26,0.45);
          box-shadow: 0 24px 48px -28px rgba(191,70,26,0.55);
          transform: translate(var(--tx), var(--ty)) rotateX(var(--rx)) rotateY(var(--ry)) translateZ(0);
        }
        .au-stat-row { display: flex; align-items: baseline; gap: 18px; }
        .au-stat-num {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: clamp(32px, 3vw, 42px);
          font-weight: 900; color: var(--au-gold);
          line-height: 1; letter-spacing: -0.03em;
          min-width: 88px; text-align: left; flex-shrink: 0;
        }
        .au-stat-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13.5px; line-height: 1.45;
          color: var(--au-medium); letter-spacing: 0.01em;
        }
        .au-stat-glow {
          position: absolute; inset: -2px;
          background: radial-gradient(circle at 50% 50%, rgba(255, 186, 26, 0.18) 0%, transparent 50%);
          opacity: 0; transition: opacity 400ms ease; pointer-events: none;
        }
        .au-stat:hover .au-stat-glow { opacity: 1; }
        .au-stat-ignite {
          position: absolute; left: 20px; right: 20px; bottom: 10px; height: 2px;
          background: linear-gradient(90deg, var(--au-care), var(--au-gold));
          transform: scaleX(0); transform-origin: left;
          transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 0.85;
        }
        .au-stat--lit .au-stat-ignite { transform: scaleX(1); }

        /* Pull quote */
        .au-pull {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px; color: var(--au-sage); line-height: 1.55;
          margin: 24px 0 0; padding: 14px 18px;
          background: rgba(34, 83, 81, 0.18);
          border-left: 3px solid var(--au-care);
          border-radius: 0 6px 6px 0;
          font-weight: 400; letter-spacing: -0.005em; font-style: italic;
        }
        .au-card[data-active="true"] .au-pull::after {
          content: '|'; color: var(--au-gold); margin-left: 4px;
          animation: auCaret 1.2s steps(2) infinite;
          font-style: normal; font-weight: 700;
        }
        @keyframes auCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* ── Controls ── */
        .au-controls {
          display: flex; align-items: center; gap: 14px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .au-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 40px; height: 40px;
          background: transparent;
          color: var(--au-care);
          border: 1px solid rgba(191,70,26,0.55);
          border-radius: 999px;
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease, transform 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease;
        }
        .au-arrow:hover { background: var(--au-care); color: var(--au-sage); transform: translateY(-1px); }
        .au-arrow:focus-visible { outline: 2px solid var(--au-gold); outline-offset: 3px; }
        .au-dots { display: inline-flex; gap: 10px; align-items: center; }
        .au-dot {
          width: 8px; height: 8px;
          background: rgba(213, 222, 212, 0.28);
          border: none; border-radius: 50%;
          padding: 0; cursor: pointer;
          transition: background 250ms ease, transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease;
        }
        .au-dot[aria-current="true"] {
          background: var(--au-care);
          box-shadow: 0 0 0 4px rgba(191,70,26,0.18);
          transform: scale(1.15);
        }
        .au-dot:hover { background: var(--au-gold); }
        .au-dot:focus-visible { outline: 2px solid var(--au-gold); outline-offset: 3px; }

        .au-pos {
          margin-left: auto;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--au-muted);
        }

        /* ── Bottom strip ── */
        .au-bottom {
          position: relative; z-index: 2;
          max-width: 1280px; margin: clamp(40px, 5vw, 72px) auto 0;
          padding-top: 28px; border-top: 1px solid rgba(213, 222, 212, 0.12);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 22px;
        }
        .au-bottom-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14.5px; color: var(--au-muted);
          margin: 0; font-weight: 400; letter-spacing: 0.02em; max-width: 60ch;
        }
        .au-bottom-text strong {
          color: var(--au-sage); font-weight: 900;
          text-transform: uppercase; letter-spacing: -0.01em;
        }
        .au-badges { display: flex; gap: 10px; flex-wrap: wrap; }
        .au-badge {
          position: relative; overflow: hidden;
          border: 1px solid rgba(213, 222, 212, 0.18);
          border-radius: 999px;
          padding: 9px 18px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: var(--au-medium); text-transform: uppercase; font-weight: 500;
          transition: border-color 220ms ease, color 220ms ease, background 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
          text-decoration: none;
        }
        .au-badge::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 35%, rgba(255,186,26,0.18) 50%, transparent 65%);
          transform: translateX(-110%);
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .au-badge:hover { border-color: var(--au-care); color: var(--au-sage); background: rgba(191,70,26,0.12); transform: translateY(-2px); }
        .au-badge:hover::before { transform: translateX(110%); }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .au-glow-a, .au-glow-b, .au-curtain, .au-eyebrow-row, .au-deck, .au-flipper,
          .au-quote::before, .au-stat, .au-stat-ignite, .au-title .word, .au-card-dot,
          .au-card {
            animation: none !important;
            transition: opacity 200ms ease !important;
            transform: none !important;
            opacity: 1 !important;
          }
          .au-curtain { width: 100%; }
          .au-card { backface-visibility: visible; -webkit-backface-visibility: visible; }
          .au-card[data-active="false"] { opacity: 0 !important; pointer-events: none; }
          .au-card[data-active="true"]  { opacity: 1 !important; }
          .au-card[data-active="true"] .au-quote::before { height: calc(100% - 4px); }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="authority"
        className={`au-root${active ? ' au-active' : ''}`}
      >
        <div className="au-curtain" aria-hidden />
        <div className="au-atmos" aria-hidden>
          <div className="au-glow-a" />
          <div className="au-glow-b" />
          <div className="au-grain" />
        </div>

        <div className="au-inner">
          {/* ── Left rail ── */}
          <header className="au-rail">
            <div className="au-eyebrow-row">
              <span className="au-eyebrow-bar" aria-hidden />
              <p className="au-eyebrow">02 · Built By</p>
            </div>

            <h2 className="au-title">
              <span className="word w1">Built</span>{' '}
              <span className="word w2">by</span>{' '}
              <span className="word w3">the</span>{' '}
              <span className="word w4 accent">people</span>{' '}
              <span className="word w5">who</span>{' '}
              <span className="word w6">built it.</span>
            </h2>

            <p className="au-deck">
              <strong>Three signatures.</strong> Foreword, practitioner, author — flip through.
            </p>
          </header>

          {/* ── Right: rolodex flipper ── */}
          <div
            ref={flipperRef}
            className="au-flipper"
            role="region"
            aria-roledescription="carousel"
            aria-label="Authority signatures"
            tabIndex={0}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => pauseAndScheduleResume()}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!flipperRef.current?.contains(e.relatedTarget as Node | null)) {
                pauseAndScheduleResume();
              }
            }}
            onKeyDown={onFlipperKeyDown}
          >
            <div className="au-stage">
              <div className="au-stack-shadow deeper" aria-hidden />
              <div className="au-stack-shadow" aria-hidden />

              {/* Card 0 — Foreword */}
              <article
                className="au-card"
                data-active={activeIndex === 0}
                aria-hidden={activeIndex !== 0}
                aria-label="Foreword by Jonathan Copulsky"
                style={{ transform: `rotateY(${rotationFor(0)}deg)` }}
              >
                <div className="au-card-eyebrow">
                  <span className="au-card-dot" aria-hidden />
                  <span className="au-card-label">Foreword</span>
                  <span className="au-card-pos">01 / 03</span>
                </div>
                <blockquote className="au-quote">
                  <p className="au-quote-text">
                    <span className="qmark">“</span>
                    Go to market in professional services is as much a mindset issue as it is an
                    operational one. The firms that grow are the ones with real clarity about the
                    problems they solve, for whom, and what outcomes that produces. This book builds
                    the system around that clarity.<span className="qmark">”</span>
                  </p>
                </blockquote>
                <p className="au-attr-name">Jonathan Copulsky</p>
                <p className="au-attr-line">Former CMO, Deloitte · Senior Lecturer, Northwestern Kellogg</p>
                <div className="au-affil" aria-label="Deloitte and Northwestern Kellogg">
                  <span className="au-affil-mark">Deloitte.</span>
                  <span className="au-affil-dot" aria-hidden>·</span>
                  <span className="au-affil-mark kellogg">Kellogg</span>
                </div>
              </article>

              {/* Card 1 — Practitioner */}
              <article
                className="au-card"
                data-active={activeIndex === 1}
                aria-hidden={activeIndex !== 1}
                aria-label="Practitioner: Richard Ashbaugh"
                style={{ transform: `rotateY(${rotationFor(1)}deg)` }}
              >
                <div className="au-card-eyebrow">
                  <span className="au-card-dot" aria-hidden />
                  <span className="au-card-label">Practitioner</span>
                  <span className="au-card-pos">02 / 03</span>
                </div>
                <p className="au-name">Richard Ashbaugh</p>
                <div className="au-role-row">
                  <p className="au-role">Co-Author · CEO, Mabbly</p>
                  <a
                    href="https://www.linkedin.com/in/richardfashbaugh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Richard Ashbaugh on LinkedIn"
                    className="au-li"
                    tabIndex={activeIndex === 1 ? 0 : -1}
                  >
                    <Linkedin size={14} strokeWidth={2} />
                  </a>
                </div>
                <div className="au-stats">
                  {PRACTITIONER_STATS.map((s, i) => renderStatCard(s, `p-${i}`, i))}
                </div>
                <p className="au-pull">
                  The framework in this book is the one I wish I had at AArete.
                </p>
              </article>

              {/* Card 2 — Author */}
              <article
                className="au-card"
                data-active={activeIndex === 2}
                aria-hidden={activeIndex !== 2}
                aria-label="Author: Adam Fridman"
                style={{ transform: `rotateY(${rotationFor(2)}deg)` }}
              >
                <div className="au-card-eyebrow">
                  <span className="au-card-dot" aria-hidden />
                  <span className="au-card-label">Author</span>
                  <span className="au-card-pos">03 / 03</span>
                </div>
                <p className="au-name">Adam Fridman</p>
                <p className="au-role" style={{ margin: '8px 0 24px' }}>Co-Author · Founder, Mabbly</p>
                <div className="au-stats">
                  {AUTHOR_STATS.map((s, i) => renderStatCard(s, `a-${i}`, i))}
                </div>
                <p className="au-pull">
                  Six hundred conversations. One framework that survived contact with reality.
                </p>
              </article>
            </div>

            <div className="au-controls" aria-live="polite">
              <button
                type="button"
                className="au-arrow"
                aria-label="Previous signature"
                onClick={() => { prev(); pauseAndScheduleResume(); }}
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <div className="au-dots" role="tablist" aria-label="Select signature">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="au-dot"
                    role="tab"
                    aria-selected={activeIndex === i}
                    aria-current={activeIndex === i}
                    aria-label={`Show ${CARD_LABELS[i]}`}
                    onClick={() => { goTo(i); pauseAndScheduleResume(); }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="au-arrow"
                aria-label="Next signature"
                onClick={() => { next(); pauseAndScheduleResume(); }}
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
              <span className="au-pos">
                {String(activeIndex + 1).padStart(2, '0')} / 03 · {CARD_LABELS[activeIndex]}
              </span>
            </div>
          </div>
        </div>

        <div className="au-bottom">
          <p className="au-bottom-text">
            <strong>The most credentialed GTM authority strip in professional services.</strong>{' '}
            Verified affiliations — open the source.
          </p>
          <div className="au-badges">
            <a className="au-badge" href="https://www.deloitte.com" target="_blank" rel="noopener noreferrer" aria-label="Deloitte (opens in new tab)">Deloitte</a>
            <a className="au-badge" href="https://www.kearney.com" target="_blank" rel="noopener noreferrer" aria-label="A.T. Kearney (opens in new tab)">A.T. Kearney</a>
            <a className="au-badge" href="https://mabbly.com" target="_blank" rel="noopener noreferrer" aria-label="Mabbly (opens in new tab)">Mabbly</a>
          </div>
        </div>
      </section>
    </>
  );
}
