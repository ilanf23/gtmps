import { Link } from "react-router-dom";
import { scrollToHero } from "@/lib/scrollToHero";

const PROPERTIES = [
  {
    label: "discover.mabbly.com",
    desc: "Research + the book.",
    href: null as string | null,
    current: true,
  },
  {
    label: "mabbly.com",
    desc: "Agency. GTM for professional services firms.",
    href: "https://mabbly.com",
    current: false,
  },
  {
    label: "mabbly.ai",
    desc: "Product. Activate dormant relationships at scale.",
    href: "https://mabbly.ai",
    current: false,
  },
  {
    label: "The Podcast",
    desc: "500 practitioner interviews on YouTube.",
    href: "https://www.youtube.com/@GTMforPS",
    current: false,
  },
];

type SitemapLink = { label: string; to: string } | { label: string; href: string; external?: boolean };
type SitemapCol = { title: string; links: SitemapLink[] };

const SITEMAP: SitemapCol[] = [
  {
    title: "Explore",
    links: [
      { label: "Discover", to: "/" },
      { label: "Manuscript", to: "/manuscript" },
      { label: "About", to: "/about" },
      { label: "Awards", to: "/awards" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Consulting", to: "/consulting" },
      { label: "Law", to: "/law" },
      { label: "Accounting", to: "/accounting" },
      { label: "Advisory", to: "/advisory" },
    ],
  },
];

const Footer = () => {
  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHero();
  };

  return (
    <footer
      data-page-footer="true"
      className="mf-root"
      aria-label="Site footer"
    >
      <style>{`
        .mf-root {
          --mf-ink: #0A1413;
          --mf-ink-soft: #11201E;
          --mf-cream: #F5F1E8;
          --mf-cream-mid: rgba(245, 241, 232, 0.78);
          --mf-cream-low: rgba(245, 241, 232, 0.55);
          --mf-cream-faint: rgba(245, 241, 232, 0.32);
          --mf-line: rgba(245, 241, 232, 0.12);
          --mf-line-strong: rgba(245, 241, 232, 0.22);
          --mf-gold: #C9AC2A;
          --mf-gold-soft: #A79014;
          --mf-rust: #BF461A;
          --mf-rust-bright: #E5582B;
          --mf-display: 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          --mf-mono: 'DM Mono', 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace;
          --mf-body: 'Inter Tight', system-ui, sans-serif;
          --mf-serif: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          --mf-ease: cubic-bezier(0.13, 0.28, 0.3, 1);

          position: relative;
          color: var(--mf-cream);
          background:
            radial-gradient(ellipse 800px 380px at 80% 0%, rgba(191, 70, 26, 0.10), transparent 60%),
            radial-gradient(ellipse 700px 320px at 10% 100%, rgba(167, 144, 20, 0.08), transparent 65%),
            var(--mf-ink);
          padding: 36px 32px 22px;
          overflow: hidden;
        }

        /* Inner */
        .mf-shell {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        /* TOP BAND - editorial CTA */
        .mf-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
          align-items: center;
          padding-bottom: 26px;
        }
        .mf-top-headline {
          font-family: var(--mf-display);
          font-weight: 800;
          font-size: clamp(24px, 2.6vw, 34px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--mf-cream);
          margin: 0 0 8px;
          max-width: 32ch;
        }
        .mf-top-headline em {
          font-style: italic;
          font-family: var(--mf-serif);
          font-weight: 500;
          color: var(--mf-rust-bright);
          letter-spacing: -0.005em;
        }
        .mf-top-deck {
          font-family: var(--mf-body);
          font-size: 14px;
          line-height: 1.55;
          color: var(--mf-cream-mid);
          margin: 0;
          max-width: 56ch;
        }
        .mf-top-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }
        .mf-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: var(--mf-rust);
          color: var(--mf-cream);
          font-family: var(--mf-display);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.02em;
          text-decoration: none;
          border-radius: 2px;
          border: 1px solid var(--mf-rust);
          transition: background 0.25s var(--mf-ease), transform 0.25s var(--mf-ease);
        }
        .mf-cta:hover {
          background: var(--mf-rust-bright);
          transform: translateY(-1px);
        }
        .mf-cta-arrow {
          display: inline-block;
          transition: transform 0.25s var(--mf-ease);
          font-size: 13px;
        }
        .mf-cta:hover .mf-cta-arrow { transform: translateX(3px); }
        .mf-cta-trust {
          font-family: var(--mf-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mf-cream-low);
          margin: 0;
        }

        /* DIVIDER */
        .mf-div {
          height: 1px;
          background: var(--mf-line);
          margin: 0;
        }

        /* MID ROW - properties + sitemap combined in a single compact row */
        .mf-mid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 32px;
          padding: 26px 0;
        }
        .mf-section-eyebrow {
          font-family: var(--mf-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--mf-gold);
          font-weight: 700;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--mf-line);
        }

        .mf-props {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 22px;
        }
        .mf-prop {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 5px 0 5px 12px;
          border-left: 2px solid var(--mf-gold-soft);
          text-decoration: none;
          transition: border-color 0.2s var(--mf-ease);
        }
        .mf-prop.is-current {
          border-left-color: var(--mf-rust);
        }
        .mf-prop:hover:not(.is-current) {
          border-left-color: var(--mf-gold);
        }
        .mf-prop-label {
          font-family: var(--mf-display);
          font-weight: 600;
          font-size: 14px;
          color: var(--mf-cream);
          letter-spacing: -0.005em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .mf-prop-arrow {
          color: var(--mf-gold);
          transition: transform 0.25s var(--mf-ease), color 0.25s var(--mf-ease);
          font-size: 12px;
        }
        .mf-prop:hover .mf-prop-arrow {
          transform: translateX(2px);
          color: var(--mf-rust-bright);
        }
        .mf-prop-current-badge {
          font-family: var(--mf-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mf-rust-bright);
          font-weight: 700;
        }
        .mf-prop-desc {
          font-family: var(--mf-body);
          font-size: 12px;
          line-height: 1.45;
          color: var(--mf-cream-low);
          margin: 0;
        }

        .mf-map-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mf-map-link {
          font-family: var(--mf-body);
          font-size: 13.5px;
          color: var(--mf-cream-mid);
          text-decoration: none;
          line-height: 1.5;
          transition: color 0.2s var(--mf-ease);
        }
        .mf-map-link:hover { color: var(--mf-cream); }

        /* BOTTOM STRIP */
        .mf-bot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-top: 18px;
          border-top: 1px solid var(--mf-line);
          flex-wrap: wrap;
        }
        .mf-wordmark {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
        }
        .mf-wordmark-name {
          font-family: var(--mf-display);
          font-weight: 700;
          font-size: 15px;
          color: var(--mf-cream);
          letter-spacing: -0.01em;
        }
        .mf-wordmark-name .mf-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--mf-rust);
          margin-left: 1px;
          vertical-align: middle;
        }
        .mf-wordmark-tag {
          font-family: var(--mf-mono);
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--mf-cream-low);
          font-weight: 600;
        }

        .mf-legal-row {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--mf-mono);
          font-size: 10.5px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }
        .mf-legal-link {
          color: var(--mf-cream-low);
          text-decoration: none;
          transition: color 0.2s var(--mf-ease);
          font-weight: 600;
        }
        .mf-legal-link:hover { color: var(--mf-cream); }
        .mf-legal-sep {
          color: var(--mf-cream-faint);
        }
        .mf-legal-copy {
          font-family: var(--mf-mono);
          font-size: 10.5px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--mf-cream-faint);
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 980px) {
          .mf-root { padding: 28px 20px 18px; }
          .mf-top { grid-template-columns: 1fr; gap: 18px; padding-bottom: 22px; }
          .mf-top-cta-wrap { justify-content: flex-start; }
          .mf-mid { grid-template-columns: 1fr; gap: 22px; padding: 22px 0; }
        }
        @media (max-width: 600px) {
          .mf-props { grid-template-columns: 1fr; }
          .mf-bot { flex-direction: column; align-items: flex-start; gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mf-root *,
          .mf-root *::before,
          .mf-root *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="mf-shell">
        {/* TOP BAND - editorial CTA */}
        <div className="mf-top">
          <div>
            <h2 className="mf-top-headline">
              GTM for the market you <em>already own.</em>
            </h2>
            <p className="mf-top-deck">
              The Relationship Revenue OS — in book and in product. Diagnose your dormancy in 90 seconds, then read the playbook.
            </p>
          </div>
          <div className="mf-top-cta-wrap">
            <span className="mf-cta-trust">Free · 90 sec</span>
            <a
              href="#hero"
              onClick={handleCta}
              className="mf-cta"
              data-cta="add-your-firm"
            >
              Add Your Firm
              <span className="mf-cta-arrow" aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mf-div" aria-hidden />

        {/* MID ROW - properties + sitemap */}
        <div className="mf-mid">
          <div>
            <p className="mf-section-eyebrow">Across Mabbly</p>
            <div className="mf-props">
              {PROPERTIES.map((p) =>
                p.current ? (
                  <div className="mf-prop is-current" key={p.label}>
                    <span className="mf-prop-label">{p.label}</span>
                    <span className="mf-prop-current-badge">You are here</span>
                  </div>
                ) : (
                  <a
                    className="mf-prop"
                    key={p.label}
                    href={p.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="mf-prop-label">
                      {p.label}
                      <span className="mf-prop-arrow" aria-hidden>→</span>
                    </span>
                    <p className="mf-prop-desc">{p.desc}</p>
                  </a>
                ),
              )}
            </div>
          </div>

          {SITEMAP.map((col) => (
            <div className="mf-map-col" key={col.title}>
              <p className="mf-section-eyebrow">{col.title}</p>
              {col.links.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} className="mf-map-link">
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="mf-map-link"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM STRIP */}
        <div className="mf-bot">
          <div className="mf-wordmark">
            <span className="mf-wordmark-name">
              mabbly<span className="mf-dot" aria-hidden />
            </span>
            <span className="mf-wordmark-tag">Est. 2014 · Chicago</span>
          </div>

          <span className="mf-legal-row">
            <Link to="/about" className="mf-legal-link">About</Link>
            <span className="mf-legal-sep">·</span>
            <a
              href="https://www.linkedin.com/company/mabbly"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-legal-link"
            >
              LinkedIn
            </a>
            <span className="mf-legal-sep">·</span>
            <a
              href="https://mabbly.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-legal-link"
            >
              Privacy
            </a>
            <span className="mf-legal-sep">·</span>
            <a
              href="https://mabbly.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-legal-link"
            >
              Terms
            </a>
          </span>

          <span className="mf-legal-copy">© 2026 Mabbly LLC</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
