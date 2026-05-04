import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHero } from "@/lib/scrollToHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useFooterVisible } from "@/hooks/useFooterVisible";
import { useInlineCtaVisible } from "@/hooks/useInlineCtaVisible";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import PaperGrain from "@/components/discover/PaperGrain";
import AuthorityStrip from "@/components/discover/AuthorityStrip";
import ScrollProgressRail from "@/components/discover/ScrollProgressRail";
import SectionRail from "@/components/discover/SectionRail";
import DiscoverHero from '@/components/discover/DiscoverHero';
import IndustryGrid from '@/components/discover/IndustryGrid';
import ManuscriptAnchor from '@/components/discover/ManuscriptAnchor';
import FloatingHeroVideo from '@/components/discover/FloatingHeroVideo';
import DeadZone from '@/components/discover/DeadZone';
import WhyNow from '@/components/discover/WhyNow';
import BetaReader from '@/components/discover/BetaReader';
import Results from '@/components/discover/Results';
import Faq from '@/components/discover/Faq';
import FinalCta from '@/components/discover/FinalCta';
import EarlyAccessReminder from '@/components/discover/EarlyAccessReminder';
import bookCoverGm from '@/assets/book-cover-gm.png';

const ADD_YOUR_FIRM_LABEL = "Build Your Map →";

const handleAddYourFirmClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  scrollToHero();
};

/* ─────────────────────────────────────────────
   STICKY BOTTOM CTA - restyled, lower visual weight
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
          href="#hero"
          onClick={handleAddYourFirmClick}
          className="pointer-events-auto rounded-full font-sans"
          style={{
            background: "rgba(251,248,244,0.96)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid #D5DEC2",
            color: "#0F1E1D",
            height: 56,
            padding: "0 28px",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            boxShadow: "0 8px 24px -12px rgba(15,30,29,0.18)",
            pointerEvents: show ? "auto" : "none",
            transition: "color 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
            maxWidth: "calc(100% - 16px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#0F1E1D";
            e.currentTarget.style.background = "linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%)";
            e.currentTarget.style.borderColor = "#A8923A";
            e.currentTarget.style.boxShadow = "0 10px 28px -10px rgba(168, 146, 58,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#0F1E1D";
            e.currentTarget.style.background = "rgba(251,248,244,0.96)";
            e.currentTarget.style.borderColor = "#D5DEC2";
            e.currentTarget.style.boxShadow = "0 8px 24px -12px rgba(15,30,29,0.18)";
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
  const location = useLocation();

  useEffect(() => {
    document.title = "Discover · GTM for Professional Services · Mabbly";
  }, []);

  useEffect(() => {
    if (location.hash === "#hero") {
      // Defer to next paint so the hero is mounted before we scroll/focus
      requestAnimationFrame(() => scrollToHero({ focus: true }));
    }
  }, [location.hash]);

  // When returning from a vertical landing (clicked from IndustryGrid), put
  // the user back where they left off. We defer with rAF so this fires AFTER
  // ScrollToTop's reset on PUSH navigations.
  useEffect(() => {
    if (location.hash) return;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem("discover:returnScroll");
    } catch {
      return;
    }
    if (!saved) return;
    const y = parseInt(saved, 10);
    try {
      sessionStorage.removeItem("discover:returnScroll");
    } catch {
      // ignore
    }
    if (!Number.isFinite(y) || y <= 0) return;
    const handle = requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0 });
    });
    return () => cancelAnimationFrame(handle);
  }, [location.pathname]);

  const railItems = [
    { id: "hero", label: "01 · Hero" },
    { id: "industries", label: "02 · Industries" },
    { id: "authority", label: "03 · Built By" },
    { id: "dead-zone", label: "04 · Dead Zone" },
    { id: "why-now", label: "08 · Why Now" },
    { id: "results", label: "09 · Proof" },
    { id: "manuscript", label: "10 · Manuscript" },
    { id: "beta-reader", label: "11 · Early Access" },
    { id: "faq", label: "12 · FAQ" },
    { id: "final", label: "13 · Final" },
  ];

  return (
    <>
      <VerticalNavBar
        forYourFirmHref="#industries"
        addYourFirmHref="#hero"
        addYourFirmLabel="Build Your Map"
        onAddYourFirm={() => scrollToHero()}
      />
      <SectionRail items={railItems} />
      <main style={{ paddingBottom: 120 }}>
        <div id="hero">
          <DiscoverHero />
        </div>
        <IndustryGrid />
        <section style={{ background: "#0F1E1D", padding: "96px 24px" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
              gap: 64,
              alignItems: "center",
            }}
            className="discover-book-intro"
          >
            <div>
              <img
                src={bookCoverGm}
                alt="The Relationship Revenue OS — book cover"
                style={{
                  width: "100%",
                  maxWidth: 420,
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  boxShadow: "0 30px 60px -20px rgba(15,30,29,0.25), 0 12px 24px -12px rgba(15,30,29,0.18)",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#B8933A",
                  margin: "0 0 16px",
                }}
              >
                The Book
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  lineHeight: 1.1,
                  color: "#EDF5EC",
                  margin: "0 0 24px",
                  fontWeight: 600,
                }}
              >
                The go-to-market system for firms that sell expertise,{" "}
                <em style={{ color: "#B8933A" }}>not products.</em>
              </h2>
              <p
                style={{
                  fontFamily: "'Instrument Sans', system-ui, sans-serif",
                  fontSize: 18,
                  lineHeight: 1.6,
                  color: "rgba(237, 245, 236, 0.78)",
                  margin: "0 0 16px",
                }}
              >
                The Relationship Revenue OS is a field manual for professional services firms — a translation of how 30 cohort firms across 8 verticals turned reputation, relationships, and bench expertise into a repeatable revenue engine.
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Sans', system-ui, sans-serif",
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(237, 245, 236, 0.55)",
                  margin: 0,
                }}
              >
                By Adam Fridman · Richard Ashbaugh
              </p>
            </div>
          </div>
          <style>{`
            @media (max-width: 900px) {
              .discover-book-intro {
                grid-template-columns: 1fr !important;
                gap: 40px !important;
              }
            }
          `}</style>
        </section>
        <AuthorityStrip />
        <DeadZone />
        <WhyNow />
        <Results />
        <ManuscriptAnchor />
        <BetaReader />
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
