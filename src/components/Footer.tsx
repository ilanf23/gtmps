import { Youtube } from "lucide-react";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer
        data-page-footer="true"
        className="px-6 py-10 md:px-12 bg-soft-navy"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-[1080px] mx-auto">
          {/* Subscribe band */}
          <div
            id="footer-podcast"
            className="pb-8 mb-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "#B8933A",
                marginBottom: 10,
              }}
            >
              The Podcast
            </p>
            <p
              className="font-sans"
              style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 18, maxWidth: 640, lineHeight: 1.55 }}
            >
              500 practitioner interviews across 6 seasons of GTM for Professional Services. Watch on YouTube.
            </p>
            <div className="flex">
              <a
                href="https://www.youtube.com/@GTMforPS"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase transition-all duration-200 w-full sm:w-auto"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "rgba(184,147,58,0.85)",
                  border: "1px solid rgba(184,147,58,0.35)",
                  background: "rgba(184,147,58,0.06)",
                  padding: "14px 26px",
                  minHeight: 48,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  borderRadius: 3,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#B8933A";
                  e.currentTarget.style.color = "#F5EFE0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(184,147,58,0.35)";
                  e.currentTarget.style.color = "rgba(184,147,58,0.85)";
                }}
              >
                <Youtube size={14} />
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left items-start">
            {/* Left — wordmark */}
            <div>
              <span className="font-display font-bold text-white" style={{ fontSize: 18 }}>
                mabbly
              </span>
              <span className="font-sans block mt-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                GTM for the market you already own.
              </span>
            </div>

            {/* Center — Across Mabbly */}
            <div>
              <style>{`
                .am-link { transition: color 180ms ease; }
                .am-link:hover { color: #B8933A !important; }
                .am-link:hover + .am-desc { opacity: 0.4 !important; }
                .am-desc { transition: opacity 180ms ease; }
              `}</style>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "#B8933A",
                  marginBottom: 12,
                }}
              >
                Across Mabbly
              </p>
              <ul className="flex flex-col gap-4 items-center md:items-start">
                <li className="flex flex-col items-center md:items-start">
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 13,
                      color: "#F5EFE0",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(184,147,58,0.6)",
                      paddingBottom: 1,
                    }}
                  >
                    discover.mabbly.com
                  </span>
                  <span
                    className="font-sans block text-center md:text-left"
                    style={{
                      fontSize: 13,
                      color: "rgba(245,239,224,0.55)",
                      maxWidth: 240,
                      lineHeight: 1.5,
                      marginTop: 4,
                    }}
                  >
                    Research + the book.
                  </span>
                </li>
                <li className="flex flex-col items-center md:items-start">
                  <a
                    href="https://mabbly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-link font-sans"
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                  >
                    mabbly.com →
                  </a>
                  <span
                    className="am-desc font-sans block text-center md:text-left"
                    style={{
                      fontSize: 13,
                      color: "rgba(245,239,224,0.55)",
                      maxWidth: 240,
                      lineHeight: 1.5,
                      marginTop: 4,
                    }}
                  >
                    Agency. GTM for professional services firms.
                  </span>
                </li>
                <li className="flex flex-col items-center md:items-start">
                  <a
                    href="https://mabbly.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-link font-sans"
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                  >
                    mabbly.ai →
                  </a>
                  <span
                    className="am-desc font-sans block text-center md:text-left"
                    style={{
                      fontSize: 13,
                      color: "rgba(245,239,224,0.55)",
                      maxWidth: 240,
                      lineHeight: 1.5,
                      marginTop: 4,
                    }}
                  >
                    Product. Activate dormant relationships at scale.
                  </span>
                </li>
              </ul>
            </div>

            {/* Right — copyright + legal */}
            <div className="md:text-right">
              <span className="font-sans block" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                GTM for Professional Services © 2026 Mabbly LLC
              </span>
              <div className="flex gap-4 mt-3 justify-center md:justify-end">
                <a
                  href="https://mabbly.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans transition-colors duration-200 hover:text-white"
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                >
                  Privacy Policy
                </a>
                <a
                  href="https://mabbly.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans transition-colors duration-200 hover:text-white"
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
