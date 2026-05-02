import { Link } from 'react-router-dom';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';
import { scrollToHero } from '@/lib/scrollToHero';

export default function IndustryGrid() {
  return (
    <>
      <style>{`
        .ig-root {
          width: 100%;
          background: #FAF9F5;
          border-top: 1px solid rgba(213, 222, 212, 0.7);
          padding: 96px 24px;
        }
        @media (min-width: 768px) {
          .ig-root { padding: 112px 40px; }
        }
        .ig-inner {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }
        .ig-header {
          max-width: 720px;
          margin: 0 auto 48px;
        }
        .ig-eyebrow {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #FFBA1A;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .ig-rule {
          width: 44px; height: 2px;
          background: linear-gradient(90deg, #FFBA1A, rgba(255, 186, 26, 0.3));
          margin: 0 auto 28px;
        }
        .ig-h2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 500;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #0F1E1D;
          margin: 0 0 18px;
        }
        .ig-sub {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(17px, 1.6vw, 20px);
          color: rgba(15, 30, 29, 0.62);
          line-height: 1.55;
          margin: 0;
          font-weight: 400;
        }

        .ig-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          text-align: left;
        }
        @media (min-width: 640px) {
          .ig-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
        }
        @media (min-width: 1024px) {
          .ig-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
        }

        .ig-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
          padding: 28px 24px;
          background: #EDF5EC;
          border: 1px solid rgba(213, 222, 212, 0.9);
          border-radius: 4px;
          color: #0F1E1D;
          text-decoration: none;
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
          min-height: 140px;
        }
        .ig-card:hover {
          transform: translateY(-3px);
          border-color: #BF461A;
          background: #FFFFFF;
        }
        .ig-card-icon {
          color: #225351;
          transition: color 220ms ease, transform 220ms ease;
        }
        .ig-card:hover .ig-card-icon {
          color: #BF461A;
          transform: scale(1.05);
        }
        .ig-card-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.25;
          color: #0F1E1D;
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
          font-family: 'Inter Tight', sans-serif;
          font-size: 17px;
          color: rgba(15, 30, 29, 0.62);
          margin: 0;
          font-weight: 400;
          line-height: 1.55;
        }
        .ig-foot-text em { color: #BF461A; font-style: normal; font-weight: 600; }
        .ig-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #BF461A;
          color: #EDF5EC;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 25px;
          text-decoration: none;
          transition: transform 180ms ease, background 180ms ease;
        }
        .ig-cta:hover { transform: translateY(-1px); background: #803402; }
      `}</style>

      <section id="industries" className="ig-root">
        <div className="ig-inner">
          <div className="ig-header">
            <p className="ig-eyebrow">07 · Find Your Industry</p>
            <div className="ig-rule" aria-hidden />
            <h2 className="ig-h2">Built for relationship-driven firms.</h2>
            <p className="ig-sub">One framework. Eight verticals. Pick yours.</p>
          </div>

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
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToHero(); }}
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
