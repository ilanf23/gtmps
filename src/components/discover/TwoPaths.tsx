export default function TwoPaths() {
  return (
    <section
      id="two-paths"
      className="px-6 md:px-10"
      style={{
        background: '#F5EFE0',
        borderTop: '1px solid rgba(184,147,58,0.12)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <style>{`
        .tp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 768px) {
          .tp-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        .tp-card { transition: transform 0.18s, border-color 0.18s; }
        .tp-card-i:hover {
          transform: translateY(-4px);
          border-color: rgba(42,26,8,0.18);
        }
        .tp-card-ii:hover {
          transform: translateY(-4px);
          border-color: rgba(184,147,58,0.6);
        }
        .tp-anim-i { animation: fadeUp 0.7s ease 0.1s both; }
        .tp-anim-ii { animation: fadeUp 0.7s ease 0.2s both; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
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
          12 · THE DECISION
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
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 500,
            color: '#2A1A08',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          Two firms. Same market. Different systems.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(42,26,8,0.55)',
            margin: '0 0 56px',
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          This is the only decision that matters in PS GTM right now.
        </p>

        <div className="tp-grid">
          <div
            className="tp-card tp-card-i tp-anim-i"
            style={{
              background: '#fff',
              border: '1px solid rgba(42,26,8,0.1)',
              borderRadius: 6,
              padding: '40px 36px',
            }}
          >
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(42,26,8,0.35)',
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              PATH I · WITHOUT THE MAP
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(80px, 10vw, 128px)',
                fontWeight: 700,
                color: 'rgba(42,26,8,0.06)',
                lineHeight: 1,
                marginBottom: 18,
                letterSpacing: '-0.05em',
              }}
            >
              I
            </div>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(18px, 1.7vw, 22px)',
                lineHeight: 1.55,
                color: 'rgba(42,26,8,0.7)',
                margin: '0 0 24px',
                fontWeight: 300,
              }}
            >
              Cold outreach. Conferences. Referrals by accident. 70% of your CRM sits untouched.
              Revenue comes in spikes. The pipeline is always a worry.
            </p>
            <div
              style={{
                borderTop: '1px solid rgba(42,26,8,0.1)',
                margin: '24px 0',
              }}
            />
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(20px, 2vw, 26px)',
                color: 'rgba(42,26,8,0.5)',
                margin: 0,
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '-0.015em',
                lineHeight: 1.3,
              }}
            >
              You're building from scratch, every quarter.
            </p>
          </div>

          <div
            className="tp-card tp-card-ii tp-anim-ii"
            style={{
              background: 'rgba(184,147,58,0.05)',
              border: '2px solid rgba(184,147,58,0.4)',
              borderRadius: 6,
              padding: '40px 36px',
            }}
          >
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#B8933A',
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              PATH II · WITH THE MAP
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(80px, 10vw, 128px)',
                fontWeight: 700,
                color: 'rgba(184,147,58,0.18)',
                lineHeight: 1,
                marginBottom: 18,
                letterSpacing: '-0.05em',
              }}
            >
              II
            </div>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(18px, 1.7vw, 22px)',
                lineHeight: 1.55,
                color: 'rgba(42,26,8,0.85)',
                margin: '0 0 24px',
                fontWeight: 300,
              }}
            >
              Systematic relationship reactivation. Your Dead Zone converts. Orbits I–II generate
              the majority of new revenue. The pipeline is a function, not a prayer.
            </p>
            <div
              style={{
                borderTop: '1px solid rgba(184,147,58,0.22)',
                margin: '24px 0',
              }}
            />
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(20px, 2vw, 26px)',
                color: '#B8933A',
                margin: 0,
                fontWeight: 500,
                letterSpacing: '-0.015em',
                lineHeight: 1.3,
              }}
            >
              You're building on trust that already exists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
