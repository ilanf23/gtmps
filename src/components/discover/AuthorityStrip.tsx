import { useEffect, useRef } from 'react';
import { Linkedin } from 'lucide-react';

type StatCard = {
  target?: number;
  float?: number;
  prefix?: string;
  suffix?: string;
  display: string;
  label: string;
};

const PRACTITIONER_STATS: StatCard[] = [
  { target: 26, display: '26', label: 'years across 9 professional services firms' },
  { target: 125, prefix: '$', suffix: 'M', display: '$125M', label: 'AArete revenue as CMO' },
  { float: 1.2, prefix: '$', suffix: 'B', display: '$1.2B', label: 'A.T. Kearney, scaled from $250M' },
];

const AUTHOR_STATS: StatCard[] = [
  { target: 500, display: '500', label: 'interviews, The Science of Story' },
  { target: 180, display: '180', label: 'podcast episodes on GTM for PS' },
  { target: 2, suffix: ' yrs', display: '2 yrs', label: 'Inc. columnist' },
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

export default function AuthorityStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nums = node.querySelectorAll<HTMLElement>('.as-stat-num');
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

  const renderStatCard = (stat: StatCard, key: string) => (
    <div key={key} className="as-stat">
      <span
        className="as-stat-num"
        data-target={stat.target ?? undefined}
        data-float={stat.float ?? undefined}
        data-prefix={stat.prefix ?? ''}
        data-suffix={stat.suffix ?? ''}
      >
        {stat.display}
      </span>
      <span className="as-stat-label">{stat.label}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes asFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes asGrowRule {
          from { width: 0; }
          to   { width: 28px; }
        }

        .as-root {
          width: 100%;
          background: #EDF5EC;
          border-top: 2px solid rgba(168, 146, 58, 0.22);
          padding: clamp(64px, 12vw, 144px) 24px;
        }
        @media (min-width: 768px) {
          .as-root { padding: 176px 40px; }
        }
        .as-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 1024px) {
          .as-inner {
            grid-template-columns: 44% 1fr 1fr;
            gap: 56px;
          }
        }

        .as-col-a { animation: asFadeUp 0.7s ease 0.1s both; }
        .as-col-b { animation: asFadeUp 0.7s ease 0.25s both; }
        .as-col-c { animation: asFadeUp 0.7s ease 0.35s both; }

        .as-eyebrow {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0;
          font-weight: 500;
        }

        .as-rule {
          width: 44px;
          height: 2px;
          background: linear-gradient(90deg, #A8923A, rgba(168, 146, 58, 0.3));
          margin: 18px 0 28px;
          animation: asGrowRule 0.8s ease both;
        }

        .as-quote-block {
          border-left: 4px solid #A8923A;
          padding-left: 24px;
          margin-bottom: 32px;
        }
        .as-quote-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 300;
          line-height: 1.45;
          color: #2A1A08;
          letter-spacing: -0.015em;
          margin: 0;
        }
        .as-attribution { margin-top: 32px; }
        .as-attr-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #2A1A08;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }
        .as-attr-line {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          color: #6A5038;
          letter-spacing: 0.04em;
          margin: 0;
          font-weight: 400;
        }
        .as-affil-logos {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .as-affil-mark {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.01em;
          color: rgba(168, 146, 58,0.6);
          text-transform: none;
        }
        .as-affil-mark--kellogg {
          font-style: italic;
          letter-spacing: 0.02em;
        }
        .as-affil-dot {
          color: rgba(168, 146, 58,0.45);
          font-size: 16px;
        }
        @media (max-width: 768px) {
          .as-affil-logos { gap: 14px; }
          .as-affil-mark { font-size: 22px; }
          .as-affil-dot { display: none; }
        }

        .as-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 26px;
          font-weight: 600;
          color: #2A1A08;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .as-role {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: #6A5038;
          letter-spacing: 0.05em;
          margin: 4px 0 22px;
          font-weight: 400;
        }
        .as-role-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 4px 0 22px;
          flex-wrap: wrap;
        }
        .as-role-row .as-role {
          margin: 0;
        }
        .as-li {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin: -14px 0 -14px -10px;
          color: #A8923A;
          border-radius: 4px;
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .as-li:hover {
          color: #C4AC4A;
          transform: scale(1.1);
        }
        .as-li:focus-visible {
          outline: 2px solid rgba(168, 146, 58,0.55);
          outline-offset: 2px;
        }

        .as-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .as-stat {
          position: relative;
          overflow: hidden;
          background: rgba(255, 250, 240, 0.8);
          border: 1px solid rgba(168, 146, 58, 0.18);
          border-radius: 4px;
          padding: 18px 20px;
          cursor: default;
          display: flex;
          align-items: center;
          gap: 18px;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }
        .as-stat::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 3px;
          background: #A8923A;
          height: 0;
          transition: height 0.25s ease;
        }
        .as-stat:hover {
          background: rgba(168, 146, 58, 0.10);
          border-color: rgba(168, 146, 58, 0.42);
          transform: translateX(5px);
        }
        .as-stat:hover::before { height: 100%; }
        .as-stat-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: 44px;
          font-weight: 600;
          color: #A8923A;
          line-height: 1;
          min-width: 80px;
          text-align: right;
          flex-shrink: 0;
          letter-spacing: -0.03em;
        }
        .as-stat-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          color: #4A3018;
          letter-spacing: 0.01em;
          line-height: 1.4;
          font-weight: 400;
        }

        .as-pull {
          font-family: 'Inter Tight', sans-serif;
          font-size: 18px;
          color: #7A6040;
          line-height: 1.55;
          border-left: 2px solid rgba(168, 146, 58, 0.3);
          padding-left: 18px;
          margin: 22px 0 0;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .as-bottom {
          max-width: 1280px;
          margin: 56px auto 0;
          padding-top: 28px;
          border-top: 1px solid rgba(168, 146, 58, 0.18);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }
        .as-bottom-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: 17px;
          color: #8B7355;
          margin: 0;
          font-weight: 300;
          letter-spacing: -0.005em;
        }
        .as-badges {
          display: flex;
          flex-direction: row;
          gap: 10px;
          flex-wrap: wrap;
        }
        .as-badge {
          border: 1px solid rgba(168, 146, 58, 0.28);
          border-radius: 3px;
          padding: 8px 16px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.12em;
          color: #6A5038;
          text-transform: uppercase;
          cursor: default;
          font-weight: 500;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }
        .as-badge:hover {
          border-color: rgba(168, 146, 58, 0.65);
          color: #9A7020;
          background: rgba(168, 146, 58, 0.08);
        }
      `}</style>

      <section ref={sectionRef} id="authority" className="as-root">
        <div className="as-inner">
          {/* Column A — Foreword */}
          <div className="as-col-a">
            <p className="as-eyebrow">FOREWORD</p>
            <div className="as-rule" aria-hidden />
            <div className="as-quote-block">
              <p className="as-quote-text">
                Go to market in professional services is as much a mindset issue as it is an operational one. The firms that grow are the ones with real clarity about the problems they solve, for whom, and what outcomes that produces. This book builds the system around that clarity.
              </p>
            </div>
            <div className="as-attribution">
              <p className="as-attr-name">Jonathan Copulsky</p>
              <p className="as-attr-line">Former CMO, Deloitte · Senior Lecturer, Northwestern Kellogg</p>
              <div className="as-affil-logos" aria-label="Deloitte and Northwestern Kellogg">
                <span className="as-affil-mark">Deloitte.</span>
                <span className="as-affil-dot" aria-hidden>·</span>
                <span className="as-affil-mark as-affil-mark--kellogg">Kellogg</span>
              </div>
            </div>
          </div>

          {/* Column B — Practitioner */}
          <div className="as-col-b">
            <p className="as-eyebrow">THE PRACTITIONER</p>
            <div className="as-rule" aria-hidden />
            <p className="as-name">Richard Ashbaugh</p>
            <div className="as-role-row">
              <p className="as-role">Co-Author · CEO, Mabbly</p>
              <a
                href="https://www.linkedin.com/in/richardfashbaugh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Richard Ashbaugh on LinkedIn"
                className="as-li"
              >
                <Linkedin size={16} strokeWidth={1.75} />
              </a>
            </div>
            <div className="as-stats">
              {PRACTITIONER_STATS.map((s, i) => renderStatCard(s, `p-${i}`))}
            </div>
            <p className="as-pull">
              "The framework in this book is the one I wish I had at AArete."
            </p>
          </div>

          {/* Column C — Author */}
          <div className="as-col-c">
            <p className="as-eyebrow">THE AUTHOR</p>
            <div className="as-rule" aria-hidden />
            <p className="as-name">Adam Fridman</p>
            <p className="as-role">Co-Author · Founder, Mabbly</p>
            <div className="as-stats">
              {AUTHOR_STATS.map((s, i) => renderStatCard(s, `a-${i}`))}
            </div>
            <p className="as-pull">
              "Six hundred conversations. One framework that survived contact with reality."
            </p>
          </div>
        </div>

        <div className="as-bottom">
          <p className="as-bottom-text">
            The most credentialed GTM authority strip in professional services.
          </p>
          <div className="as-badges">
            <a
              className="as-badge"
              href="https://www.deloitte.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Deloitte (opens in new tab)"
            >
              Deloitte
            </a>
            <a
              className="as-badge"
              href="https://www.kearney.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="A.T. Kearney (opens in new tab)"
            >
              A.T. Kearney
            </a>
            <a
              className="as-badge"
              href="https://mabbly.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mabbly (opens in new tab)"
            >
              Mabbly
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
