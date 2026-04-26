import adamPhoto from '@/assets/adam-fridman.png';
import richardPhoto from '@/assets/richard-ashbaugh.png';

type Author = {
  photo: string;
  name: string;
  role: string;
  quote: string;
  badges: string[];
  delay: string;
};

const AUTHORS: Author[] = [
  {
    photo: adamPhoto,
    name: 'Adam Fridman',
    role: 'Co-Author · Founder, Mabbly',
    quote: 'Six hundred conversations. One framework that survived contact with reality.',
    badges: ['500 interviews', '180 episodes', 'Inc. Columnist'],
    delay: '0.1s',
  },
  {
    photo: richardPhoto,
    name: 'Richard Ashbaugh',
    role: 'Co-Author · CEO, Mabbly',
    quote: 'The framework in this book is the one I wish I had at AArete.',
    badges: ['$400M CMO', '$1.2B Scale', '26 years'],
    delay: '0.25s',
  },
];

export default function Authors() {
  return (
    <section
      id="authors"
      className="px-6 md:px-10"
      style={{
        background: '#F5EFE0',
        borderTop: '2px solid rgba(184,147,58,0.15)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <style>{`
        .au-badge {
          border: 1px solid rgba(184,147,58,0.28);
          border-radius: 3px;
          padding: 8px 16px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.12em;
          color: #6A5038;
          text-transform: uppercase;
          cursor: default;
          font-weight: 500;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }
        .au-badge:hover {
          border-color: rgba(184,147,58,0.65);
          color: #9A7020;
          background: rgba(184,147,58,0.08);
        }
        .au-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 768px) {
          .au-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
        }
        .au-portrait {
          width: 100%;
          aspect-ratio: 4 / 5;
          background: rgba(42,26,8,0.08);
          border-radius: 6px;
          object-fit: cover;
          margin-bottom: 28px;
          display: block;
          filter: grayscale(15%);
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
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
          07 · THE AUTHORS
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
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 500,
            color: '#2A1A08',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          Built from inside the arena.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(42,26,8,0.55)',
            margin: '0 0 64px',
            lineHeight: 1.5,
            fontWeight: 300,
            maxWidth: 720,
          }}
        >
          Not theorists. Operators who ran the P&amp;L and paid the cost of getting GTM wrong.
        </p>

        <div className="au-grid">
          {AUTHORS.map((a) => (
            <div
              key={a.name}
              style={{ animation: `fadeUp 0.7s ease ${a.delay} both` }}
            >
              <img src={a.photo} alt={a.name} className="au-portrait" />
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 'clamp(28px, 3vw, 38px)',
                  fontWeight: 600,
                  color: '#2A1A08',
                  margin: '0 0 6px',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                {a.name}
              </p>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14,
                  color: '#6A5038',
                  letterSpacing: '0.06em',
                  margin: '0 0 24px',
                  fontWeight: 500,
                }}
              >
                {a.role}
              </p>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 'clamp(18px, 1.7vw, 22px)',
                  lineHeight: 1.5,
                  color: 'rgba(42,26,8,0.78)',
                  borderLeft: '3px solid rgba(184,147,58,0.45)',
                  paddingLeft: 20,
                  margin: '0 0 28px',
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              >
                {a.quote}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {a.badges.map((b) => (
                  <span key={b} className="au-badge">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
