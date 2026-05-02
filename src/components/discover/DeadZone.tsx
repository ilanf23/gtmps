import { useEffect, useRef, useState } from 'react';
import { useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DEFAULT_CRM = 500;
const DORMANCY_RATE = 0.7;
const REVENUE_PER_CONTACT = 6850; // illustrative average annual revenue tied to a re-engaged contact

const BREAKDOWN: Array<{ label: string; pct: number }> = [
  { label: 'Stale relationships never re-engaged', pct: 42 },
  { label: 'Signals missed (job changes, RFPs, funding)', pct: 24 },
  { label: 'Manual follow-up that never happens', pct: 18 },
  { label: 'Discovery loops with cold leads', pct: 16 },
];

// Editorial chart: cumulative loss vs. partial recovery, year over year
const CHART_YEARS = [1, 2, 3, 4, 5];
const LOSS_SERIES = [1, 2.1, 3.3, 4.6, 6.0];
const RECOVERY_SERIES = [0.38, 0.78, 1.18, 1.58, 1.95];

type ChartProps = { triggered: boolean; reducedMotion: boolean };

function DeadZoneChart({ triggered, reducedMotion }: ChartProps) {
  const width = 560;
  const height = 240;
  const padX = 36;
  const padY = 24;
  const maxY = 6.2;

  const xFor = (i: number) => padX + (i / (CHART_YEARS.length - 1)) * (width - padX * 2);
  const yFor = (v: number) => height - padY - (v / maxY) * (height - padY * 2);

  const buildPath = (series: number[]) =>
    series
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`)
      .join(' ');

  const lossPath = buildPath(LOSS_SERIES);
  const recoveryPath = buildPath(RECOVERY_SERIES);

  const animate = triggered && !reducedMotion;

  return (
    <div className="dz-chart-wrap">
      <p className="dz-chart-title">The dead zone compounds.</p>
      <svg
        className="dz-chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Cumulative loss versus partial recovery, year over year"
      >
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = padY + t * (height - padY * 2);
          return (
            <line
              key={t}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="rgba(15,30,29,0.06)"
              strokeWidth={1}
            />
          );
        })}

        <path
          d={lossPath}
          fill="none"
          stroke="#BF461A"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? 'dz-line dz-line-on' : 'dz-line'}
          style={{ animationDelay: '0.1s' }}
        />
        <path
          d={recoveryPath}
          fill="none"
          stroke="#0F1E1D"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          className={animate ? 'dz-line dz-line-on' : 'dz-line'}
          style={{ animationDelay: '0.4s' }}
        />

        <circle
          cx={xFor(CHART_YEARS.length - 1)}
          cy={yFor(LOSS_SERIES[LOSS_SERIES.length - 1])}
          r={4}
          fill="#BF461A"
        />
        <circle
          cx={xFor(CHART_YEARS.length - 1)}
          cy={yFor(RECOVERY_SERIES[RECOVERY_SERIES.length - 1])}
          r={4}
          fill="#0F1E1D"
        />

        {CHART_YEARS.map((y, i) => (
          <text
            key={y}
            x={xFor(i)}
            y={height - 4}
            textAnchor="middle"
            fontFamily="DM Mono, monospace"
            fontSize={10}
            fill="rgba(15,30,29,0.5)"
          >
            Y{y}
          </text>
        ))}
      </svg>
      <div className="dz-chart-legend">
        <span className="dz-chart-legend-item">
          <span className="dz-chart-swatch" style={{ background: '#BF461A' }} />
          Cumulative loss
        </span>
        <span className="dz-chart-legend-item">
          <span
            className="dz-chart-swatch"
            style={{ background: '#0F1E1D', opacity: 0.85 }}
          />
          Partial recovery (activated)
        </span>
      </div>
      <p className="dz-chart-caption">
        Cumulative loss vs. partial recovery, year over year.
      </p>
    </div>
  );
}

export default function DeadZone() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [crmInput, setCrmInput] = useState<string>(String(DEFAULT_CRM));
  const [displayResult, setDisplayResult] = useState<number>(
    Math.round(DEFAULT_CRM * DORMANCY_RATE * REVENUE_PER_CONTACT),
  );
  const reducedMotion = useReducedMotion();

  const effectiveCrm =
    crmInput.trim() === ''
      ? DEFAULT_CRM
      : Math.max(0, Number(crmInput) || 0);
  const targetContacts = Math.round(effectiveCrm * DORMANCY_RATE);
  const targetRevenue = Math.round(targetContacts * REVENUE_PER_CONTACT);

  const spring = useSpring(Math.round(DEFAULT_CRM * DORMANCY_RATE * REVENUE_PER_CONTACT), {
    stiffness: 80,
    damping: 18,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      spring.jump(targetRevenue);
      setDisplayResult(targetRevenue);
      return;
    }
    spring.set(targetRevenue);
  }, [targetRevenue, reducedMotion, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplayResult(Math.round(v));
    });
    return () => unsubscribe();
  }, [spring]);

  const formatMoney = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${n}`;
  };

  return (
    <section
      ref={sectionRef}
      id="dead-zone"
      className="relative px-6 md:px-10"
      style={{
        background: '#FBF8F4',
        paddingTop: 'clamp(96px, 14vw, 176px)',
        paddingBottom: 'clamp(96px, 14vw, 176px)',
      }}
    >
      <style>{`
        .dz-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }
        .dz-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .dz-grid {
            grid-template-columns: 1.05fr 1fr;
            gap: 72px;
          }
        }
        .dz-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #A8923A;
          margin: 0;
          font-weight: 500;
        }
        .dz-rule {
          height: 2px;
          background: linear-gradient(90deg, #A8923A, #C4AC4A);
          margin: 16px 0 28px;
          width: 0;
        }
        .dz-rule.dz-on { animation: growRule 0.8s ease forwards; }
        .dz-headline {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 500;
          color: #0F1E1D;
          line-height: 0.98;
          letter-spacing: -0.04em;
          margin: 0 0 24px;
        }
        .dz-headline .dz-headline-period { color: #BF461A; }
        .dz-subhead {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(17px, 1.6vw, 21px);
          color: rgba(15,30,29,0.66);
          line-height: 1.55;
          margin: 0 0 40px;
          font-weight: 300;
          max-width: 560px;
        }
        .dz-estimate-card {
          background: #FFFFFF;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .dz-estimate-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.5);
          margin: 0;
          font-weight: 500;
        }
        .dz-estimate-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(72px, 10vw, 128px);
          font-weight: 600;
          color: #0F1E1D;
          line-height: 0.95;
          letter-spacing: -0.045em;
          margin: 0;
        }
        .dz-estimate-meta {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
          padding-top: 4px;
        }
        .dz-estimate-meta span {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.5);
          font-weight: 500;
        }
        .dz-estimate-meta b {
          color: #0F1E1D;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .dz-estimate-input-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 18px;
          border-top: 1px solid rgba(15,30,29,0.08);
          flex-wrap: wrap;
        }
        .dz-estimate-input {
          background: #FBF8F4;
          border: 1px solid #D5DEC2;
          border-radius: 3px;
          padding: 10px 14px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #0F1E1D;
          width: 120px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .dz-estimate-input:focus { border-color: #A8923A; }
        .dz-estimate-input-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: rgba(15,30,29,0.55);
          font-weight: 300;
        }

        .dz-compare {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: #D5DEC2;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 28px;
        }
        @media (min-width: 640px) {
          .dz-compare { grid-template-columns: repeat(3, 1fr); }
        }
        .dz-compare-cell {
          background: #FFFFFF;
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dz-compare-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.5);
          margin: 0;
          font-weight: 500;
        }
        .dz-compare-num {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(34px, 4.4vw, 48px);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .dz-compare-num-loss { color: #BF461A; }
        .dz-compare-num-recover { color: #A8923A; }
        .dz-compare-num-time { color: #0F1E1D; }
        .dz-compare-foot {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(15,30,29,0.55);
          margin: 0;
          font-weight: 300;
          line-height: 1.4;
        }

        .dz-breakdown {
          background: #FFFFFF;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          padding: 32px 28px;
        }
        .dz-breakdown-title {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.5);
          margin: 0 0 24px;
          font-weight: 500;
        }
        .dz-breakdown-row {
          display: grid;
          grid-template-columns: 14px 1fr 56px;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(15,30,29,0.06);
        }
        .dz-breakdown-row:last-child { border-bottom: 0; }
        .dz-breakdown-square {
          width: 10px;
          height: 10px;
          background: #EDF5EC;
          border: 1px solid #D5DEC2;
          border-radius: 1px;
          margin: 0 2px;
        }
        .dz-breakdown-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .dz-breakdown-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          color: #0F1E1D;
          margin: 0;
          font-weight: 400;
          line-height: 1.35;
        }
        .dz-breakdown-bar {
          height: 6px;
          background: rgba(15,30,29,0.05);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .dz-breakdown-bar-fill {
          height: 100%;
          background: #EDF5EC;
          border-right: 1px solid #A8923A;
          width: 0;
          transition: width 1.1s cubic-bezier(0.22,1,0.36,1);
        }
        .dz-breakdown-pct {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: #0F1E1D;
          font-weight: 500;
          text-align: right;
          letter-spacing: 0.02em;
        }

        .dz-chart-wrap {
          background: #FFFFFF;
          border: 1px solid #D5DEC2;
          border-radius: 4px;
          padding: 32px 28px;
          margin-top: 28px;
        }
        .dz-chart-title {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(20px, 2vw, 26px);
          color: #0F1E1D;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 18px;
        }
        .dz-chart-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .dz-line {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
        }
        .dz-line-on {
          animation: dzDraw 1.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes dzDraw {
          to { stroke-dashoffset: 0; }
        }
        .dz-chart-legend {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .dz-chart-legend-item {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.6);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .dz-chart-swatch {
          display: inline-block;
          width: 12px;
          height: 2px;
          border-radius: 1px;
        }
        .dz-chart-caption {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: rgba(15,30,29,0.5);
          margin: 14px 0 0;
          font-weight: 500;
        }

        .dz-quote {
          background: #FBF8F4;
          border-left: 4px solid #EDF5EC;
          border-top: 1px solid rgba(15,30,29,0.06);
          border-right: 1px solid rgba(15,30,29,0.06);
          border-bottom: 1px solid rgba(15,30,29,0.06);
          border-radius: 0 4px 4px 0;
          padding: 36px 40px;
        }
        .dz-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 22px;
          line-height: 1.45;
          color: #0F1E1D;
          margin: 0 0 18px;
          font-weight: 400;
          letter-spacing: -0.005em;
        }
        @media (min-width: 768px) {
          .dz-quote-text { font-size: 26px; }
        }
        .dz-quote-attr {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(15,30,29,0.55);
          font-weight: 500;
          margin: 0;
        }

        @keyframes growRule {
          from { width: 0; }
          to { width: 56px; }
        }
      `}</style>

      <div className="dz-content">
        <div className="dz-grid">
          {/* LEFT: eyebrow, headline, estimate, comparison strip */}
          <div>
            <p className="dz-eyebrow">05 / The Problem</p>
            <div
              className={`dz-rule ${triggered ? 'dz-on' : ''}`}
              style={{ width: 56 }}
            />
            <h2 className="dz-headline">
              The Dead Zone<span className="dz-headline-period">.</span>
            </h2>
            <p className="dz-subhead">
              Between 60% and 80% of the contacts in your CRM are sitting here right
              now. Quiet, warm, and unactivated. Here is what that costs you.
            </p>

            <div className="dz-estimate-card">
              <p className="dz-estimate-label">Your Dead Zone estimate</p>
              <p className="dz-estimate-num">{formatMoney(displayResult)}</p>
              <div className="dz-estimate-meta">
                <span>
                  <b>{targetContacts.toLocaleString()}</b> dormant contacts
                </span>
                <span>per year</span>
                <span>per partner book</span>
              </div>
              <div className="dz-estimate-input-row">
                <label htmlFor="dz-crm" className="dz-estimate-input-label">
                  Contacts in your CRM
                </label>
                <input
                  id="dz-crm"
                  type="text"
                  inputMode="numeric"
                  className="dz-estimate-input"
                  value={crmInput}
                  placeholder="500"
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '' || /^\d+$/.test(raw)) {
                      setCrmInput(raw);
                    }
                  }}
                  aria-label="Number of contacts in your CRM"
                />
              </div>
            </div>

            <div className="dz-compare">
              <div className="dz-compare-cell">
                <p className="dz-compare-label">What you're losing</p>
                <p className="dz-compare-num dz-compare-num-loss">$2.4M / yr</p>
                <p className="dz-compare-foot">Median dormant pipeline value</p>
              </div>
              <div className="dz-compare-cell">
                <p className="dz-compare-label">Activated firms recover</p>
                <p className="dz-compare-num dz-compare-num-recover">62%</p>
                <p className="dz-compare-foot">Within the first program year</p>
              </div>
              <div className="dz-compare-cell">
                <p className="dz-compare-label">Time to first signal</p>
                <p className="dz-compare-num dz-compare-num-time">11 days</p>
                <p className="dz-compare-foot">From activation to first warm reply</p>
              </div>
            </div>
          </div>

          {/* RIGHT: where the money goes + editorial chart */}
          <div>
            <div className="dz-breakdown">
              <p className="dz-breakdown-title">Where the money goes</p>
              {BREAKDOWN.map((item, idx) => (
                <div className="dz-breakdown-row" key={item.label}>
                  <span className="dz-breakdown-square" aria-hidden="true" />
                  <div className="dz-breakdown-text">
                    <p className="dz-breakdown-label">{item.label}</p>
                    <div className="dz-breakdown-bar">
                      <div
                        className="dz-breakdown-bar-fill"
                        style={{
                          width: triggered ? `${item.pct}%` : '0%',
                          transitionDelay: `${0.2 + idx * 0.12}s`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="dz-breakdown-pct">{item.pct}%</span>
                </div>
              ))}
            </div>

            <DeadZoneChart triggered={triggered} reducedMotion={reducedMotion} />
          </div>
        </div>

        {/* QUOTE: full-width below */}
        <div className="dz-quote">
          <p className="dz-quote-text">
            "We knew we were leaving money on the table. We didn't know it was an
            entire revenue line."
          </p>
          <p className="dz-quote-attr">
            Managing Partner / mid-market advisory firm
          </p>
        </div>
      </div>
    </section>
  );
}
