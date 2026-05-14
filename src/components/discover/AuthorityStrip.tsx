import LinkedInIcon from '@/components/icons/LinkedInIcon';

type Stat = { value: string; label: string };

const RICHARD_STATS: Stat[] = [
  { value: '26', label: 'years across 9 professional services firms' },
  { value: '$125M', label: 'AArete revenue as CMO' },
  { value: '$1.2B', label: 'Kearney, scaled from $250M' },
];

const ADAM_STATS: Stat[] = [
  { value: '332', label: 'interviews, The Science of Story' },
  { value: '92', label: 'podcast episodes on GTM for PS' },
  { value: '1 yr', label: 'Inc. columnist' },
];

export default function AuthorityStrip() {
  return (
    <>
      <style>{`
        .au-root {
          position: relative;
          width: 100%;
          background: #0F1E1D;
          color: #EDF5EC;
          padding: clamp(72px, 9vw, 128px) 24px;
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        @media (min-width: 768px) {
          .au-root { padding-left: 40px; padding-right: 40px; }
        }

        .au-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .au-header {
          text-align: left;
          max-width: 720px;
          margin: 0 0 clamp(40px, 5vw, 64px);
        }
        .au-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #FFBA1A;
          margin: 0 0 14px;
          font-weight: 500;
        }
        .au-title {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 3.2vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #EDF5EC;
          margin: 0 0 14px;
        }
        .au-deck {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          color: #A1A9A0;
          line-height: 1.55;
          margin: 0;
        }

        .au-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 900px) {
          .au-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; max-width: 880px; margin-left: auto; margin-right: auto; }
        }

        .au-card {
          background: #1A2B2A;
          border: 1px solid rgba(213, 222, 212, 0.10);
          border-radius: 16px;
          padding: clamp(24px, 2.4vw, 32px);
          display: flex;
          flex-direction: column;
          min-height: 360px;
          transition: border-color 220ms ease, transform 220ms ease;
        }
        .au-card:hover {
          border-color: rgba(191, 70, 26, 0.32);
          transform: translateY(-2px);
        }

        .au-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .au-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #FFBA1A;
          font-weight: 500;
        }
        .au-card-pos {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #A1A9A0;
        }

        .au-quote {
          padding-left: 16px;
          border-left: 2px solid #BF461A;
          margin: 0 0 24px;
          font-size: 15.5px;
          line-height: 1.6;
          color: #EDF5EC;
          font-weight: 400;
          flex: 1;
        }

        .au-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: #EDF5EC;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .au-name-tooltip {
          cursor: help;
          width: fit-content;
          text-decoration: underline dotted rgba(213, 222, 212, 0.4);
          text-underline-offset: 6px;
          transition: text-decoration-color 200ms ease;
        }
        .au-name-tooltip:hover,
        .au-name-tooltip:focus-visible {
          text-decoration-color: #BF461A;
          outline: none;
        }
        .au-role {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          color: #A1A9A0;
          letter-spacing: 0.04em;
          margin: 0;
          font-weight: 400;
        }
        .au-role-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 20px;
          flex-wrap: wrap;
        }
        .au-li {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          color: #FFFFFF;
          background: #BF461A;
          border: 1px solid #BF461A;
          border-radius: 50%;
          transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
        }
        .au-li:hover {
          background: #A33C16;
          border-color: #A33C16;
        }

        .au-affil {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .au-affil-mark {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          font-size: 14px;
          color: #A79014;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }
        .au-affil-mark.kellogg {
          font-style: italic;
          font-weight: 700;
          text-transform: none;
          letter-spacing: 0.02em;
        }
        .au-affil-dot { color: rgba(167, 144, 20, 0.5); }

        .au-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .au-stat {
          background: rgba(15, 30, 29, 0.55);
          border: 1px solid rgba(213, 222, 212, 0.08);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          align-items: baseline;
          gap: 14px;
        }
        .au-stat-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #FFBA1A;
          line-height: 1;
          letter-spacing: -0.02em;
          min-width: 64px;
          flex-shrink: 0;
        }
        .au-stat-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          line-height: 1.4;
          color: #D5DED4;
        }

        .au-bottom {
          max-width: 1280px;
          margin: clamp(40px, 5vw, 64px) auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(213, 222, 212, 0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }
        .au-bottom-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13.5px;
          color: #A1A9A0;
          margin: 0;
          max-width: 60ch;
        }
        .au-bottom-text strong {
          color: #EDF5EC;
          font-weight: 900;
        }
        .au-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .au-badge {
          border: 1px solid rgba(213, 222, 212, 0.18);
          border-radius: 999px;
          padding: 8px 16px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #D5DED4;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 200ms ease, color 200ms ease, background 200ms ease;
        }
        .au-badge:hover {
          border-color: #BF461A;
          color: #EDF5EC;
          background: rgba(191, 70, 26, 0.12);
        }
      `}</style>

      <section id="authority" className="au-root">
        <div className="au-inner">
          <header className="au-header">
            <h2 className="au-title">Built by the people who built it.</h2>
            <p className="au-deck">Two signatures. Practitioner and author.</p>
          </header>

          <div className="au-grid">
            {/* Richard - Practitioner */}
            <article className="au-card">
              <div className="au-card-head">
                <span className="au-card-label">Practitioner</span>
                <span className="au-card-pos">01 / 02</span>
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
                >
                  <LinkedInIcon size={18} variant="white" />
                </a>
              </div>
              <div className="au-stats">
                {RICHARD_STATS.map((s, i) => (
                  <div key={i} className="au-stat">
                    <span className="au-stat-num">{s.value}</span>
                    <span className="au-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Adam - Author */}
            <article className="au-card">
              <div className="au-card-head">
                <span className="au-card-label">Author</span>
                <span className="au-card-pos">02 / 02</span>
              </div>
              <p className="au-name">Adam Fridman</p>
              <div className="au-role-row">
                <p className="au-role">Co-Author · Founder, Mabbly</p>
                <a
                  href="https://www.linkedin.com/in/adamfridman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Adam Fridman on LinkedIn"
                  className="au-li"
                >
                  <LinkedInIcon size={18} variant="white" />
                </a>
              </div>
              <div className="au-stats">
                {ADAM_STATS.map((s, i) => (
                  <div key={i} className="au-stat">
                    <span className="au-stat-num">{s.value}</span>
                    <span className="au-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="au-bottom">
            <p className="au-bottom-text">
              <strong>The most credentialed GTM authority strip in professional services.</strong>{' '}
              Verified affiliations.
            </p>
            <div className="au-badges">
              <a className="au-badge" href="https://www.deloitte.com" target="_blank" rel="noopener noreferrer">Deloitte</a>
              <a className="au-badge" href="https://www.kearney.com" target="_blank" rel="noopener noreferrer">Kearney</a>
              <a className="au-badge" href="https://mabbly.com" target="_blank" rel="noopener noreferrer">Mabbly</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
