import { useState } from 'react';
import { scrollToHero } from '@/lib/scrollToHero';

export default function BetaReader() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    scrollToHero();
  };

  return (
    <section
      id="beta-reader"
      className="ea-band"
      aria-label="Early Access"
    >
      <style>{`
        .ea-band {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: #0F1E1D;
          padding: 38px 67px;
          animation: eaBandIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) both;
        }
        .ea-band::before {
          content: "";
          position: absolute;
          top: -120px; left: -120px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(255, 186, 26, 0.10) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .ea-band::after {
          content: "";
          position: absolute;
          bottom: -100px; right: -100px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(191, 70, 26, 0.14) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .ea-row {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 58px;
          align-items: center;
        }
        .ea-left {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ea-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(255, 186, 26, 0.12);
          border: 1px solid rgba(255, 186, 26, 0.45);
          border-radius: 100px;
          width: fit-content;
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #FFBA1A;
        }
        .ea-pill .ea-num {
          color: #EDF5EC;
          margin-right: 4px;
        }
        .ea-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FFBA1A;
          box-shadow: 0 0 10px rgba(255, 186, 26, 0.7);
          animation: eaPulseDot 1.6s ease-in-out infinite;
        }
        .ea-headline {
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          font-weight: 900;
          font-size: clamp(34px, 4.1vw, 53px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          color: #EDF5EC;
          max-width: 22ch;
          margin: 0;
        }
        .ea-headline .ea-period {
          color: #FFBA1A;
        }
        .ea-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 0;
        }
        .ea-input-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }
        .ea-input {
          flex: 1;
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 17px;
          letter-spacing: -0.01em;
          color: #EDF5EC;
          padding: 0 19px;
          height: 56px;
          box-sizing: border-box;
          background: rgba(237, 245, 236, 0.06);
          border: 1.5px solid rgba(237, 245, 236, 0.18);
          border-radius: 10px;
          outline: none;
          transition: border-color 200ms, background 200ms, box-shadow 200ms;
        }
        .ea-input::placeholder {
          color: rgba(237, 245, 236, 0.45);
        }
        .ea-input:focus {
          border-color: #BF461A;
          background: rgba(237, 245, 236, 0.1);
          box-shadow: 0 0 0 3px rgba(191, 70, 26, 0.18);
        }
        .ea-submit {
          position: relative;
          overflow: hidden;
          font-family: 'Mabbly Repro', 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #F8F2E5;
          background: #BF461A;
          padding: 0 26px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 999px;
          border: 2px solid #BF461A;
          cursor: pointer;
          box-shadow: 0 10px 28px -10px rgba(191, 70, 26, 0.45);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          transition: background 300ms cubic-bezier(0.13, 0.28, 0.3, 1), border-color 300ms cubic-bezier(0.13, 0.28, 0.3, 1), transform 300ms cubic-bezier(0.13, 0.28, 0.3, 1), box-shadow 300ms cubic-bezier(0.13, 0.28, 0.3, 1);
        }
        .ea-submit:hover {
          background: #0F1E1D;
          border-color: #0F1E1D;
          color: #F8F2E5;
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -10px rgba(15,30,29,0.45);
        }
        .ea-submit .ea-arrow {
          display: inline-block;
          transition: transform 350ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .ea-submit:hover .ea-arrow {
          transform: translateX(4px);
        }
        .ea-submit::before {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(237, 245, 236, 0.22), transparent);
          animation: eaShimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .ea-trust {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: #EDF5EC;
          opacity: 0.55;
          margin: 0;
        }
        .ea-trust .ea-sep {
          color: #FFBA1A;
          margin: 0 8px;
          opacity: 0.85;
        }

        .ea-success {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 22px 24px;
          background: rgba(41, 207, 157, 0.08);
          border: 1px solid rgba(41, 207, 157, 0.45);
          border-radius: 12px;
          animation: eaSuccessIn 480ms cubic-bezier(0.13, 0.28, 0.3, 1) both;
        }
        .ea-success-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ea-success-check {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #29CF9D;
          color: #0F1E1D;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .ea-success-headline {
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: #EDF5EC;
          margin: 0;
        }
        .ea-success-body {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 13px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          color: rgba(237, 245, 236, 0.78);
          margin: 0;
        }
        @keyframes eaSuccessIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes eaBandIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eaPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes eaShimmer {
          0%   { left: -100%; }
          50%  { left: 200%; }
          100% { left: 200%; }
        }

        @media (max-width: 900px) {
          .ea-band { padding: 34px 38px; }
          .ea-row { grid-template-columns: 1fr; gap: 29px; }
          .ea-headline { font-size: clamp(29px, 6.6vw, 38px); }
        }
        @media (max-width: 540px) {
          .ea-input-row { flex-direction: column; }
          .ea-submit { justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ea-band,
          .ea-dot,
          .ea-submit::before {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
          .ea-submit:hover { transform: none; }
          .ea-submit:hover .ea-arrow { transform: none; }
        }
      `}</style>

      <div className="ea-row">
        <div className="ea-left">
          <span className="ea-pill">
            <span className="ea-dot" aria-hidden />
            <span>
              <span className="ea-num">15 ·</span>Early Access · Open
            </span>
          </span>
          <h2 className="ea-headline">
            Get this system 90 days before launch<span className="ea-period">.</span>
          </h2>
        </div>

        {submitted ? (
          <div className="ea-success" role="status" aria-live="polite">
            <div className="ea-success-row">
              <span className="ea-success-check" aria-hidden>✓</span>
              <h3 className="ea-success-headline">You're on the list.</h3>
            </div>
            <p className="ea-success-body">
              We'll review your application and respond within 48 hours. Add your firm's
              website above to get your personalized MAP while you wait.
            </p>
          </div>
        ) : (
          <form
            className="ea-form"
            action="mailto:beta@mabbly.com"
            onSubmit={handleSubmit}
          >
            <div className="ea-input-row">
              <input
                type="email"
                name="email"
                className="ea-input"
                placeholder="you@firm.com"
                aria-label="Work email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="ea-submit" data-cta="add-your-firm">
                Add Your Firm
                <span className="ea-arrow" aria-hidden>→</span>
              </button>
            </div>
            <p className="ea-trust">
              Free<span className="ea-sep">·</span>By application<span className="ea-sep">·</span>48hr decisions
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
