import { Link } from 'react-router-dom';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';

const ADD_YOUR_FIRM_HREF = '/assess';

export default function IndustryGrid() {
  return (
    <>
      <style>{`
        .ig-root {
          width: 100%;
          background: #F5EFE0;
          border-top: 1px solid rgba(184,147,58,0.15);
          padding: 96px 24px;
        }
        @media (min-width: 768px) {
          .ig-root { padding: 112px 40px; }
        }
        .ig-inner { max-width: 1180px; margin: 0 auto; }
        .ig-eyebrow {
          font-family: 'DM Mono', 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 18px;
        }
        .ig-rule {
          width: 44px; height: 2px;
          background: linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3));
          margin: 0 0 28px;
        }
        .ig-h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(32px, 4.4vw, 52px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #2A1A08;
          margin: 0 0 18px;
        }
        .ig-sub {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(17px, 1.5vw, 20px);
          font-weight: 300;
          color: rgba(42,26,8,0.65);
          line-height: 1.5;
          margin: 0 0 48px;
          max-width: 560px;
        }

        .ig-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .ig-grid { grid-template-columns: 1fr 1fr; gap: 18px; }
        }
        @media (min-width: 1024px) {
          .ig-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        .ig-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
          padding: 28px 24px;
          background: #fff;
          border: 1px solid rgba(184,147,58,0.18);
          border-radius: 6px;
          color: #2A1A08;
          text-decoration: none;
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
          min-height: 140px;
        }
        .ig-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px -16px rgba(184,147,58,0.45);
          border-color: rgba(184,147,58,0.55);
        }
        .ig-card-icon {
          color: #B8933A;
          transition: color 220ms ease, transform 220ms ease;
        }
        .ig-card:hover .ig-card-icon {
          color: #D4AE48;
          transform: scale(1.05);
        }
        .ig-card-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.25;
          color: #2A1A08;
          margin: 0;
          letter-spacing: -0.005em;
        }

        .ig-foot {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          text-align: center;
        }
        .ig-foot-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 300;
          color: rgba(42,26,8,0.65);
          margin: 0;
        }
        .ig-foot-text em { color: #B8933A; font-style: normal; font-weight: 500; }
        .ig-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #0D1117;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 6px 20px -8px rgba(184,147,58,0.55);
        }
        .ig-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -8px rgba(184,147,58,0.7); }
      `}</style>

      <section id="industries" className="ig-root">
        <div className="ig-inner">
          <p className="ig-eyebrow">1.5 · Find Your Industry</p>
          <div className="ig-rule" aria-hidden />
          <h2 className="ig-h2">Built for relationship-driven firms.</h2>
          <p className="ig-sub">One framework. Eight verticals. Pick yours.</p>

          <div className="ig-grid">
            {NAV_VERTICAL_LINKS.map((v) => {
              const Icon = INDUSTRY_ICONS[v.slug];
              return (
                <Link key={v.slug} to={`/${v.slug}`} className="ig-card" aria-label={v.label}>
                  <Icon className="ig-card-icon" size={40} strokeWidth={1.6} />
                  <h3 className="ig-card-name">{v.label}</h3>
                </Link>
              );
            })}
          </div>

          <div className="ig-foot">
            <p className="ig-foot-text">
              Or stay general — <em>Take the diagnostic now.</em>
            </p>
            <a
              href={ADD_YOUR_FIRM_HREF}
              className="ig-cta"
              data-cta="add-your-firm"
            >
              Add Your Firm →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
