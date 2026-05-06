import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import { NAV_VERTICAL_LINKS, type VerticalSlug } from "@/content/verticals";
import { INDUSTRY_ICONS } from "@/content/industryIcons";
import SectionRail from "@/components/discover/SectionRail";
import Footer from "@/components/Footer";
import adamPhoto from "@/assets/adam-fridman.png";
import richardPhoto from "@/assets/richard-ashbaugh.png";
import bookCover from "@/assets/book-cover-v2.png";
import scienceOfStory from "@/assets/science-of-story-cover.png";
import { useRevealRef, revealStyle } from "@/hooks/useRevealRef";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ADD_YOUR_FIRM_HREF = "/#hero";
const ADD_YOUR_FIRM_LABEL = "Add Your Firm →";
const PODCAST_HREF = "https://www.youtube.com/@GTMforPS";

/* ─────────────────────────────────────────────
   TOP NAV (light variant - page is light overall, hero is dark)
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

  const onHero = !scrolled;
  const linkColor = onHero ? "rgba(245,241,232,0.7)" : "rgba(15, 30, 29,0.6)";
  const linkHover = onHero ? "#EDF5EC" : "#0F1E1D";
  const wordColor = onHero ? "rgba(245,241,232,0.85)" : "#0F1E1D";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-500"
        style={{
          background: onHero ? "rgba(10,8,7,0)" : "rgba(251,248,244,0.92)",
          backdropFilter: onHero ? "none" : "blur(20px)",
          height: 64,
          borderBottom: onHero
            ? "1px solid rgba(168, 146, 58,0)"
            : "1px solid rgba(15, 30, 29,0.08)",
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
                  background: "#0F1E1D",
                  border: "1px solid rgba(168, 146, 58,0.25)",
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
                        color: "#EDF5EC",
                        textDecoration: "none",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(168, 146, 58,0.12)";
                        e.currentTarget.style.color = "#A8923A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#EDF5EC";
                      }}
                    >
                      <Icon size={16} color="#A8923A" strokeWidth={1.7} />
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
              background: "linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%)",
              color: "#0F1E1D",
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
          style={{ color: onHero ? "#EDF5EC" : "#0F1E1D", transition: "color 500ms ease" }}
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
                    color: "#EDF5EC",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(168, 146, 58,0.15)",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={18} color="#A8923A" strokeWidth={1.7} />
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
              background: "linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%)",
              color: "#0F1E1D",
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
   SHARED STYLES & CONSTANTS
   ───────────────────────────────────────────── */
const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#A8923A",
  margin: 0,
};

const VERTICAL_TAGLINES: Record<VerticalSlug, string> = {
  consulting: "Practice Growth",
  law: "Origination Strategy",
  accounting: "Client Development",
  msp: "GTM",
  advisory: "Prospecting Strategy",
  ae: "Business Development",
  recruiting: "Mandate Origination",
  agency: "New Business",
};

/* Headline + body presets */
const h2Dark: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(32px, 4.4vw, 52px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  color: "#EDF5EC",
  margin: "20px 0 28px",
  maxWidth: 820,
};
const h2Light: React.CSSProperties = { ...h2Dark, color: "#0F1E1D" };

const bodyDark: React.CSSProperties = {
  fontFamily: "'Inter Tight', sans-serif",
  fontSize: 17,
  lineHeight: 1.7,
  color: "rgba(237, 245, 236,0.78)",
  margin: 0,
  maxWidth: 720,
};
const bodyLight: React.CSSProperties = {
  fontFamily: "'Inter Tight', sans-serif",
  fontSize: 17,
  lineHeight: 1.7,
  color: "rgba(15, 30, 29,0.78)",
  margin: 0,
  maxWidth: 720,
};

const pullQuoteDark: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontStyle: "italic",
  fontSize: "clamp(20px, 2.2vw, 26px)",
  lineHeight: 1.55,
  color: "rgba(237, 245, 236,0.92)",
  margin: 0,
  maxWidth: 760,
};
const pullQuoteLight: React.CSSProperties = { ...pullQuoteDark, color: "rgba(15, 30, 29,0.92)" };

