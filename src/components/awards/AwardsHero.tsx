import { Link } from "react-router-dom";

export default function AwardsHero() {
  return (
    <section
      style={{
        background: '#0F1E1D',
        position: 'relative',
        overflow: 'hidden',
        padding: '140px 24px 120px',
      }}
    >
      <style>{`
        .ah-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(168, 146, 58,0.14), transparent 60%);
          pointer-events: none;
        }
        .ah-inner {
          position: relative;
          max-width: 880px;
          margin: 0 auto;
          text-align: center;
          animation: ahFade 0.9s ease 0.1s both;
        }
        @keyframes ahFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ah-sculpture {
          position: relative;
          width: 320px;
          height: 320px;
          margin: 0 auto 56px;
          filter: drop-shadow(0 40px 80px rgba(168, 146, 58,0.35));
        }
        @media (max-width: 640px) {
          .ah-sculpture { width: 60vw; height: 60vw; margin-bottom: 40px; }
        }
        .ah-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(168, 146, 58,0.9);
          animation: ahSpin 60s linear infinite;
        }
        .ah-ring.r2 {
          inset: 10%;
          border-color: rgba(168, 146, 58,0.7);
          animation-duration: 75s;
          animation-direction: reverse;
        }
        .ah-ring.r3 {
          inset: 22%;
          border-color: rgba(168, 146, 58,0.5);
          animation-duration: 90s;
        }
        .ah-ring.r4 {
          inset: 32%;
          border-color: rgba(168, 146, 58,0.32);
          animation-duration: 105s;
          animation-direction: reverse;
        }
        .ah-ring.r5 {
          inset: 40%;
          border-color: rgba(168, 146, 58,0.2);
          animation-duration: 120s;
        }
        @keyframes ahSpin { to { transform: rotate(360deg); } }
        .ah-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C4AC4A, #A8923A);
          box-shadow: 0 0 16px rgba(212,174,72,0.6);
        }
        .ah-dot.d1 { top: -5px; left: 50%; transform: translateX(-50%); }
        .ah-dot.d2 { bottom: 14%; right: 6%; width: 8px; height: 8px; }
        .ah-dot.core {
          inset: 44%;
          width: auto;
          height: auto;
          background: radial-gradient(circle, #EDF5EC, #A8923A 70%);
          box-shadow: 0 0 32px rgba(212,174,72,0.8);
        }
        @media (prefers-reduced-motion: reduce) {
          .ah-ring { animation: none; }
        }
        .ah-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 24px;
        }
        .ah-headline {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-weight: 400;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          color: #EDF5EC;
          margin: 0 0 28px;
        }
        .ah-sub {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: clamp(18px, 2.4vw, 24px);
          line-height: 1.5;
          color: rgba(237, 245, 236,0.7);
          max-width: 640px;
          margin: 0 auto 40px;
        }
        .ah-cta {
          display: inline-block;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 16px 36px;
          background: linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%);
          color: #0F1E1D;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 200ms, box-shadow 200ms;
        }
        .ah-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(168, 146, 58,0.6);
        }
        @media (max-width: 640px) {
          .ah-cta { display: block; width: 100%; }
        }
        .ah-trust {
          margin-top: 24px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(237, 245, 236,0.45);
          letter-spacing: 0.01em;
        }
      `}</style>

      <div className="ah-glow" aria-hidden />
      <div className="ah-inner">
        <div className="ah-sculpture" aria-hidden>
          <div className="ah-ring r1" />
          <div className="ah-ring r2" />
          <div className="ah-ring r3" />
          <div className="ah-ring r4" />
          <div className="ah-ring r5" />
          <div className="ah-dot core" />
          <div className="ah-dot d1" />
          <div className="ah-dot d2" />
        </div>

        <p className="ah-eyebrow">01 · Inaugural · 2026</p>
        <h1 className="ah-headline">Awards built for the firms that win unfairly.</h1>
        <p className="ah-sub">
          Excellence in relationship driven growth deserves institutional recognition. Eight awards. One per vertical. Inaugural cohort, Q3 2026.
        </p>
        <Link to="/#hero" className="ah-cta" data-cta="add-your-firm">Add Your Firm →</Link>
        <p className="ah-trust">Free. 90 seconds to build. 10 minutes to read. Confidential. Considered for the Awards by default.</p>
      </div>
    </section>
  );
}
