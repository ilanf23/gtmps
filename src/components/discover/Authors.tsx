import { Linkedin } from 'lucide-react';
import adamPhoto from '@/assets/adam-fridman.png';
import richardPhoto from '@/assets/richard-ashbaugh.png';

type Author = {
  photo: string;
  name: string;
  role: string;
  quote: string;
  badges: string[];
  delay: string;
  linkedin: string;
};

const AUTHORS: Author[] = [
  {
    photo: adamPhoto,
    name: 'Adam Fridman',
    role: 'Co-Author · Founder, Mabbly',
    quote: 'Six hundred conversations. One framework that survived contact with reality.',
    badges: ['500 interviews', '180 episodes', 'Inc. Columnist'],
    delay: '0.1s',
    linkedin: 'https://www.linkedin.com/in/adamfridman/',
  },
  {
    photo: richardPhoto,
    name: 'Richard Ashbaugh',
    role: 'Co-Author · CEO, Mabbly',
    quote: 'The framework in this book is the one I wish I had at AArete.',
    badges: ['$125M CMO', '$1.2B Scale', '26 years'],
    delay: '0.25s',
    linkedin: 'https://www.linkedin.com/in/richardfashbaugh/',
  },
];

export default function Authors() {
  return (
    <section
      id="authors"
      className="px-6 md:px-10"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #D5DEC2',
        paddingTop: "clamp(64px, 12vw, 144px)",
        paddingBottom: "clamp(64px, 12vw, 144px)",
      }}
    >
      <style>{`
        .au-hero-figure {
          margin: 0 0 64px;
        }
        .au-hero-photo {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          filter: grayscale(0.35) sepia(0.18) brightness(1.04);
        }
        .au-hero-caption {
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.5);
          margin: 14px 0 0;
        }
        .au-badge {
          border: 1px solid rgba(168, 146, 58,0.28);
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
          border-color: rgba(168, 146, 58,0.65);
          color: #9A7020;
          background: rgba(168, 146, 58,0.08);
        }
        .au-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 768px) {
          .au-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
        }
        .au-portrait-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 28px;
          border-radius: 50%;
          border: 3px solid #A8923A;
          background: #0F1E1D;
          overflow: hidden;
          box-shadow: 0 8px 24px -10px rgba(42,26,8,0.35);
        }
        .au-portrait-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            0 0 0 1px rgba(237, 245, 236,0.10) inset,
            0 0 40px rgba(15, 30, 29,0.30) inset;
          pointer-events: none;
        }
        .au-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 22%;
          display: block;
          filter: grayscale(40%) saturate(0.7);
          transform: scale(1.05);
          transform-origin: center 30%;
        }
        @media (max-width: 1023px) {
          .au-portrait-wrap { width: 120px; height: 120px; }
        }
        @media (max-width: 767px) {
          .au-portrait-wrap { width: 96px; height: 96px; margin: 0 auto 20px; }
          .au-text-block { text-align: center; }
          .au-role-row { justify-content: center; }
        }
        .au-role-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0 0 24px;
          flex-wrap: wrap;
        }
        .au-li {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin: -14px 0 -14px -10px;
          color: #A8923A;
          border-radius: 4px;
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .au-li:hover {
          color: #C4AC4A;
          transform: scale(1.1);
        }
        .au-li:focus-visible {
          outline: 2px solid rgba(168, 146, 58,0.55);
          outline-offset: 2px;
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <figure className="au-hero-figure">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
            alt="The Mabbly editorial team in studio"
            loading="lazy"
            decoding="async"
            className="au-hero-photo"
          />
          <figcaption className="au-hero-caption">
            Mabbly editorial team - Chicago, 2026.
          </figcaption>
        </figure>

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
          13 · THE AUTHORS
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: 'linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))',
            margin: '18px 0 28px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 500,
            color: '#0F1E1D',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          Built from inside the arena<span style={{ color: '#BF461A' }}>.</span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(15,30,29,0.66)',
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
              <div className="au-portrait-wrap">
                <img src={a.photo} alt={a.name} className="au-portrait" loading="lazy" decoding="async" />
              </div>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 'clamp(28px, 3vw, 38px)',
                  fontWeight: 600,
                  color: '#0F1E1D',
                  margin: '0 0 6px',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                {a.name}
              </p>
              <div className="au-role-row">
                <p
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 14,
                    color: '#6A5038',
                    letterSpacing: '0.06em',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {a.role}
                </p>
                <a
                  href={a.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${a.name} on LinkedIn`}
                  className="au-li"
                >
                  <Linkedin size={16} strokeWidth={1.75} />
                </a>
              </div>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 'clamp(18px, 1.7vw, 22px)',
                  lineHeight: 1.5,
                  color: 'rgba(15,30,29,0.78)',
                  borderLeft: '3px solid rgba(168, 146, 58,0.45)',
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
