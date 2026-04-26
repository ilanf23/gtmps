import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';
import AwardsHero from '@/components/awards/AwardsHero';
import AwardsManuscriptQuote from '@/components/awards/AwardsManuscriptQuote';
import AwardsGrid from '@/components/awards/AwardsGrid';
import AwardsJudging from '@/components/awards/AwardsJudging';
import AwardsCalendarCta from '@/components/awards/AwardsCalendarCta';
import VerticalFooter from '@/components/VerticalLanding/VerticalFooter';

const PODCAST_HREF = 'https://www.youtube.com/@GTMforPS';

function AwardsNav() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <>
      <style>{`
        .an-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(28,16,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184,147,58,0.15);
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        @media (min-width: 768px) { .an-root { padding: 0 40px; } }
        .an-inner { max-width: 1280px; margin: 0 auto; width: 100%; display: flex; align-items: center; justify-content: space-between; }
        .an-brand {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px; letter-spacing: 0.22em; font-weight: 600;
          color: rgba(245,239,224,0.85); text-transform: uppercase; text-decoration: none;
        }
        .an-links { display: none; align-items: center; gap: 28px; }
        @media (min-width: 1024px) { .an-links { display: flex; } }
        .an-trigger {
          background: none; border: none;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px; color: rgba(245,239,224,0.7);
          cursor: pointer; display: inline-flex; align-items: center; gap: 4px; padding: 8px 0;
          transition: color 200ms;
        }
        .an-trigger:hover { color: #F5EFE0; }
        .an-link {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px; color: rgba(245,239,224,0.7);
          text-decoration: none; transition: color 200ms;
        }
        .an-link:hover { color: #F5EFE0; }
        .an-link[data-active="true"] { color: #B8933A; }
        .an-dropdown-wrap { position: relative; }
        .an-dropdown {
          position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          min-width: 280px; background: #1C1008;
          border: 1px solid rgba(184,147,58,0.25); border-radius: 6px; padding: 8px;
          box-shadow: 0 16px 48px -12px rgba(0,0,0,0.4);
        }
        .an-dropdown-link {
          display: inline-flex; align-items: center; gap: 12px; width: 100%;
          padding: 12px 16px; font-family: 'Inter Tight', sans-serif; font-size: 14px;
          color: #F5EFE0; text-decoration: none; border-radius: 4px;
          transition: background 180ms, color 180ms;
        }
        .an-dropdown-link svg { color: #B8933A; flex-shrink: 0; }
        .an-dropdown-link:hover { background: rgba(184,147,58,0.12); color: #B8933A; }
        .an-cta {
          font-family: 'Inter Tight', sans-serif; font-weight: 600;
          font-size: 13px; letter-spacing: 0.04em; padding: 10px 22px;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #1C1008; border-radius: 999px; text-decoration: none;
          transition: transform 180ms, box-shadow 180ms;
        }
        .an-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -4px rgba(184,147,58,0.5); }
        .an-burger { display: inline-flex; background: none; border: none; color: #F5EFE0; cursor: pointer; }
        @media (min-width: 1024px) { .an-burger { display: none; } }
        .an-mobile {
          position: fixed; inset: 0; z-index: 99;
          background: rgba(28,16,8,0.97); backdrop-filter: blur(20px);
          padding: 88px 24px 40px; overflow-y: auto;
        }
        .an-mobile-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.32em; text-transform: uppercase; color: #B8933A;
          margin: 0 0 14px;
        }
        .an-mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 0; font-family: 'Cormorant Garamond', serif;
          font-size: 22px; color: #F5EFE0; text-decoration: none;
          border-bottom: 1px solid rgba(184,147,58,0.15);
        }
        .an-mobile-link svg { color: #B8933A; flex-shrink: 0; }
        .an-mobile-cta {
          display: inline-block; margin-top: 24px; padding: 14px 28px;
          background: #B8933A; color: #1C1008; border-radius: 999px;
          font-family: 'Inter Tight', sans-serif; font-weight: 600;
          font-size: 14px; text-decoration: none;
        }
      `}</style>

      <nav className="an-root">
        <div className="an-inner">
          <Link to="/discover" className="an-brand">Discover · Mabbly</Link>

          <div className="an-links">
            <div className="an-dropdown-wrap" ref={dropdownRef}>
              <button
                className="an-trigger"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                For Your Firm <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="an-dropdown" role="menu">
                  {NAV_VERTICAL_LINKS.map((v) => {
                    const Icon = INDUSTRY_ICONS[v.slug];
                    return (
                      <Link
                        key={v.slug}
                        to={`/${v.slug}`}
                        className="an-dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        <Icon size={16} strokeWidth={1.7} />
                        {v.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <Link to="/awards" className="an-link" data-active="true">Awards</Link>
            <a href={PODCAST_HREF} target="_blank" rel="noopener noreferrer" className="an-link">Podcast</a>
            <a href="/assess" className="an-cta">Add Your Firm →</a>
          </div>

          <button className="an-burger" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="an-mobile">
          <p className="an-mobile-eyebrow">For Your Firm</p>
          {NAV_VERTICAL_LINKS.map((v) => {
            const Icon = INDUSTRY_ICONS[v.slug];
            return (
              <Link key={v.slug} to={`/${v.slug}`} className="an-mobile-link" onClick={() => setOpen(false)}>
                <Icon size={20} strokeWidth={1.7} />
                {v.label}
              </Link>
            );
          })}
          <Link to="/awards" className="an-mobile-link" style={{ color: '#B8933A' }} onClick={() => setOpen(false)}>
            Awards
          </Link>
          <a href={PODCAST_HREF} target="_blank" rel="noopener noreferrer" className="an-mobile-link" onClick={() => setOpen(false)}>
            Podcast
          </a>
          <a href="/assess" className="an-mobile-cta" onClick={() => setOpen(false)}>Add Your Firm →</a>
        </div>
      )}
    </>
  );
}

export default function Awards() {
  useEffect(() => {
    document.title = 'GTM for Professional Services Awards · Mabbly';
  }, []);

  return (
    <main style={{ background: '#1C1008', minHeight: '100vh' }}>
      <AwardsNav />
      <AwardsHero />
      <AwardsManuscriptQuote />
      <AwardsGrid />
      <AwardsJudging />
      <AwardsCalendarCta />
      <VerticalFooter />
    </main>
  );
}
