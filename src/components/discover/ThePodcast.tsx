// RETIRED: this section was removed from /discover. Subscribe links now live in the Footer (#footer-podcast). File kept for easy restore.
const PLATFORMS = ['Apple Podcasts', 'Spotify', 'YouTube'];

const STATS = [
  { num: '180', label: 'episodes' },
  { num: '500+', label: 'interviews' },
  { num: '6', label: 'seasons' },
];

export default function ThePodcast() {
  return (
    <section
      id="the-podcast"
      className="px-6 md:px-10"
      style={{
        background: '#0D0A04',
        borderTop: '1px solid rgba(184,147,58,0.1)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
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
          11 · THE PODCAST
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
            margin: '18px 0 28px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(56px, 8vw, 104px)',
            fontWeight: 500,
            color: '#F5EFE0',
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            margin: '0 0 18px',
          }}
        >
          The Science of Story
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(245,239,224,0.5)',
            margin: '0 0 40px',
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          180 episodes. The GTM conversations that built this framework.
        </p>

        <div
          style={{
            width: '100%',
            height: 3,
            background:
              'linear-gradient(90deg, transparent, rgba(184,147,58,0.3), rgba(184,147,58,0.7), rgba(184,147,58,0.3), transparent)',
            borderRadius: 3,
            marginBottom: 48,
          }}
        />

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'rgba(184,147,58,0.12)',
              border: '2px solid #B8933A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 12px rgba(184,147,58,0.06)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 32,
                color: '#B8933A',
                marginLeft: 4,
              }}
            >
              ▶
            </span>
          </div>

          <div style={{ flex: '1 1 360px' }}>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#B8933A',
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              S6 · EP 01 · LATEST EPISODE
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(24px, 2.4vw, 32px)',
                fontWeight: 500,
                color: '#F5EFE0',
                marginBottom: 12,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              The Dead Zone — Why Your Best Clients Already Know You
            </div>
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 16,
                color: 'rgba(245,239,224,0.5)',
                marginBottom: 22,
                fontWeight: 300,
              }}
            >
              With Richard Ashbaugh · 48 min
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  style={{
                    border: '1px solid rgba(184,147,58,0.25)',
                    borderRadius: 3,
                    padding: '6px 14px',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11.5,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(184,147,58,0.75)',
                    fontWeight: 500,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(184,147,58,0.12)',
            margin: '48px 0',
          }}
        />

        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 'clamp(56px, 6vw, 76px)',
                  fontWeight: 600,
                  color: '#B8933A',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14,
                  color: 'rgba(245,239,224,0.5)',
                  marginTop: 10,
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
