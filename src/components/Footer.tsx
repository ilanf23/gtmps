import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      data-page-footer="true"
      className="bg-soft-navy"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "80px 24px 40px",
      }}
    >
      <style>{`
        .mf-am-link { transition: color 180ms ease; }
        .mf-am-link:hover { color: #B8933A !important; }
        .mf-am-link:hover + .mf-am-desc { opacity: 0.4 !important; }
        .mf-am-desc { transition: opacity 180ms ease; }
        .mf-legal { transition: color 180ms ease; }
        .mf-legal:hover { color: #F5EFE0 !important; }
        @media (max-width: 767px) {
          .mf-root { padding: 48px 24px 32px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mf-am-link, .mf-am-desc, .mf-legal { transition: none !important; }
        }
      `}</style>

      <div className="mf-root max-w-[1100px] mx-auto">
        {/* Row 1 — ACROSS MABBLY */}
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "#B8933A",
            margin: 0,
            marginBottom: 24,
          }}
        >
          Across Mabbly
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Item 1 — current page */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span
              className="font-display"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#F5EFE0",
                borderBottom: "1px solid rgba(184,147,58,0.6)",
                paddingBottom: 2,
                alignSelf: "flex-start",
              }}
            >
              discover.mabbly.com
            </span>
            <span
              className="font-display"
              style={{
                fontSize: 13,
                color: "rgba(245,239,224,0.55)",
                lineHeight: 1.5,
                maxWidth: 240,
              }}
            >
              Research + the book.
            </span>
          </div>

          {/* Item 2 — mabbly.com */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <a
              href="https://mabbly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-am-link font-display"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(245,239,224,0.92)",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              mabbly.com →
            </a>
            <span
              className="mf-am-desc font-display"
              style={{
                fontSize: 13,
                color: "rgba(245,239,224,0.55)",
                lineHeight: 1.5,
                maxWidth: 240,
              }}
            >
              Agency. GTM for professional services firms.
            </span>
          </div>

          {/* Item 3 — mabbly.ai */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <a
              href="https://mabbly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-am-link font-display"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(245,239,224,0.92)",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              mabbly.ai →
            </a>
            <span
              className="mf-am-desc font-display"
              style={{
                fontSize: 13,
                color: "rgba(245,239,224,0.55)",
                lineHeight: 1.5,
                maxWidth: 240,
              }}
            >
              Product. Activate dormant relationships at scale.
            </span>
          </div>

          {/* Item 4 — Podcast */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <a
              href="https://www.youtube.com/@GTMforPS"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-am-link font-display"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(245,239,224,0.92)",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              The Podcast →
            </a>
            <span
              className="mf-am-desc font-display"
              style={{
                fontSize: 13,
                color: "rgba(245,239,224,0.55)",
                lineHeight: 1.5,
                maxWidth: 240,
              }}
            >
              100 practitioner interviews on YouTube.
            </span>
          </div>
        </div>

        {/* Row 2 — divider */}
        <div
          aria-hidden
          style={{
            height: 1,
            width: "100%",
            background: "rgba(184,147,58,0.2)",
            margin: "56px 0 28px",
          }}
        />

        {/* Row 3 — bottom strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <div style={{ maxWidth: 320 }} className="mx-auto md:mx-0">
            <span
              className="font-display block"
              style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.01em" }}
            >
              mabbly
            </span>
            <span
              className="font-display block"
              style={{ fontSize: 13, color: "rgba(245,239,224,0.45)", marginTop: 6 }}
            >
              GTM for the market you already own.
            </span>
          </div>

          <div
            style={{ maxWidth: 480 }}
            className="mx-auto md:mx-0 md:text-right flex flex-col md:items-end gap-1"
          >
            <span
              className="font-display"
              style={{ fontSize: 12, color: "rgba(245,239,224,0.45)" }}
            >
              © 2026 Mabbly LLC
            </span>
            <span className="font-display" style={{ fontSize: 12 }}>
              <Link
                to="/about"
                className="mf-legal"
                style={{ color: "rgba(184,147,58,0.7)", textDecoration: "none" }}
              >
                About
              </Link>
              <span style={{ color: "rgba(245,239,224,0.25)", margin: "0 8px" }}>·</span>
              <a
                href="https://mabbly.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="mf-legal"
                style={{ color: "rgba(184,147,58,0.7)", textDecoration: "none" }}
              >
                Privacy Policy
              </a>
              <span style={{ color: "rgba(245,239,224,0.25)", margin: "0 8px" }}>·</span>
              <a
                href="https://mabbly.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="mf-legal"
                style={{ color: "rgba(184,147,58,0.7)", textDecoration: "none" }}
              >
                Terms of Service
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
