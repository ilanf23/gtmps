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
import ReceiptsStrip from "@/components/discover/ReceiptsStrip";
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
import MapSection from '@/components/discover/MapSection';
import TwoPaths from '@/components/discover/TwoPaths';
import Faq from '@/components/discover/Faq';
import FinalCta from '@/components/discover/FinalCta';
import AdamNote from '@/components/discover/AdamNote';
import EarlyAccessReminder from '@/components/discover/EarlyAccessReminder';

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

  const railItems = [
    { id: "hero", label: "01 · Hero" },
    { id: "authority", label: "02 · Built By" },
    { id: "receipts", label: "03 · Receipts" },
    { id: "two-paths", label: "04 · After the Map" },
    { id: "dead-zone", label: "05 · Dead Zone" },
    { id: "map", label: "06 · GTM Score" },
    { id: "industries", label: "07 · Industries" },
    { id: "why-now", label: "08 · Why Now" },
    { id: "adam-note", label: "09 · Note" },
    { id: "results", label: "10 · Proof" },
    { id: "manuscript", label: "11 · Manuscript" },
    { id: "beta-reader", label: "12 · Early Access" },
    { id: "faq", label: "13 · FAQ" },
    { id: "final", label: "14 · Final" },
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
        <AuthorityStrip />
        <ReceiptsStrip />
        <TwoPaths />
        <DeadZone />
        <MapSection />
        <IndustryGrid />
        <WhyNow />
        <AdamNote />
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