/* Outline gold CTA (secondary). Primary gold pill stays exclusive to "Get MY Map". */
const outlineCtaBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "'Inter Tight', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.04em",
  color: "#A8923A",
  padding: "12px 22px",
  borderRadius: 999,
  border: "1px solid rgba(168, 146, 58,0.55)",
  background: "transparent",
  textDecoration: "none",
  transition: "background 180ms ease, color 180ms ease, border-color 180ms ease",
  marginTop: 32,
};
const outlineHoverIn = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.background = "rgba(168, 146, 58,0.12)";
  e.currentTarget.style.color = "#C4AC4A";
  e.currentTarget.style.borderColor = "#C4AC4A";
};
const outlineHoverOut = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.color = "#A8923A";
  e.currentTarget.style.borderColor = "rgba(168, 146, 58,0.55)";
};

const railItems = [
  { id: "hero", label: "01 · Mission" },
  { id: "mission", label: "02 · Why" },
  { id: "definition", label: "03 · Definition" },
  { id: "rooms", label: "04 · Three Rooms" },
  { id: "manuscript", label: "05 · The Book" },
  { id: "awards", label: "06 · The Awards" },
  { id: "agency", label: "07 · The Agency" },
  { id: "product", label: "08 · The Product" },
  { id: "verticals", label: "09 · Verticals" },
  { id: "vision", label: "10 · The Vision" },
  { id: "founders", label: "11 · Founders" },
  { id: "press", label: "12 · Press" },
];

/* ─────────────────────────────────────────────
   INLINE VISUAL COMPONENTS
   ───────────────────────────────────────────── */

/* S6E1 cold-open audio embed (lives inside Section 02 / Mission) */
const S6E1AudioBlock = () => {
  const reduced = useReducedMotion();
  const { ref, isVisible } = useRevealRef(200);
  const style = reduced
    ? { opacity: 1, transform: "none" }
    : revealStyle(isVisible, 600);
  return (
    <div
      ref={ref}
      style={{
        marginTop: 56,
        maxWidth: 640,
        ...style,
      }}
    >
      <p style={{ ...eyebrowStyle, marginBottom: 18 }}>Hear the Thesis · 30 Seconds</p>
      <blockquote
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(18px, 2vw, 22px)",
          lineHeight: 1.5,
          color: "rgba(15, 30, 29,0.82)",
          margin: "0 0 24px",
          paddingLeft: 20,
          borderLeft: "4px solid #A8923A",
          maxWidth: 600,
        }}
      >
        “Professional service firms deserve marketing as sophisticated as the work they sell.”
      </blockquote>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(168, 146, 58,0.28)",
          borderRadius: 6,
          padding: "16px 18px",
          boxShadow: "0 6px 20px -10px rgba(0,0,0,0.12)",
        }}
      >
        <audio
          controls
          preload="metadata"
          src={`${import.meta.env.BASE_URL}s6e1-cold-open.mp3`}
          aria-label="S6E1 cold open, 30 seconds"
          style={{ width: "100%", minHeight: 48, display: "block" }}
        >
          Your browser does not support the audio element.
        </audio>
      </div>
      <p
        style={{
          ...eyebrowStyle,
          marginTop: 14,
          fontSize: 11,
          opacity: 0.85,
        }}
      >
        Adam Fridman · S6E1 of GTM for Professional Services
      </p>
    </div>
  );
};

/* Editorial pull quote - appears as its own quiet section between content blocks */
const PullQuoteBlock = ({
  id,
  quote,
  attribution,
}: {
  id: string;
  quote: string;
  attribution: string;
}) => {
  const reduced = useReducedMotion();
  const { ref, isVisible } = useRevealRef(200);
  const style = reduced
    ? { opacity: 1, transform: "none" }
    : revealStyle(isVisible, 600);
  return (
    <section
      id={id}
      style={{
        background: "#EDF5EC",
        color: "#0F1E1D",
        padding: "96px 24px",
      }}
    >
      <figure
        ref={ref as unknown as React.Ref<HTMLElement>}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: 0,
          ...style,
        }}
      >
        <blockquote
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.55,
            fontWeight: 400,
            color: "#0F1E1D",
            margin: 0,
            paddingLeft: 24,
            borderLeft: "4px solid #A8923A",
            letterSpacing: "-0.005em",
          }}
        >
          “{quote}”
        </blockquote>
        <figcaption
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(168, 146, 58,0.7)",
            marginTop: 20,
            paddingLeft: 26,
          }}
        >
          {attribution}
        </figcaption>
      </figure>
    </section>
  );
};

