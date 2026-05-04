import { scrollToHero } from '@/lib/scrollToHero';

export default function BetaReader() {
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
          padding: 17px 19px;
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
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          font-weight: 900;
          font-size: 16px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #EDF5EC;
          background: #BF461A;
          padding: 17px 26px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 16px -6px rgba(191, 70, 26, 0.55);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          transition: background 200ms, color 200ms, transform 200ms;
        }
        .ea-submit:hover {
          background: #EDF5EC;
          color: #0F1E1D;
          transform: translateY(-1px);
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

        <form
          className="ea-form"
          action="mailto:beta@mabbly.com"
          onSubmit={(e) => {
            e.preventDefault();
            scrollToHero();
          }}
        >
          <div className="ea-input-row">
            <input
              type="email"
              name="email"
              className="ea-input"
              placeholder="you@firm.com"
              aria-label="Work email"
              autoComplete="email"
            />
            <button type="submit" className="ea-submit" data-cta="add-your-firm">
              Build Your Map
              <span className="ea-arrow" aria-hidden>→</span>
            </button>
          </div>
          <p className="ea-trust">
            Free<span className="ea-sep">·</span>By application<span className="ea-sep">·</span>48hr decisions
          </p>
        </form>
      </div>
    </section>
  );
}
