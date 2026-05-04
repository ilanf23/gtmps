import { useEffect, useRef, useState } from 'react';
import AdamNote from '@/components/discover/AdamNote';

type Key = 'contacts' | 'dealValue' | 'dormancy' | 'winRate' | 'activation';

const DEFAULTS: Record<Key, number> = {
  contacts: 500,
  dealValue: 25000,
  dormancy: 70,
  winRate: 27,
  activation: 62,
};

const CONSTRAINTS: Record<Key, { min: number; max: number; step: number }> = {
  contacts:   { min: 50,  max: 100000,  step: 50 },
  dealValue:  { min: 500, max: 5000000, step: 1000 },
  dormancy:   { min: 50,  max: 85,      step: 1 },
  winRate:    { min: 5,   max: 40,      step: 1 },
  activation: { min: 20,  max: 90,      step: 1 },
};

function fmtMoney(v: number): string {
  if (!isFinite(v) || v < 0) v = 0;
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e4) return '$' + Math.round(v / 1e3).toLocaleString() + 'K';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
  return '$' + Math.round(v).toLocaleString();
}
function fmtNum(v: number): string {
  return Math.round(v).toLocaleString();
}

function clampVal(key: Key, v: number): number {
  const c = CONSTRAINTS[key];
  if (isNaN(v)) return DEFAULTS[key];
  if (v < c.min) return c.min;
  if (v > c.max) return c.max;
  return v;
}

