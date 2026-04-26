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
import AuthorityStrip from "@/components/discover/AuthorityStrip";
import DuotonePortrait from "@/components/discover/DuotonePortrait";
import Waveform from "@/components/discover/Waveform";
import FiveOrbitsDiagram from "@/components/discover/FiveOrbitsDiagram";
import ScrollProgressRail from "@/components/discover/ScrollProgressRail";
import SectionRail from "@/components/discover/SectionRail";
import DiscoverHero from '@/components/discover/DiscoverHero';
import DeadZone from '@/components/discover/DeadZone';
import WhyNow from '@/components/discover/WhyNow';
import BetaReader from '@/components/discover/BetaReader';
import Authors from '@/components/discover/Authors';
import Results from '@/components/discover/Results';
import MapSection from '@/components/discover/MapSection';
import TheBook from '@/components/discover/TheBook';
import ThePodcast from '@/components/discover/ThePodcast';
import TwoPaths from '@/components/discover/TwoPaths';
import Faq from '@/components/discover/Faq';
import FinalCta from '@/components/discover/FinalCta';

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
            Create Your GTM
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
        <DiscoverHero />
        <AuthorityStrip />
        <DeadZone />
        <SectionPromisedLand />
        <WhyNow />
        <BetaReader />
        <Authors />
        <Results />
        <MapSection />
        <TheBook />
        <ThePodcast />
        <TwoPaths />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
};

export default Discover;
