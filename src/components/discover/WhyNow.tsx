export default function WhyNow() {
  return (
    <section
      id="why-now"
      className="py-24 md:py-32 px-6 md:px-10"
      style={{ background: '#08070a', borderTop: '1px solid rgba(184,147,58,0.1)' }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: '0 auto',
          animation: 'fadeUp 0.8s ease 0.1s both',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8933A',
            margin: 0,
          }}
        >
          05 · WHY NOW
        </p>
        <div
          aria-hidden
          style={{
            width: 28,
            height: 1,
            background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
            margin: '12px 0 18px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 6.5vw, 68px)',
            fontWeight: 400,
            color: '#F5EFE0',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Why this matters now.
        </h2>

        <div
          style={{
            width: '100%',
            height: 1,
            background: 'rgba(184,147,58,0.12)',
            margin: '28px 0',
          }}
        />

        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 240px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(184,147,58,0.15)',
              borderRadius: 3,
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 48,
                fontWeight: 700,
                color: '#B8933A',
                lineHeight: 1,
              }}
            >
              73%
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 11,
                color: 'rgba(245,239,224,0.4)',
                lineHeight: 1.5,
                marginTop: 8,
              }}
            >
              of PS buyers say they will use AI-native firms by 2026
            </div>
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14,
            lineHeight: 1.75,
            color: 'rgba(245,239,224,0.65)',
            maxWidth: 640,
            marginBottom: 28,
            margin: '0 0 28px',
          }}
        >
          The firms building a relationship system now will own the categories
          their competitors are still trying to define. The firms that wait will compete on price.
        </p>

        <div
          style={{
            borderTop: '1px solid rgba(184,147,58,0.15)',
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(18px, 2.8vw, 28px)',
              fontStyle: 'italic',
              color: '#B8933A',
              marginBottom: 4,
              margin: '0 0 4px',
            }}
          >
            Most firms will wait.
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(18px, 2.8vw, 28px)',
              color: '#F5EFE0',
              margin: 0,
            }}
          >
            The ones that move first set the terms.
          </p>
        </div>
      </div>
    </section>
  );
}
