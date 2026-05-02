import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFooterVisible } from "@/hooks/useFooterVisible";
import { useInlineCtaVisible } from "@/hooks/useInlineCtaVisible";
import { NAV_VERTICAL_LINKS } from "@/content/verticals";
import { INDUSTRY_ICONS } from "@/content/industryIcons";
import Footer from "@/components/Footer";
import PaperGrain from "@/components/discover/PaperGrain";
import AuthorityStrip from "@/components/discover/AuthorityStrip";
import FiveOrbitsDiagram from "@/components/discover/FiveOrbitsDiagram";
import ScrollProgressRail from "@/components/discover/ScrollProgressRail";
import SectionRail from "@/components/discover/SectionRail";
import DiscoverHero from '@/components/discover/DiscoverHero';
import IndustryGrid from '@/components/discover/IndustryGrid';
import ManuscriptAnchor from '@/components/discover/ManuscriptAnchor';
import FloatingHeroVideo from '@/components/discover/FloatingHeroVideo';
import DeadZone from '@/components/discover/DeadZone';
import WhyNow from '@/components/discover/WhyNow';
import BetaReader from '@/components/discover/BetaReader';
import Authors from '@/components/discover/Authors';
import Results from '@/components/discover/Results';
import MapSection from '@/components/discover/MapSection';
import TwoPaths from '@/components/discover/TwoPaths';
import Faq from '@/components/discover/Faq';
import FinalCta from '@/components/discover/FinalCta';
import AdamNote from '@/components/discover/AdamNote';
import WarStory from '@/components/discover/WarStory';

const ADD_YOUR_FIRM_HREF = "/assess";
const ADD_YOUR_FIRM_LABEL = "Add Your Firm →";
const PODCAST_HREF = "https://www.youtube.com/@GTMforPS";

/* ─────────────────────────────────────────────
   TOP NAV
   ───────────────────────────────────────────── */
const navItems = [
  { label: "About", href: "/about", external: false, internal: true },
  { label: "Awards", href: "/awards", external: false, internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 120);
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

        <div className="hidden lg:flex items-center gap-7">
          {/* FOR YOUR FIRM dropdown */}
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
                      className="transition-colors"
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
                {...(n.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#B8933A",
              alignSelf: "stretch",
              textAlign: "left",
              maxWidth: 360,
              margin: "0 auto",
            }}
          >
            For Your Firm
          </p>
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
                {...(n.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
   THE RELATIONSHIP REVENUE OS (unnumbered system section)
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
        paddingTop: "clamp(56px, 11vw, 128px)",
        paddingBottom: "clamp(56px, 11vw, 128px)",
      }}
    >
      <div className="max-w-[1100px] mx-auto">
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
            Map every relationship you own. Start with the ones you know. From Signal to Response, not Pitch.
          </p>
        </div>

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
   STICKY BOTTOM CTA — restyled, lower visual weight
   ───────────────────────────────────────────── */
const StickyCTA = () => {
  const [scrolled, setScrolled] = useState(false);
  const footerVisible = useFooterVisible(0.05);
  const inlineVisible = useInlineCtaVisible(0.5);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = scrolled && !footerVisible && !inlineVisible;

  return (
    <>
      {/* Always-visible scroll progress rail at very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-none">
        <div className="pointer-events-auto">
          <ScrollProgressRail />
        </div>
      </div>

      {/* Floating pill */}
      <div
        className="fixed left-0 right-0 z-[90] flex justify-center pointer-events-none"
        style={{
          bottom: 24,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          padding: "0 16px",
        }}
      >
        <a
          href={ADD_YOUR_FIRM_HREF}
          className="pointer-events-auto rounded-full font-sans"
          style={{
            background: "rgba(28,16,8,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(184,147,58,0.3)",
            color: "#B8933A",
            height: 56,
            padding: "0 28px",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            boxShadow: "0 4px 16px -8px rgba(184,147,58,0.25)",
            pointerEvents: show ? "auto" : "none",
            transition: "color 200ms ease, background 200ms ease, box-shadow 200ms ease",
            maxWidth: "calc(100% - 16px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F5EFE0";
            e.currentTarget.style.background = "#B8933A";
            e.currentTarget.style.boxShadow = "0 6px 20px -6px rgba(184,147,58,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#B8933A";
            e.currentTarget.style.background = "rgba(28,16,8,0.92)";
            e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(184,147,58,0.25)";
          }}
        >
          {ADD_YOUR_FIRM_LABEL}
        </a>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   PAGE ROOT
   ───────────────────────────────────────────── */
const Discover = () => {
  useScrollReveal();

  useEffect(() => {
    document.title = "Discover · GTM for Professional Services · Mabbly";
  }, []);

  const railItems = [
    { id: "hero", label: "01 · Hero" },
    { id: "industries", label: "02 · Industries" },
    { id: "manuscript", label: "03 · Manuscript" },
    { id: "authority", label: "— · Built By" },
    { id: "dead-zone", label: "04 · Dead Zone" },
    { id: "adam-note", label: "— · Note" },
    { id: "promised-land", label: "— · The System" },
    { id: "why-now", label: "05 · Why Now" },
    { id: "beta-reader", label: "06 · Early Access" },
    { id: "authors", label: "07 · Authors" },
    { id: "results", label: "08 · Proof" },
    { id: "war-story", label: "09 · One Story" },
    { id: "map", label: "10 · GTM Score" },
    { id: "two-paths", label: "11 · Paths" },
    { id: "faq", label: "12 · FAQ" },
    { id: "final", label: "13 · Final" },
  ];

  return (
    <>
      <TopNav />
      <SectionRail items={railItems} />
      <main style={{ paddingBottom: 120 }}>
        <div id="hero">
          <DiscoverHero />
        </div>
        <IndustryGrid />
        <ManuscriptAnchor />
        <AuthorityStrip />
        <DeadZone />
        <AdamNote />
        <SectionPromisedLand />
        <WhyNow />
        <BetaReader />
        <Authors />
        <Results />
        <WarStory />
        <MapSection />
        <TwoPaths />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCTA />
      <FloatingHeroVideo />
    </>
  );
};

export default Discover;
