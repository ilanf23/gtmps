export default function WarStory() {
  return (
    <section
      id="war-story"
      className="px-6 md:px-10"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #D5DEC2',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          animation: 'fadeUp 0.8s ease 0.1s both',
        }}
      >
        <style>{`
          .ws-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            align-items: start;
          }
          @media (min-width: 900px) {
            .ws-layout {
              grid-template-columns: minmax(280px, 380px) 1fr;
              gap: 64px;
            }
          }
          .ws-figure {
            margin: 0;
            position: relative;
          }
          @media (min-width: 900px) {
            .ws-figure {
              position: sticky;
              top: 96px;
            }
          }
          .ws-photo {
            width: 100%;
            height: auto;
            display: block;
            border: 1px solid #D5DEC2;
            border-radius: 4px;
            filter: grayscale(0.4) sepia(0.15) brightness(1.05);
          }
          .ws-caption {
            font-family: 'DM Mono', ui-monospace, monospace;
            font-size: 11px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: rgba(15,30,29,0.5);
            margin: 14px 0 0;
          }
        `}</style>

        <div className="ws-layout">
          <figure className="ws-figure">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
              alt="Senior partner in conversation"
              loading="lazy"
              decoding="async"
              className="ws-photo"
            />
            <figcaption className="ws-caption">
              Field note · operator at the table
            </figcaption>
          </figure>

          <div>
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
              10 · One Story In Full
            </p>
            <div
              aria-hidden
              style={{
                width: 44,
                height: 2,
                background: 'linear-gradient(90deg, #A8923A, rgba(168, 146, 58, 0.3))',
                margin: '18px 0 28px',
              }}
            />
            <h2
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(48px, 7vw, 84px)',
                fontWeight: 500,
                color: '#0F1E1D',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                margin: '0 0 18px',
              }}
            >
              $400K in 7 minutes<span style={{ color: '#BF461A' }}>.</span>
            </h2>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(18px, 1.8vw, 22px)',
                color: 'rgba(15,30,29,0.66)',
                margin: '0 0 48px',
                fontWeight: 300,
                lineHeight: 1.5,
              }}
            >
              How Madcraft reactivated a dead proposal that had been silent for 9 months.
            </p>

            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(17px, 1.5vw, 19px)',
                color: 'rgba(15,30,29,0.78)',
                lineHeight: 1.7,
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
                  color: '#0F1E1D',
                  fontSize: 'clamp(20px, 2vw, 24px)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  borderLeft: '3px solid #BF461A',
                  paddingLeft: 20,
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
                borderTop: '1px solid #D5DEC2',
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
                  color: '#BF461A',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(191, 70, 26,0.45)',
                  paddingBottom: 4,
                  fontWeight: 600,
                }}
              >
                Read the full case at mabbly.ai/case-study/madcraft →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
