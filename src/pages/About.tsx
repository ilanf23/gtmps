import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Linkedin } from "lucide-react";
import { NAV_VERTICAL_LINKS } from "@/content/verticals";
import { INDUSTRY_ICONS } from "@/content/industryIcons";
import Footer from "@/components/Footer";
import adamPhoto from "@/assets/adam-fridman.png";
import richardPhoto from "@/assets/richard-ashbaugh.png";

const ADD_YOUR_FIRM_HREF = "/assess";
const ADD_YOUR_FIRM_LABEL = "Add Your Firm →";
const PODCAST_HREF = "https://www.youtube.com/@GTMforPS";

/* ─────────────────────────────────────────────
   TOP NAV (light variant — page is light overall, hero is dark)
   ───────────────────────────────────────────── */
const navItems = [
  { label: "About", href: "/about", internal: true },
  { label: "Awards", href: "/awards", internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Always treat as "on dark" since /about hero is dark and full-bleed
  const onHero = !scrolled;
  const linkColor = onHero ? "rgba(245,241,232,0.7)" : "rgba(13,17,23,0.6)";
  const linkHover = onHero ? "#F5F1E8" : "#0D1117";
  const wordColor = onHero ? "rgba(245,241,232,0.85)" : "#0D1117";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-500"
        style={{
          background: onHero ? "rgba(10,8,7,0)" : "rgba(251,248,244,0.92)",
          backdropFilter: onHero ? "none" : "blur(20px)",
          height: 64,
          borderBottom: onHero
            ? "1px solid rgba(184,147,58,0)"
            : "1px solid rgba(13,17,23,0.08)",
        }}
      >
        <Link to="/discover" className="flex items-baseline gap-2 group">
          <span
            className="font-display"
            style={{
              fontSize: 14,
              letterSpacing: "0.22em",
              color: wordColor,
              textTransform: "uppercase",
              fontWeight: 600,
              transition: "color 500ms ease",
            }}
          >
            Discover · Mabbly
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="font-sans text-sm transition-colors duration-300 inline-flex items-center gap-1"
              style={{ color: linkColor, background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              For Your Firm
              <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div
                role="menu"
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 min-w-[280px]"
                style={{
                  background: "#1C1008",
                  border: "1px solid rgba(184,147,58,0.25)",
                  borderRadius: 6,
                  padding: 8,
                  boxShadow: "0 16px 48px -12px rgba(0,0,0,0.4)",
                }}
              >
                {NAV_VERTICAL_LINKS.map((v) => {
                  const Icon = INDUSTRY_ICONS[v.slug];
                  return (
                    <Link
                      key={v.slug}
                      to={`/${v.slug}`}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 12,
                        width: "100%",
                        padding: "12px 16px",
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 14,
                        color: "#F5EFE0",
                        textDecoration: "none",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(184,147,58,0.12)";
                        e.currentTarget.style.color = "#B8933A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#F5EFE0";
                      }}
                    >
                      <Icon size={16} color="#B8933A" strokeWidth={1.7} />
                      {v.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {navItems.map((n) =>
            n.internal ? (
              <Link
                key={n.href}
                to={n.href}
                className="font-sans text-sm transition-colors duration-300"
                style={{ color: linkColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.href}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm transition-colors duration-300"
                style={{ color: linkColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
              >
                {n.label}
              </a>
            )
          )}
          <a
            href={ADD_YOUR_FIRM_HREF}
            className="font-sans font-medium rounded-full transition-all duration-200 hover:scale-[1.02]"
            style={{
              fontSize: 13,
              padding: "9px 22px",
              background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
              color: "#0D1117",
              border: "none",
              fontWeight: 600,
            }}
          >
            {ADD_YOUR_FIRM_LABEL}
          </a>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: onHero ? "#F5F1E8" : "#0D1117", transition: "color 500ms ease" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-start gap-4 overflow-y-auto"
          style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", padding: "88px 24px 40px" }}
        >
          <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
            {NAV_VERTICAL_LINKS.map((v) => {
              const Icon = INDUSTRY_ICONS[v.slug];
              return (
                <Link
                  key={v.slug}
                  to={`/${v.slug}`}
                  onClick={() => setOpen(false)}
                  className="font-display"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 19,
                    color: "#F5F1E8",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(184,147,58,0.15)",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={18} color="#B8933A" strokeWidth={1.7} />
                  {v.label}
                </Link>
              );
            })}
          </div>
          {navItems.map((n) =>
            n.internal ? (
              <Link
                key={n.href}
                to={n.href}
                onClick={() => setOpen(false)}
                className="font-display text-lg transition-colors"
                style={{ color: "rgba(245,241,232,0.7)", marginTop: 12 }}
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.href}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="font-display text-lg transition-colors"
                style={{ color: "rgba(245,241,232,0.7)", marginTop: 12 }}
              >
                {n.label}
              </a>
            )
          )}
          <a
            href={ADD_YOUR_FIRM_HREF}
            onClick={() => setOpen(false)}
            className="font-sans font-semibold rounded-full mt-3 px-8 py-3"
            style={{
              background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
              color: "#0D1117",
              fontSize: 14,
            }}
          >
            {ADD_YOUR_FIRM_LABEL}
          </a>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   SHARED STYLES
   ───────────────────────────────────────────── */
const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#B8933A",
  margin: 0,
};

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */
const About = () => {
  useEffect(() => {
    document.title = "About · Mabbly";
  }, []);

  return (
    <>
      <TopNav />
      <main>
        {/* ── Section A — HERO ── */}
        <section
          style={{
            background: "#1C1008",
            color: "#F5EFE0",
            padding: "144px 24px 96px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 720,
              height: 720,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(184,147,58,0.10) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          <div className="max-w-[920px] mx-auto" style={{ position: "relative", zIndex: 1 }}>
            <p style={eyebrowStyle}>About Mabbly</p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5.5vw, 72px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#F5EFE0",
                margin: "24px 0 24px",
              }}
            >
              We are building the operating system for relationship revenue.
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 20,
                lineHeight: 1.55,
                color: "rgba(245,239,224,0.7)",
                maxWidth: 640,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Mabbly began with one observation across hundreds of professional services firms: the next client almost always already knew them. The relationships existed. The trust was built. The system to activate them did not.
            </p>
          </div>
        </section>

        {/* ── Section B — THE THREE ROOMS (cream) ── */}
        <section style={{ background: "#FBF8F4", color: "#0D1117", padding: "96px 24px" }}>
          <div className="max-w-[1100px] mx-auto">
            <p style={eyebrowStyle}>How We Are Built</p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(34px, 4.5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#0D1117",
                margin: "20px 0 56px",
                maxWidth: 720,
              }}
            >
              Three rooms. One mission.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  eyebrow: "The Research",
                  name: "discover.mabbly.com",
                  href: null,
                  body: "The category authority hub. The book, the podcast, the diagnostic, the research cohort, the awards. Where we publish what we are learning.",
                },
                {
                  eyebrow: "The Agency",
                  name: "mabbly.com →",
                  href: "https://mabbly.com",
                  body: "Hands-on GTM consulting and execution for professional services firms. Where we apply the framework end to end with named teams.",
                },
                {
                  eyebrow: "The Product",
                  name: "mabbly.ai →",
                  href: "https://mabbly.ai",
                  body: "The Lead Nurturing Agent. AI-powered relationship reactivation, signal detection, and human-reviewed outreach. Where the framework runs at scale.",
                },
              ].map((r) => (
                <div
                  key={r.eyebrow}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(184,147,58,0.25)",
                    padding: 32,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <p style={eyebrowStyle}>{r.eyebrow}</p>
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0D1117",
                        textDecoration: "none",
                        letterSpacing: "-0.01em",
                        transition: "color 180ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#B8933A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#0D1117")}
                    >
                      {r.name}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0D1117",
                        letterSpacing: "-0.01em",
                        borderBottom: "1px solid rgba(184,147,58,0.6)",
                        alignSelf: "flex-start",
                        paddingBottom: 2,
                      }}
                    >
                      {r.name}
                    </span>
                  )}
                  <p
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(13,17,23,0.7)",
                      margin: 0,
                    }}
                  >
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section C — THE FOUNDERS (dark) ── */}
        <section style={{ background: "#0A0807", color: "#F5EFE0", padding: "112px 24px" }}>
          <div className="max-w-[1100px] mx-auto">
            <p style={eyebrowStyle}>Who Is Building This</p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(34px, 4.5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#F5EFE0",
                margin: "20px 0 56px",
                maxWidth: 760,
              }}
            >
              Built by practitioners, not researchers.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  name: "Adam Fridman",
                  role: "Co-Author + Founder, Mabbly",
                  photo: adamPhoto,
                  linkedin: "https://www.linkedin.com/in/adamfridman/",
                  bullets: [
                    "500 practitioner interviews (Science of Story)",
                    "180 podcast episodes on GTM for Professional Services",
                    "2 yrs Inc. columnist",
                  ],
                },
                {
                  name: "Richard Ashbaugh",
                  role: "Co-Author + CEO, Mabbly",
                  photo: richardPhoto,
                  linkedin: "https://www.linkedin.com/in/richardfashbaugh/",
                  bullets: [
                    "26 years across 9 professional services firms",
                    "$125M AArete revenue as CMO",
                    "$1.2B A.T. Kearney scaled from $250M",
                  ],
                },
              ].map((p) => (
                <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid rgba(184,147,58,0.4)",
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 32,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        color: "#F5EFE0",
                        margin: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      {p.name}
                      <a
                        href={p.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.name} on LinkedIn`}
                        style={{
                          color: "#B8933A",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 8,
                          transition: "color 180ms ease, transform 180ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#D4AE48";
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#B8933A";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <Linkedin size={16} />
                      </a>
                    </h3>
                    <p
                      style={{
                        ...eyebrowStyle,
                        marginTop: 8,
                        fontSize: 11,
                        letterSpacing: "0.16em",
                      }}
                    >
                      {p.role}
                    </p>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 15,
                          lineHeight: 1.55,
                          color: "rgba(245,239,224,0.78)",
                          paddingLeft: 18,
                          position: "relative",
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "0.6em",
                            width: 6,
                            height: 6,
                            background: "#B8933A",
                            borderRadius: "50%",
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section D — THE ORIGIN (cream) ── */}
        <section style={{ background: "#FBF8F4", color: "#0D1117", padding: "112px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Why This Book Exists</p>
            <figure style={{ margin: "32px 0 0", padding: 0 }}>
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#0D1117",
                  margin: 0,
                  paddingLeft: 28,
                  borderLeft: "2px solid rgba(184,147,58,0.65)",
                  letterSpacing: "-0.012em",
                }}
              >
                “We kept making the same mistake. We would meet with a firm. They had 400 dormant contacts. We would ask ‘have you called them?’ The answer was always no. Not because they forgot. Because they had no system. No permission. No cadence.”
              </blockquote>
              <figcaption
                style={{
                  ...eyebrowStyle,
                  marginTop: 20,
                  paddingLeft: 30,
                }}
              >
                Adam Fridman · Co-Author
              </figcaption>
            </figure>

            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(13,17,23,0.78)",
                marginTop: 48,
              }}
            >
              Mabbly exists to fix that. The book documents what we found. The agency applies it. The product runs it at scale.
            </p>
          </div>
        </section>

        {/* ── Section E — VALIDATION / FOREWORD (dark) ── */}
        <section style={{ background: "#1C1008", color: "#F5EFE0", padding: "112px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Foreword</p>
            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(22px, 2.6vw, 30px)",
                lineHeight: 1.5,
                fontWeight: 400,
                color: "#F5EFE0",
                margin: "32px 0 0",
                paddingLeft: 28,
                borderLeft: "2px solid rgba(184,147,58,0.65)",
                letterSpacing: "-0.01em",
              }}
            >
              Go to market in professional services is as much a mindset issue as it is an operational one. The firms that grow are the ones with real clarity about the problems they solve, for whom, and what outcomes that produces. This book builds the system around that clarity.
            </blockquote>
            <div style={{ marginTop: 24, paddingLeft: 30 }}>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#F5EFE0",
                  margin: 0,
                  letterSpacing: "-0.005em",
                }}
              >
                Jonathan Copulsky
              </p>
              <p
                style={{
                  ...eyebrowStyle,
                  marginTop: 6,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                }}
              >
                Former CMO, Deloitte · Senior Lecturer, Northwestern Kellogg
              </p>
            </div>
          </div>
        </section>

        {/* ── Section F — CONTACT + PRESS (cream) ── */}
        <section style={{ background: "#FBF8F4", color: "#0D1117", padding: "96px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Press + Inquiries</p>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 18,
                color: "#0D1117",
                margin: "20px 0 0",
              }}
            >
              <a
                href="mailto:press@mabbly.com"
                style={{ color: "#0D1117", textDecoration: "none", borderBottom: "1px solid rgba(184,147,58,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B8933A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0D1117")}
              >
                press@mabbly.com
              </a>
            </p>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                color: "rgba(13,17,23,0.55)",
                marginTop: 12,
              }}
            >
              Based in Chicago, Illinois.
            </p>
          </div>
        </section>

        {/* ── Section G — FINAL CTA (dark) ── */}
        <section
          style={{
            background: "#0A0807",
            color: "#F5EFE0",
            padding: "128px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#F5EFE0",
                margin: "0 0 36px",
              }}
            >
              Ready to add your firm to the research?
            </h2>
            <a
              href={ADD_YOUR_FIRM_HREF}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
                color: "#0D1117",
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.04em",
                padding: "16px 32px",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 6px 24px -8px rgba(184,147,58,0.55)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 10px 28px -8px rgba(184,147,58,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px -8px rgba(184,147,58,0.55)";
              }}
            >
              {ADD_YOUR_FIRM_LABEL}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
