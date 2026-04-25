import { useEffect, useState } from "react";

interface Item {
  id: string;
  label: string;
}

/**
 * Vertical scroll-spy rail. Desktop-only (hidden under 1280px).
 * 12px dots, gold-filled when section is active. Hairline connector.
 */
const SectionRail = ({ items }: { items: Item[] }) => {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((i) => ({ id: i.id, el: document.getElementById(i.id) }))
      .filter((x): x is { id: string; el: HTMLElement } => Boolean(x.el));

    const obs = new IntersectionObserver(
      (entries) => {
        // Track all entries' ratios; pick the most-visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-30% 0px -50% 0px" }
    );

    els.forEach(({ el }) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Sections"
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-[80] flex-col items-center"
      style={{ gap: 14 }}
    >
      <div
        aria-hidden
        style={{
          width: 1,
          height: items.length * 28,
          background: "linear-gradient(to bottom, transparent, rgba(184,147,58,0.25), transparent)",
          position: "absolute",
          top: 6,
        }}
      />
      {items.map((i) => {
        const isActive = i.id === active;
        return (
          <a
            key={i.id}
            href={`#${i.id}`}
            aria-label={i.label}
            className="relative group block"
            style={{ width: 12, height: 12, zIndex: 1 }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `1px solid ${isActive ? "#B8933A" : "rgba(184,147,58,0.45)"}`,
                background: isActive ? "#B8933A" : "transparent",
                transition: "all 300ms ease",
                boxShadow: isActive ? "0 0 12px rgba(184,147,58,0.5)" : "none",
              }}
            />
            <span
              className="font-mono uppercase absolute whitespace-nowrap"
              style={{
                left: 22,
                top: -2,
                fontSize: 9,
                letterSpacing: "0.18em",
                color: isActive ? "#B8933A" : "rgba(184,147,58,0)",
                transition: "color 300ms ease",
                pointerEvents: "none",
              }}
            >
              {i.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export default SectionRail;
