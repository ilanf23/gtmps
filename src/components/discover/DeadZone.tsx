import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type Key = 'contacts' | 'dealValue' | 'dormancy';

const DEFAULTS: Record<Key, number> = {
  contacts: 500,
  dealValue: 25000,
  dormancy: 70,
};

const CONSTRAINTS: Record<Key, { min: number; max: number; step: number }> = {
  contacts:  { min: 50,  max: 100000,  step: 50 },
  dealValue: { min: 500, max: 5000000, step: 1000 },
  dormancy:  { min: 50,  max: 85,      step: 1 },
};

const WIN_RATE = 0.27;
const ACTIVATION = 0.62;

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
  });

  const heroRef = useRef<HTMLParagraphElement>(null);
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

  const contacts = numVal('contacts');
  const dealValue = numVal('dealValue');
  const dormancyPct = numVal('dormancy');

  const dormant = Math.round(contacts * (dormancyPct / 100));
  const annualPipeline = dormant * dealValue * WIN_RATE;
  const recoverable = annualPipeline * ACTIVATION;

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
          max-width: 980px;
          margin: 0 auto;
          padding: 36px 40px 44px;
        }
        @media (max-width: 639px) {
          .dz-root { padding: 24px 18px 32px; }
        }

        .dz-section-meta {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0 0 16px;
        }
        .dz-section-meta-rule {
          display: block;
          width: 38px;
          height: 2px;
          background: #A79014;
          margin-top: 8px;
        }

        .dz-headline {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 0.95;
          color: #0F1E1D;
          margin: 0 0 10px;
        }
        @media (max-width: 639px) {
          .dz-headline { font-size: 30px; }
        }
        .dz-period { color: #BF461A; }
        .dz-term {
          cursor: help;
          text-decoration: underline dotted rgba(15, 30, 29, 0.28);
          text-underline-offset: 8px;
          text-decoration-thickness: 2px;
          transition: text-decoration-color 200ms ease;
        }
        .dz-term:hover,
        .dz-term:focus-visible {
          text-decoration-color: #BF461A;
          outline: none;
        }
        .dz-sub {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(15, 30, 29, 0.72);
          max-width: 520px;
          margin: 0 0 24px;
        }
        .dz-sub strong { color: #0F1E1D; font-weight: 700; }

        .dz-calc {
          background: #FCFAF4;
          border: 1px solid #E5E0CF;
          border-radius: 16px;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: stretch;
        }
        @media (max-width: 760px) {
          .dz-calc { grid-template-columns: 1fr; }
        }
        .dz-divider {
          background: #E5E0CF;
        }
        @media (max-width: 760px) {
          .dz-divider { width: 100%; height: 1px; }
        }

        .dz-inputs {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dz-inputs-head {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          margin: 0 0 2px;
        }

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
          padding: 22px 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }
        @media (max-width: 639px) {
          .dz-results { padding: 22px 24px; }
        }

        .dz-hero-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          margin: 0 0 4px;
        }
        .dz-hero-value {
          font-family: 'Inter Tight', sans-serif;
          font-size: 64px;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.92;
          color: #BF461A;
          margin: 0;
          transform-origin: left center;
        }
        @media (max-width: 639px) {
          .dz-hero-value { font-size: 48px; }
        }
        .dz-hero-unit {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          color: rgba(15, 30, 29, 0.6);
          margin: 6px 0 0;
        }
        .dz-hero-unit strong { color: #0F1E1D; font-weight: 700; }

        .dz-recover {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #E5E0CF;
        }
        .dz-recover-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
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

        .dz-define {
          margin: 28px 0 0;
          padding: 22px 0 0;
          border-top: 1px solid #E5E0CF;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 18px 22px;
          align-items: start;
        }
        @media (max-width: 639px) {
          .dz-define { grid-template-columns: 1fr; gap: 10px; }
        }
        .dz-define-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A79014;
          padding-top: 4px;
          white-space: nowrap;
        }
        .dz-define-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(15, 30, 29, 0.82);
          margin: 0;
          max-width: 640px;
        }
        .dz-define-body + .dz-define-body { margin-top: 10px; }
        .dz-define-body strong { color: #0F1E1D; font-weight: 700; }

        .dz-foot {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          color: rgba(15, 30, 29, 0.5);
          margin: 14px 0 0;
        }

        @keyframes dzPulseCare {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .dz-bump { animation: dzPulseCare 0.32s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .dz-bump { animation: none !important; }
          .dz-num-input,
          .dz-slider::-webkit-slider-thumb,
          .dz-slider::-moz-range-thumb { transition: none !important; }
        }
      `}</style>

      <div className="dz-root">
        <p className="dz-section-meta">
          The Problem
          <span className="dz-section-meta-rule" aria-hidden="true" />
        </p>

        <h2 className="dz-headline">
          The{' '}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="dz-term"
                tabIndex={0}
                aria-label="Dead Zone, dormant relationships where trust still exists but no system reactivates them"
              >
                Dead Zone
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={12}
              className="rr-tooltip"
            >
              <span className="rr-tooltip-eyebrow">Dead Zone</span>
              <span className="rr-tooltip-body">
                Dormant relationships where trust still exists but no system reactivates them — past clients, lapsed prospects, stalled proposals. Typically the highest-ROI orbit.
              </span>
            </TooltipContent>
          </Tooltip>
          <span className="dz-period">.</span>
        </h2>
        <p className="dz-sub">
          <strong>60 to 80%</strong> of your CRM is sitting quiet, warm, and unactivated. Tune the inputs to see what it costs you.
        </p>

        <div className="dz-calc">
          <aside className="dz-inputs" aria-label="Calculator inputs">
            <header className="dz-inputs-head">◧ Your firm</header>

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
          </aside>

          <div className="dz-divider" aria-hidden="true" />

          <div className="dz-results">
            <div>
              <p className="dz-hero-label">Annual pipeline at risk</p>
              <p className="dz-hero-value" ref={heroRef}>{fmtMoney(annualPipeline)}</p>
              <p className="dz-hero-unit">
                <strong>{fmtNum(dormant)}</strong> dormant contacts · per year
              </p>
            </div>

            <div className="dz-recover">
              <span className="dz-recover-label">Y1 Recoverable</span>
              <span className="dz-recover-value">{fmtMoney(recoverable)}</span>
            </div>
          </div>
        </div>

        <div className="dz-define">
          <span className="dz-define-eyebrow">What it really is</span>
          <div>
            <p className="dz-define-body">
              The Dead Zone is <strong>not</strong> dormant contacts. It is <strong>not</strong> lapsed leads. It is the predictable result of applying the wrong GTM definition to a relationship business.
            </p>
            <p className="dz-define-body">
              These are not strangers. They knew you, worked with you, evaluated you, or were introduced to you. <strong>Every one represents a relationship that was started but never maintained.</strong>
            </p>
          </div>
        </div>

        <p className="dz-foot">Assumes 27% win rate on activated contacts · 62% Y1 program activation.</p>
      </div>
    </section>
  );
}
