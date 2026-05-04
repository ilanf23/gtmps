import { scrollToHero } from '@/lib/scrollToHero';

const DIMENSIONS = [
  { name: 'Relationship Depth', cohort: 64, peer: 41 },
  { name: 'Orbit Activation', cohort: 58, peer: 33 },
  { name: 'Signal Capture', cohort: 71, peer: 48 },
  { name: 'Cadence & Systems', cohort: 52, peer: 36 },
];

export default function MapSection() {
  return (
    <section
      id="map"
      className="px-6 md:px-10"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(15, 30, 29, 0.08)',
        paddingTop: "clamp(64px, 12vw, 144px)",
        paddingBottom: "clamp(64px, 12vw, 144px)",
      }}
    >
      <style>{`
        .ms-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .ms-grid { grid-template-columns: 52% 48%; gap: 72px; }
        }
        .ms-left { animation: fadeUp 0.7s ease 0.1s both; }
        .ms-right { animation: fadeUp 0.7s ease 0.25s both; }
      `}</style>

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          background: '#FBF8F4',
          borderRadius: 6,
          border: '1px solid #D5DEC2',
          boxShadow: '0 4px 24px -8px rgba(15, 30, 29, 0.08)',
          padding: 'clamp(36px, 4vw, 56px) clamp(28px, 3.5vw, 48px)',
        }}
      >
      <div className="ms-grid">
        <div className="ms-left">
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
            The GTM Score
          </p>
          <div
            aria-hidden
            style={{
              width: 44,
              height: 2,
              background: 'linear-gradient(90deg, #A8923A, #C4AC4A)',
              margin: '18px 0 28px',
              animation: 'growRule 0.8s ease both',
            }}
          />
          <h2
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 500,
              color: '#0F1E1D',
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              margin: '0 0 20px',
            }}
          >
            Score your firm's GTM in 10 minutes.
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(17px, 1.6vw, 20px)',
              color: 'rgba(15, 30, 29, 0.66)',
              margin: '0 0 44px',
              lineHeight: 1.55,
              fontWeight: 400,
            }}
          >
            The GTM Score diagnostic. Four dimensions. One benchmark against peer PS firms.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(15, 30, 29, 0.5)',
                fontWeight: 500,
                paddingBottom: 4,
              }}
            >
              <span style={{ flex: 1 }}>Dimension</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden style={{ width: 10, height: 10, borderRadius: 999, background: '#BF461A' }} />
                Cohort top
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden style={{ width: 10, height: 10, borderRadius: 999, background: '#225351' }} />
                Peer median
              </span>
            </div>
            {DIMENSIONS.map((d) => (
              <div key={d.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 14,
                      color: '#0F1E1D',
                      fontWeight: 500,
                    }}
                  >
                    {d.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 12,
                      color: 'rgba(15, 30, 29, 0.55)',
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 500,
                    }}
                  >
                    {d.cohort} <span style={{ opacity: 0.5 }}>· {d.peer}</span>
                  </span>
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: 8,
                    background: 'rgba(15, 30, 29, 0.06)',
                    borderRadius: 4,
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${d.peer}%`,
                      background: '#225351',
                      borderRadius: 4,
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${d.cohort}%`,
                      background: '#BF461A',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ms-right">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Compass illustration */}
            <div
              aria-hidden
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 32,
              }}
            >
              <svg viewBox="0 0 240 240" width="100%" style={{ maxWidth: 260, height: 'auto' }}>
                {/* outer hex shape */}
                <polygon
                  points="120,20 200,60 200,180 120,220 40,180 40,60"
                  fill="rgba(15, 30, 29, 0.03)"
                  stroke="rgba(15, 30, 29, 0.18)"
                  strokeWidth="1"
                />
                {/* concentric circles */}
                {[80, 60, 40, 20].map((r) => (
                  <circle
                    key={r}
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke="rgba(15, 30, 29, 0.18)"
                    strokeWidth="0.8"
                  />
                ))}
                {/* diagonal cross lines */}
                <line x1="50" y1="50" x2="190" y2="190" stroke="rgba(15, 30, 29, 0.12)" strokeWidth="0.6" />
                <line x1="190" y1="50" x2="50" y2="190" stroke="rgba(15, 30, 29, 0.12)" strokeWidth="0.6" />
                {/* horizontal needle */}
                <polygon
                  points="40,120 120,116 200,120 120,124"
                  fill="rgba(15, 30, 29, 0.4)"
                />
                {/* vertical needle (longer / brighter) */}
                <polygon
                  points="120,30 116,120 120,210 124,120"
                  fill="#0F1E1D"
                />
                {/* center dot */}
                <circle cx="120" cy="120" r="6" fill="#BF461A" />
                <circle cx="120" cy="120" r="3" fill="#FBF8F4" />
                {/* cardinal letters */}
                <text x="120" y="14" textAnchor="middle" fill="rgba(15, 30, 29, 0.6)"
                  fontFamily="'DM Mono', monospace" fontSize="10" letterSpacing="2">N</text>
                <text x="120" y="234" textAnchor="middle" fill="rgba(15, 30, 29, 0.6)"
                  fontFamily="'DM Mono', monospace" fontSize="10" letterSpacing="2">S</text>
                <text x="14" y="124" textAnchor="middle" fill="rgba(15, 30, 29, 0.6)"
                  fontFamily="'DM Mono', monospace" fontSize="10" letterSpacing="2">W</text>
                <text x="226" y="124" textAnchor="middle" fill="rgba(15, 30, 29, 0.6)"
                  fontFamily="'DM Mono', monospace" fontSize="10" letterSpacing="2">E</text>
              </svg>
            </div>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span
                aria-hidden
                style={{ width: 24, height: 1, background: '#A8923A' }}
              />
              <span
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#A8923A',
                  fontWeight: 500,
                }}
              >
                No pitch. Research collaboration.
              </span>
            </div>

            {/* Headline */}
            <h3
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(32px, 4.2vw, 52px)',
                fontWeight: 700,
                color: '#0F1E1D',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                margin: '0 0 24px',
              }}
            >
              Your Firm<span style={{ color: '#BF461A' }}>.</span><br />
              Your Map<span style={{ color: '#BF461A' }}>.</span><br />
              Your Move<span style={{ color: '#BF461A' }}>.</span>
            </h3>

            {/* Body copy */}
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                color: 'rgba(15, 30, 29, 0.66)',
                lineHeight: 1.6,
                margin: '0 0 32px',
                fontWeight: 400,
              }}
            >
              10 questions. Confidential. Benchmarked against 30 peer firms in the research cohort. The RROS map is yours either way - we just ask for feedback on the framework in return.
            </p>

            {/* Button row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#hero"
                onClick={(e) => { e.preventDefault(); scrollToHero(); }}
                data-cta="add-your-firm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#BF461A',
                  color: '#FFFFFF',
                  borderRadius: 25,
                  padding: '14px 26px',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Build Your Map <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>&rarr;</span>
              </a>
              <span
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12,
                  color: 'rgba(15, 30, 29, 0.5)',
                  fontWeight: 400,
                }}
              >
                Free &middot; 90 seconds &middot; No email required
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
