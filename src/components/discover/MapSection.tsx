const DIMENSIONS = [
  'I · Relationship Depth',
  'II · Orbit Activation',
  'III · Signal Capture',
  'IV · Cadence & Systems',
];

export default function MapSection() {
  return (
    <section
      id="map"
      className="px-6 md:px-10"
      style={{
        background: '#F5EFE0',
        borderTop: '1px solid rgba(184,147,58,0.12)',
        paddingTop: 144,
        paddingBottom: 144,
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

      <div className="ms-grid">
        <div className="ms-left">
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#B8933A',
              margin: 0,
              fontWeight: 500,
            }}
          >
            09 · THE MAP
          </p>
          <div
            aria-hidden
            style={{
              width: 44,
              height: 2,
              background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
              margin: '18px 0 28px',
              animation: 'growRule 0.8s ease both',
            }}
          />
          <h2
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(48px, 7vw, 84px)',
              fontWeight: 500,
              color: '#2A1A08',
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              margin: '0 0 20px',
            }}
          >
            Score your firm's GTM in 10 minutes.
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              color: 'rgba(42,26,8,0.55)',
              margin: '0 0 44px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            The Market Activation Plan diagnostic. Four dimensions. One benchmark against peer PS
            firms.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {DIMENSIONS.map((d) => (
              <div key={d}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 13,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#B8933A',
                      fontWeight: 500,
                    }}
                  >
                    {d}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 14,
                      color: 'rgba(42,26,8,0.4)',
                      fontWeight: 400,
                    }}
                  >
                    —/25
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'rgba(42,26,8,0.08)',
                    borderRadius: 3,
                    width: '100%',
                  }}
                />
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 16,
              color: 'rgba(42,26,8,0.5)',
              lineHeight: 1.55,
              marginTop: 32,
              margin: '32px 0 0',
              fontWeight: 300,
            }}
          >
            Most PS firms score between 28 and 44 out of 100. The MAP tells you exactly where the
            gap is.
          </p>
        </div>

        <div className="ms-right">
          <div
            style={{
              background: 'rgba(255,250,240,0.9)',
              border: '1px solid rgba(184,147,58,0.22)',
              borderRadius: 6,
              padding: '52px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(42,26,8,0.4)',
                marginBottom: 14,
                fontWeight: 500,
              }}
            >
              YOUR MAP SCORE
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(96px, 12vw, 140px)',
                fontWeight: 600,
                color: '#B8933A',
                lineHeight: 1,
                letterSpacing: '-0.05em',
              }}
            >
              —
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15,
                color: 'rgba(42,26,8,0.4)',
                marginTop: 10,
                fontWeight: 400,
              }}
            >
              out of 100
            </div>
            <div
              style={{
                width: '100%',
                height: 1,
                background: 'rgba(184,147,58,0.18)',
                margin: '32px 0',
              }}
            />
            <a
              href="#beta-reader"
              style={{
                display: 'block',
                width: '100%',
                background: '#B8933A',
                color: '#fff',
                borderRadius: 3,
                padding: '18px',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 16,
                letterSpacing: '0.08em',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Create Your GTM
            </a>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                color: 'rgba(42,26,8,0.4)',
                textAlign: 'center',
                marginTop: 14,
                margin: '14px 0 0',
                fontWeight: 400,
              }}
            >
              Free · 10 minutes · Instant results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
