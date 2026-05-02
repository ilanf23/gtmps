const CARDS = [
  {
    eyebrow: 'Selection',
    body:
      'Winners selected by Adam Fridman, Richard Ashbaugh, and a panel of practitioners spanning all 8 verticals.',
  },
  {
    eyebrow: 'Methodology',
    body:
      'Judged on systematic excellence: the firms that built repeatable systems, not the ones with single lucky wins.',
  },
  {
    eyebrow: 'Year One Truth',
    body:
      'Inaugural cohort, 2026. We will not award where we cannot evidence excellence. Held verticals re-open Year Two.',
  },
];

export default function AwardsJudging() {
  return (
    <section
      style={{
        background: '#EDF5EC',
        padding: '120px 24px',
      }}
    >
      <style>{`
        .aj-header {
          max-width: 880px;
          margin: 0 auto 64px;
          text-align: center;
        }
        .aj-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 20px;
        }
        .aj-headline {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-weight: 400;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.018em;
          color: #0F1E1D;
          margin: 0;
        }
        .aj-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .aj-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
        }
        .aj-card {
          padding: 36px 32px;
          background: #EDF5EC;
          border: 1px solid rgba(15, 30, 29,0.1);
          border-top: 2px solid #A8923A;
          border-radius: 2px;
        }
        .aj-card-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 16px;
        }
        .aj-card-body {
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-size: 18px;
          line-height: 1.55;
          color: #0F1E1D;
          margin: 0;
        }
      `}</style>

      <div className="aj-header">
        <p className="aj-eyebrow">03 · How It Works</p>
        <h2 className="aj-headline">Judged by practitioners. Awarded with integrity.</h2>
      </div>

      <div className="aj-grid">
        {CARDS.map((c) => (
          <div key={c.eyebrow} className="aj-card">
            <p className="aj-card-eyebrow">{c.eyebrow}</p>
            <p className="aj-card-body">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
