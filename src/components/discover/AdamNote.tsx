import { Linkedin } from 'lucide-react';

const ADAM_LINKEDIN_URL = 'https://www.linkedin.com/in/adamfridman/';

export default function AdamNote() {
  return (
    <section
      id="adam-note"
      className="px-6 md:px-10"
      style={{
        background: '#0A0807',
        borderTop: '1px solid rgba(184,147,58,0.1)',
        borderBottom: '1px solid rgba(184,147,58,0.1)',
        paddingTop: 112,
        paddingBottom: 112,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
          animation: 'fadeUp 0.8s ease 0.1s both',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8933A',
            margin: '0 0 32px',
            fontWeight: 500,
          }}
        >
          A Note From Adam
        </p>

        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            fontStyle: 'italic',
            color: 'rgba(245,239,224,0.85)',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          <p style={{ margin: '0 0 24px' }}>We kept making the same mistake.</p>
          <p style={{ margin: '0 0 24px' }}>
            We would meet with a firm. They had 400 dormant contacts. We would ask "have you
            called them?"
          </p>
          <p style={{ margin: '0 0 24px' }}>
            The answer was always no. Not because they forgot. Because they had no system. No
            permission. No cadence.
          </p>
          <p style={{ margin: '0 0 24px' }}>
            The Dead Zone is not a CRM problem. It is an avoidance problem.
          </p>
          <p style={{ margin: '0 0 36px' }}>This page is the answer.</p>
        </div>

        <div
          aria-hidden
          style={{
            width: 32,
            height: 1,
            background: 'rgba(184,147,58,0.4)',
            margin: '0 auto 16px',
          }}
        />
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B8933A',
            margin: 0,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          Adam Fridman · Co-author
          <a
            href={ADAM_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Adam Fridman on LinkedIn (opens in new tab)"
            style={{
              color: '#B8933A',
              display: 'inline-flex',
              alignItems: 'center',
              opacity: 0.85,
              transition: 'opacity 180ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <Linkedin size={14} strokeWidth={1.75} />
          </a>
        </p>
      </div>
    </section>
  );
}
