import { Link } from 'react-router-dom';
import { Youtube } from 'lucide-react';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';

export default function VerticalFooter() {
  return (
    <>
      <style>{`
        .vf-root {
          background: #0D0905;
          color: #F5EFE0;
          padding: 72px 24px 40px;
        }
        @media (min-width: 768px) { .vf-root { padding: 96px 40px 48px; } }
        .vf-inner { max-width: 1100px; margin: 0 auto; }
        .vf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 56px;
        }
        @media (min-width: 768px) {
          .vf-grid { grid-template-columns: 1.2fr 1fr 1fr 0.8fr; gap: 32px; }
        }
        .vf-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 16px;
        }
        .vf-brand {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #F5EFE0;
          margin: 0 0 12px;
          font-weight: 600;
        }
        .vf-blurb {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(245,239,224,0.55);
          line-height: 1.6;
          margin: 0;
        }
        .vf-link {
          display: block;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(245,239,224,0.7);
          padding: 6px 0;
          text-decoration: none;
          transition: color 180ms;
        }
        .vf-link:hover { color: #B8933A; }
        .vf-yt {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid rgba(184,147,58,0.4);
          border-radius: 999px;
          color: #B8933A;
          text-decoration: none;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 8px;
          transition: background 180ms, color 180ms;
        }
        .vf-yt:hover { background: rgba(184,147,58,0.12); color: #F5EFE0; }
        .vf-am-unit { display: flex; flex-direction: column; gap: 4px; }
        .vf-am-current {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #F5EFE0;
          border-bottom: 1px solid rgba(184,147,58,0.6);
          padding-bottom: 1px;
          align-self: flex-start;
        }
        .vf-am-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(245,239,224,0.85);
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
        .vf-am-list { display: flex; flex-direction: column; gap: 16px; }
        .vf-bottom {
          padding-top: 32px;
          border-top: 1px solid rgba(245,239,224,0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,239,224,0.35);
        }
        @media (min-width: 768px) {
          .vf-bottom { flex-direction: row; justify-content: space-between; align-items: center; }
        }
      `}</style>

      <footer className="vf-root" data-page-footer="true">
        <div className="vf-inner">
          <div className="vf-grid">
            <div>
              <p className="vf-brand">Mabbly</p>
              <p className="vf-blurb">
                The largest research on GTM in Professional Services. 500 practitioner interviews. Validated by Copulsky.
              </p>
              <a
                href="https://www.youtube.com/@GTMforPS"
                target="_blank"
                rel="noopener noreferrer"
                className="vf-yt"
              >
                <Youtube size={14} /> Watch the Podcast
              </a>
            </div>

            <div>
              <p className="vf-eyebrow">For Your Firm</p>
              {NAV_VERTICAL_LINKS.slice(0, 4).map((v) => (
                <Link key={v.slug} to={`/${v.slug}`} className="vf-link">{v.label}</Link>
              ))}
            </div>

            <div>
              <p className="vf-eyebrow">More Verticals</p>
              {NAV_VERTICAL_LINKS.slice(4).map((v) => (
                <Link key={v.slug} to={`/${v.slug}`} className="vf-link">{v.label}</Link>
              ))}
            </div>

            <div>
              <p className="vf-eyebrow">Across Mabbly</p>
              <div className="vf-am-list">
                <div className="vf-am-unit">
                  <span className="vf-am-current">discover.mabbly.com</span>
                  <span className="vf-am-desc">Research + the book.</span>
                </div>
                <div className="vf-am-unit">
                  <a href="https://mabbly.com" target="_blank" rel="noopener noreferrer" className="vf-am-link">mabbly.com →</a>
                  <span className="vf-am-desc">Agency. GTM for professional services firms.</span>
                </div>
                <div className="vf-am-unit">
                  <a href="https://mabbly.ai" target="_blank" rel="noopener noreferrer" className="vf-am-link">mabbly.ai →</a>
                  <span className="vf-am-desc">Product. Activate dormant relationships at scale.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="vf-bottom">
            <span>Mabbly · Relationship Revenue OS</span>
            <span>© {new Date().getFullYear()} · All rights reserved</span>
          </div>
        </div>
      </footer>
    </>
  );
}
