import { Link } from 'react-router-dom';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';

export default function VerticalFooter() {
  return (
    <>
      <style>{`
        .vf-root {
          background: #0D0905;
          color: #F5EFE0;
          padding: 80px 24px 40px;
        }
        @media (min-width: 768px) { .vf-root { padding: 80px 40px 40px; } }
        @media (max-width: 767px) { .vf-root { padding: 48px 24px 32px; } }
        .vf-inner { max-width: 1100px; margin: 0 auto; }

        .vf-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 16px;
        }

        /* Row 0 — For Your Firm */
        .vf-firm-row { padding-bottom: 32px; border-bottom: 1px solid rgba(245,239,224,0.08); margin-bottom: 48px; }
        .vf-firm-links { display: flex; flex-wrap: wrap; gap: 12px 24px; }
        .vf-firm-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(245,239,224,0.7);
          text-decoration: none;
          transition: color 180ms ease;
        }
        .vf-firm-link:hover { color: #B8933A; }

        /* Across Mabbly grid */
        .vf-am-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) { .vf-am-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .vf-am-grid { grid-template-columns: repeat(4, 1fr); } }

        .vf-am-item { display: flex; flex-direction: column; gap: 8px; }
        .vf-am-current {
          font-family: 'Inter Tight', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #F5EFE0;
          border-bottom: 1px solid rgba(184,147,58,0.6);
          padding-bottom: 2px;
          align-self: flex-start;
        }
        .vf-am-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: rgba(245,239,224,0.92);
          text-decoration: none;
          transition: color 180ms ease;
          align-self: flex-start;
        }
        .vf-am-link:hover { color: #B8933A; }
        .vf-am-desc {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(245,239,224,0.55);
          max-width: 240px;
          transition: opacity 180ms ease;
        }
        .vf-am-link:hover + .vf-am-desc { opacity: 0.4; }

        /* Divider */
        .vf-divider { height: 1px; width: 100%; background: rgba(184,147,58,0.2); margin: 56px 0 28px; }

        /* Bottom strip */
        .vf-bottom {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          text-align: center;
        }
        @media (min-width: 768px) {
          .vf-bottom { flex-direction: row; justify-content: space-between; align-items: center; text-align: left; }
        }
        .vf-bottom-left { max-width: 320px; }
        .vf-bottom-right { max-width: 480px; display: flex; flex-direction: column; gap: 4px; align-items: center; }
        @media (min-width: 768px) { .vf-bottom-right { align-items: flex-end; text-align: right; } }
        .vf-wordmark {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          display: block;
        }
        .vf-tagline {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(245,239,224,0.45);
          display: block;
          margin-top: 6px;
        }
        .vf-copy {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          color: rgba(245,239,224,0.45);
        }
        .vf-legal-row { font-family: 'Inter Tight', sans-serif; font-size: 12px; }
        .vf-legal {
          color: rgba(184,147,58,0.7);
          text-decoration: none;
          transition: color 180ms ease;
        }
        .vf-legal:hover { color: #F5EFE0; }
        .vf-sep { color: rgba(245,239,224,0.25); margin: 0 8px; }

        @media (prefers-reduced-motion: reduce) {
          .vf-firm-link, .vf-am-link, .vf-am-desc, .vf-legal { transition: none !important; }
        }
      `}</style>

      <footer className="vf-root" data-page-footer="true">
        <div className="vf-inner">
          {/* Row 0 — For Your Firm cross-links */}
          <div className="vf-firm-row">
            <p className="vf-eyebrow">For Your Firm</p>
            <div className="vf-firm-links">
              {NAV_VERTICAL_LINKS.map((v) => (
                <Link key={v.slug} to={`/${v.slug}`} className="vf-firm-link">
                  {v.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Row 1 — Across Mabbly */}
          <p className="vf-eyebrow">Across Mabbly</p>
          <div className="vf-am-grid">
            <div className="vf-am-item">
              <span className="vf-am-current">discover.mabbly.com</span>
              <span className="vf-am-desc">Research + the book.</span>
            </div>
            <div className="vf-am-item">
              <a href="https://mabbly.com" target="_blank" rel="noopener noreferrer" className="vf-am-link">
                mabbly.com →
              </a>
              <span className="vf-am-desc">Agency. GTM for professional services firms.</span>
            </div>
            <div className="vf-am-item">
              <a href="https://mabbly.ai" target="_blank" rel="noopener noreferrer" className="vf-am-link">
                mabbly.ai →
              </a>
              <span className="vf-am-desc">Product. Activate dormant relationships at scale.</span>
            </div>
            <div className="vf-am-item">
              <a
                href="https://www.youtube.com/@GTMforPS"
                target="_blank"
                rel="noopener noreferrer"
                className="vf-am-link"
              >
                The Podcast →
              </a>
              <span className="vf-am-desc">500 practitioner interviews on YouTube.</span>
            </div>
          </div>

          {/* Row 2 — divider */}
          <div className="vf-divider" aria-hidden />

          {/* Row 3 — bottom strip */}
          <div className="vf-bottom">
            <div className="vf-bottom-left">
              <span className="vf-wordmark">mabbly</span>
              <span className="vf-tagline">GTM for the market you already own.</span>
            </div>
            <div className="vf-bottom-right">
              <span className="vf-copy">© {new Date().getFullYear()} Mabbly LLC</span>
              <span className="vf-legal-row">
                <a href="https://mabbly.com/privacy" target="_blank" rel="noopener noreferrer" className="vf-legal">
                  Privacy Policy
                </a>
                <span className="vf-sep">·</span>
                <a href="https://mabbly.com/terms" target="_blank" rel="noopener noreferrer" className="vf-legal">
                  Terms of Service
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
