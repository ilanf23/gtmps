export default function WhyNow() {
  return (
    <section
      id="why-now"
      className="py-24 md:py-32 px-6 md:px-10"
      style={{ background: '#08070a', borderTop: '1px solid rgba(168, 146, 58,0.1)' }}
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
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#A8923A',
            margin: 0,
            fontWeight: 500,
          }}
        >
          05 · Why Now
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
            fontFamily: "var(--font-display)",
            fontSize: 'clamp(40px, 6.5vw, 68px)',
            fontWeight: 400,
            color: '#EDF5EC',
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
            background: 'rgba(168, 146, 58,0.12)',
            margin: '28px 0',
          }}
        />

        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 240px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(168, 146, 58,0.15)',
              borderRadius: 3,
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: '#A8923A',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              73%
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                color: 'rgba(237, 245, 236,0.6)',
                lineHeight: 1.5,
                marginTop: 10,
              }}
            >
              of PS buyers say they will evaluate an AI-native firm before 2026
              <span
                title="Source: Mabbly cohort survey, n=30 PS firms, 2025."
                style={{ marginLeft: 4, opacity: 0.7, cursor: 'help' }}
              >
                ¹
              </span>
            </div>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 12,
            color: 'rgba(237, 245, 236,0.55)',
            margin: '4px 0 28px',
            lineHeight: 1.5,
          }}
        >
          ¹ Source: Mabbly cohort survey, n=30 PS firms, 2025.
        </p>

        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(16px, 1.4vw, 18px)',
            lineHeight: 1.65,
            color: 'rgba(237, 245, 236,0.78)',
            maxWidth: 640,
            margin: '0 0 36px',
            fontWeight: 400,
          }}
        >
          The firms building a relationship system now will own the categories
          their competitors are still trying to define. The firms that wait will compete on price.
        </p>

        <div
          style={{
            borderTop: '1px solid rgba(168, 146, 58,0.15)',
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(18px, 2.8vw, 28px)',
              fontStyle: 'italic',
              color: '#A8923A',
              marginBottom: 4,
              margin: '0 0 4px',
            }}
          >
            Most firms will wait.
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(18px, 2.8vw, 28px)',
              color: '#EDF5EC',
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
