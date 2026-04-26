export default function WarStory() {
  return (
    <section
      id="war-story"
      className="px-6 md:px-10"
      style={{
        background: '#0F0A05',
        borderTop: '1px solid rgba(184,147,58,0.1)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <div
        style={{
          maxWidth: 720,
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
            color: '#B8933A',
            margin: 0,
            fontWeight: 500,
          }}
        >
          08.5 · One Story In Full
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
            margin: '18px 0 28px',
          }}
        />
        <h2
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(48px, 7vw, 84px)',
            fontWeight: 500,
            color: '#F5EFE0',
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          $400K in 7 minutes.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(245,239,224,0.55)',
            margin: '0 0 48px',
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          How Madcraft reactivated a dead proposal that had been silent for 9 months.
        </p>

        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(17px, 1.5vw, 19px)',
            color: 'rgba(245,239,224,0.78)',
            lineHeight: 1.75,
            fontWeight: 400,
          }}
        >
          <p style={{ margin: '0 0 20px' }}>
            Madcraft is a digital agency. Strategy, design, development, performance. Stephen
            Cuccio runs new client strategy. They had a high-intent proposal sitting silent for 9
            to 10 months. The relationship was real. The work was real. But the timing was off
            and the next outreach could not sound generic.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            The team used the Lead Nurturing Agent. Real-world signals. Drafted email. Human
            review before sending. Stephen approved.
          </p>
          <p
            style={{
              margin: '0 0 20px',
              fontStyle: 'italic',
              color: '#B8933A',
              fontSize: 'clamp(20px, 2vw, 24px)',
            }}
          >
            The buyer replied in 7 minutes.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            The reply asked if Madcraft could be their agency of record for 2026. Branding,
            digital, media buying. The whole engagement.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            What made it land: not a "checking in" email. The note referenced something specific
            the buyer cared about right now. The agent surfaced the signal. A human approved the
            words. Then it sent.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            Stephen later said: "Lead nurturing agent created a customized note that reactivated
            a $400,000 opportunity for us."
          </p>
          <p style={{ margin: '0 0 20px' }}>
            This is what "signal-based" looks like in practice. A specific acknowledgement. A
            value drop. A clean next step.
          </p>
          <p style={{ margin: 0 }}>
            Most outreach centers the sender. This centered the buyer. It worked because it was
            earned, not generic.
          </p>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid rgba(184,147,58,0.18)',
          }}
        >
          <a
            href="https://mabbly.ai/case-study/madcraft"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#B8933A',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(184,147,58,0.4)',
              paddingBottom: 4,
            }}
          >
            Read the full case at mabbly.ai/case-study/madcraft →
          </a>
        </div>
      </div>
    </section>
  );
}
