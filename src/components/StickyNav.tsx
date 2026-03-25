const navItems = [
  { label: "The Mission", href: "#mission" },
  { label: "The Episode", href: "#episode" },
  { label: "The Book", href: "#book" },
  { label: "The Authors", href: "#authors" },
  { label: "Go Deeper", href: "#deeper" },
];

const StickyNav = () => {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between"
      style={{
        background: "#0D1117",
        height: 52,
        padding: "0 40px",
      }}
    >
      <a
        href="https://mabbly.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono uppercase tracking-[0.22em] text-gold"
        style={{ fontSize: 11 }}
      >
        MABBLY
      </a>

      <div className="hidden md:flex items-center" style={{ gap: 28 }}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-mono uppercase tracking-[0.16em] transition-colors duration-150"
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            {item.label}
          </a>
        ))}
      </div>

      <a
        href="#apply"
        className="font-mono uppercase tracking-[0.16em]"
        style={{
          fontSize: 9,
          background: "#B8933A",
          color: "#0D1117",
          padding: "8px 18px",
          borderRadius: 0,
          animation: "goldPulse 10s infinite",
        }}
      >
        APPLY NOW / 46 SPOTS LEFT
      </a>
    </nav>
  );
};

export default StickyNav;
