import { Link } from "react-router-dom";

const MARKERS = [
  { date: 'June 2026', label: 'Nominations open' },
  { date: 'August 2026', label: 'Finalists announced' },
  { date: 'September 2026', label: 'Winners revealed' },
];

export default function AwardsCalendarCta() {
  return (
    <section
      style={{
        background: '#0D0905',
        padding: '120px 24px',
        borderTop: '1px solid rgba(168, 146, 58,0.08)',
      }}
    >
      <style>{`
        .ac-header {
          max-width: 880px;
          margin: 0 auto 64px;
          text-align: center;
        }
        .ac-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 20px;
        }
        .ac-headline {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-weight: 400;
          font-size: clamp(48px, 7vw, 72px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #EDF5EC;
          margin: 0;
        }
        .ac-timeline {
          max-width: 920px;
          margin: 0 auto 96px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          padding: 0 8px;
        }
        @media (min-width: 768px) {
          .ac-timeline {
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            position: relative;
          }
          .ac-timeline::before {
            content: '';
            position: absolute;
            top: 7px;
            left: 12%;
            right: 12%;
            height: 1px;
            background: linear-gradient(90deg, rgba(168, 146, 58,0.1), rgba(168, 146, 58,0.4), rgba(168, 146, 58,0.1));
          }
        }
        .ac-marker {
          text-align: center;
          position: relative;
          padding-top: 28px;
        }
        .ac-marker::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #A8923A;
          box-shadow: 0 0 14px rgba(168, 146, 58,0.55);
        }
        .ac-date {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 8px;
        }
        .ac-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          color: rgba(237, 245, 236,0.75);
          margin: 0;
        }
        .ac-cta-wrap {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .ac-cta-headline {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-weight: 400;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.08;
          letter-spacing: -0.018em;
          color: #EDF5EC;
          margin: 0 0 20px;
        }
        .ac-cta-sub {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(237, 245, 236,0.55);
          margin: 0 0 32px;
        }
        .ac-cta {
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
        .ac-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(168, 146, 58,0.6);
        }
        @media (max-width: 640px) {
          .ac-cta { display: block; width: 100%; }
        }
        .ac-trust {
          margin-top: 20px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(237, 245, 236,0.4);
          letter-spacing: 0.01em;
        }
      `}</style>

      <div className="ac-header">
        <p className="ac-eyebrow">04 · Calendar</p>
        <h2 className="ac-headline">Q3 2026.</h2>
      </div>

      <div className="ac-timeline">
        {MARKERS.map((m) => (
          <div key={m.date} className="ac-marker">
            <p className="ac-date">{m.date}</p>
            <p className="ac-label">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="ac-cta-wrap">
        <h3 className="ac-cta-headline">Your firm is already eligible.</h3>
        <p className="ac-cta-sub">
          Take the 10 min diagnostic. Your firm is added to the research and considered for the Awards by default. No separate application.
        </p>
        <Link to="/#hero" className="ac-cta" data-cta="add-your-firm">Add Your Firm →</Link>
        <p className="ac-trust">Free. 90 seconds to build. 10 minutes to read. Confidential.</p>
      </div>
    </section>
  );
}
