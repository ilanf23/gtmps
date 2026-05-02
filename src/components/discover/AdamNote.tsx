import { Linkedin } from 'lucide-react';

const ADAM_LINKEDIN_URL = 'https://www.linkedin.com/in/adamfridman/';

export default function AdamNote() {
  return (
    <section
      id="adam-note"
      className="px-6 md:px-10"
      style={{
        background: '#FBF8F4',
        borderTop: '1px solid #D5DEC2',
        borderBottom: '1px solid #D5DEC2',
        paddingTop: 112,
        paddingBottom: 112,
      }}
    >
      <style>{`
        .an-card {
          position: relative;
          max-width: 720px;
          margin: 0 auto;
          animation: fadeUp 0.8s ease 0.1s both;
        }
        .an-photo-wrap {
          margin: 0 0 32px;
          display: flex;
          justify-content: center;
        }
        .an-photo {
          width: 100%;
          max-width: 280px;
          height: auto;
          display: block;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          background: #fff;
          padding: 8px;
          box-shadow: 0 12px 32px -16px rgba(15,30,29,0.18);
        }
        @media (min-width: 900px) {
          .an-photo-wrap {
            position: absolute;
            top: -24px;
            right: -32px;
            margin: 0;
            width: 220px;
            transform: rotate(2deg);
            z-index: 2;
          }
          .an-photo {
            max-width: 220px;
          }
        }
        @media (min-width: 1200px) {
          .an-photo-wrap {
            right: -120px;
            width: 260px;
          }
          .an-photo {
            max-width: 260px;
          }
        }
      `}</style>

      <div className="an-card">
        <div className="an-photo-wrap">
          <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80"
            alt="Notebook on desk with handwritten margins"
            loading="lazy"
            decoding="async"
            className="an-photo"
          />
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 11,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#A8923A',
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
              color: 'rgba(15,30,29,0.85)',
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
            <p style={{ margin: '0 0 36px' }}>This page is the answer<span style={{ color: '#BF461A' }}>.</span></p>
          </div>

          <div
            aria-hidden
            style={{
              width: 32,
              height: 1,
              background: 'rgba(168, 146, 58,0.5)',
              margin: '0 auto 16px',
            }}
          />
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 18,
              color: '#0F1E1D',
              margin: '0 0 8px',
              fontWeight: 500,
            }}
          >
            — Adam
          </p>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#A8923A',
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
                color: '#A8923A',
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
      </div>
    </section>
  );
}
