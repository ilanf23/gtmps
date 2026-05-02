import { useEffect, useRef, useState } from 'react';
import bookCover from '@/assets/book-cover-v2.png';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollToHero } from '@/lib/scrollToHero';

export default function ManuscriptAnchor() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="manuscript"
      style={{
        background: '#0F1E1D',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '80px 24px',
      }}
    >
      <style>{`
        .ma-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 720px;
          height: 720px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168, 146, 58,0.14) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ma-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 36px;
          max-width: 720px;
          text-align: center;
        }
        .ma-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0;
        }
        .ma-book-wrap {
          perspective: 1400px;
        }
        .ma-book {
          width: 360px;
          height: auto;
          display: block;
          box-shadow:
            0 40px 80px -20px rgba(0,0,0,0.7),
            0 0 0 1px rgba(168, 146, 58,0.18),
            0 0 100px -20px rgba(168, 146, 58,0.25);
          transform-origin: center;
          transform: rotateY(-15deg);
          transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ma-book.ma-revealed { transform: rotateY(0deg); }
        .ma-line {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-size: clamp(20px, 2.4vw, 26px);
          font-weight: 400;
          color: #EDF5EC;
          line-height: 1.45;
          margin: 0;
          letter-spacing: -0.005em;
          max-width: 640px;
        }
        .ma-cta {
          display: inline-block;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 14px 30px;
          border: 1px solid rgba(168, 146, 58,0.55);
          color: #A8923A;
          background: transparent;
          border-radius: 999px;
          text-decoration: none;
          transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
        }
        .ma-cta:hover {
          background: rgba(168, 146, 58,0.10);
          color: #EDF5EC;
          border-color: #A8923A;
        }

        @media (max-width: 767px) {
          section#manuscript { min-height: 80vh; }
          .ma-book { width: 60vw; max-width: 220px; transform: none; transition: opacity 400ms ease; opacity: 0; }
          .ma-book.ma-revealed { opacity: 1; }
          .ma-glow { width: 460px; height: 460px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ma-book { transition: opacity 200ms ease; transform: none; opacity: 0; }
          .ma-book.ma-revealed { opacity: 1; }
        }
      `}</style>

      <div className="ma-glow" aria-hidden />

      <div className="ma-inner">
        <p className="ma-eyebrow">03 · The Manuscript</p>
        <div className="ma-book-wrap">
          <img
            src={bookCover}
            alt="GTM for Professional Services manuscript cover"
            className={`ma-book ${revealed || reduced ? 'ma-revealed' : ''}`}
          />
        </div>
        <p className="ma-line">
          30 chapters. Three frameworks. Available now to Early Access readers.
        </p>
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollToHero(); }}
          className="ma-cta"
          data-cta="add-your-firm"
        >
          Add Your Firm →
        </a>
      </div>
    </section>
  );
}
