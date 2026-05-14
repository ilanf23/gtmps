import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";

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
    <div style={{ background: "#0A0807", minHeight: "100vh", color: "#EDF5EC" }}>
      {/* Minimal nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "rgba(10, 8, 7, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(168, 146, 58, 0.15)",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            letterSpacing: "0.22em",
            color: "rgba(245, 241, 232, 0.85)",
            textTransform: "uppercase",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Discover · Mabbly
        </Link>
        <Link
          to="/"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 13,
            color: "rgba(245, 241, 232, 0.65)",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>
      </nav>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "120px 24px 120px",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#A8923A",
            margin: "0 0 20px",
          }}
        >
          Contact
        </p>
        <h1
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            margin: "0 0 24px",
            color: "#EDF5EC",
            maxWidth: 820,
          }}
        >
          Get in touch.
        </h1>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(237, 245, 236, 0.72)",
            maxWidth: 620,
            margin: "0 0 64px",
          }}
        >
          Tell us about your firm and what you are trying to solve. We read every message and reply within one business day.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)",
            gap: 56,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          <div>
            <ContactForm />
          </div>

          <aside
            style={{
              padding: "32px 28px",
              border: "1px solid rgba(237, 245, 236, 0.1)",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#A8923A",
                margin: "0 0 14px",
              }}
            >
              Prefer a call?
            </p>
            <h2
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 22,
                lineHeight: 1.25,
                fontWeight: 500,
                margin: "0 0 14px",
                color: "#EDF5EC",
              }}
            >
              Book a 30 minute working session.
            </h2>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(237, 245, 236, 0.65)",
                margin: "0 0 20px",
              }}
            >
              Skip the form. Pick a time on Richard's calendar and we will walk through your situation live.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.04em",
                color: "#A8923A",
                padding: "11px 20px",
                borderRadius: 999,
                border: "1px solid rgba(168, 146, 58, 0.55)",
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