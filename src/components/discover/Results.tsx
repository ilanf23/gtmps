import { useEffect, useRef } from 'react';

type Stat = {
  target?: number;
  float?: number;
  prefix?: string;
  suffix?: string;
  display: string;
  label: string;
};

const STATS: Stat[] = [
  {
    prefix: '$',
    target: 400,
    suffix: 'K',
    display: '$400K',
    label: 'avg. new revenue per reactivated Dead Zone client',
  },
  {
    float: 8.1,
    suffix: '×',
    display: '8.1×',
    label: 'ROI on MAP implementation vs. cold outreach spend',
  },
  {
    target: 167,
    suffix: '%',
    display: '167%',
    label: 'increase in qualified opportunities within 90 days',
  },
  {
    target: 51,
    suffix: '%',
    display: '51%',
    label: 'reduction in sales cycle length at Orbits I–II',
  },
  {
    target: 288,
    suffix: '%',
    display: '288%',
    label: 'growth in referral pipeline after MAP activation',
  },
  {
    target: 100,
    suffix: '%',
    display: '100%',
    label: 'of beta cohort firms reported at least one closed deal within 90 days',
  },
];

function countUp(
  el: HTMLElement,
  target: number | null,
  floatTarget: number | null,
  prefix: string,
  suffix: string,
  duration: number,
) {
  const start = performance.now();
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  function tick(now: number) {
    const p = Math.min((now - start) / duration, 1);
    const e = easeOut(p);
    const display =
      floatTarget !== null
        ? (e * floatTarget).toFixed(1)
        : Math.round(e * (target ?? 0)).toString();
    el.textContent = prefix + display + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent =
        prefix + (floatTarget !== null ? floatTarget.toFixed(1) : String(target)) + suffix;
    }
  }

  el.textContent = prefix + (floatTarget !== null ? '0.0' : '0') + suffix;
  requestAnimationFrame(tick);
}

export default function Results() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nums = node.querySelectorAll<HTMLElement>('.rs-stat-num');
          nums.forEach((el, i) => {
            const target = el.dataset.target ? parseInt(el.dataset.target, 10) : null;
            const floatTarget = el.dataset.float ? parseFloat(el.dataset.float) : null;
            const prefix = el.dataset.prefix ?? '';
            const suffix = el.dataset.suffix ?? '';
            setTimeout(() => countUp(el, target, floatTarget, prefix, suffix, 700), i * 80);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="results"
      className="px-6 md:px-10"
      style={{
        background: '#120D05',
        borderTop: '1px solid rgba(184,147,58,0.1)',
        paddingTop: 144,
        paddingBottom: 144,
      }}
    >
      <style>{`
        .rs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          animation: fadeUp 0.8s ease 0.1s both;
        }
        @media (min-width: 640px) {
          .rs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .rs-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .rs-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(184,147,58,0.15);
          border-radius: 4px;
          padding: 40px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }
        .rs-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
          border-top: 2px solid rgba(184,147,58,0.55);
          border-left: 2px solid rgba(184,147,58,0.55);
        }
        .rs-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          border-bottom: 2px solid rgba(184,147,58,0.55);
          border-right: 2px solid rgba(184,147,58,0.55);
        }
        .rs-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(184,147,58,0.4);
          transform: translateY(-3px);
        }
        .rs-stat-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(56px, 6vw, 80px);
          font-weight: 600;
          color: #B8933A;
          line-height: 1;
          display: block;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
        }
        .rs-stat-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          color: rgba(245,239,224,0.55);
          line-height: 1.5;
          font-weight: 300;
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8933A',
            margin: 0,
            fontWeight: 500,
          }}
        >
          08 · PROOF
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: 'linear-gradient(90deg, #B8933A, rgba(184,147,58,0.3))',
            margin: '18px 0 28px',
            animation: 'growRule 0.8s ease both',
          }}
        />
        <h2
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(56px, 8vw, 104px)',
            fontWeight: 500,
            color: '#F5EFE0',
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            margin: '0 0 18px',
          }}
        >
          What happens when the system runs.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            color: 'rgba(245,239,224,0.5)',
            margin: '0 0 56px',
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          Across 9 PS firms, 14 engagements, $2.6B in tracked pipeline.
        </p>

        <div className="rs-grid">
          {STATS.map((s, i) => (
            <div key={i} className="rs-card">
              <span
                className="rs-stat-num"
                data-target={s.target ?? undefined}
                data-float={s.float ?? undefined}
                data-prefix={s.prefix ?? ''}
                data-suffix={s.suffix ?? ''}
              >
                {s.display}
              </span>
              <span className="rs-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
