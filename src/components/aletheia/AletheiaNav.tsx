import { useEffect, useState } from "react";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";

const AletheiaNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(11,26,46,0.92)" : "rgba(11,26,46,0)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? `1px solid ${GOLD}33` : "1px solid transparent",
        transition: "all 300ms ease-out",
        color: OFFWHITE,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <a
          href="https://mabbly.com"
          className="text-xs tracking-[0.32em] font-semibold"
          style={{ color: OFFWHITE, fontFamily: "'Inter Tight', sans-serif" }}
        >
          MABBLY
        </a>
        <div
          className="hidden md:block text-xs tracking-[0.28em]"
          style={{ color: OFFWHITE, opacity: 0.7, fontFamily: "'Inter Tight', sans-serif" }}
        >
          ALETHEIA · MAP · APRIL 2026
        </div>
        <a
          href="https://calendly.com/richard-mabbly"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.18em] font-semibold px-4 py-2 border transition-colors"
          style={{
            color: NAVY,
            backgroundColor: GOLD,
            borderColor: GOLD,
            fontFamily: "'Inter Tight', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = GOLD;
            (e.currentTarget as HTMLAnchorElement).style.color = NAVY;
          }}
        >
          BOOK WORKING SESSION
        </a>
      </div>
    </nav>
  );
};

export default AletheiaNav;
