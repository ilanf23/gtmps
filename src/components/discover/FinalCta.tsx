import { scrollToHero } from '@/lib/scrollToHero';

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="px-6 md:px-10"
      style={{
        background: '#FBF8F4',
        borderTop: '1px solid rgba(15, 30, 29, 0.08)',
        padding: 'clamp(64px, 11vw, 112px) 24px',
      }}
    >
      <style>{`
        .fc-section { padding: clamp(64px, 11vw, 112px) 24px; }
        @media (min-width: 768px) {
          .fc-section { padding: 160px 40px; }
        }
        /* Primary conversion CTA - reserved Burnt Orange per brand spec. */
        .fc-btn-primary {
          background: #BF461A;
          color: #FFFFFF;
          border-radius: 2px;
          padding: 13px 32px;
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: background 0.18s;
          display: inline-block;
        }
        .fc-btn-primary:hover { background: #A33A14; }
        .fc-btn-secondary {
          background: transparent;
          border: 1px solid rgba(168, 146, 58,0.35);
          color: rgba(168, 146, 58,0.75);
          border-radius: 2px;
          padding: 13px 32px;
          font-family: 'Inter Tight', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: background 0.18s;
          display: inline-block;
        }
        .fc-btn-secondary:hover { background: rgba(168, 146, 58,0.12); }
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
            color: '#A8923A',
            marginBottom: 12,
            margin: '0 0 12px',
          }}
        >
          17 · BEGIN
        </p>
        <div
          aria-hidden
          style={{
            width: 28,
            height: 1,
            background: 'linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))',
            margin: '12px auto 20px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 'clamp(36px, 6vw, 62px)',
            fontWeight: 400,
            color: '#0F1E1D',
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
            color: 'rgba(15, 30, 29, 0.6)',
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
            color: '#A8923A',
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
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToHero(); }}
            className="fc-btn-primary"
            data-cta="add-your-firm"
          >
            Get MY Map →
          </a>
        </div>

        <div
          style={{
            width: 40,
            height: 1,
            background: 'rgba(168, 146, 58,0.15)',
            margin: '0 auto 20px',
          }}
        />

        <p
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(15, 30, 29, 0.4)',
            margin: 0,
          }}
        >
          MABBLY · RELATIONSHIP REVENUE OS
        </p>
      </div>
    </section>
  );
}
