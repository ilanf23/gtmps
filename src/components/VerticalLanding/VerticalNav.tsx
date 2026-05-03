import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_VERTICAL_LINKS, type VerticalSlug } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';

type Props = { currentSlug?: VerticalSlug };

export default function VerticalNav({ currentSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .vn-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(251,248,244,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184,147,58,0.15);
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        @media (min-width: 768px) {
          .vn-root { padding: 0 40px; }
        }
        .vn-inner {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vn-brand {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          letter-spacing: 0.22em;
          font-weight: 600;
          color: #2A1A08;
          text-transform: uppercase;
          text-decoration: none;
        }
        .vn-links {
          display: none;
          align-items: center;
          gap: 28px;
        }
        @media (min-width: 1024px) {
          .vn-links { display: flex; }
        }
        .vn-trigger {
          background: none;
          border: none;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: rgba(42,26,8,0.7);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 0;
          transition: color 200ms;
        }
        .vn-trigger:hover { color: #2A1A08; }
        .vn-dropdown-wrap { position: relative; }
        .vn-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          background: #1C1008;
          border: 1px solid rgba(184,147,58,0.25);
          border-radius: 6px;
          padding: 8px;
          box-shadow: 0 16px 48px -12px rgba(0,0,0,0.4);
        }
        .vn-dropdown-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: #F5EFE0;
          text-decoration: none;
          border-radius: 4px;
          transition: background 180ms, color 180ms;
        }
        .vn-dropdown-link svg { color: #B8933A; flex-shrink: 0; }
        .vn-mobile-link { display: flex; align-items: center; gap: 12px; }
        .vn-mobile-link svg { color: #B8933A; flex-shrink: 0; }
        .vn-dropdown-link:hover {
          background: rgba(184,147,58,0.12);
          color: #B8933A;
        }
        .vn-dropdown-link[data-current="true"] {
          color: #B8933A;
          background: rgba(184,147,58,0.08);
        }
        .vn-cta {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 10px 22px;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #0D1117;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 180ms, box-shadow 180ms;
        }
        .vn-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -4px rgba(184,147,58,0.5); }
        .vn-burger {
          display: inline-flex;
          background: none;
          border: none;
          color: #2A1A08;
          cursor: pointer;
        }
        @media (min-width: 1024px) {
          .vn-burger { display: none; }
        }
        .vn-mobile {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(28,16,8,0.97);
          backdrop-filter: blur(20px);
          padding: 88px 24px 40px;
          overflow-y: auto;
        }
        .vn-mobile-section {
          margin-bottom: 32px;
        }
        .vn-mobile-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 14px;
        }
        .vn-mobile-link {
          display: block;
          padding: 14px 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #F5EFE0;
          text-decoration: none;
          border-bottom: 1px solid rgba(184,147,58,0.15);
        }
        .vn-mobile-cta {
          display: inline-block;
          margin-top: 20px;
          padding: 14px 28px;
          background: #B8933A;
          color: #1C1008;
          border-radius: 999px;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          text-decoration: none;
        }
      `}</style>

      <nav className="vn-root">
        <div className="vn-inner">
          <Link to="/discover" className="vn-brand">Discover · Mabbly</Link>

          <div className="vn-links">
            <div className="vn-dropdown-wrap" ref={dropdownRef}>
              <button
                className="vn-trigger"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                For Your Firm
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="vn-dropdown" role="menu">
                  {NAV_VERTICAL_LINKS.map((v) => {
                    const Icon = INDUSTRY_ICONS[v.slug];
                    return (
                      <Link
                        key={v.slug}
                        to={`/${v.slug}`}
                        className="vn-dropdown-link"
                        data-current={currentSlug === v.slug}
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
            <Link to="/awards" className="vn-trigger" style={{ textDecoration: 'none' }}>
              Awards
            </Link>
            <a
              href="https://www.youtube.com/@GTMforPS"
              target="_blank"
              rel="noopener noreferrer"
              className="vn-trigger"
              style={{ textDecoration: 'none' }}
            >
              Podcast
            </a>
            <a
              href="/#hero"
              className="vn-cta"
            >
              Get MY Map →
            </a>
          </div>

          <button
            className="vn-burger"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="vn-mobile">
          <div className="vn-mobile-section">
            <p className="vn-mobile-eyebrow">For Your Firm</p>
            {NAV_VERTICAL_LINKS.map((v) => {
              const Icon = INDUSTRY_ICONS[v.slug];
              return (
                <Link
                  key={v.slug}
                  to={`/${v.slug}`}
                  className="vn-mobile-link"
                  onClick={() => setOpen(false)}
                  style={currentSlug === v.slug ? { color: '#B8933A' } : undefined}
                >
                  <Icon size={20} strokeWidth={1.7} />
                  {v.label}
                </Link>
              );
            })}
          </div>
          <Link to="/awards" className="vn-mobile-link" onClick={() => setOpen(false)} style={{ color: '#B8933A' }}>
            Awards
          </Link>
          <a
            href="https://www.youtube.com/@GTMforPS"
            target="_blank"
            rel="noopener noreferrer"
            className="vn-mobile-link"
            onClick={() => setOpen(false)}
          >
            Podcast
          </a>
          <a
            href="/#hero"
            className="vn-mobile-cta"
            onClick={() => setOpen(false)}
          >
            Get MY Map →
          </a>
        </div>
      )}
    </>
  );
}