export default function DeadZone() {
  const [vals, setVals] = useState<Record<Key, string>>({
    contacts: String(DEFAULTS.contacts),
    dealValue: String(DEFAULTS.dealValue),
    dormancy: String(DEFAULTS.dormancy),
    winRate: String(DEFAULTS.winRate),
    activation: String(DEFAULTS.activation),
  });

  const heroRef = useRef<HTMLParagraphElement>(null);
  const lineLossRef = useRef<SVGPolylineElement>(null);
  const lineRecoverRef = useRef<SVGPolylineElement>(null);
  const firstRender = useRef(true);

  const numVal = (key: Key): number => {
    const v = parseFloat(vals[key]);
    if (isNaN(v)) return DEFAULTS[key];
    return clampVal(key, v);
  };

  const handleNumberChange = (key: Key) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVals(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleNumberBlur = (key: Key) => (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    const clamped = isNaN(raw) ? DEFAULTS[key] : clampVal(key, raw);
    setVals(prev => ({ ...prev, [key]: String(clamped) }));
  };

  const handleSliderChange = (key: Key) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVals(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleReset = () => {
    setVals({
      contacts: String(DEFAULTS.contacts),
      dealValue: String(DEFAULTS.dealValue),
      dormancy: String(DEFAULTS.dormancy),
      winRate: String(DEFAULTS.winRate),
      activation: String(DEFAULTS.activation),
    });
    [lineLossRef.current, lineRecoverRef.current].forEach(el => {
      if (!el) return;
      el.classList.remove('dz-draw-line');
      void el.getBoundingClientRect();
      el.classList.add('dz-draw-line');
    });
  };

  const contacts = numVal('contacts');
  const dealValue = numVal('dealValue');
  const dormancyPct = numVal('dormancy');
  const winRatePct = numVal('winRate');
  const activationPct = numVal('activation');

  const dormancy = dormancyPct / 100;
  const winRate = winRatePct / 100;
  const activation = activationPct / 100;

  const dormant = Math.round(contacts * dormancy);
  const annualPipeline = dormant * dealValue * winRate;
  const recoverable = annualPipeline * activation;
  const noAction = annualPipeline * 5;

  let activatedTotal = 0;
  let remaining = 1.0;
  const recoverYearly: number[] = [];
  for (let y = 1; y <= 5; y++) {
    const recYearShare = remaining * activation;
    const recYearDollars = annualPipeline * recYearShare;
    activatedTotal += recYearDollars;
    recoverYearly.push(activatedTotal);
    remaining -= recYearShare;
  }

  const CH_TOP = 12, CH_BOTTOM = 72, CH_RANGE = CH_BOTTOM - CH_TOP, X_STEP = 240 / 4;
  const maxVal = Math.max(noAction, activatedTotal, 1);
  const lossPts: string[] = [];
  const recPts: string[] = [];
  for (let y = 0; y <= 4; y++) {
    const x = y * X_STEP;
    const lossY = annualPipeline * (y + 1);
    const lossYpx = CH_BOTTOM - (lossY / maxVal) * CH_RANGE;
    lossPts.push(`${x},${lossYpx.toFixed(2)}`);
    const recYDollar = recoverYearly[y];
    const recYpx = CH_BOTTOM - (recYDollar / maxVal) * CH_RANGE;
    recPts.push(`${x},${recYpx.toFixed(2)}`);
  }
  const lossEndY = parseFloat(lossPts[lossPts.length - 1].split(',')[1]);
  const recEndY = parseFloat(recPts[recPts.length - 1].split(',')[1]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = heroRef.current;
    if (!el) return;
    el.classList.remove('dz-bump');
    void el.offsetWidth;
    el.classList.add('dz-bump');
  }, [vals]);

  return (
    <section id="dead-zone" className="dz-section">
      <style>{`
        .dz-section {
          position: relative;
          width: 100%;
          background: #F8F2E5;
          color: #0F1E1D;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
        .dz-root {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 44px 40px 56px;
        }
        @media (max-width: 639px) {
          .dz-root { padding: 24px 18px; }
        }

        .dz-section-meta {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0 0 20px;
        }
        .dz-section-meta-rule {
          display: block;
          width: 38px;
          height: 2px;
          background: #A79014;
          margin-top: 8px;
        }

        .dz-head-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: end;
          margin-bottom: 28px;
        }
        @media (min-width: 980px) {
          .dz-head-row {
            grid-template-columns: 1fr auto;
            gap: 48px;
          }
        }
        .dz-headline {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 0.95;
          color: #0F1E1D;
          margin: 0;
        }
        @media (max-width: 979px) {
          .dz-headline { font-size: 34px; }
        }
        .dz-period { color: #BF461A; }
        .dz-headline-sub {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;
          color: rgba(15, 30, 29, 0.7);
          max-width: 360px;
          margin: 0;
        }
        .dz-headline-sub strong { color: #0F1E1D; font-weight: 700; }

        .dz-calc {
          background: #FCFAF4;
          border: 1px solid #E5E0CF;
          border-radius: 4px;
          display: grid;
          grid-template-columns: 300px 1fr;
        }
        @media (max-width: 979px) {
          .dz-calc { grid-template-columns: 1fr; }
        }

        .dz-inputs {
          border-right: 1px solid #E5E0CF;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @media (max-width: 979px) {
          .dz-inputs { border-right: 0; border-bottom: 1px solid #E5E0CF; }
        }
        @media (max-width: 639px) {
          .dz-inputs { padding: 18px; }
        }

        .dz-inputs-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          margin: 0 0 2px;
        }
        .dz-reset {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.5);
          background: transparent;
          border: 1px solid #E5E0CF;
          border-radius: 12px;
          padding: 4px 8px;
          cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .dz-reset:hover { color: #BF461A; border-color: #BF461A; }
        .dz-reset:focus-visible { outline: 2px solid #BF461A; outline-offset: 2px; }

        .dz-input-block { display: flex; flex-direction: column; gap: 6px; }
        .dz-input-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }

        .dz-num-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 2px;
          padding: 8px 12px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          -moz-appearance: textfield;
          appearance: textfield;
        }
        .dz-num-input::-webkit-outer-spin-button,
        .dz-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .dz-num-input:focus {
          border-color: #BF461A;
          box-shadow: 0 0 0 3px rgba(191, 70, 26, 0.12);
        }
        .dz-num-wrap { position: relative; }
        .dz-num-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 900;
          color: #9AA09C;
          pointer-events: none;
        }
        .dz-num-input--prefixed { padding-left: 24px; }

        .dz-slider-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
        }
        .dz-slider-live {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
        }
        .dz-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          background: #E1E5DD;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .dz-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #BF461A;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(191, 70, 26, 0.35);
          transition: transform 0.12s ease;
        }
        .dz-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .dz-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #BF461A;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(191, 70, 26, 0.35);
        }

        .dz-results {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @media (max-width: 639px) {
          .dz-results { padding: 18px; }
        }

        .dz-hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .dz-hero { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .dz-hero-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }
        .dz-hero-value {
          font-family: 'Inter Tight', sans-serif;
          font-size: 72px;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.92;
          color: #BF461A;
          margin: 0;
          transform-origin: left center;
        }
        @media (max-width: 979px) {
          .dz-hero-value { font-size: 48px; }
        }
        .dz-hero-unit {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(15, 30, 29, 0.6);
          margin: 0;
        }
        .dz-hero-unit strong { color: #0F1E1D; font-weight: 700; }

        .dz-recover {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 3px;
          min-width: 140px;
        }
        .dz-recover-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }
        .dz-recover-value {
          font-family: 'Inter Tight', sans-serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.025em;
          color: #225351;
        }
        .dz-recover-meta {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10px;
          color: rgba(15, 30, 29, 0.55);
        }

        .dz-chart {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #E5E0CF;
        }
        .dz-chart-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          flex-wrap: wrap;
          gap: 10px;
        }
        .dz-chart-legend {
          display: inline-flex;
          gap: 14px;
          letter-spacing: 0.06em;
          text-transform: none;
          font-size: 10px;
          font-weight: 600;
          color: rgba(15, 30, 29, 0.6);
        }
        .dz-chart-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .dz-chart-legend b {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          color: #0F1E1D;
          letter-spacing: -0.01em;
          font-size: 11px;
        }
        .dz-legend-swatch { width: 12px; height: 2px; border-radius: 2px; display: inline-block; }
        .dz-chart-body { display: flex; min-height: 130px; }
        .dz-chart-body svg { width: 100%; height: 100%; min-height: 130px; display: block; }

        .dz-draw-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: dzDrawIn 1.4s ease-out forwards;
        }
        @keyframes dzDrawIn { to { stroke-dashoffset: 0; } }

        @keyframes dzPulseCare {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .dz-bump { animation: dzPulseCare 0.32s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .dz-bump, .dz-draw-line { animation: none !important; }
          .dz-num-input, .dz-reset,
          .dz-slider::-webkit-slider-thumb,
          .dz-slider::-moz-range-thumb { transition: none !important; }
        }
      `}</style>

      <div className="dz-root">
        <p className="dz-section-meta">
          The Problem
          <span className="dz-section-meta-rule" aria-hidden="true" />
        </p>

        <div className="dz-head-row">
          <h2 className="dz-headline">
            The Dead Zone<span className="dz-period">.</span>
          </h2>
          <p className="dz-headline-sub">
            <strong>60-80%</strong> of your CRM is sitting quiet, warm, and unactivated. Tune the inputs. Watch what it costs.
          </p>
        </div>

        <div className="dz-calc">
          <aside className="dz-inputs" aria-label="Calculator inputs">
            <header className="dz-inputs-head">
              <span>◧ Your firm</span>
              <button type="button" className="dz-reset" onClick={handleReset}>Reset</button>
            </header>

            <div className="dz-input-block">
              <label className="dz-input-label" htmlFor="dz-contacts">Contacts in CRM</label>
              <input
                id="dz-contacts"
                type="number"
                className="dz-num-input"
                value={vals.contacts}
                min={CONSTRAINTS.contacts.min}
                max={CONSTRAINTS.contacts.max}
                step={CONSTRAINTS.contacts.step}
                onChange={handleNumberChange('contacts')}
                onBlur={handleNumberBlur('contacts')}
                inputMode="numeric"
              />
            </div>

            <div className="dz-input-block">
              <label className="dz-input-label" htmlFor="dz-deal">Avg deal value</label>
              <div className="dz-num-wrap">
                <span className="dz-num-prefix" aria-hidden="true">$</span>
                <input
                  id="dz-deal"
                  type="number"
                  className="dz-num-input dz-num-input--prefixed"
                  value={vals.dealValue}
                  min={CONSTRAINTS.dealValue.min}
                  max={CONSTRAINTS.dealValue.max}
                  step={CONSTRAINTS.dealValue.step}
                  onChange={handleNumberChange('dealValue')}
                  onBlur={handleNumberBlur('dealValue')}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="dz-input-block">
              <div className="dz-slider-row">
                <span className="dz-input-label">Dormancy rate</span>
                <span className="dz-slider-live">{vals.dormancy}%</span>
              </div>
              <input
                type="range"
                className="dz-slider"
                aria-label="Dormancy rate"
                min={CONSTRAINTS.dormancy.min}
                max={CONSTRAINTS.dormancy.max}
                step={CONSTRAINTS.dormancy.step}
                value={vals.dormancy}
                onChange={handleSliderChange('dormancy')}
              />
            </div>

            <div className="dz-input-block">
              <div className="dz-slider-row">
                <span className="dz-input-label">Win rate · activated</span>
                <span className="dz-slider-live">{vals.winRate}%</span>
              </div>
              <input
                type="range"
                className="dz-slider"
                aria-label="Win rate on activated dormant contacts"
                min={CONSTRAINTS.winRate.min}
                max={CONSTRAINTS.winRate.max}
                step={CONSTRAINTS.winRate.step}
                value={vals.winRate}
                onChange={handleSliderChange('winRate')}
              />
            </div>

            <div className="dz-input-block">
              <div className="dz-slider-row">
                <span className="dz-input-label">Y1 activation</span>
                <span className="dz-slider-live">{vals.activation}%</span>
              </div>
              <input
                type="range"
                className="dz-slider"
                aria-label="Year one program activation"
                min={CONSTRAINTS.activation.min}
                max={CONSTRAINTS.activation.max}
                step={CONSTRAINTS.activation.step}
                value={vals.activation}
                onChange={handleSliderChange('activation')}
              />
            </div>
          </aside>

          <div className="dz-results">
            <div className="dz-hero-row">
              <div className="dz-hero">
                <span className="dz-hero-label">Annual pipeline at risk</span>
                <p className="dz-hero-value" ref={heroRef}>{fmtMoney(annualPipeline)}</p>
                <p className="dz-hero-unit">
                  <strong>{fmtNum(dormant)}</strong> dormant contacts · per year
                </p>
              </div>
              <div className="dz-recover">
                <span className="dz-recover-label">Y1 Recoverable</span>
                <span className="dz-recover-value">{fmtMoney(recoverable)}</span>
                <span className="dz-recover-meta">at {activationPct}% activation</span>
              </div>
            </div>

            <div className="dz-chart" aria-hidden="true">
              <header className="dz-chart-head">
                <span>◧ 5-year trajectory</span>
                <span className="dz-chart-legend">
                  <span><i className="dz-legend-swatch" style={{ background: '#BF461A' }} /> No action <b>{fmtMoney(noAction)}</b></span>
                  <span><i className="dz-legend-swatch" style={{ background: '#225351' }} /> Activated <b>{fmtMoney(activatedTotal)}</b></span>
                </span>
              </header>
              <div className="dz-chart-body">
                <svg viewBox="0 0 240 88" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="240" y2="20" stroke="#E5E0CF" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="240" y2="40" stroke="#E5E0CF" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="240" y2="60" stroke="#E5E0CF" strokeWidth="0.5" />
                  <polyline
                    ref={lineLossRef}
                    className="dz-draw-line"
                    points={lossPts.join(' ')}
                    stroke="#BF461A"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    ref={lineRecoverRef}
                    className="dz-draw-line"
                    points={recPts.join(' ')}
                    stroke="#225351"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <circle cx={4 * X_STEP} cy={lossEndY} r="2.5" fill="#BF461A" />
                  <circle cx={4 * X_STEP} cy={recEndY} r="2.5" fill="#225351" />
                  <text x="2"   y="84" fontFamily="DM Mono, monospace" fontSize="7" fill="#9AA09C">Y1</text>
                  <text x="61"  y="84" fontFamily="DM Mono, monospace" fontSize="7" fill="#9AA09C">Y2</text>
                  <text x="120" y="84" fontFamily="DM Mono, monospace" fontSize="7" fill="#9AA09C">Y3</text>
                  <text x="178" y="84" fontFamily="DM Mono, monospace" fontSize="7" fill="#9AA09C">Y4</text>
                  <text x="225" y="84" fontFamily="DM Mono, monospace" fontSize="7" fill="#9AA09C">Y5</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <AdamNote />
      </div>
    </section>
  );
}
