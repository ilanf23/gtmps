import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Mission", href: "#mission" },
  { label: "Episode", href: "#episode" },
  { label: "Book", href: "#book" },
  { label: "Authors", href: "#authors" },
  { label: "Research", href: "#deeper" },
];

const StickyNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10"
        style={{
          background: "rgba(13,17,23,0.92)",
          backdropFilter: "blur(16px)",
          height: 56,
        }}
      >
        <a
          href="https://mabbly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-bold tracking-tight text-white"
          style={{ fontSize: 20 }}
        >
          mabbly
        </a>

        <div
          className="hidden lg:flex items-center gap-1 rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "4px 6px",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-sm px-4 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#apply"
          className="hidden lg:inline-flex font-sans font-semibold rounded-full transition-all duration-200 text-white border border-white/25 hover:bg-white hover:text-ink"
          style={{ fontSize: 13, padding: "8px 24px" }}
        >
          Apply Now
        </a>

        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
          style={{
            background: "rgba(13,17,23,0.97)",
            backdropFilter: "blur(20px)",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="font-display font-bold text-white text-2xl transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#apply"
            onClick={() => setMobileOpen(false)}
            className="font-sans font-semibold text-ink bg-gold rounded-full mt-4 px-8 py-3 text-base"
          >
            Apply Now
          </a>
        </div>
      )}
    </>
  );
};

export default StickyNav;
