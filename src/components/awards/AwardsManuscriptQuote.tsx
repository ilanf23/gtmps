export default function AwardsManuscriptQuote() {
  return (
    <section
      style={{
        background: '#EDF5EC',
        padding: '120px 24px',
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .amq-section { padding: 160px 40px; }
        }
        .amq-inner {
          max-width: 880px;
          margin: 0 auto;
          text-align: center;
        }
        .amq-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 32px;
        }
        .amq-quote {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.32;
          color: #0F1E1D;
          letter-spacing: -0.01em;
          margin: 0 0 32px;
        }
        .amq-rule {
          width: 40px;
          height: 1px;
          background: rgba(168, 146, 58,0.35);
          margin: 0 auto 20px;
        }
        .amq-attr {
          font-family: 'Inter Tight', sans-serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(15, 30, 29,0.55);
          margin: 0 0 24px;
          letter-spacing: 0.02em;
        }
        .amq-tag {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: #A8923A;
          font-weight: 500;
          margin: 0;
        }
      `}</style>

      <div className="amq-inner">
        <p className="amq-eyebrow">From the manuscript</p>
        <blockquote className="amq-quote">
          "The right person at the wrong moment is just another name in your CRM. The right person at the right moment is revenue."
        </blockquote>
        <div className="amq-rule" aria-hidden />
        <p className="amq-attr">Chapter 4, Truth II · The Relationship Revenue OS</p>
        <p className="amq-tag">We are recognizing the firms that mastered the right moment.</p>
      </div>
    </section>
  );
}
