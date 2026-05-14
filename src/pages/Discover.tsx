import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHero } from "@/lib/scrollToHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import PaperGrain from "@/components/discover/PaperGrain";
import ScrollProgressRail from "@/components/discover/ScrollProgressRail";
import SectionRail from "@/components/discover/SectionRail";
import DiscoverHero from '@/components/discover/DiscoverHero';
import IndustryGrid from '@/components/discover/IndustryGrid';
import bookCoverGm from '@/assets/book-cover-gm.png';

// Below-the-fold sections. Lazy-loaded so they do not bloat the initial
// homepage bundle. Each becomes its own small chunk fetched as the user
// scrolls (React.lazy mounts on first render of the element). Suspense
// fallback below preserves layout height to prevent CLS jumps.
const AuthorityStrip = lazy(() => import("@/components/discover/AuthorityStrip"));
const FloatingHeroVideo = lazy(() => import("@/components/discover/FloatingHeroVideo"));
const DeadZone = lazy(() => import("@/components/discover/DeadZone"));
const WhyNow = lazy(() => import("@/components/discover/WhyNow"));
const BetaReader = lazy(() => import("@/components/discover/BetaReader"));
const Results = lazy(() => import("@/components/discover/Results"));
const TheDecision = lazy(() => import("@/components/discover/TheDecision"));
const Faq = lazy(() => import("@/components/discover/Faq"));

/* Always-visible scroll progress rail at the bottom of the viewport. */
const BottomProgressRail = () => (
  <div className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-none">
    <div className="pointer-events-auto">
      <ScrollProgressRail />
    </div>
  </div>
);

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
    { id: "the-book", label: "03 · The Book" },
    { id: "authority", label: "04 · Authors" },
    { id: "dead-zone", label: "05 · Dead Zone" },
    { id: "why-now", label: "06 · Why Now" },
    { id: "beta-reader", label: "07 · Early Access" },
    { id: "results", label: "08 · Proof" },
    { id: "decision", label: "09 · Decision" },
    { id: "faq", label: "10 · FAQ" },
  ];

  return (
    <>
      <SkipLink />
      <VerticalNavBar
        forYourFirmHref="#industries"
        addYourFirmHref="#hero"
        addYourFirmLabel="Add Your Firm"
        onAddYourFirm={() => scrollToHero()}
      />
      <SectionRail items={railItems} />
      <main>
        <div id="hero">
          <DiscoverHero />
        </div>
        <IndustryGrid />
        <section id="the-book" style={{ background: "#0F1E1D", padding: "96px 24px" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
              gap: 64,
              alignItems: "center",
              border: "1px solid rgba(15, 30, 29, 0.08)",
              borderRadius: 16,
              padding: "48px 52px",
              background: "#FBF8F4",
              boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)",
            }}
            className="discover-book-intro"
          >
            <div>
              <img
                src={bookCoverGm}
                alt="The Relationship Revenue OS, book cover"
                width={840}
                height={1260}
                loading="lazy"
                decoding="async"
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
                  color: "#0F1E1D",
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
                  color: "rgba(15, 30, 29, 0.78)",
                  margin: "0 0 16px",
                }}
              >
                The Relationship Revenue OS is a field manual for professional services firms, a translation of how 30 cohort firms across 8 verticals turned reputation, relationships, and bench expertise into a repeatable revenue engine.
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Sans', system-ui, sans-serif",
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(15, 30, 29, 0.55)",
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
        <Suspense fallback={<div style={{ minHeight: 400 }} aria-hidden />}>
          <BetaReader />
          <AuthorityStrip />
          <DeadZone />
          <WhyNow />
          <Results />
          <TheDecision />
          <Faq />
        </Suspense>
      </main>
      <Footer />
      <BottomProgressRail />
      <Suspense fallback={null}>
        <FloatingHeroVideo />
      </Suspense>
    </>
  );
};

export default Discover;
