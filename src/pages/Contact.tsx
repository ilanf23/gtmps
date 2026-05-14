import { useEffect } from "react";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { scrollToHero } from "@/lib/scrollToHero";

const CALENDLY_URL = "https://calendly.com/richard-mabbly";

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
    <div style={{ background: "#F5F1E8", minHeight: "100vh", color: "#0F1E1D" }}>
      <VerticalNavBar
        addYourFirmHref="/#hero"
        onAddYourFirm={() => {
          window.location.href = "/#hero";
          requestAnimationFrame(() => scrollToHero({ focus: true }));
        }}
      />

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "96px 32px 120px",
        }}
      >
        <p
          style={{
            fontFamily:
              "'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#BF461A",
            fontWeight: 700,
            margin: "0 0 24px",
          }}
        >
          Contact
        </p>
        <h1
          style={{
            fontFamily:
              "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif",
            fontSize: "clamp(44px, 6.4vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 900,
            margin: "0 0 28px",
            color: "#0F1E1D",
            maxWidth: 880,
          }}
        >
          Get in touch.
        </h1>
        <p
          style={{
            fontFamily: "'Inter', 'Inter Tight', sans-serif",
            fontSize: 19,
            lineHeight: 1.55,
            color: "rgba(15, 30, 29, 0.72)",
            maxWidth: 640,
            margin: "0 0 72px",
          }}
        >
          Tell us about your firm and what you are trying to solve. We read every
          message and reply within one business day.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)",
            gap: 64,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          <div
            style={{
              background: "#FBF7EC",
              border: "1px solid #E5E0CF",
              borderRadius: 16,
              padding: "40px 36px",
              boxShadow: "0 1px 0 rgba(15, 30, 29, 0.04)",
            }}
          >
            <ContactForm />
          </div>

          <aside
            style={{
              padding: "36px 32px",
              border: "1px solid #E5E0CF",
              borderRadius: 16,
              background: "#FBF7EC",
            }}
          >
            <p
              style={{
                fontFamily:
                  "'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#BF461A",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Prefer a call?
            </p>
            <h2
              style={{
                fontFamily:
                  "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: 24,
                lineHeight: 1.2,
                fontWeight: 900,
                letterSpacing: "-0.01em",
                margin: "0 0 14px",
                color: "#0F1E1D",
              }}
            >
              Book a 30 minute working session.
            </h2>
            <p
              style={{
                fontFamily: "'Inter', 'Inter Tight', sans-serif",
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(15, 30, 29, 0.7)",
                margin: "0 0 24px",
              }}
            >
              Skip the form. Pick a time on Richard's calendar and we will walk
              through your situation live.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily:
                  "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif",
                fontWeight: 900,
                fontSize: 11,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#BF461A",
                padding: "12px 22px",
                borderRadius: 999,
                border: "1.5px solid #BF461A",
                background: "transparent",
                textDecoration: "none",
              }}
            >
              Open Calendly →
            </a>
          </aside>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
