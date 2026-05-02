import { useEffect, useRef, useState } from "react";

interface Item {
  id: string;
  label: string;
}

/**
 * Vertical scroll-spy rail. Visible from 1024px up.
 * Active dot: filled gold 12px. Inactive: 8px outline.
 * Label appears as a tooltip on hover/focus only — never in normal flow.
 *
 * Visibility:
 *   - Hidden while the hero section (#hero) is in the viewport.
 *   - Hidden once the page footer ([data-page-footer="true"]) enters the viewport.
 *   - Visible only across the body sections in between.
 *   - Fades opacity 250ms; instant for prefers-reduced-motion.
 *   - Below 1024px the rail stays display:none regardless of state.
 */
const SectionRail = ({ items }: { items: Item[] }) => {
  const [active, setActive] = useState(items[0]?.id);
  const [visible, setVisible] = useState(false);

  // Track each gate independently so out-of-order observer callbacks can't
  // accidentally show the rail while either gate is still active.
  const heroInView = useRef(true);
  const footerInView = useRef(false);

  // Scroll-spy
  useEffect(() => {
    const els = items
      .map((i) => ({ id: i.id, el: document.getElementById(i.id) }))
      .filter((x): x is { id: string; el: HTMLElement } => Boolean(x.el));

    const obs = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.id) setActive(visibleEntry.target.id);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-30% 0px -50% 0px" }
    );

    els.forEach(({ el }) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  // Visibility gating: hide in hero and footer, show in body
  useEffect(() => {
    const recompute = () => {
      setVisible(!heroInView.current && !footerInView.current);
    };

    let heroObs: IntersectionObserver | null = null;
    let footerObs: IntersectionObserver | null = null;
    let rafId = 0;

    const attachHero = () => {
      // Accept either a literal `#hero` (Discover/About) OR the v10 microsite's
      // first section so the rail correctly stays hidden across both surfaces.
      const hero =
        document.getElementById("hero") ||
        document.querySelector('[data-v10-section="1"]');
      if (!hero) return;
      heroObs = new IntersectionObserver(
        ([entry]) => {
          heroInView.current = entry.isIntersecting;
          recompute();
        },
        { threshold: 0.5 }
      );
      heroObs.observe(hero);
    };

    const attachFooter = () => {
      // Page footer OR the v10 final Share+Save section (Section 11) — same
      // gating intent: hide the rail once the closing share UI is on-screen.
      const footer =
        document.querySelector('[data-page-footer="true"]') ||
        document.querySelector('[data-v10-section="11"]');
      if (!footer) {
        rafId = requestAnimationFrame(attachFooter);
        return;
      }
      footerObs = new IntersectionObserver(
        ([entry]) => {
          footerInView.current = entry.isIntersecting;
          recompute();
        },
        { threshold: 0.3 }
      );
      footerObs.observe(footer);
    };

    attachHero();
    attachFooter();

    return () => {
      cancelAnimationFrame(rafId);
      heroObs?.disconnect();
      footerObs?.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .sr-rail {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          left: 16px;
          z-index: 50;
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 24px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 250ms ease;
        }
        .sr-rail[data-visible="true"] {
          opacity: 1;
          pointer-events: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .sr-rail { transition: none; }
        }
        @media (min-width: 1024px) { .sr-rail { display: flex; } }
        @media (min-width: 1280px) { .sr-rail { left: 24px; } }

        .sr-connector {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(168, 146, 58,0.25), transparent);
          pointer-events: none;
        }

        .sr-dot {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          z-index: 1;
        }
        .sr-dot-mark {
          display: block;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          border: 1px solid rgba(168, 146, 58,0.45);
          background: transparent;
          transition: width 300ms ease, height 300ms ease, background 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
        }
        .sr-dot[data-active="true"] .sr-dot-mark {
          width: 12px;
          height: 12px;
          background: #A8923A;
          border-color: #A8923A;
          box-shadow: 0 0 12px rgba(168, 146, 58,0.5);
        }

        .sr-tooltip {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 30, 29,0.92);
          color: #A8923A;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 4px;
          max-width: 200px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 150ms ease;
          z-index: 100;
          box-shadow: 0 4px 12px -4px rgba(0,0,0,0.4);
        }
        .sr-dot:hover .sr-tooltip,
        .sr-dot:focus-visible .sr-tooltip,
        .sr-dot:focus .sr-tooltip {
          opacity: 1;
        }
      `}</style>

      <nav aria-label="Sections" className="sr-rail" data-visible={visible}>
        <div className="sr-connector" style={{ height: items.length * 28 }} aria-hidden />
        {items.map((i) => {
          const isActive = i.id === active;
          return (
            <a
              key={i.id}
              href={`#${i.id}`}
              aria-label={i.label}
              className="sr-dot"
              data-active={isActive}
            >
              <span className="sr-dot-mark" />
              <span className="sr-tooltip">{i.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
};

export default SectionRail;
