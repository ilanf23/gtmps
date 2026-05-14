import { useEffect } from "react";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { scrollToHero } from "@/lib/scrollToHero";

const CALENDLY_URL = "https://calendly.com/richard-mabbly";

const DISPLAY =
  "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif";
const MONO =
  "'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace";
const BODY = "'Inter', 'Inter Tight', sans-serif";
const SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact, Mabbly";
    const ensure = (sel: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(sel) as HTMLElement | null;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      return el;
    };
    const desc = ensure('meta[name="description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      return m;
    });
    desc.setAttribute(
      "content",
      "Get in touch with Mabbly. Send a note about your firm, your GTM challenge, or to book a working session.",
    );
    const canonical = ensure('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    });
    canonical.setAttribute("href", "https://discover.mabbly.com/contact");
  }, []);

  return (
    <div style={{ background: "#FBF9F6", minHeight: "100vh", color: "#0F1E1D" }}>
      <VerticalNavBar
        addYourFirmHref="/#hero"
        onAddYourFirm={() => {
          window.location.href = "/#hero";
          requestAnimationFrame(() => scrollToHero({ focus: true }));
        }}
      />

      <main
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 32px 120px",
          overflow: "hidden",
        }}
      >
        <div
          className="contact-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 96,
            alignItems: "start",
          }}
        >
          {/* LEFT — editorial header + call card */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <span
              style={{
                display: "inline-block",
                padding: "5px 12px",
                background: "#BF461A",
                color: "#FBF9F6",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 28,
              }}
            >
              Contact
            </span>

            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(56px, 8vw, 128px)",
                lineHeight: 0.85,
                letterSpacing: "-0.035em",
                fontWeight: 900,
                margin: "0 0 28px",
                color: "#0F1E1D",
              }}
            >
              Get in <br />
              <span style={{ color: "#BF461A" }}>touch.</span>
            </h1>

            <p
              style={{
                fontFamily: BODY,
                fontSize: 20,
                lineHeight: 1.55,
                fontWeight: 500,
                color: "rgba(15, 30, 29, 0.78)",
                maxWidth: 460,
                margin: "0 0 44px",
              }}
            >
              Tell us about your firm and what you are trying to solve. We read
              every message and reply within one business day.
            </p>

            {/* Call card with soft glow */}
            <div style={{ position: "relative" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -6,
                  background: "rgba(191, 70, 26, 0.18)",
                  borderRadius: 18,
                  filter: "blur(14px)",
                  opacity: 0.45,
                }}
              />
              <div
                style={{
                  position: "relative",
                  background: "#FFFFFF",
                  border: "1px solid #E5E0D8",
                  borderRadius: 14,
                  padding: "32px 32px 30px",
                  boxShadow: "0 1px 0 rgba(15, 30, 29, 0.04)",
                }}
              >
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#BF461A",
                    fontWeight: 700,
                    margin: "0 0 18px",
                  }}
                >
                  Prefer a call?
                </p>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 26,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    fontWeight: 900,
                    margin: "0 0 12px",
                    color: "#0F1E1D",
                  }}
                >
                  Book a 30 minute working session.
                </h3>
                <p
                  style={{
                    fontFamily: BODY,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(15, 30, 29, 0.55)",
                    margin: "0 0 24px",
                  }}
                >
                  Skip the form. Pick a time on Richard's calendar and we will
                  walk through your situation live.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#0F1E1D",
                    paddingBottom: 4,
                    borderBottom: "2px solid #BF461A",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#BF461A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#0F1E1D")}
                >
                  Open Calendly →
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT — premium form with watermark numeral */}
          <div style={{ position: "relative", paddingTop: 12 }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <ContactForm />

              <div
                style={{
                  marginTop: 64,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 72,
                    background: "rgba(191, 70, 26, 0.35)",
                  }}
                />
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "#BF461A",
                    margin: 0,
                  }}
                >
                  We respond within 24 hours. Guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 1023px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          .contact-orbit-lg, .contact-orbit-md, .contact-watermark {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
