export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="px-6 md:px-10"
      style={{
        background: '#0D0905',
        borderTop: '1px solid rgba(184,147,58,0.1)',
        padding: 'clamp(64px, 11vw, 112px) 24px',
      }}
    >
      <style>{`
        .fc-section { padding: clamp(64px, 11vw, 112px) 24px; }
        @media (min-width: 768px) {
          .fc-section { padding: 160px 40px; }
        }
        .fc-btn-primary {
          background: #B8933A;
          color: #fff;
          border-radius: 2px;
          padding: 13px 32px;
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: background 0.18s;
          display: inline-block;
        }
        .fc-btn-primary:hover { background: #9A7020; }
        .fc-btn-secondary {
          background: transparent;
          border: 1px solid rgba(184,147,58,0.35);
          color: rgba(184,147,58,0.75);
          border-radius: 2px;
          padding: 13px 32px;
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: background 0.18s;
          display: inline-block;
        }
        .fc-btn-secondary:hover { background: rgba(184,147,58,0.12); }
      `}</style>

      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center',
          animation: 'fadeUp 0.8s ease 0.15s both',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8933A',
            marginBottom: 12,
            margin: '0 0 12px',
          }}
        >
          13 · BEGIN
        </p>
        <div
          aria-hidden
          style={{
            width: 28,
            height: 1,
            background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
            margin: '12px auto 20px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 6vw, 62px)',
            fontWeight: 400,
            color: '#F5EFE0',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 14px',
          }}
        >
          Your next client already knows you.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14,
            color: 'rgba(245,239,224,0.45)',
            lineHeight: 1.65,
            margin: '0 0 24px',
          }}
        >
          The MAP tells you which relationship to activate first. The manuscript tells you how.
        </p>
        <p
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 13,
            fontStyle: 'italic',
            color: '#B8933A',
            lineHeight: 1.55,
            margin: '0 0 28px',
          }}
        >
          You will need someone to own this. It cannot be delegated to marketing alone.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 36,
          }}
        >
          <a
            href="/assess"
            className="fc-btn-primary"
            data-cta="add-your-firm"
          >
            Add Your Firm →
          </a>
        </div>

        <div
          style={{
            width: 40,
            height: 1,
            background: 'rgba(184,147,58,0.15)',
            margin: '0 auto 20px',
          }}
        />

        <p
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,224,0.2)',
            margin: 0,
          }}
        >
          MABBLY · RELATIONSHIP REVENUE OS
        </p>
      </div>
    </section>
  );
}
