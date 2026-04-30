const BADGES = ['AArete', 'West Monroe', 'Kearney', 'Accenture', 'Madcraft'];

const eyebrow: React.CSSProperties = {
  fontFamily: "'Inter Tight', sans-serif",
  fontSize: 14,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: '#B8933A',
  margin: 0,
  fontWeight: 500,
};

const goldRule: React.CSSProperties = {
  width: 44,
  height: 2,
  background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
  margin: '18px 0 28px',
  animation: 'growRule 0.8s ease both',
};

const inputStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(42,26,8,0.18)',
  borderRadius: 3,
  padding: '16px 20px',
  fontFamily: "'Inter Tight', sans-serif",
  fontSize: 18,
  color: '#2A1A08',
  marginBottom: 14,
  width: '100%',
  outline: 'none',
  fontWeight: 400,
};

export default function BetaReader() {
  return (
    <section
      id="beta-reader"
      className="px-6 md:px-10"
      style={{
        background: '#F5EFE0',
        borderTop: '1px solid rgba(184,147,58,0.12)',
        paddingTop: "clamp(64px, 12vw, 144px)",
        paddingBottom: "clamp(64px, 12vw, 144px)",
      }}
    >
      <style>{`
        .br-input::placeholder { color: rgba(42,26,8,0.35); }
        .br-input:focus { border-color: rgba(184,147,58,0.65); }
        .br-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .br-grid { grid-template-columns: 52% 48%; gap: 72px; }
        }
        .br-left { animation: fadeUp 0.7s ease 0.1s both; }
        .br-right { animation: fadeUp 0.7s ease 0.3s both; }
        .br-badge {
          border: 1px solid rgba(184,147,58,0.28);
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
        .br-badge:hover {
          border-color: rgba(184,147,58,0.65);
          color: #9A7020;
          background: rgba(184,147,58,0.08);
        }
      `}</style>

      <div className="br-grid">
        <div className="br-left">
          <p style={eyebrow}>06 · EARLY ACCESS</p>
          <div aria-hidden style={goldRule} />
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
            Get this system 90 days before launch.
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              color: 'rgba(42,26,8,0.55)',
              margin: '0 0 14px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            Apply the method now, ahead of public launch. Active PS BD teams approved priority.
          </p>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              fontStyle: 'italic',
              color: 'rgba(42,26,8,0.5)',
              margin: '0 0 36px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            30 chapters. Three frameworks (Dead Zone, Five Orbits, MAP). Available now to Early Access readers.
          </p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
            <span className="br-badge">30 chapters</span>
            <span className="br-badge">Three frameworks</span>
            <span className="br-badge">Approved by application</span>
          </div>

          <div
            style={{
              borderLeft: '4px solid #B8933A',
              paddingLeft: 24,
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(18px, 1.7vw, 22px)',
                lineHeight: 1.55,
                color: 'rgba(42,26,8,0.8)',
                margin: 0,
                fontWeight: 300,
                letterSpacing: '-0.01em',
              }}
            >
              "Lead nurturing agent created a customized note that reactivated a $400,000
              opportunity for us."
            </p>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#B8933A',
                marginTop: 14,
                margin: '14px 0 0',
                fontWeight: 500,
              }}
            >
              Stephen Cuccio · Head of New Client Strategy, Madcraft
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {BADGES.map((b) => (
              <span key={b} className="br-badge">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="br-right">
          <form
            action="mailto:beta@mabbly.com"
            style={{
              background: '#fff',
              border: '1px solid rgba(184,147,58,0.2)',
              borderRadius: 6,
              padding: '40px 36px',
            }}
          >
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(42,26,8,0.5)',
                marginBottom: 24,
                fontWeight: 500,
              }}
            >
              Early Access Application
            </div>
            <input
              className="br-input"
              type="text"
              name="firm"
              placeholder="Firm name"
              style={inputStyle}
            />
            <input
              className="br-input"
              type="email"
              name="email"
              placeholder="Work email"
              style={inputStyle}
            />
            <button
              type="submit"
              style={{
                background: '#B8933A',
                color: '#fff',
                borderRadius: 3,
                padding: '16px',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15,
                letterSpacing: '0.08em',
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              data-cta="add-your-firm"
            >
              Add Your Firm →
            </button>
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
              Free. Approved by application. Most decisions within 48 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
