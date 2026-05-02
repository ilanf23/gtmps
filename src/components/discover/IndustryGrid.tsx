import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NAV_VERTICAL_LINKS } from '@/content/verticals';
import { INDUSTRY_ICONS } from '@/content/industryIcons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CarouselCard = {
  slug: string;
  eyebrow: string;
  archetype: string;
  bullets: string[];
};

// Tight, carousel-sized copy per vertical. Hand-written for the carousel —
// pain.cards in verticals.ts are too long for a card-sized read.
const CARD_COPY: Record<string, { archetype: string; bullets: string[] }> = {
  consulting: {
    archetype: 'For partner-led practices selling six- to seven-figure engagements.',
    bullets: [
      'Surface dormant accounts and stalled proposals',
      'Cut partner BD time without losing origination credit',
      'Benchmark practice growth against peer firms',
    ],
  },
  law: {
    archetype: 'For midmarket and AmLaw firms where origination is partner-owned.',
    bullets: [
      'Reactivate former clients before competitors do',
      'Retain lateral books past the 24-month decay curve',
      'Cross-sell across practice groups on signal',
    ],
  },
  accounting: {
    archetype: 'For tax and advisory firms expanding beyond compliance work.',
    bullets: [
      'Convert tax-only relationships into advisory engagements',
      'Catch lapsed clients before PE rollups poach them',
      'Trigger outreach on M&A, leadership, regulatory shifts',
    ],
  },
  msp: {
    archetype: 'For MSPs and IT services firms protecting renewals and expansion.',
    bullets: [
      'Detect churn signals before the renewal conversation',
      'Re-engage former champions in their new roles',
      'Convert one-off projects into managed services',
    ],
  },
};

