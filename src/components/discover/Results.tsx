type Case = {
  industry: string;
  bigNumber: string;
  label: string;
  detail: string;
  quote: string;
  attribution: string;
  href: string;
};

const CASES: Case[] = [
  {
    industry: 'MADCRAFT · DIGITAL AGENCY',
    bigNumber: '$400K',
    label: 'dormant proposal reactivated. 7 minute reply.',
    detail:
      'Proposal had been silent 9 months. Buyer replied 7 minutes after a signal-matched email. Asked Madcraft to be their agency of record for 2026.',
    quote:
      'Lead nurturing agent created a customized note that reactivated a $400,000 opportunity for us.',
    attribution: 'Stephen Cuccio · Head of New Client Strategy',
    href: 'https://mabbly.ai/case-study/madcraft',
  },
  {
    industry: 'CALLIOPE COMMUNICATIONS · HEALTHCARE B2B CONTENT',
    bigNumber: '2/2',
    label: 'dormant healthcare contacts replied',
    detail:
      'First 2 emails sent. Both replied. One positive engagement, one "stay in touch" reopened door. Founder voice preserved through human review.',
    quote: 'The AI has done a pretty good job connecting the dots.',
    attribution: 'Mary Tindall · Founder',
    href: 'https://mabbly.ai/case-study/calliope',
  },
  {
    industry: 'SPR · CHICAGO TECHNOLOGY CONSULTING',
    bigNumber: '150',
    label: 'dormant enterprise contacts identified, 43 emails sent, 3 conversations restarted',
    detail:
      '3-layer human review (enrichment, content, executive). 4 ICPs. Reply rate ~7%. Kyle Gams (Managing Director) was final approver.',
    quote: "Your guys' signal is the personalization piece.",
    attribution: 'Kristin Rosa · Creative & Content Manager',
    href: 'https://mabbly.ai/case-study/spr',
  },
];

export default function Results() {
  return (
    <section
      id="results"
      className="px-6 md:px-10"
      style={{
        background: '#0F1E1D',
        borderTop: '1px solid rgba(168, 146, 58,0.1)',
        paddingTop: "clamp(64px, 12vw, 144px)",
        paddingBottom: "clamp(64px, 12vw, 144px)",
      }}
    >
      <style>{`
        .rs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          animation: fadeUp 0.8s ease 0.1s both;
        }
        @media (min-width: 768px) {
          .rs-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .rs-card {
          background: #1A2B2A;
          border: 1px solid rgba(213, 222, 212, 0.10);
          border-radius: 4px;
          padding: 36px 28px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }
        .rs-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
          border-top: 2px solid rgba(255, 186, 26, 0.6);
          border-left: 2px solid rgba(255, 186, 26, 0.6);
        }
        .rs-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          border-bottom: 2px solid rgba(255, 186, 26, 0.6);
          border-right: 2px solid rgba(255, 186, 26, 0.6);
        }
        .rs-card:hover {
          background: #213635;
          border-color: rgba(213, 222, 212, 0.20);
          transform: translateY(-3px);
        }
        .rs-industry {
          font-family: 'Inter Tight', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(255, 186, 26, 0.90);
          font-weight: 500;
          margin: 0 0 20px;
          line-height: 1.4;
        }
        .rs-bignum {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(48px, 5vw, 64px);
          font-weight: 700;
          color: #FFBA1A;
          line-height: 1;
          letter-spacing: -0.04em;
          margin: 0 0 12px;
        }
        .rs-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: rgba(237, 245, 236,0.78);
          line-height: 1.5;
          font-weight: 400;
          margin: 0 0 16px;
        }
        .rs-detail {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13.5px;
          color: rgba(237, 245, 236,0.55);
          line-height: 1.6;
          font-weight: 400;
          margin: 0 0 20px;
        }
        .rs-quote {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          color: rgba(237, 245, 236,0.88);
          font-style: italic;
          line-height: 1.5;
          border-left: 2px solid #FFBA1A;
          padding-left: 14px;
          margin: 0 0 12px;
        }
        .rs-attr {
          font-family: 'Inter Tight', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(213, 222, 212, 0.65);
          font-weight: 500;
          margin: 0 0 18px;
        }
        .rs-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #BF461A;
          text-decoration: none;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(213, 222, 212, 0.12);
          transition: color 0.18s;
          font-weight: 600;
        }
        .rs-link:hover { color: #D8633A; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 760, margin: '0 auto 56px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#FFBA1A',
              margin: 0,
              fontWeight: 500,
            }}
          >
            12 · Proof
          </p>
          <div
            aria-hidden
            style={{
              width: 44,
              height: 2,
              background: 'linear-gradient(90deg, #FFBA1A, rgba(255, 186, 26,0.3))',
              margin: '18px auto 28px',
              animation: 'growRule 0.8s ease both',
            }}
          />
          <h2
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 500,
              color: '#EDF5EC',
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              margin: '0 0 18px',
            }}
          >
            The framework works in the field.
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(17px, 1.6vw, 20px)',
              color: 'rgba(237, 245, 236,0.62)',
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.55,
            }}
          >
            Three documented cases. Real firms. Real outcomes. Real quotes.
          </p>
        </div>

        <div className="rs-grid">
          {CASES.map((c) => (
            <article key={c.industry} className="rs-card">
              <p className="rs-industry">{c.industry}</p>
              <p className="rs-bignum">{c.bigNumber}</p>
              <p className="rs-label">{c.label}</p>
              <p className="rs-detail">{c.detail}</p>
              <p className="rs-quote">"{c.quote}"</p>
              <p className="rs-attr">{c.attribution}</p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rs-link"
              >
                Read full case study →
              </a>
            </article>
          ))}
        </div>

        <div
          style={{
            maxWidth: 680,
            margin: '64px auto 0',
            paddingTop: 32,
            borderTop: '1px solid rgba(168, 146, 58,0.25)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontStyle: 'italic',
              color: 'rgba(237, 245, 236,0.55)',
              lineHeight: 1.65,
              margin: 0,
              fontWeight: 300,
            }}
          >
            What did not work for everyone: each of these firms had an internal owner who ran the
            work. Without an owner, the framework does not run itself. Three firms in our pilot
            saw little movement. The pattern was the same: no one owned it. We tell you this
            because you should know.
          </p>
        </div>
      </div>
    </section>
  );
}
