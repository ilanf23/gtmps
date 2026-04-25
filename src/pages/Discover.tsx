import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Linkedin, Youtube } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCursorParallax } from "@/hooks/useCursorParallax";
import { useCountUp, useInView } from "@/hooks/useCountUp";
import bookCover from "@/assets/book-cover.png";
import adamPhoto from "@/assets/adam-fridman.png";
import richardPhoto from "@/assets/richard-ashbaugh.png";
import Footer from "@/components/Footer";
import EditorialNumeral from "@/components/discover/EditorialNumeral";
import HairlineRule from "@/components/discover/HairlineRule";
import PullQuote from "@/components/discover/PullQuote";
import PaperGrain from "@/components/discover/PaperGrain";
import EmberMesh from "@/components/discover/EmberMesh";
import DuotonePortrait from "@/components/discover/DuotonePortrait";
import Waveform from "@/components/discover/Waveform";
import FiveOrbitsDiagram from "@/components/discover/FiveOrbitsDiagram";
import ScrollProgressRail from "@/components/discover/ScrollProgressRail";
import SectionRail from "@/components/discover/SectionRail";

/* ─────────────────────────────────────────────
   TOP NAV
   ───────────────────────────────────────────── */
const navItems = [
  { label: "Build Your MAP", href: "#map" },
  { label: "The Book", href: "#book" },
  { label: "Podcast", href: "#podcast" },
];

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over dark hero: nav transparent w/ cream text. Past hero (mostly light): white glass w/ ink text.
  const onHero = !pastHero;
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
        <a href="#hero" className="flex items-baseline gap-2 group">
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
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-sans text-sm transition-colors duration-300"
              style={{ color: linkColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#beta-reader"
            className="font-sans font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] gold-ember-half"
            style={{
              fontSize: 13,
              padding: "9px 22px",
              background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
              color: "#0D1117",
            }}
          >
            Apply
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
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-7"
          style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
        >
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl transition-colors"
              style={{ color: "#F5F1E8" }}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#beta-reader"
            onClick={() => setOpen(false)}
            className="font-sans font-semibold text-ink rounded-full mt-3 px-8 py-3"
            style={{ background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)", color: "#0D1117" }}
          >
            Apply
          </a>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   SECTION 01 · HERO
   ───────────────────────────────────────────── */
const SectionHero = () => (
  <section
    id="hero"
    className="relative flex items-center justify-center overflow-hidden"
    style={{
      background: "#0A0807",
      minHeight: "100vh",
      paddingTop: 96,
      paddingBottom: 96,
    }}
  >
    <PaperGrain opacity={0.03} />
    <div className="cover-fade relative w-full max-w-[1100px] mx-auto px-6 md:px-10 text-center">
      <h1
        className="font-display"
        style={{
          color: "#F5F1E8",
          fontSize: "clamp(48px, 7.5vw, 112px)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          fontWeight: 500,
        }}
      >
        Professional services firms deserve marketing as sophisticated as the work they sell
        <span style={{ color: "#B8933A" }}>.</span>
      </h1>

      <p
        className="font-display mx-auto mt-10"
        style={{
          fontSize: 22,
          fontWeight: 300,
          color: "rgba(245,241,232,0.7)",
          lineHeight: 1.5,
          maxWidth: 640,
          letterSpacing: "-0.005em",
        }}
      >
        Read the manuscript before publication. Shape the book.
      </p>

      <p
        className="font-mono uppercase mt-8"
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          color: "#B8933A",
        }}
      >
        30 PS firms in &nbsp;·&nbsp; 70 spots remain
      </p>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 02 · AUTHORITY — Pull Quote → Bylines
   ───────────────────────────────────────────── */
const SectionAuthority = () => (
  <section
    id="authority"
    className="relative"
    style={{
      background: "hsl(38 33% 94%)" /* --cream */,
      paddingTop: 128,
      paddingBottom: 128,
    }}
  >
    <div className="scroll-reveal max-w-[1100px] mx-auto px-6 md:px-10">
      {/* Eyebrow */}
      <p
        className="font-mono uppercase text-center"
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          color: "#B8933A",
        }}
      >
        Built By
      </p>

      {/* Copulsky pullout */}
      <blockquote
        className="font-display text-center mx-auto"
        style={{
          marginTop: 64,
          color: "#1F1812",
          fontSize: "clamp(28px, 3.6vw, 56px)",
          lineHeight: 1.22,
          letterSpacing: "-0.018em",
          fontWeight: 500,
          maxWidth: 920,
        }}
      >
        Go to market in professional services is as much a mindset issue as it is an operational one. The firms that grow are the ones with real clarity about the problems they solve, for whom, and what outcomes that produces. This book builds the system around that clarity.
      </blockquote>

      {/* Attribution */}
      <div className="text-center" style={{ marginTop: 36 }}>
        <p
          className="font-display"
          style={{
            fontSize: 18,
            color: "#1F1812",
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          Jonathan Copulsky
        </p>
        <p
          className="font-mono uppercase"
          style={{
            marginTop: 8,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "#5A4F44",
          }}
        >
          Former CMO, Deloitte &nbsp;·&nbsp; Senior Lecturer, Northwestern Kellogg
        </p>
      </div>

      {/* Hairline divider */}
      <div
        aria-hidden
        className="mx-auto"
        style={{
          marginTop: 96,
          marginBottom: 96,
          height: 1,
          width: 320,
          background: "rgba(184,147,58,0.6)",
        }}
      />

      {/* Bylines */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 mx-auto"
        style={{ maxWidth: 980, columnGap: 80, rowGap: 64 }}
      >
        {/* Richard */}
        <div>
          <h3
            className="font-display"
            style={{
              fontSize: 28,
              color: "#1F1812",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
            }}
          >
            Richard Ashbaugh
          </h3>
          <p
            className="font-mono uppercase"
            style={{
              marginTop: 12,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "#B8933A",
            }}
          >
            Co-Author &nbsp;·&nbsp; CEO, Mabbly
          </p>
          <p
            className="font-sans"
            style={{
              marginTop: 16,
              fontSize: 15,
              color: "rgba(31,24,18,0.78)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            26 years across nine professional services firms. Former CMO at AArete ($400M revenue). Helped scale A.T. Kearney from $250M to $1.2B over seven years. Former Partner and CMO at Lotis Blue Consulting.
          </p>
          <p
            className="font-mono uppercase"
            style={{
              marginTop: 24,
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#5A4F44",
            }}
          >
            26 Years &nbsp;·&nbsp; 9 PS Firms &nbsp;·&nbsp; A.T. Kearney $250M → $1.2B
          </p>
        </div>

        {/* Adam */}
        <div>
          <h3
            className="font-display"
            style={{
              fontSize: 28,
              color: "#1F1812",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
            }}
          >
            Adam Fridman
          </h3>
          <p
            className="font-mono uppercase"
            style={{
              marginTop: 12,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "#B8933A",
            }}
          >
            Co-Author &nbsp;·&nbsp; Founder, Mabbly
          </p>
          <p
            className="font-sans"
            style={{
              marginTop: 16,
              fontSize: 15,
              color: "rgba(31,24,18,0.78)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Author of The Science of Story (500 interviews with the world's leading storytellers, brand builders, and culture architects). 180 podcast episodes. Inc. columnist for two years.
          </p>
          <p
            className="font-mono uppercase"
            style={{
              marginTop: 24,
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#5A4F44",
            }}
          >
            500 Interviews &nbsp;·&nbsp; 180 Episodes &nbsp;·&nbsp; Inc. Columnist
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 03 · THE DEAD ZONE
   ───────────────────────────────────────────── */
const SectionDeadZone = () => (
  <section
    id="dead-zone"
    className="relative px-6 md:px-10 py-32 md:py-40"
    style={{ background: "#FBF8F4" }}
  >
    <div className="relative max-w-[760px] mx-auto stagger-children">
      <div className="flex items-baseline gap-5 mb-10">
        <EditorialNumeral n="03" size={64} tone="gold" />
        <p
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(13,17,23,0.6)" }}
        >
          The Problem
        </p>
      </div>

      <h2
        className="font-display scroll-reveal"
        style={{
          color: "#0D1117",
          fontSize: "clamp(48px, 6vw, 96px)",
          lineHeight: 0.98,
          letterSpacing: "-0.03em",
          fontWeight: 500,
        }}
      >
        The dead zone.
        <br />
        You already know it’s there.
      </h2>

      <p
        className="font-serif scroll-reveal mt-7"
        style={{
          color: "rgba(26,24,20,0.7)",
          fontSize: "clamp(22px, 2vw, 28px)",
          lineHeight: 1.4,
          fontWeight: 400,
          fontStyle: "italic",
        }}
      >
        Your biggest GTM asset, hiding in plain sight.
      </p>

      <HairlineRule
        variant="ink"
        className="mt-10 mb-12 scroll-reveal"
        style={{ maxWidth: 96 }}
      />

      <div className="scroll-reveal">
        <p
          className="font-sans drop-cap"
          style={{ color: "rgba(26,24,20,0.88)", fontSize: 18, lineHeight: 1.7 }}
        >
          The Dead Zone is not dormant contacts. It is not lapsed leads. It is the predictable result of applying the wrong GTM definition to a relationship business — and if you run a professional services firm, you have already felt it.
        </p>
        <p
          className="font-sans mt-6"
          style={{ color: "rgba(26,24,20,0.82)", fontSize: 17, lineHeight: 1.78 }}
        >
          Between 60% and 80% of the contacts in your CRM are in the Dead Zone right now. They are not strangers. They knew you, worked with you, evaluated you, or were introduced to you. Each one is a relationship that started and was never maintained. You did not forget them. You ran out of the time, system, and discipline to keep showing up.
        </p>
      </div>

      {/* Editorial pullout */}
      <figure className="mt-20 mb-4 scroll-reveal" style={{ marginInline: "auto", maxWidth: 620 }}>
        <div
          aria-hidden
          style={{
            height: 1,
            background: "rgba(13,17,23,0.18)",
            width: 80,
            margin: "0 auto",
          }}
        />
        <blockquote
          className="font-serif text-center"
          style={{
            color: "#1A1814",
            fontSize: "clamp(24px, 2.6vw, 32px)",
            lineHeight: 1.36,
            fontStyle: "italic",
            fontWeight: 400,
            margin: "32px 0",
          }}
        >
          Your next client already knows you. You have no system to reach them.
        </blockquote>
        <div
          aria-hidden
          style={{
            height: 1,
            background: "rgba(13,17,23,0.18)",
            width: 80,
            margin: "0 auto",
          }}
        />
        <figcaption
          className="font-mono uppercase text-center mt-5"
          style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(26,24,20,0.5)" }}
        >
          — Chapter 7
        </figcaption>
      </figure>

      <p
        className="font-sans scroll-reveal mt-16"
        style={{
          color: "rgba(26,24,20,0.6)",
          fontSize: 16,
          lineHeight: 1.7,
        }}
      >
        Read that line again. Then think about the last six people you meant to follow up with and didn’t. That is the system this book is for.
      </p>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 04 · THE RELATIONSHIP REVENUE OS
   ───────────────────────────────────────────── */
const SectionPromisedLand = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="promised-land"
      className="relative px-6 md:px-10 vellum"
      style={{
        paddingTop: 128,
        paddingBottom: 128,
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Title block — centered */}
        <div className="text-center mx-auto" style={{ maxWidth: 720 }}>
          <p
            className="font-mono uppercase"
            style={{ fontSize: 11, letterSpacing: "0.32em", color: "#8B7F3F" }}
          >
            The System
          </p>
          <h2
            className="font-display mx-auto"
            style={{
              marginTop: 24,
              color: "#0D1117",
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            The Relationship Revenue OS
          </h2>
          <p
            className="font-display mx-auto"
            style={{
              marginTop: 24,
              color: "rgba(26,24,20,0.7)",
              fontSize: 18,
              lineHeight: 1.55,
              fontWeight: 300,
              maxWidth: 600,
              letterSpacing: "-0.005em",
            }}
          >
            Five Orbits map every relationship your firm has ever built. Five Layers activate them in sequence.
          </p>
        </div>

        {/* Diagram — printed plate on dark backing, editorial figure-style */}
        <div
          style={{
            marginTop: 72,
            marginBottom: 16,
            background: "#0A0807",
            border: "1px solid rgba(13,17,23,0.10)",
            padding: "56px 32px",
          }}
        >
          <FiveOrbitsDiagram triggered={triggered} staticMode={reduced} />
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 05 · WHY NOW
   ───────────────────────────────────────────── */
const SectionWhyNow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="why-now"
      className="relative px-6 md:px-10 py-32 md:py-40 overflow-hidden"
      style={{
        background: seen ? "#08070a" : "#0A0807",
        transition: "background 800ms ease",
        borderTop: "1px solid rgba(184,147,58,0.08)",
      }}
    >
      <EmberMesh intensity="low" />
      {/* Center gold hairline */}
      <svg
        aria-hidden
        className="absolute"
        style={{ top: "32%", left: 0, width: "100%", height: 2 }}
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="1"
          x2="1000"
          y2="1"
          stroke="#B8933A"
          strokeWidth="1"
          strokeDasharray="1000"
          style={{
            strokeDashoffset: seen ? 0 : 1000,
            transition: "stroke-dashoffset 1500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      <div className="relative max-w-[920px] mx-auto stagger-children text-center">
        <div className="flex items-baseline gap-5 mb-10 justify-center">
          <EditorialNumeral n="05" size={88} />
          <p
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.28em", color: "#B8933A" }}
          >
            The Window
          </p>
        </div>

        <h2
          className="font-display scroll-reveal mx-auto"
          style={{
            color: "#F5F1E8",
            fontSize: "clamp(36px, 4.8vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            maxWidth: 880,
          }}
        >
          <span className="editorial-italic" style={{ color: "#D4AE48" }}>
            12 to 18 months
          </span>
          <br />
          before the category gets crowded.
        </h2>

        <HairlineRule className="my-12 scroll-reveal mx-auto" style={{ maxWidth: 200 }} />

        <p
          className="font-sans scroll-reveal mt-2 mx-auto"
          style={{ color: "rgba(245,241,232,0.78)", fontSize: 19, lineHeight: 1.7, maxWidth: 640 }}
        >
          The professional services GTM space is wide open right now.
        </p>
        <p
          className="font-sans scroll-reveal mt-3 mx-auto"
          style={{ color: "rgba(245,241,232,0.78)", fontSize: 19, lineHeight: 1.7, maxWidth: 640 }}
        >
          Firms that modernize their growth motion in this window own their market position{" "}
          <span className="editorial-italic" style={{ color: "#D4AE48" }}>for the next decade.</span>
        </p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 06 · BETA READER PROGRAM
   ───────────────────────────────────────────── */
const SectionBetaReader = () => {
  const counters = useInView<HTMLDivElement>(0.3);
  const inCount = useCountUp(30, 1500, counters.visible, 0, (t) => 1 - Math.pow(1 - t, 3));
  const remainCount = useCountUp(70, 1500, counters.visible, 200, (t) => 1 - Math.pow(1 - t, 3));

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", firm: "", role: "", revenue: "", challenge: "" });
  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const inputClasses = "w-full font-sans text-sm outline-none rounded-lg transition-all duration-200";
  const inputStyle: React.CSSProperties = {
    background: "white",
    border: "1px solid #DDD5CC",
    padding: "14px 18px",
    color: "#2D2A26",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    textTransform: "uppercase",
    color: "#6B6560",
    letterSpacing: "0.18em",
    display: "block",
    marginBottom: 8,
  };

  return (
    <section
      id="beta-reader"
      className="relative px-6 md:px-10 py-28 md:py-36 vellum"
    >
      <PaperGrain opacity={0.018} blendMode="multiply" />
      <div className="relative max-w-[1180px] mx-auto stagger-children">
        <div className="flex items-baseline gap-5 mb-10">
          <EditorialNumeral n="06" size={88} tone="ink" />
          <p
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8B7F3F" }}
          >
            Primary CTA
          </p>
        </div>

        <h2
          className="font-display scroll-reveal"
          style={{
            color: "#2D2A26",
            fontSize: "clamp(40px, 5vw, 64px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            maxWidth: 880,
          }}
        >
          Read the manuscript.{" "}
          <span className="editorial-italic" style={{ color: "#B8933A" }}>
            Shape the book.
          </span>
        </h2>

        <p
          className="font-sans scroll-reveal mt-7"
          style={{ color: "#2D2A26", fontSize: 18, lineHeight: 1.75, maxWidth: 720 }}
        >
          Read the manuscript before publication. Submit feedback through a structured form. Get a 60 minute call with Adam and Richard to debrief. Be acknowledged by name in the book at launch.
        </p>

        {/* Counters */}
        <div ref={counters.ref} className="grid grid-cols-2 gap-10 mt-16 max-w-[680px]">
          <div className="scroll-reveal" style={{ borderTop: "1px solid rgba(184,147,58,0.4)", paddingTop: 18 }}>
            <span
              className="font-display block"
              style={{
                color: "#B8933A",
                fontSize: "clamp(64px, 8vw, 112px)",
                lineHeight: 0.92,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              {inCount}
            </span>
            <span className="font-mono uppercase block mt-3" style={{ color: "#6B6560", fontSize: 10, letterSpacing: "0.22em" }}>
              PS firms in
            </span>
          </div>
          <div className="scroll-reveal" style={{ borderTop: "1px solid rgba(0,0,0,0.18)", paddingTop: 18 }}>
            <span
              className="font-display block"
              style={{
                color: "#2D2A26",
                fontSize: "clamp(64px, 8vw, 112px)",
                lineHeight: 0.92,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              {remainCount}
            </span>
            <span className="font-mono uppercase block mt-3" style={{ color: "#6B6560", fontSize: 10, letterSpacing: "0.22em" }}>
              spots remain
            </span>
          </div>
        </div>

        {/* Named firms strip */}
        <div className="mt-14 scroll-reveal">
          <p className="font-mono uppercase mb-3" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8B7F3F" }}>
            Among them
          </p>
          <HairlineRule variant="ink" />
          <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 py-4">
            {["AArete", "SPR", "Madcraft", "Workiva", "The Integration Office"].map((firm, i) => (
              <span key={firm} className="flex items-center gap-3">
                <span
                  className="font-display"
                  style={{ color: "#2D2A26", fontSize: 18, fontWeight: 500, letterSpacing: "-0.005em" }}
                >
                  {firm}
                </span>
                {i < 4 && (
                  <span style={{ color: "rgba(184,147,58,0.5)", fontSize: 12 }}>◆</span>
                )}
              </span>
            ))}
            <span className="font-display" style={{ color: "#6B6560", fontSize: 16, marginLeft: 8 }}>
              and 25 others
            </span>
          </div>
          <HairlineRule variant="ink" />
        </div>

        {/* Travis pull quote */}
        <div className="mt-14 max-w-[820px] scroll-reveal">
          <PullQuote
            tone="light"
            size="xl"
            attribution="Travis Roderick"
            caption="The Integration Office"
          >
            Adam, thank you for this, it is incredible work. We would like to explore a deeper partnership.
          </PullQuote>
        </div>

        {/* Application form */}
        <div
          className="mt-20 rounded-2xl p-8 sm:p-12 scroll-reveal"
          style={{
            background: "white",
            border: "1px solid #DDD5CC",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.10)",
            maxWidth: 720,
            transition: "all 300ms ease",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "rgba(184,147,58,0.4)";
            e.currentTarget.style.boxShadow = "0 24px 60px -20px rgba(184,147,58,0.18)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "#DDD5CC";
            e.currentTarget.style.boxShadow = "0 24px 60px -20px rgba(0,0,0,0.10)";
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8B7F3F" }}>
              Beta Reader Application
            </p>
            <span className="font-display" style={{ fontSize: 13, color: "#6B6560" }}>
              estimated 3 minutes
            </span>
          </div>
          <h3
            className="font-display"
            style={{ color: "#2D2A26", fontSize: 30, lineHeight: 1.1, fontWeight: 500, letterSpacing: "-0.02em" }}
          >
            Apply to read the manuscript.
          </h3>
          <HairlineRule variant="ink" className="my-7" style={{ maxWidth: 80 }} />

          <div className="flex flex-col gap-5">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                className={inputClasses}
                style={inputStyle}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD5CC")}
              />
            </div>
            <div>
              <label style={labelStyle}>Firm Name</label>
              <input
                className={inputClasses}
                style={inputStyle}
                placeholder="Name of your professional services firm"
                value={form.firm}
                onChange={(e) => update("firm", e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD5CC")}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Your Role</label>
                <select
                  className={`${inputClasses} custom-select`}
                  style={inputStyle}
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD5CC")}
                >
                  <option value="">Select your role</option>
                  <option>Managing Partner or CEO</option>
                  <option>CMO or VP of Marketing</option>
                  <option>Head of Business Development</option>
                  <option>Partner</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Annual Revenue</label>
                <select
                  className={`${inputClasses} custom-select`}
                  style={inputStyle}
                  value={form.revenue}
                  onChange={(e) => update("revenue", e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD5CC")}
                >
                  <option value="">Select revenue range</option>
                  <option>$5M to $15M</option>
                  <option>$15M to $50M</option>
                  <option>$50M to $100M</option>
                  <option>Over $100M</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>What is your biggest GTM challenge right now?</label>
              <textarea
                rows={4}
                className={inputClasses}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Be specific. The more context you give us, the more useful the conversation will be."
                value={form.challenge}
                onChange={(e) => update("challenge", e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD5CC")}
              />
            </div>

            {submitted ? (
              <p
                className="font-display text-center mt-4"
                style={{ color: "#3D5A4A", fontSize: 18 }}
              >
                Application received. We will review it personally and respond within 48 hours.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const body = [
                    `Full Name: ${form.name}`,
                    `Firm Name: ${form.firm}`,
                    `Role: ${form.role}`,
                    `Annual Revenue: ${form.revenue}`,
                    `Biggest GTM Challenge: ${form.challenge}`,
                  ].join("\n");
                  window.location.href = `mailto:adam@mabbly.com?subject=${encodeURIComponent(
                    "Beta Reader Application"
                  )}&body=${encodeURIComponent(body)}`;
                  setSubmitted(true);
                }}
                className="w-full font-sans font-bold cursor-pointer border-none rounded-full transition-all duration-200 hover:scale-[1.005] mt-2 gold-ember"
                style={{
                  fontSize: 15,
                  padding: 18,
                  background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
                  color: "#0D1117",
                  letterSpacing: "0.01em",
                }}
              >
                Apply to Read the Manuscript
              </button>
            )}

            <p className="font-display text-center mt-2" style={{ fontSize: 14, color: "#6B6560" }}>
              Free. 60 minute debrief with Adam and Richard. Acknowledged by name at launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 07 · THE AUTHORS
   ───────────────────────────────────────────── */
const AuthorCard = ({
  src,
  alt,
  name,
  role,
  bio,
  socials,
}: {
  src: string;
  alt: string;
  name: string;
  role: string;
  bio: string;
  socials: { type: "linkedin" | "youtube"; href: string }[];
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="scroll-reveal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: 32,
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(13,17,23,0.10)",
      }}
    >
      <DuotonePortrait src={src} alt={alt} />

      <div className="mt-7">
        <h3
          className="font-display inline-block"
          style={{
            color: "#0D1117",
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.018em",
            position: "relative",
          }}
        >
          {name}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -4,
              height: 1.5,
              background: "#B8933A",
              transformOrigin: "left",
              transform: hover ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 380ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </h3>
        <p
          className="font-mono uppercase mt-3"
          style={{ fontSize: 10, letterSpacing: "0.18em", color: "#8B7F3F" }}
        >
          {role}
        </p>
      </div>

      <HairlineRule variant="ink" className="my-6" style={{ width: 36 }} />

      <p
        className="font-sans"
        style={{ color: "rgba(26,24,20,0.78)", fontSize: 14, lineHeight: 1.78 }}
      >
        {bio}
      </p>

      <div className="flex items-center gap-4 mt-7">
        {socials.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "rgba(13,17,23,0.45)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0D1117")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(13,17,23,0.45)")}
          >
            {s.type === "linkedin" ? <Linkedin size={18} /> : <Youtube size={18} />}
          </a>
        ))}
      </div>
    </div>
  );
};

const SectionAuthors = () => (
  <section
    id="authors"
    className="relative px-6 md:px-10 py-28 md:py-36 vellum"
  >
    <PaperGrain opacity={0.018} blendMode="multiply" />
    <div className="relative max-w-[1180px] mx-auto stagger-children">
      <div className="flex items-baseline gap-5 mb-12">
        <EditorialNumeral n="07" size={64} tone="gold" />
        <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(13,17,23,0.6)" }}>
          The Authors
        </p>
      </div>

      <h2
        className="font-display scroll-reveal"
        style={{
          color: "#0D1117",
          fontSize: "clamp(40px, 5vw, 60px)",
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          fontWeight: 500,
          maxWidth: 820,
        }}
      >
        Written by{" "}
        <span className="editorial-italic" style={{ color: "#B8933A" }}>
          practitioners.
        </span>{" "}
        Not researchers.
      </h2>

      <p
        className="font-sans scroll-reveal mt-6"
        style={{ color: "rgba(26,24,20,0.78)", fontSize: 17, maxWidth: 640, lineHeight: 1.7 }}
      >
        Two insiders who have lived the Dead Zone problem from inside the firms that Mabbly now serves.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
        <AuthorCard
          src={adamPhoto}
          alt="Adam Fridman"
          name="Adam Fridman"
          role="Founder, Mabbly · Author · Host, Signal Activated Growth"
          bio="Founded Mabbly in 2013. Author of The Science of Story (500 interviews). 180 podcast episodes. Inc. columnist for two years. Now building Mabbly AI, the first signal-activated growth platform for PS firms."
          socials={[
            { type: "linkedin", href: "https://linkedin.com/in/adamfridman" },
            { type: "youtube", href: "https://www.youtube.com/@SignalActivatedGrowth" },
          ]}
        />
        <AuthorCard
          src={richardPhoto}
          alt="Richard Ashbaugh"
          name="Richard Ashbaugh"
          role="CEO, Mabbly · Former CMO, AArete · Former CMO, Lotis Blue"
          bio="26 years across nine professional services firms. Helped scale A.T. Kearney from $250M to $1.2B over seven years. Built the GTM infrastructure at AArete ($400M revenue) that most PS firms spend a decade trying to replicate."
          socials={[{ type: "linkedin", href: "https://linkedin.com/in/richardfashbaugh" }]}
        />
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 08 · RESULTS
   ───────────────────────────────────────────── */
const SectionResults = () => {
  const wrap = useInView<HTMLDivElement>(0.2);
  const settle = (t: number) => 1 - Math.pow(1 - t, 4);
  const v1 = useCountUp(400, 1500, wrap.visible, 0, settle);
  const v2 = useCountUp(81, 1500, wrap.visible, 150, settle);
  const v3 = useCountUp(167, 1500, wrap.visible, 300, settle);
  const v4 = useCountUp(51, 1500, wrap.visible, 450, settle);
  const v5 = useCountUp(288, 1500, wrap.visible, 600, settle);
  const v6 = useCountUp(100, 1500, wrap.visible, 750, settle);

  const stats = [
    { numeral: `${Math.round(v1)}`, unit: "K", prefix: "$", label: "Deal closed from a 10-month dormant proposal. Reply in 7 minutes. Zero cold contact." },
    { numeral: `${(v2 / 10).toFixed(1)}`, unit: "%", label: "Reply rate vs 1.3% industry average. 37 signal-activated messages to dormant contacts." },
    { numeral: `${Math.round(v3)}`, unit: "%", label: "More qualified opportunities for Workiva after shifting from job title to challenge-based outreach." },
    { numeral: `${Math.round(v4)}`, unit: "%", label: "Lower cost per consultation. Lactation Network. Consultant network tripled in one year." },
    { numeral: `${Math.round(v5)}`, unit: "%", label: "Lift in conversions for NoDoz through proof-based content matched to audience intent." },
    { numeral: `${Math.round(v6)}`, unit: "%", label: "Reply rate from dormant reactivation when sender had personal context and precise signal." },
  ];

  return (
    <section id="results" className="relative px-6 md:px-10 py-28 md:py-36 vellum">
      <PaperGrain opacity={0.018} blendMode="multiply" />
      <div ref={wrap.ref} className="relative max-w-[1180px] mx-auto stagger-children">
        <div className="flex items-baseline gap-5 mb-10">
          <EditorialNumeral n="08" size={88} tone="ink" />
          <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8B7F3F" }}>
            The Receipts
          </p>
        </div>

        <h2
          className="font-display scroll-reveal"
          style={{
            color: "#2D2A26",
            fontSize: "clamp(36px, 4.6vw, 56px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            maxWidth: 800,
          }}
        >
          Receipts. Not{" "}
          <span className="editorial-italic" style={{ color: "#B8933A" }}>
            projections.
          </span>
        </h2>

        <p
          className="font-sans scroll-reveal mt-5"
          style={{ color: "#6B6560", fontSize: 16, lineHeight: 1.7, maxWidth: 580 }}
        >
          Six results from clients on the system the book documents. Each is reproducible. The framework explains why.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14">
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative rounded-md p-8 scroll-reveal transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid #DDD5CC",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 40px -10px rgba(184,147,58,0.16), inset 0 0 0 1px rgba(184,147,58,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
              }}
            >
              {/* Gold corner bracket */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  width: 14,
                  height: 14,
                  borderTop: "1px solid rgba(184,147,58,0.7)",
                  borderLeft: "1px solid rgba(184,147,58,0.7)",
                }}
              />

              <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8B7F3F", marginLeft: 8 }}>
                Result · {String(i + 1).padStart(2, "0")}
              </p>

              <div className="flex items-baseline mt-5">
                {s.prefix && (
                  <span
                    className="font-display"
                    style={{ color: "#B8933A", fontSize: 30, fontWeight: 500, marginRight: 2, lineHeight: 1 }}
                  >
                    {s.prefix}
                  </span>
                )}
                <span
                  className="font-display"
                  style={{
                    color: "#B8933A",
                    fontSize: "clamp(48px, 4.4vw, 64px)",
                    lineHeight: 0.9,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {s.numeral}
                </span>
                <span
                  className="font-display"
                  style={{ color: "#B8933A", fontSize: 24, fontWeight: 500, marginLeft: 2, lineHeight: 1 }}
                >
                  {s.unit}
                </span>
              </div>

              <HairlineRule variant="ink" className="my-5" style={{ width: 28 }} />

              <p className="font-sans" style={{ color: "#2D2A26", fontSize: 13, lineHeight: 1.65 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <p
          className="font-display text-center mt-14 mx-auto scroll-reveal"
          style={{ color: "#6B6560", fontSize: 18, maxWidth: 600, lineHeight: 1.6, fontWeight: 500 }}
        >
          These are not projections. They are reproducible. The framework explains why.
        </p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 09 · MAP
   ───────────────────────────────────────────── */
const SectionMap = () => (
  <section
    id="map"
    className="relative px-6 md:px-10 py-28 md:py-36 overflow-hidden vellum"
  >
    <PaperGrain opacity={0.018} blendMode="multiply" />

    <div className="relative max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start stagger-children">
      <div className="md:col-span-7">
        <div className="flex items-baseline gap-5 mb-10">
          <EditorialNumeral n="09" size={64} tone="gold" />
          <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(13,17,23,0.6)" }}>
            Build Your MAP
          </p>
        </div>

        <h2
          className="font-display scroll-reveal"
          style={{
            color: "#0D1117",
            fontSize: "clamp(36px, 4.4vw, 56px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 500,
          }}
        >
          Score your firm's GTM in{" "}
          <span className="editorial-italic" style={{ color: "#B8933A" }}>
            10 minutes.
          </span>
        </h2>

        <HairlineRule variant="ink" className="my-7 scroll-reveal" style={{ maxWidth: 80 }} />

        <p className="font-sans scroll-reveal" style={{ color: "rgba(26,24,20,0.82)", fontSize: 17, lineHeight: 1.75, maxWidth: 580 }}>
          Not ready for the Beta Reader Program? Use the Mabbly Activation Profile to map your Five Orbits, score each layer, and surface the Dead Zone in your own CRM.
        </p>

        <a
          href="/map"
          className="inline-flex items-center justify-center font-sans font-semibold rounded-full mt-10 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "transparent",
            border: "1.5px solid #0D1117",
            color: "#0D1117",
            padding: "14px 36px",
            fontSize: 14,
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0D1117";
            e.currentTarget.style.color = "#F5F1E8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#0D1117";
          }}
        >
          Build Your MAP →
        </a>
      </div>

      {/* Legend block */}
      <div
        className="md:col-span-5 scroll-reveal"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(13,17,23,0.10)",
          padding: 32,
        }}
      >
        <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.28em", color: "#8B7F3F" }}>
          Legend
        </p>
        <HairlineRule variant="ink" className="my-4" />
        <ul className="space-y-4 mt-5">
          {[
            { tick: "I", t: "Your firm scored across all five orbits" },
            { tick: "II", t: "Dead Zone exposure estimate" },
            { tick: "III", t: "Layer-by-layer activation gaps" },
            { tick: "IV", t: "12-month roadmap, sequenced" },
          ].map((item) => (
            <li key={item.tick} className="grid grid-cols-[36px_1fr] items-baseline gap-4">
              <span
                className="font-display"
                style={{ fontSize: 18, color: "#B8933A", fontWeight: 500 }}
              >
                {item.tick}.
              </span>
              <span className="font-sans" style={{ color: "rgba(26,24,20,0.85)", fontSize: 15, lineHeight: 1.6 }}>
                {item.t}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 10 · THE BOOK
   ───────────────────────────────────────────── */
const SectionBook = () => {
  const bookRef = useRef<HTMLDivElement>(null);
  const parallax = useCursorParallax(bookRef, 4);
  const reduced = useReducedMotion();

  const chapters = [
    { n: "01", title: "The Wrong Definition", pages: "Pages 1–28 · 22 min", desc: "Why every GTM playbook in PS is built around the wrong starting question." },
    { n: "04", title: "The Five Orbits", pages: "Pages 78–112 · 32 min", desc: "How to map every relationship your firm has ever built — and what each layer is worth." },
    { n: "07", title: "The Dead Zone", pages: "Pages 142–168 · 26 min", desc: "The avoidance pattern that costs firms 60–80% of their CRM's revenue potential." },
    { n: "11", title: "Signal + Proof + Context", pages: "Pages 224–254 · 28 min", desc: "The formula behind reply rates of 8% in a 1.3% industry." },
  ];

  return (
    <section id="book" className="relative px-6 md:px-10 py-28 md:py-36 vellum">
      <PaperGrain opacity={0.018} blendMode="multiply" />
      <div className="relative max-w-[1180px] mx-auto stagger-children">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 items-center">
          {/* Cover */}
          <div ref={bookRef} className="md:col-span-5 scroll-reveal flex justify-center">
            <div
              style={{
                perspective: 1400,
                transform: reduced
                  ? "rotateY(-3deg) rotateX(2deg)"
                  : `rotateY(${-3 + parallax.x * -0.6}deg) rotateX(${2 + parallax.y * 0.4}deg)`,
                transition: reduced ? undefined : "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={bookCover}
                alt="GTM for Professional Services"
                style={{
                  display: "block",
                  maxWidth: 360,
                  width: "100%",
                  boxShadow:
                    "0 40px 70px -24px rgba(0,0,0,0.45), 0 0 60px -10px rgba(184,147,58,0.20), inset -1px -1px 0 rgba(212,174,72,0.5)",
                  borderRadius: 4,
                }}
              />
              {/* Foil-stamp gold edge highlight */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 4,
                  background:
                    "linear-gradient(118deg, transparent 50%, rgba(232,199,106,0.18) 70%, transparent 86%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="md:col-span-7">
            <div className="flex items-baseline gap-5 mb-8">
              <EditorialNumeral n="10" size={88} tone="ink" />
              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8B7F3F" }}>
                The Book
              </p>
            </div>
            <h2
              className="font-display scroll-reveal"
              style={{
                color: "#2D2A26",
                fontSize: "clamp(36px, 4.4vw, 56px)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              GTM for Professional Services
            </h2>
            <p
              className="font-display scroll-reveal mt-3"
              style={{ color: "#B8933A", fontSize: 24, fontWeight: 500 }}
            >
              The Relationship Revenue OS
            </p>
            <HairlineRule variant="ink" className="my-7" style={{ maxWidth: 80 }} />
            <p
              className="font-sans scroll-reveal"
              style={{ color: "#2D2A26", fontSize: 16, lineHeight: 1.7, maxWidth: 520 }}
            >
              First edition · Mabbly Press · Q4 2026.
            </p>
            <p
              className="font-sans scroll-reveal mt-2"
              style={{ color: "#6B6560", fontSize: 14, lineHeight: 1.7, maxWidth: 520 }}
            >
              The category authority on go-to-market for professional services. Beta readers shape the manuscript.
            </p>
          </div>
        </div>

        {/* Chapter previews */}
        <p className="font-mono uppercase mt-20 mb-6" style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8B7F3F" }}>
          Selected Chapters
        </p>
        <HairlineRule variant="ink" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-10 stagger-children">
          {chapters.map((c) => (
            <div key={c.n} className="grid grid-cols-[auto_1fr] gap-6 scroll-reveal">
              <span
                className="font-display"
                style={{
                  color: "#B8933A",
                  fontSize: 64,
                  lineHeight: 0.85,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                }}
              >
                {c.n}
              </span>
              <div>
                <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8B7F3F" }}>
                  {c.pages}
                </p>
                <h3
                  className="font-display mt-2"
                  style={{ color: "#2D2A26", fontSize: 24, lineHeight: 1.15, fontWeight: 500, letterSpacing: "-0.018em" }}
                >
                  {c.title}
                </h3>
                <p className="font-sans mt-3" style={{ color: "#6B6560", fontSize: 14, lineHeight: 1.7 }}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 11 · THE PODCAST
   ───────────────────────────────────────────── */
const SectionPodcast = () => (
  <section
    id="podcast"
    className="relative px-6 md:px-10 py-28 md:py-36 overflow-hidden vellum"
  >
    <PaperGrain opacity={0.018} blendMode="multiply" />
    <div className="relative max-w-[1180px] mx-auto stagger-children">
      <div className="flex items-baseline gap-5 mb-10">
        <EditorialNumeral n="11" size={64} tone="gold" />
        <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(13,17,23,0.6)" }}>
          The Podcast
        </p>
      </div>
      <h2
        className="font-display scroll-reveal"
        style={{
          color: "#0D1117",
          fontSize: "clamp(36px, 4.4vw, 56px)",
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          fontWeight: 500,
          maxWidth: 800,
        }}
      >
        <span className="editorial-italic" style={{ color: "#B8933A" }}>
          Signal Activated
        </span>{" "}
        Growth.
      </h2>
      <p className="font-display scroll-reveal mt-3" style={{ color: "#8B7F3F", fontSize: 22, fontWeight: 500 }}>
        Season 6, Episode 1 — out now.
      </p>

      <div
        className="mt-14 scroll-reveal grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(13,17,23,0.10)",
          padding: 36,
        }}
      >
        <a
          href="https://www.youtube.com/@SignalActivatedGrowth"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Play episode"
          className="relative group block flex-shrink-0"
          style={{ width: 132, height: 132 }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full transition-opacity duration-300"
            style={{
              border: "1.5px solid #B8933A",
              boxShadow: "0 0 36px rgba(184,147,58,0.22)",
              animation: "goldEmber 4s ease-in-out infinite",
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              inset: 8,
              background: "linear-gradient(180deg, #1A1714 0%, #08070a 100%)",
              border: "1px solid rgba(184,147,58,0.3)",
            }}
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <polygon points="11,8 25,16 11,24" fill="#D4AE48" />
            </svg>
          </span>
        </a>

        <div>
          <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(13,17,23,0.5)" }}>
            S6 · E1 · 47 min
          </p>
          <h3
            className="font-display mt-2"
            style={{ color: "#0D1117", fontSize: 28, lineHeight: 1.15, fontWeight: 500, letterSpacing: "-0.018em" }}
          >
            What 500 interviews taught us about why PS firms can't scale GTM.
          </h3>
          <p
            className="font-sans mt-4"
            style={{ color: "rgba(26,24,20,0.78)", fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}
          >
            Adam and Richard open the season with the thesis behind the book — why the relationship is the asset, why the Dead Zone exists, and what it takes to reach response, not pitch.
          </p>

          <div className="mt-7">
            <Waveform height={64} />
          </div>

          <a
            href="https://www.youtube.com/@SignalActivatedGrowth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono uppercase mt-6"
            style={{ fontSize: 11, letterSpacing: "0.22em", color: "#0D1117" }}
          >
            Listen now →
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 12 · TWO PATHS
   ───────────────────────────────────────────── */
const SectionTwoPaths = () => {
  const paths = [
    {
      roman: "I",
      eyebrow: "Path 01",
      title: "Read the manuscript.",
      desc: "Free. Apply to the Beta Reader Program. Read the book before publication. 60-minute debrief with Adam and Richard. Acknowledged by name at launch.",
      cta: "Apply to Read",
      href: "#beta-reader",
    },
    {
      roman: "II",
      eyebrow: "Path 02",
      title: "Build your firm's MAP.",
      desc: "10 minutes. Score your firm across the Five Orbits. Surface your Dead Zone exposure. Get a sequenced roadmap before you read a word of the book.",
      cta: "Build Your MAP",
      href: "/map",
    },
  ];

  return (
    <section id="two-paths" className="relative px-6 md:px-10 py-28 md:py-36 vellum">
      <PaperGrain opacity={0.018} blendMode="multiply" />
      <div className="relative max-w-[1180px] mx-auto stagger-children">
        <div className="flex items-baseline gap-5 mb-10 justify-center">
          <EditorialNumeral n="12" size={88} tone="ink" />
          <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8B7F3F" }}>
            Two Paths
          </p>
        </div>

        <h2
          className="font-display text-center scroll-reveal mx-auto"
          style={{
            color: "#2D2A26",
            fontSize: "clamp(36px, 4.4vw, 56px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            maxWidth: 760,
          }}
        >
          Pick the one that matches{" "}
          <span className="editorial-italic" style={{ color: "#B8933A" }}>
            where you are.
          </span>
        </h2>

        <HairlineRule variant="ink" className="my-12 scroll-reveal mx-auto" style={{ maxWidth: 200 }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Connector "or" — desktop only */}
          <div
            aria-hidden
            className="hidden md:flex items-center justify-center absolute"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}
          >
            <span
              className="font-display px-3"
              style={{
                fontSize: 18,
                color: "#8B7F3F",
                background: "#FBF8F4",
                fontWeight: 500,
              }}
            >
              or
            </span>
          </div>

          {paths.map((p) => (
            <div
              key={p.roman}
              className="relative scroll-reveal group transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid #DDD5CC",
                padding: "44px 36px",
                minHeight: 380,
                boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "#B8933A";
                e.currentTarget.style.boxShadow = "0 24px 56px -16px rgba(184,147,58,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#DDD5CC";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.05)";
              }}
            >
              {/* Roman numeral upper-right */}
              <span
                className="font-display absolute select-none pointer-events-none"
                style={{
                  top: 24,
                  right: 28,
                  fontSize: 64,
                  lineHeight: 0.9,
                  color: "rgba(184,147,58,0.32)",
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                }}
              >
                {p.roman}
              </span>

              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#B8933A" }}>
                {p.eyebrow}
              </p>
              <h3
                className="font-display mt-5"
                style={{ color: "#2D2A26", fontSize: 36, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.022em", maxWidth: 320 }}
              >
                {p.title}
              </h3>
              <HairlineRule variant="ink" className="my-6" style={{ width: 36 }} />
              <p className="font-sans" style={{ color: "#6B6560", fontSize: 15, lineHeight: 1.7 }}>
                {p.desc}
              </p>

              <a
                href={p.href}
                className="inline-flex items-center font-sans font-semibold mt-8"
                style={{
                  color: "#B8933A",
                  fontSize: 14,
                  borderBottom: "1px solid #B8933A",
                  paddingBottom: 4,
                }}
              >
                {p.cta} →
              </a>

              {/* Hover corner bracket */}
              <span
                aria-hidden
                className="absolute pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  bottom: 16,
                  right: 16,
                  width: 18,
                  height: 18,
                  borderBottom: "1px solid #B8933A",
                  borderRight: "1px solid #B8933A",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 13 · FAQ
   ───────────────────────────────────────────── */
const faqs = [
  { q: "Who is the Beta Reader Program for?", a: "Managing partners, CMOs, and heads of business development at professional services firms between $5M and $100M in revenue. We are not a fit for SaaS, in-house corporate marketers, or firms outside that range." },
  { q: "What does a beta reader actually do?", a: "Read the manuscript. Submit feedback through a structured form. Sit for a 60-minute debrief with Adam and Richard. Be acknowledged by name in the published book." },
  { q: "How much does it cost?", a: "Nothing. The program is free for selected firms. We are not selling a service through this funnel." },
  { q: "When does the book publish?", a: "Q4 2026. Manuscript closes for beta reader feedback in Q3 2026." },
  { q: "What is the difference between the Beta Reader Program and Build Your MAP?", a: "The Beta Reader Program puts the manuscript in your hands. Build Your MAP is a 10-minute self-scored diagnostic of your firm's GTM. You can do both." },
  { q: "Can my partner or colleague also apply?", a: "Yes. Each beta reader is selected individually. Multiple people from the same firm are welcome to apply." },
];

const FaqItem = ({ q, a, n }: { q: string; a: string; n: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        style={{
          height: open ? 1.5 : 1,
          background: "rgba(13,17,23,0.14)",
          transition: "height 300ms ease",
        }}
      />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-baseline gap-6 text-left transition-colors py-7"
      >
        <span
          className="font-display flex-shrink-0"
          style={{ color: "#B8933A", fontSize: 20, fontWeight: 500, width: 36 }}
        >
          {n}.
        </span>
        <span
          className="font-display flex-1"
          style={{
            color: "#0D1117",
            fontSize: 19,
            lineHeight: 1.4,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "rgba(13,17,23,0.6)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 300ms ease",
            flexShrink: 0,
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 320 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 350ms ease, opacity 280ms ease",
          overflow: "hidden",
        }}
      >
        <p
          className="font-sans"
          style={{
            color: "rgba(26,24,20,0.78)",
            fontSize: 16,
            lineHeight: 1.75,
            paddingLeft: 60,
            paddingBottom: 28,
            paddingRight: 36,
            maxWidth: 760,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
};

const SectionFaq = () => (
  <section id="faq" className="relative px-6 md:px-10 py-28 md:py-36 vellum">
    <PaperGrain opacity={0.018} blendMode="multiply" />
    <div className="relative max-w-[920px] mx-auto stagger-children">
      <div className="flex items-baseline gap-5 mb-10">
        <EditorialNumeral n="13" size={64} tone="gold" />
        <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(13,17,23,0.6)" }}>
          Questions
        </p>
      </div>
      <h2
        className="font-display scroll-reveal"
        style={{
          color: "#0D1117",
          fontSize: "clamp(36px, 4.4vw, 56px)",
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          fontWeight: 500,
        }}
      >
        Questions,{" "}
        <span className="editorial-italic" style={{ color: "#B8933A" }}>
          answered.
        </span>
      </h2>

      <div className="mt-12">
        {faqs.map((f, i) => (
          <FaqItem key={f.q} q={f.q} a={f.a} n={String(i + 1).padStart(2, "0")} />
        ))}
        <div style={{ height: 1, background: "rgba(13,17,23,0.12)" }} />
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 14 · FINAL CTA
   ───────────────────────────────────────────── */
const SectionFinalCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="final"
      className="relative px-6 md:px-10 py-28 md:py-36"
      style={{ background: "#0A0807" }}
    >
      <PaperGrain opacity={0.025} />
      {/* Top double-rule */}
      <div
        aria-hidden
        className="absolute left-0 right-0"
        style={{ top: 0, height: 5, borderTop: "1px solid rgba(184,147,58,0.5)", borderBottom: "1px solid rgba(184,147,58,0.5)" }}
      />
      {/* Bottom double-rule */}
      <div
        aria-hidden
        className="absolute left-0 right-0"
        style={{ bottom: 0, height: 5, borderTop: "1px solid rgba(184,147,58,0.5)", borderBottom: "1px solid rgba(184,147,58,0.5)" }}
      />
      <div className="relative max-w-[920px] mx-auto stagger-children text-center">
        <div className="flex items-baseline gap-5 mb-10 justify-center">
          <EditorialNumeral n="14" size={64} tone="gold" />
          <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "#B8933A" }}>
            Final Word
          </p>
        </div>

        <h2
          className="font-display scroll-reveal mx-auto"
          style={{
            color: "#F5F1E8",
            fontSize: "clamp(40px, 5vw, 68px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            fontWeight: 500,
            maxWidth: 880,
          }}
        >
          The revenue your firm needs is in the relationships{" "}
          <span className="editorial-italic" style={{ color: "#D4AE48" }}>
            you already earned.
          </span>
        </h2>

        <p
          className="font-display scroll-reveal mt-7 mx-auto"
          style={{ color: "rgba(245,241,232,0.7)", fontSize: 21, lineHeight: 1.55, maxWidth: 600, fontWeight: 500 }}
        >
          Apply to read the manuscript. Or get one essay a week from the Library.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-7 mt-12 scroll-reveal">
          <a
            href="#beta-reader"
            className="inline-flex items-center justify-center font-sans font-semibold rounded-full transition-all duration-300 gold-ember"
            style={{
              background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
              color: "#0D1117",
              padding: "16px 40px",
              fontSize: 15,
              letterSpacing: "0.01em",
            }}
          >
            Apply to Read
          </a>
        </div>

        {/* Library subscription card */}
        <div
          className="mt-20 mx-auto scroll-reveal text-left"
          style={{
            background: "rgba(245,241,232,0.04)",
            border: "1px solid rgba(184,147,58,0.22)",
            maxWidth: 600,
            padding: 36,
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#D4AE48" }}>
              The Library
            </p>
            <span className="font-display" style={{ fontSize: 13, color: "rgba(245,241,232,0.55)" }}>
              free · weekly
            </span>
          </div>
          <h3
            className="font-display"
            style={{ color: "#F5F1E8", fontSize: 28, lineHeight: 1.1, fontWeight: 500, letterSpacing: "-0.02em" }}
          >
            One essay. Once a week.{" "}
            <span className="editorial-italic" style={{ color: "#D4AE48" }}>
              No pitch.
            </span>
          </h3>
          <HairlineRule className="my-6" style={{ maxWidth: 80 }} />

          {submitted ? (
            <p className="font-display" style={{ color: "#D4AE48", fontSize: 18 }}>
              You're in. Welcome to the Library.
            </p>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <label
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(245,241,232,0.55)" }}
              >
                Email Address
              </label>
              <div
                className="flex items-baseline pb-3"
                style={{ borderBottom: "1px solid rgba(184,147,58,0.7)" }}
              >
                <input
                  type="email"
                  required
                  placeholder="you@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-display flex-1 outline-none bg-transparent"
                  style={{
                    color: "#F5F1E8",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                />
                <button
                  type="submit"
                  className="font-sans font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
                    color: "#0D1117",
                    padding: "10px 22px",
                    fontSize: 13,
                    letterSpacing: "0.01em",
                  }}
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STICKY BOTTOM CTA
   ───────────────────────────────────────────── */
const StickyCTA = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] flex flex-col items-stretch pointer-events-none"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="pointer-events-auto">
        <ScrollProgressRail />
      </div>
      <div className="flex justify-center pointer-events-none" style={{ padding: "12px 16px 16px 16px" }}>
        <div
          className="pointer-events-auto rounded-full flex items-center gap-4 px-5 py-3 gold-ember-half"
          style={{
            background: "rgba(8,7,7,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(184,147,58,0.45)",
          }}
        >
          <span
            className="font-mono hidden sm:inline"
            style={{
              color: "rgba(245,241,232,0.85)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            70 of 100 spots remain
          </span>
          <span className="hidden sm:inline" style={{ color: "rgba(184,147,58,0.4)", fontSize: 12 }}>
            ·
          </span>
          <a
            href="#beta-reader"
            className="font-sans font-semibold rounded-full transition-all"
            style={{
              background: "linear-gradient(135deg, #B8933A 0%, #D4AE48 100%)",
              color: "#0D1117",
              padding: "8px 22px",
              fontSize: 13,
              letterSpacing: "0.01em",
            }}
          >
            Apply to Read
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */
const Discover = () => {
  useScrollReveal();

  const railItems = [
    { id: "hero", label: "01 · Hero" },
    { id: "authority", label: "02 · Built By" },
    { id: "dead-zone", label: "03 · Dead Zone" },
    { id: "promised-land", label: "04 · The System" },
    { id: "why-now", label: "05 · Why Now" },
    { id: "beta-reader", label: "06 · Apply" },
    { id: "authors", label: "07 · Authors" },
    { id: "results", label: "08 · Results" },
    { id: "map", label: "09 · MAP" },
    { id: "book", label: "10 · Book" },
    { id: "podcast", label: "11 · Podcast" },
    { id: "two-paths", label: "12 · Paths" },
    { id: "faq", label: "13 · FAQ" },
    { id: "final", label: "14 · Final" },
  ];

  return (
    <>
      <TopNav />
      <SectionRail items={railItems} />
      <main>
        <SectionHero />
        <SectionAuthority />
        <SectionDeadZone />
        <SectionPromisedLand />
        <SectionWhyNow />
        <SectionBetaReader />
        <SectionAuthors />
        <SectionResults />
        <SectionMap />
        <SectionBook />
        <SectionPodcast />
        <SectionTwoPaths />
        <SectionFaq />
        <SectionFinalCTA />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
};

export default Discover;