export default function IndustryGrid() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);

  const cards: CarouselCard[] = useMemo(() => {
    return NAV_VERTICAL_LINKS.slice(0, 4).map((v) => {
      const copy = CARD_COPY[v.slug] ?? {
        archetype: 'A relationship-driven practice.',
        bullets: ['Surface dormant relationships', 'Trigger outreach on real signal', 'Benchmark against peers'],
      };
      return {
        slug: v.slug,
        eyebrow: v.label,
        archetype: copy.archetype,
        bullets: copy.bullets,
      };
    });
  }, []);

  const total = cards.length;
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    },
    [next, prev],
  );

  // Keep keyboard focus visually parked on the active card area
  useEffect(() => {
    // no-op; here in case we later wire focus management
  }, [active]);

  const transition = reduced ? 'none' : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <>
      <style>{`
        .ig-root {
          width: 100%;
          background: #FBF8F4;
          border-top: 1px solid rgba(213, 222, 212, 0.6);
          padding: 96px 24px;
        }
        @media (min-width: 768px) {
          .ig-root { padding: 112px 40px; }
        }
        .ig-inner {
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }
        .ig-header {
          max-width: 760px;
          margin: 0 auto 56px;
        }
        .ig-eyebrow {
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0 0 20px;
          font-weight: 500;
        }
        .ig-h2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 500;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #0F1E1D;
          margin: 0 0 18px;
        }
        .ig-sub {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(16px, 1.4vw, 19px);
          color: rgba(15, 30, 29, 0.66);
          line-height: 1.55;
          margin: 0;
          font-weight: 400;
        }

        .ig-stage {
          position: relative;
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 12px;
        }
        .ig-arrow {
          flex-shrink: 0;
          align-self: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(15, 30, 29, 0.14);
          background: #FFFFFF;
          color: #0F1E1D;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 180ms ease, border-color 180ms ease, transform 180ms ease;
          z-index: 3;
        }
        .ig-arrow:hover {
          color: #BF461A;
          border-color: #BF461A;
          transform: translateY(-1px);
        }
        .ig-arrow:focus-visible {
          outline: 2px solid #A8923A;
          outline-offset: 3px;
        }

        .ig-track {
          position: relative;
          flex: 1;
          min-height: 360px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .ig-track { min-height: 340px; }
        }

        .ig-card {
          position: absolute;
          top: 0;
          left: 50%;
          width: min(100%, 520px);
          padding: 36px 32px;
          background: #FFFFFF;
          border: 1px solid #D5DEC2;
          border-radius: 6px;
          box-shadow: 0 8px 32px -12px rgba(15, 30, 29, 0.10);
          color: #0F1E1D;
          text-decoration: none;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .ig-card { padding: 40px 36px; }
        }

        .ig-card-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #EDF5EC;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #225351;
        }
        .ig-card-eyebrow {
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.5);
          margin: 0;
          font-weight: 500;
        }
        .ig-card-headline {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(22px, 2.2vw, 26px);
          font-weight: 500;
          line-height: 1.22;
          letter-spacing: -0.015em;
          color: #0F1E1D;
          margin: 0;
        }
        .ig-card-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ig-card-bullet {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          color: rgba(15, 30, 29, 0.66);
          line-height: 1.5;
          padding-left: 16px;
          position: relative;
        }
        .ig-card-bullet::before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #BF461A;
        }
        .ig-card-cta {
          margin-top: 4px;
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #A8923A;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ig-card-cta-dot { color: #BF461A; }

        .ig-card.is-active {
          z-index: 2;
        }
        .ig-card.is-active:hover {
          transform: translate(-50%, -2px) scale(1);
        }
        .ig-card.is-peek {
          z-index: 1;
          pointer-events: none;
        }

        .ig-dots {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .ig-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(15, 30, 29, 0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 180ms ease, transform 180ms ease;
        }
        .ig-dot:hover { background: rgba(15, 30, 29, 0.35); }
        .ig-dot.is-active { background: #A8923A; transform: scale(1.2); }
        .ig-dot:focus-visible { outline: 2px solid #A8923A; outline-offset: 3px; }

        .ig-foot {
          margin-top: 20px;
          font-family: 'DM Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.5);
        }
        .ig-foot-period { color: #BF461A; }

        /* Hide peek cards on mobile for clarity */
        @media (max-width: 767px) {
          .ig-card.is-peek { display: none; }
        }
      `}</style>

      <section id="industries" className="ig-root">
        <div className="ig-inner">
          <div className="ig-header">
            <p className="ig-eyebrow">07 · The Verticals</p>
            <h2 className="ig-h2">Built for relationship-driven firms.</h2>
            <p className="ig-sub">
              One operating system. Four flavors of practice. The same recurring revenue posture.
            </p>
          </div>

          <div
            className="ig-stage"
            role="region"
            aria-roledescription="carousel"
            aria-label="Industries we serve"
            tabIndex={0}
            onKeyDown={onKeyDown}
            ref={regionRef}
          >
            <button
              type="button"
              className="ig-arrow"
              aria-label="Previous industry"
              onClick={prev}
            >
              <ChevronLeft size={20} strokeWidth={1.6} />
            </button>

            <div className="ig-track">
              {cards.map((card, idx) => {
                const Icon = INDUSTRY_ICONS[card.slug as keyof typeof INDUSTRY_ICONS];
                const isActive = idx === active;
                const isPrev = idx === (active - 1 + total) % total;
                const isNext = idx === (active + 1) % total;
                const isPeek = isPrev || isNext;
                const isHidden = !isActive && !isPeek;

                let transform = 'translate(-50%, 0) scale(0.92)';
                let opacity = 0;
                if (isActive) {
                  transform = 'translate(-50%, 0) scale(1)';
                  opacity = 1;
                } else if (isPrev) {
                  transform = 'translate(calc(-50% - 320px), 0) scale(0.92)';
                  opacity = 0.4;
                } else if (isNext) {
                  transform = 'translate(calc(-50% + 320px), 0) scale(0.92)';
                  opacity = 0.4;
                }

                return (
                  <Link
                    key={card.slug}
                    to={`/${card.slug}`}
                    className={`ig-card ${isActive ? 'is-active' : ''} ${isPeek ? 'is-peek' : ''}`}
                    style={{
                      transform,
                      opacity,
                      transition,
                      visibility: isHidden ? 'hidden' : 'visible',
                    }}
                    aria-hidden={!isActive}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span className="ig-card-icon-wrap" aria-hidden>
                      <Icon size={24} strokeWidth={1.6} />
                    </span>
                    <p className="ig-card-eyebrow">{card.eyebrow}</p>
                    <h3 className="ig-card-headline">{card.archetype}</h3>
                    <ul className="ig-card-bullets">
                      {card.bullets.map((b) => (
                        <li key={b} className="ig-card-bullet">{b}</li>
                      ))}
                    </ul>
                    <span className="ig-card-cta">
                      Read the full thesis
                      <span className="ig-card-cta-dot">.</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              className="ig-arrow"
              aria-label="Next industry"
              onClick={next}
            >
              <ChevronRight size={20} strokeWidth={1.6} />
            </button>
          </div>

          <div className="ig-dots" role="tablist" aria-label="Industry selector">
            {cards.map((card, idx) => (
              <button
                key={card.slug}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-label={`Show ${card.eyebrow}`}
                className={`ig-dot ${idx === active ? 'is-active' : ''}`}
                onClick={() => setActive(idx)}
              />
            ))}
          </div>

          <p className="ig-foot">
            Click an industry to see the full thesis<span className="ig-foot-period">.</span>
          </p>
        </div>
      </section>
    </>
  );
}
