import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { scrollToHero } from "@/lib/scrollToHero";
import { Menu, X, ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useFooterVisible } from "@/hooks/useFooterVisible";
import { useInlineCtaVisible } from "@/hooks/useInlineCtaVisible";
import { NAV_VERTICAL_LINKS } from "@/content/verticals";
import { INDUSTRY_ICONS } from "@/content/industryIcons";
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

const ADD_YOUR_FIRM_LABEL = "Add Your Firm →";

const handleAddYourFirmClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  scrollToHero();
};
const PODCAST_HREF = "https://www.youtube.com/@GTMforPS";

/* ─────────────────────────────────────────────
   TOP NAV
   ───────────────────────────────────────────── */
const navItems = [
  { label: "About", href: "/about", external: false, internal: true },
  { label: "Awards", href: "/awards", external: false, internal: true },
  { label: "Podcast", href: PODCAST_HREF, external: true },
];

// Section ids whose background reads as DARK — nav above them flips to a
// dark fill with sage text. Anything not listed reads as a light section.
const DARK_NAV_SECTION_IDS = new Set<string>([
  "hero",
  "authority",
  "dead-zone",
  "industries",
  "results",
]);

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"dark" | "light">("dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const NAV_PROBE_OFFSET = 32; // px from top — sample just below the nav
    const onScroll = () => {
      // Walk known sections; the one whose vertical range contains the probe
      // line wins. Default to dark (the page opens on the dark hero).
      let next: "dark" | "light" = "dark";
      const ids = [
        "hero", "authority", "receipts", "two-paths", "dead-zone",
        "map", "industries", "why-now", "adam-note",
        "results", "manuscript", "beta-reader",
        "faq", "final",
      ];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= NAV_PROBE_OFFSET && r.bottom > NAV_PROBE_OFFSET) {
          next = DARK_NAV_SECTION_IDS.has(id) ? "dark" : "light";
          break;
        }
      }
      setNavTheme((prev) => (prev === next ? prev : next));
    };
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

  const isDark = navTheme === "dark";
  // Always-visible nav: pick contrast colors based on the section behind it.
  const linkColor = isDark ? "rgba(237,245,236,0.78)" : "rgba(15,30,29,0.7)";
  const linkHover = isDark ? "#EDF5EC" : "#0F1E1D";
  const wordColor = isDark ? "#EDF5EC" : "#0F1E1D";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-500"
        style={{
          background: isDark ? "rgba(15,30,29,0.88)" : "rgba(251,248,244,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          height: 64,
          borderBottom: isDark
            ? "1px solid rgba(237,245,236,0.10)"
            : "1px solid rgba(15,30,29,0.08)",
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
                  background: "#FFFFFF",
                  border: "1px solid #D5DEC2",
                  borderRadius: 6,
                  padding: 8,
                  boxShadow: "0 16px 48px -12px rgba(15,30,29,0.18)",
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
                        color: "#0F1E1D",
                        textDecoration: "none",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#EDF5EC";
                        e.currentTarget.style.color = "#A8923A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#0F1E1D";
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
            href="#hero"
            onClick={handleAddYourFirmClick}
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
          style={{ color: isDark ? "#EDF5EC" : "#0F1E1D", transition: "color 500ms ease" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-start gap-4 overflow-y-auto"
          style={{ background: "rgba(251,248,244,0.97)", backdropFilter: "blur(20px)", padding: "88px 24px 40px" }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#A8923A",
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
                    color: "#0F1E1D",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(168, 146, 58,0.18)",
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
                style={{ color: "rgba(15,30,29,0.7)", marginTop: 12 }}
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
                style={{ color: "rgba(15,30,29,0.7)", marginTop: 12 }}
              >
                {n.label}
              </a>
            )
          )}
          <a
            href="#hero"
            onClick={(e) => {
              setOpen(false);
              handleAddYourFirmClick(e);
            }}
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
      <TopNav />
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
