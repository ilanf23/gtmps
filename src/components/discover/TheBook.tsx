// RETIRED: This component is no longer rendered on /discover.
// Section 10 (The Manuscript) was cut from the homepage; its SEO surface
// now lives on the standalone /manuscript route (src/pages/Manuscript.tsx).
// Kept on disk for restore parity.
type Chapter = { num: string; title: string; meta: string };

const CHAPTERS: Chapter[] = [
  { num: '01', title: 'The Dead Zone', meta: 'Chapter 7 · 24 pages' },
  { num: '02', title: 'The Five Orbits', meta: 'Chapter 4 · 18 pages' },
  { num: '03', title: 'Building Your MAP', meta: 'Chapter 11 · 31 pages' },
];

const BADGES = ['30 Chapters', '3 Frameworks', 'PS Firms $5M–$100M'];

export default function TheBook() {
  return (
    <section
      id="the-book"
      className="px-6 md:px-10"
      style={{
        background: '#EDF5EC',
        borderTop: '1px solid rgba(168, 146, 58,0.12)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <style>{`
        .tb-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .tb-grid { grid-template-columns: 40% 60%; gap: 72px; }
        }
        .tb-left { animation: fadeUp 0.7s ease 0.1s both; display: flex; justify-content: center; }
        .tb-right { animation: fadeUp 0.7s ease 0.2s both; }
        .tb-badge {
          border: 1px solid rgba(168, 146, 58,0.28);
          border-radius: 3px;
          padding: 8px 16px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.12em;
          color: #6A5038;
          text-transform: uppercase;
          cursor: default;
          font-weight: 500;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }
        .tb-badge:hover {
          border-color: rgba(168, 146, 58,0.65);
          color: #9A7020;
          background: rgba(168, 146, 58,0.08);
        }
      `}</style>

      <div className="tb-grid">
        <div className="tb-left">
          <div
            style={{
              width: 320,
              maxWidth: '100%',
              aspectRatio: '2 / 3',
              background: '#0F1E1D',
              border: '2px solid rgba(168, 146, 58,0.45)',
              borderRadius: 6,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '8px 12px 48px rgba(0,0,0,0.22)',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'rgba(168, 146, 58,0.55)',
                  fontWeight: 500,
                }}
              >
                MABBLY PRESS
              </div>
              <div
                style={{
                  width: 52,
                  height: 1.5,
                  background: '#A8923A',
                  marginTop: 14,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 22,
                fontWeight: 500,
                color: '#EDF5EC',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Relationship Revenue OS
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                color: 'rgba(237, 245, 236,0.5)',
                fontWeight: 400,
                letterSpacing: '0.04em',
              }}
            >
              Fridman · Ashbaugh
            </div>
          </div>
        </div>

        <div className="tb-right">
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#A8923A',
              margin: 0,
              fontWeight: 500,
            }}
          >
            THE MANUSCRIPT
          </p>
          <div
            aria-hidden
            style={{
              width: 44,
              height: 2,
              background: 'linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))',
              margin: '18px 0 28px',
              animation: 'growRule 0.8s ease both',
            }}
          />
          <h2
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(44px, 6vw, 72px)',
              fontWeight: 500,
              color: '#2A1A08',
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              margin: '0 0 18px',
            }}
          >
            Relationship Revenue OS
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              color: 'rgba(42,26,8,0.55)',
              margin: '0 0 36px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            The complete GTM operating system for professional services firms. 30 chapters. The
            Dead Zone. The Five Orbits. The MAP.
          </p>

          <div style={{ borderTop: '1px solid rgba(168, 146, 58,0.18)', marginBottom: 24 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CHAPTERS.map((c) => (
              <div
                key={c.num}
                style={{
                  background: 'rgba(255,250,240,0.8)',
                  border: '1px solid rgba(168, 146, 58,0.18)',
                  borderRadius: 4,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 36,
                    fontWeight: 600,
                    color: 'rgba(42,26,8,0.18)',
                    minWidth: 52,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {c.num}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 22,
                    color: '#2A1A08',
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {c.title}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13,
                    color: 'rgba(42,26,8,0.45)',
                    marginLeft: 'auto',
                    fontWeight: 400,
                  }}
                >
                  {c.meta}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            {BADGES.map((b) => (
              <span key={b} className="tb-badge">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