/* Founder humanizing marks - Adam: Science of Story thumb. Richard: AArete + Kearney chips. */
const FounderMarks = ({ name }: { name: string }) => {
  if (name === "Adam Fridman") {
    return (
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <img
          src={scienceOfStory}
          alt="Science of Story book cover"
          loading="lazy"
          style={{
            width: 60,
            height: 90,
            objectFit: "cover",
            border: "1px solid rgba(168, 146, 58,0.25)",
            boxShadow: "0 8px 16px -8px rgba(0,0,0,0.5)",
            borderRadius: 2,
            display: "block",
          }}
        />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(168, 146, 58,0.6)",
          }}
        >
          Science of Story · 2014
        </span>
      </div>
    );
  }
  if (name === "Richard Ashbaugh") {
    const chipStyle: React.CSSProperties = {
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(168, 146, 58,0.85)",
      padding: "6px 12px",
      border: "1px solid rgba(168, 146, 58,0.35)",
      borderRadius: 2,
      whiteSpace: "nowrap",
    };
    return (
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={chipStyle}>AArete · CMO</span>
        <span style={chipStyle}>Kearney · GTM</span>
      </div>
    );
  }
  return null;
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
        <SectionRail items={railItems} />

        {/* ── 01 - HERO (dark) ── */}
        <section
          id="hero"
          style={{
            background: "#0F1E1D",
            color: "#EDF5EC",
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
              background: "radial-gradient(circle, rgba(168, 146, 58,0.10) 0%, transparent 70%)",
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
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5.5vw, 72px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#EDF5EC",
                margin: "24px 0 24px",
              }}
            >
              We are building the operating system for relationship revenue.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                lineHeight: 1.55,
                color: "rgba(237, 245, 236,0.7)",
                maxWidth: 640,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Mabbly began with one observation across hundreds of professional services firms: the next client almost always already knew them. The relationships existed. The trust was built. The system to activate them did not.
            </p>
          </div>
        </section>

        {/* ── 02 - THE MISSION (cream) ── */}
        <section id="mission" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "112px 24px" }}>
          <div className="max-w-[920px] mx-auto">
            <p style={eyebrowStyle}>Why We Exist</p>
            <h2 style={h2Light}>
              Professional services firms deserve marketing as sophisticated as the work they sell.
            </h2>
            <p style={bodyLight}>
              Most growth playbooks are built for software. They reward speed, scale, and outbound volume. They do not work for relationship-driven firms. Mabbly exists to build the system that does.
            </p>

            {/* S6E1 cold-open audio embed */}
            <S6E1AudioBlock />
          </div>
        </section>

        {/* ── 03 - WHAT IS GTM FOR PS (dark) ── */}
        <section id="definition" style={{ background: "#0F1E1D", color: "#EDF5EC", padding: "120px 24px" }}>
          <div className="max-w-[920px] mx-auto">
            <p style={eyebrowStyle}>A Definition</p>
            <h2 style={h2Dark}>What is GTM for Professional Services?</h2>
            <p style={pullQuoteDark}>
              GTM stands for go-to-market. It is the system a firm uses to find, win, and grow clients. Every firm has one. Most firms do not name it.
            </p>
            <p style={{ ...bodyDark, marginTop: 28 }}>
              For Professional Services means built specifically for relationship-driven firms. Not retrofitted from SaaS playbooks. Not borrowed from product marketing. The framework recognizes that in PS, relationships are the engine, signals trigger the work, and trust compounds over years.
            </p>
          </div>
        </section>

        {/* ── 04 - THE THREE ROOMS (cream) ── */}
        <section id="rooms" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "112px 24px" }}>
          <div className="max-w-[1100px] mx-auto">
            <p style={eyebrowStyle}>How We Are Built</p>
            <h2 style={{ ...h2Light, margin: "20px 0 56px", maxWidth: 720 }}>
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
                    border: "1px solid rgba(168, 146, 58,0.25)",
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
                        color: "#0F1E1D",
                        textDecoration: "none",
                        letterSpacing: "-0.01em",
                        transition: "color 180ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#A8923A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#0F1E1D")}
                    >
                      {r.name}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0F1E1D",
                        letterSpacing: "-0.01em",
                        borderBottom: "1px solid rgba(168, 146, 58,0.6)",
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
                      color: "rgba(15, 30, 29,0.7)",
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

        {/* Pull quote A - between definition (03) and rooms (04) */}
        <PullQuoteBlock
          id="pq-a"
          quote="The right person at the wrong moment is just another name in your CRM. The right person at the right moment is revenue."
          attribution="Chapter 4 · Truth II"
        />

        {/* ── 05 - THE MANUSCRIPT (dark) ── */}
        <section id="manuscript" style={{ background: "#0F1E1D", color: "#EDF5EC", padding: "120px 24px" }}>
          <div className="max-w-[1100px] mx-auto manuscript-grid">
            <style>{`
              .manuscript-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 48px;
                align-items: center;
                justify-items: center;
              }
              @media (min-width: 768px) {
                .manuscript-grid {
                  grid-template-columns: 240px 1fr;
                  gap: 64px;
                  justify-items: start;
                }
              }
              .about-book-wrap { perspective: 1200px; display: block; }
              .about-book {
                width: 180px;
                height: auto;
                display: block;
                transform: rotateY(-8deg);
                transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
                box-shadow:
                  0 30px 60px -20px rgba(0,0,0,0.4),
                  0 0 80px -20px rgba(168, 146, 58,0.25);
              }
              @media (min-width: 768px) {
                .about-book { width: 240px; }
              }
              .about-book-wrap:hover .about-book { transform: rotateY(0deg); }
              @media (prefers-reduced-motion: reduce) {
                .about-book { transform: none; transition: none; }
              }
            `}</style>
            <div className="about-book-wrap" aria-hidden>
              <img
                src={bookCover}
                alt="GTM for Professional Services manuscript cover"
                className="about-book"
                loading="lazy"
              />
            </div>
            <div>
              <p style={eyebrowStyle}>The Book</p>
              <h2 style={h2Dark}>GTM for Professional Services: The Relationship Revenue OS.</h2>
              <p style={bodyDark}>
                30 chapters. Three frameworks. Built from 500 practitioner interviews. Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg). The manuscript is in research validation now. Public launch Q3 2026.
              </p>
              <Link
                to="/discover#beta-reader"
                style={outlineCtaBase}
                onMouseEnter={outlineHoverIn}
                onMouseLeave={outlineHoverOut}
              >
                Read the manuscript before publication →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 06 - THE AWARDS (cream) - text + trophy mini-sculpture ── */}
        <section id="awards" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "120px 24px" }}>
          <div className="max-w-[1100px] mx-auto awards-grid">
            <style>{`
              .awards-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 48px;
                align-items: center;
                justify-items: center;
              }
              @media (min-width: 768px) {
                .awards-grid {
                  grid-template-columns: 1fr 200px;
                  gap: 64px;
                  justify-items: start;
                }
                .awards-grid > .awards-trophy-link { justify-self: end; }
              }
              .awards-trophy-link {
                display: block;
                text-decoration: none;
                transition: transform 400ms ease;
              }
              .awards-trophy-link:hover { transform: scale(1.05); }
              .at-mini {
                position: relative;
                width: 140px;
                height: 140px;
                filter: drop-shadow(0 24px 48px rgba(168, 146, 58,0.28));
              }
              @media (min-width: 768px) {
                .at-mini { width: 200px; height: 200px; }
              }
              .at-ring {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 1px solid rgba(168, 146, 58,0.9);
                animation: atSpin 60s linear infinite;
              }
              .at-ring.r2 {
                inset: 14%;
                border-color: rgba(168, 146, 58,0.55);
                animation-duration: 80s;
                animation-direction: reverse;
              }
              .at-ring.r3 {
                inset: 30%;
                border-color: rgba(168, 146, 58,0.3);
                animation-duration: 100s;
              }
              @keyframes atSpin { to { transform: rotate(360deg); } }
              .at-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: linear-gradient(135deg, #C4AC4A, #A8923A);
                box-shadow: 0 0 12px rgba(212,174,72,0.6);
              }
              .at-dot.d1 { top: -4px; left: 50%; transform: translateX(-50%); }
              .at-dot.d2 { bottom: 14%; right: 6%; width: 6px; height: 6px; }
              .at-dot.core {
                inset: 44%;
                width: auto;
                height: auto;
                background: radial-gradient(circle, #EDF5EC, #A8923A 70%);
                box-shadow: 0 0 24px rgba(212,174,72,0.75);
              }
              @media (prefers-reduced-motion: reduce) {
                .at-ring { animation: none; }
                .awards-trophy-link:hover { transform: none; }
              }
            `}</style>
            <div>
              <p style={eyebrowStyle}>The Recognition</p>
              <h2 style={h2Light}>Awards built for the firms that win unfairly.</h2>
              <p style={bodyLight}>
                Eight awards. One per vertical. Named in your industry's vocabulary. The Origination Award for law. The Practice Growth Award for consulting. The New Business Award for agencies. Inaugural cohort Q3 2026. Your firm is considered by default when you take the diagnostic.
              </p>
              <Link
                to="/awards"
                style={{ ...outlineCtaBase, color: "#8A6B1F", borderColor: "rgba(168, 146, 58,0.65)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(168, 146, 58,0.12)";
                  e.currentTarget.style.color = "#5E4810";
                  e.currentTarget.style.borderColor = "#A8923A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8A6B1F";
                  e.currentTarget.style.borderColor = "rgba(168, 146, 58,0.65)";
                }}
              >
                See the awards →
              </Link>
            </div>
            <Link to="/awards" className="awards-trophy-link" aria-label="See the inaugural GTM for Professional Services Awards">
              <div className="at-mini" aria-hidden>
                <div className="at-ring r1" />
                <div className="at-ring r2" />
                <div className="at-ring r3" />
                <div className="at-dot core" />
                <div className="at-dot d1" />
                <div className="at-dot d2" />
              </div>
            </Link>
          </div>
        </section>

        {/* Pull quote B - between awards (06) and agency (07) */}
        <PullQuoteBlock
          id="pq-b"
          quote="The Dead Zone is not a CRM problem. It is an avoidance problem. The contacts are there. The trust is there. The only thing missing is the willingness to pick up the phone."
          attribution="Richard Ashbaugh · Chapter 7"
        />

        {/* ── 07 - THE AGENCY (dark) ── */}
        <section id="agency" style={{ background: "#0F1E1D", color: "#EDF5EC", padding: "120px 24px" }}>
          <div className="max-w-[920px] mx-auto">
            <p style={eyebrowStyle}>When You Need Hands-On Help</p>
            <h2 style={{ ...h2Dark, fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: "clamp(32px, 4vw, 48px)" }}>
              mabbly.com
            </h2>
            <p style={bodyDark}>
              The agency. Hands-on GTM consulting and execution for professional services firms. Strategy, branding, signal-driven outreach, post-engagement relationship cadence. When the framework needs a named team applying it end-to-end, this is where they work.
            </p>
            <a
              href="https://mabbly.com"
              target="_blank"
              rel="noopener noreferrer"
              style={outlineCtaBase}
              onMouseEnter={outlineHoverIn}
              onMouseLeave={outlineHoverOut}
            >
              Visit mabbly.com →
            </a>
          </div>
        </section>

        {/* ── 08 - THE PRODUCT (cream) ── */}
        <section id="product" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "120px 24px" }}>
          <div className="max-w-[920px] mx-auto">
            <p style={eyebrowStyle}>When You Need Scale</p>
            <h2 style={{ ...h2Light, fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: "clamp(32px, 4vw, 48px)" }}>
              mabbly.ai
            </h2>
            <p style={bodyLight}>
              The product. The Lead Nurturing Agent. AI-powered relationship reactivation, signal detection, and human-reviewed outreach. Madcraft used it to reactivate a $400K dormant proposal in 7 minutes. Calliope used it to hit 2/2 reply on dormant healthcare contacts. SPR used it to systematize 150 dormant enterprise relationships.
            </p>
            <a
              href="https://mabbly.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...outlineCtaBase, color: "#8A6B1F", borderColor: "rgba(168, 146, 58,0.65)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(168, 146, 58,0.12)";
                e.currentTarget.style.color = "#5E4810";
                e.currentTarget.style.borderColor = "#A8923A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8A6B1F";
                e.currentTarget.style.borderColor = "rgba(168, 146, 58,0.65)";
              }}
            >
              Visit mabbly.ai →
            </a>
          </div>
        </section>

        {/* ── 09 - BUILT FOR THESE VERTICALS (dark) ── */}
        <section id="verticals" style={{ background: "#0F1E1D", color: "#EDF5EC", padding: "120px 24px" }}>
          <div className="max-w-[1180px] mx-auto">
            <p style={eyebrowStyle}>Who This Is For</p>
            <h2 style={h2Dark}>Eight verticals. One framework.</h2>
            <p style={{ ...bodyDark, marginBottom: 48 }}>
              Same Dead Zone. Same Five Orbits. Different vocabulary, different signals, different cadence per industry.
            </p>

            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              }}
              className="vertical-chip-grid"
            >
              <style>{`
                @media (min-width: 640px) {
                  .vertical-chip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                }
                @media (min-width: 1024px) {
                  .vertical-chip-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 18px !important; }
                }
                .v-chip { transition: transform 220ms ease, border-color 220ms ease, background 220ms ease; }
                .v-chip:hover {
                  transform: translateY(-3px);
                  border-color: rgba(168, 146, 58,0.55) !important;
                  background: rgba(237, 245, 236,0.06) !important;
                }
                .v-chip:hover .v-chip-icon { color: #C4AC4A !important; }
              `}</style>
              {NAV_VERTICAL_LINKS.map((v) => {
                const Icon = INDUSTRY_ICONS[v.slug];
                return (
                  <Link
                    key={v.slug}
                    to={`/${v.slug}`}
                    className="v-chip"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: 24,
                      background: "rgba(237, 245, 236,0.04)",
                      border: "1px solid rgba(168, 146, 58,0.2)",
                      borderRadius: 6,
                      textDecoration: "none",
                      minHeight: 148,
                    }}
                  >
                    <Icon className="v-chip-icon" size={36} color="#A8923A" strokeWidth={1.6} />
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#EDF5EC",
                          margin: 0,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {v.label}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 13,
                          color: "rgba(168, 146, 58,0.6)",
                          margin: "6px 0 0",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {VERTICAL_TAGLINES[v.slug]}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 10 - THE VISION (cream) ── */}
        <section id="vision" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "120px 24px" }}>
          <div className="max-w-[920px] mx-auto">
            <p style={eyebrowStyle}>Where This Goes</p>
            <h2 style={h2Light}>GTM for Professional Services becomes a category.</h2>
            <p style={pullQuoteLight}>
              Categories are not departments. Categories are how an industry organizes its thinking, its careers, its conferences, its standards, and its tools. PS firms have never had one for go-to-market. They have had borrowed pieces from product marketing and SaaS playbooks. None of them fit.
            </p>
            <p style={{ ...bodyLight, marginTop: 28 }}>
              The book is the textbook. The framework is the playbook. The agency runs it. The product scales it. The awards recognize the firms that do it best. Every part of Mabbly exists in service of one outcome: this category becomes inevitable.
            </p>
          </div>
        </section>

        {/* Pull quote C - between vision (10) and founders (11) */}
        <PullQuoteBlock
          id="pq-c"
          quote="Your next client already knows you. The relationships exist. The trust is built. The system to activate them did not."
          attribution="Introduction"
        />

        {/* ── 11 - THE FOUNDERS (dark) ── */}
        <section id="founders" style={{ background: "#0A0807", color: "#EDF5EC", padding: "112px 24px" }}>
          <div className="max-w-[1100px] mx-auto">
            <p style={eyebrowStyle}>Who Is Building This</p>
            <h2 style={{ ...h2Dark, margin: "20px 0 56px", maxWidth: 760 }}>
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
                    "$1.2B Kearney scaled from $250M",
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
                      border: "3px solid rgba(168, 146, 58,0.4)",
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 32,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        color: "#EDF5EC",
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
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 8,
                          transition: "transform 180ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <LinkedInIcon size={22} variant="blue" />
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
                          color: "rgba(237, 245, 236,0.78)",
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
                            background: "#A8923A",
                            borderRadius: "50%",
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <FounderMarks name={p.name} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 - PRESS + CONTACT (cream) ── */}
        <section id="press" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "112px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Inquiries</p>
            <h2 style={{ ...h2Light, fontSize: "clamp(28px, 3.4vw, 40px)" }}>
              For press, partnerships, and bookings.
            </h2>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 17,
                color: "rgba(15, 30, 29,0.78)",
                margin: 0,
              }}
            >
              <a
                href="mailto:adam@mabbly.com"
                style={{ color: "#0F1E1D", textDecoration: "none", borderBottom: "1px solid rgba(168, 146, 58,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#A8923A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0F1E1D")}
              >
                adam@mabbly.com
              </a>
              {" · Based in Chicago, Illinois"}
            </p>
          </div>
        </section>

        {/* ── 13 - THE ORIGIN / CONFESSION (dark) ── */}
        <section id="origin" style={{ background: "#0F1E1D", color: "#EDF5EC", padding: "112px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Why This Book Exists</p>
            <figure style={{ margin: "32px 0 0", padding: 0 }}>
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#EDF5EC",
                  margin: 0,
                  paddingLeft: 28,
                  borderLeft: "2px solid rgba(168, 146, 58,0.65)",
                  letterSpacing: "-0.012em",
                }}
              >
                “We kept making the same mistake. We would meet with a firm. They had 400 dormant contacts. We would ask ‘have you called them?’ The answer was always no. Not because they forgot. Because they had no system. No permission. No cadence.”
              </blockquote>
              <figcaption style={{ ...eyebrowStyle, marginTop: 20, paddingLeft: 30 }}>
                Adam Fridman · Co-Author
              </figcaption>
            </figure>

            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(237, 245, 236,0.78)",
                marginTop: 48,
              }}
            >
              Mabbly exists to fix that. The book documents what we found. The agency applies it. The product runs it at scale.
            </p>
          </div>
        </section>

        {/* ── 14 - FOREWORD (cream) ── */}
        <section id="foreword" style={{ background: "#EDF5EC", color: "#0F1E1D", padding: "112px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={eyebrowStyle}>Foreword</p>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 2.6vw, 30px)",
                lineHeight: 1.5,
                fontWeight: 400,
                color: "#0F1E1D",
                margin: "32px 0 0",
                paddingLeft: 28,
                borderLeft: "2px solid rgba(168, 146, 58,0.65)",
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
                  color: "#0F1E1D",
                  margin: 0,
                  letterSpacing: "-0.005em",
                }}
              >
                Jonathan Copulsky
              </p>
              <p style={{ ...eyebrowStyle, marginTop: 6, fontSize: 11, letterSpacing: "0.16em" }}>
                Former CMO, Deloitte · Senior Lecturer, Northwestern Kellogg
              </p>
            </div>
          </div>
        </section>

        {/* ── 15 - FINAL CTA (dark) ── */}
        <section
          id="cta"
          style={{
            background: "#0A0807",
            color: "#EDF5EC",
            padding: "128px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#EDF5EC",
                margin: "0 0 36px",
              }}
            >
              Ready to add your firm to the research?
            </h2>
            <a
              href={ADD_YOUR_FIRM_HREF}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%)",
                color: "#0F1E1D",
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.04em",
                padding: "16px 32px",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 6px 24px -8px rgba(168, 146, 58,0.55)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 10px 28px -8px rgba(168, 146, 58,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px -8px rgba(168, 146, 58,0.55)";
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
