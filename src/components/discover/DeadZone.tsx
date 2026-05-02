import { useEffect, useRef, useState } from 'react';

type Key = 'contacts' | 'dealValue' | 'bookSize' | 'dormancy' | 'winRate' | 'activation';

const DEFAULTS: Record<Key, number> = {
  contacts: 500,
  dealValue: 25000,
  bookSize: 500,
  dormancy: 70,
  winRate: 27,
  activation: 62,
};

const CONSTRAINTS: Record<Key, { min: number; max: number; step: number }> = {
  contacts:   { min: 50,  max: 100000,  step: 50 },
  dealValue:  { min: 500, max: 5000000, step: 1000 },
  bookSize:   { min: 50,  max: 10000,   step: 50 },
  dormancy:   { min: 50,  max: 85,      step: 1 },
  winRate:    { min: 5,   max: 40,      step: 1 },
  activation: { min: 20,  max: 90,      step: 1 },
};

const BREAKDOWN = [
  { label: 'Stale relationships never re-engaged', pct: 42, color: '#BF461A' },
  { label: 'Signals missed (job changes, RFPs, funding)', pct: 24, color: '#FFBA1A' },
  { label: 'Manual follow-up that never happens', pct: 18, color: '#225351' },
  { label: 'Discovery loops with cold leads', pct: 16, color: '#CBD3CA' },
];

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
    bookSize: String(DEFAULTS.bookSize),
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
      bookSize: String(DEFAULTS.bookSize),
      dormancy: String(DEFAULTS.dormancy),
      winRate: String(DEFAULTS.winRate),
      activation: String(DEFAULTS.activation),
    });
    [lineLossRef.current, lineRecoverRef.current].forEach(el => {
      if (!el) return;
      el.classList.remove('dz-draw-line');
      // force reflow
      void el.getBoundingClientRect();
      el.classList.add('dz-draw-line');
    });
  };

  // Math
  const contacts = numVal('contacts');
  const dealValue = numVal('dealValue');
  const bookSize = numVal('bookSize');
  const dormancyPct = numVal('dormancy');
  const winRatePct = numVal('winRate');
  const activationPct = numVal('activation');

  const dormancy = dormancyPct / 100;
  const winRate = winRatePct / 100;
  const activation = activationPct / 100;

  const dormant = Math.round(contacts * dormancy);
  const pipelinePerBook = dormant * dealValue * winRate;
  const recoverable = pipelinePerBook * activation;
  const perContact = dormant > 0 ? pipelinePerBook / dormant : 0;
  const books = bookSize > 0 ? contacts / bookSize : 0;
  const firmPipeline = pipelinePerBook * Math.max(books, 1);
  const noAction = pipelinePerBook * 5;

  let activatedTotal = 0;
  let remaining = 1.0;
  const recoverYearly: number[] = [];
  for (let y = 1; y <= 5; y++) {
    const recYearShare = remaining * activation;
    const recYearDollars = pipelinePerBook * recYearShare;
    activatedTotal += recYearDollars;
    recoverYearly.push(activatedTotal);
    remaining -= recYearShare;
  }

  // Chart
  const CH_TOP = 12, CH_BOTTOM = 72, CH_RANGE = CH_BOTTOM - CH_TOP, X_STEP = 240 / 4;
  const maxVal = Math.max(noAction, activatedTotal, 1);
  const lossPts: string[] = [];
  const recPts: string[] = [];
  for (let y = 0; y <= 4; y++) {
    const x = y * X_STEP;
    const lossY = pipelinePerBook * (y + 1);
    const lossYpx = CH_BOTTOM - (lossY / maxVal) * CH_RANGE;
    lossPts.push(`${x},${lossYpx.toFixed(2)}`);
    const recYDollar = recoverYearly[y];
    const recYpx = CH_BOTTOM - (recYDollar / maxVal) * CH_RANGE;
    recPts.push(`${x},${recYpx.toFixed(2)}`);
  }
  const lossEndY = parseFloat(lossPts[lossPts.length - 1].split(',')[1]);
  const recEndY = parseFloat(recPts[recPts.length - 1].split(',')[1]);

  // Hero bump on every input change
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
          max-width: 1440px;
          margin: 0 auto;
          padding: 44px 40px 56px;
        }
        @media (max-width: 639px) {
          .dz-root { padding: 24px 18px; }
        }

        .dz-blob {
          position: absolute;
          top: 80px;
          right: -120px;
          width: 480px;
          height: 510px;
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }
        .dz-blob svg { width: 100%; height: 100%; display: block; }
        @media (max-width: 979px) { .dz-blob { display: none; } }

        .dz-section-meta {
          font-family: 'DM Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
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
          gap: 24px;
          align-items: end;
          margin-bottom: 32px;
        }
        @media (min-width: 980px) {
          .dz-head-row {
            grid-template-columns: 1fr auto;
            gap: 48px;
          }
        }
        .dz-headline {
          font-family: 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
          font-size: 52px;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 0.95;
          color: #0F1E1D;
          margin: 0;
        }
        @media (max-width: 979px) {
          .dz-headline { font-size: 38px; }
        }
        .dz-period { color: #BF461A; }
        .dz-headline-sub {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.5;
          color: rgba(15, 30, 29, 0.7);
          max-width: 380px;
          margin: 0;
        }
        .dz-headline-sub strong { color: #0F1E1D; font-weight: 700; }

        .dz-calc {
          background: #FCFAF4;
          border: 1px solid #E5E0CF;
          border-radius: 4px;
          display: grid;
          grid-template-columns: 340px 1fr;
        }
        @media (max-width: 979px) {
          .dz-calc { grid-template-columns: 1fr; }
        }

        .dz-inputs {
          border-right: 1px solid #E5E0CF;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 22px;
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
          margin: 0 0 4px;
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

        .dz-input-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dz-input-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }
        .dz-input-helper {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: #9AA09C;
          margin-left: 6px;
        }

        .dz-num-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 2px;
          padding: 9px 12px;
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          -moz-appearance: textfield;
          appearance: textfield;
        }
        .dz-num-input::-webkit-outer-spin-button,
        .dz-num-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
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
          font-size: 14px;
          font-weight: 900;
          color: #9AA09C;
          pointer-events: none;
        }
        .dz-num-input--prefixed { padding-left: 26px; }

        .dz-slider-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
        }
        .dz-slider-live {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
        }
        .dz-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          background: #E1E5DD;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .dz-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #BF461A;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(191, 70, 26, 0.35);
          transition: transform 0.12s ease;
        }
        .dz-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .dz-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #BF461A;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(191, 70, 26, 0.35);
          transition: transform 0.12s ease;
        }
        .dz-slider::-moz-range-thumb:hover { transform: scale(1.2); }
        .dz-slider:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(191, 70, 26, 0.25); }

        .dz-results {
          padding: 32px;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 24px 28px;
        }
        @media (max-width: 979px) {
          .dz-results { grid-template-columns: 1fr; }
        }
        @media (max-width: 639px) {
          .dz-results { padding: 18px; }
        }

        .dz-hero {
          grid-column: 1 / 2;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (max-width: 979px) {
          .dz-hero { grid-column: 1; grid-row: auto; }
        }
        .dz-hero-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }
        .dz-hero-rule { flex: 1; height: 1px; background: #E5E0CF; }
        .dz-hero-value {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 88px;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.92;
          color: #BF461A;
          margin: 0;
          transform-origin: left center;
        }
        @media (max-width: 979px) {
          .dz-hero-value { font-size: 54px; }
        }
        .dz-hero-unit {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          margin: 0;
        }
        .dz-hero-unit strong { color: #0F1E1D; font-weight: 700; }
        .dz-mid-dot { color: #9AA09C; margin: 0 4px; }

        .dz-sub-col {
          grid-column: 2 / 3;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @media (max-width: 979px) {
          .dz-sub-col {
            grid-column: 1;
            grid-row: auto;
            flex-direction: row;
            flex-wrap: wrap;
          }
          .dz-substat {
            flex: 1 1 calc(33% - 6px);
            min-width: 140px;
          }
        }
        .dz-substat {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 14px;
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 3px;
        }
        .dz-substat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
        }
        .dz-substat-value {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 1.0;
          color: #0F1E1D;
        }
        .dz-substat-unit { font-size: 12px; margin-left: 4px; font-weight: 700; }
        .dz-substat-meta {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: rgba(15, 30, 29, 0.55);
        }
        .dz-substat-meta b {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          color: #0F1E1D;
        }

        .dz-breakdown {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 6px;
        }
        @media (max-width: 979px) {
          .dz-breakdown { grid-column: 1; grid-row: auto; }
        }
        .dz-breakdown-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.72);
          padding-bottom: 6px;
          border-bottom: 1px solid #E5E0CF;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dz-breakdown-total {
          font-weight: 600;
          color: rgba(15, 30, 29, 0.55);
        }
        .dz-breakdown-total b {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          margin-left: 6px;
        }

        .dz-bar-row {
          display: grid;
          grid-template-columns: 1fr 84px;
          align-items: center;
          column-gap: 14px;
          row-gap: 4px;
          padding: 8px 0;
        }
        .dz-bar-row-top {
          grid-column: 1;
          grid-row: 1;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .dz-bar-label {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #0F1E1D;
        }
        .dz-bar-pct {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(15, 30, 29, 0.55);
          margin-left: auto;
        }
        .dz-bar-track {
          grid-column: 1;
          grid-row: 2;
          position: relative;
          height: 6px;
          background: #E1E5DD;
          border-radius: 3px;
          overflow: hidden;
        }
        .dz-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .dz-bar-amount {
          grid-column: 2;
          grid-row: 1 / span 2;
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          text-align: right;
        }
        @media (max-width: 639px) {
          .dz-bar-row { grid-template-columns: 1fr; }
          .dz-bar-amount { grid-column: 1; grid-row: auto; text-align: left; padding-left: 12px; }
        }

        .dz-compound {
          grid-column: 1 / -1;
          grid-row: 3;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 22px;
          align-items: stretch;
          padding-top: 18px;
          margin-top: 6px;
          border-top: 1px solid #E5E0CF;
        }
        @media (max-width: 979px) {
          .dz-compound { grid-column: 1; grid-row: auto; }
        }
        @media (max-width: 639px) {
          .dz-compound { grid-template-columns: 1fr; }
        }
        .dz-compound-text {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 18px;
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 3px;
        }
        .dz-compound-title {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.025em;
          color: #0F1E1D;
          margin: 0;
        }
        .dz-compound-stats {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }
        .dz-compound-stat {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(15, 30, 29, 0.72);
          margin: 0;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
        }
        .dz-dash { font-weight: 900; }
        .dz-dash-loss { color: #BF461A; }
        .dz-dash-rec { color: #225351; }
        .dz-compound-amount {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0F1E1D;
        }
        .dz-compound-chart {
          background: #FFFFFF;
          border: 1px solid #E5E0CF;
          border-radius: 3px;
          padding: 14px 18px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 180px;
        }
        .dz-compound-chart-head {
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
        .dz-compound-legend {
          display: inline-flex;
          gap: 14px;
          letter-spacing: 0.06em;
          text-transform: none;
          font-size: 10px;
          font-weight: 600;
          color: rgba(15, 30, 29, 0.55);
        }
        .dz-compound-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .dz-legend-swatch {
          width: 12px;
          height: 2px;
          border-radius: 2px;
          display: inline-block;
        }
        .dz-compound-chart-body { flex: 1; display: flex; }
        .dz-compound-chart-body svg { width: 100%; height: 100%; min-height: 140px; display: block; }

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

        .dz-quote {
          background: #F8F2E5;
          border: 1px solid #E5E0CF;
          border-radius: 4px;
          padding: 22px 26px;
          margin-top: 24px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .dz-quote-mark {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 36px;
          color: #BF461A;
          line-height: 0.7;
          flex-shrink: 0;
        }
        .dz-quote-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dz-quote-text {
          font-family: Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.4;
          color: #0F1E1D;
          margin: 0;
        }
        .dz-quote-attr {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15, 30, 29, 0.55);
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .dz-bump, .dz-draw-line { animation: none !important; }
          .dz-bar-fill, .dz-num-input, .dz-reset,
          .dz-slider::-webkit-slider-thumb,
          .dz-slider::-moz-range-thumb { transition: none !important; }
        }
      `}</style>

      <div className="dz-root">
        <div className="dz-blob" aria-hidden="true">
          <svg viewBox="0 0 576 610" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
              fill="#CBD3CA"
            />
          </svg>
        </div>

        <p className="dz-section-meta">
          05 / The Problem
          <span className="dz-section-meta-rule" aria-hidden="true" />
        </p>

        <div className="dz-head-row">
          <h2 className="dz-headline">
            The Dead Zone<span className="dz-period">.</span>
          </h2>
          <p className="dz-headline-sub">
            Between <strong>60% and 80%</strong> of your CRM is sitting here right now — quiet, warm, unactivated. <strong>Tune the inputs.</strong> Watch what it costs.
          </p>
        </div>

        <div className="dz-calc">
          <aside className="dz-inputs" aria-label="Calculator inputs">
            <header className="dz-inputs-head">
              <span>◧ Your firm</span>
              <button type="button" className="dz-reset" onClick={handleReset}>
                Reset
              </button>
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
              <label className="dz-input-label" htmlFor="dz-book">
                Avg partner book
                <span className="dz-input-helper">contacts/partner</span>
              </label>
              <input
                id="dz-book"
                type="number"
                className="dz-num-input"
                value={vals.bookSize}
                min={CONSTRAINTS.bookSize.min}
                max={CONSTRAINTS.bookSize.max}
                step={CONSTRAINTS.bookSize.step}
                onChange={handleNumberChange('bookSize')}
                onBlur={handleNumberBlur('bookSize')}
                inputMode="numeric"
              />
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
                <span className="dz-input-label">Win rate · activated dormant</span>
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
                <span className="dz-input-label">Y1 program activation</span>
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
            <div className="dz-hero">
              <div className="dz-hero-label">
                <span>Your Dead Zone — Annual Pipeline</span>
                <span className="dz-hero-rule" aria-hidden="true" />
              </div>
              <p className="dz-hero-value" ref={heroRef}>{fmtMoney(pipelinePerBook)}</p>
              <p className="dz-hero-unit">
                <strong>{fmtNum(dormant)}</strong> dormant contacts <span className="dz-mid-dot">·</span> per partner book <span className="dz-mid-dot">·</span> per year
              </p>
            </div>

            <div className="dz-sub-col">
              <div className="dz-substat">
                <span className="dz-substat-label">Y1 Recoverable</span>
                <span className="dz-substat-value" style={{ color: '#BF461A' }}>{fmtMoney(recoverable)}</span>
                <span className="dz-substat-meta">At {activationPct}% activation</span>
              </div>
              <div className="dz-substat">
                <span className="dz-substat-label">Time to first signal</span>
                <span className="dz-substat-value">11<span className="dz-substat-unit">days</span></span>
                <span className="dz-substat-meta">Cohort median, after activation</span>
              </div>
              <div className="dz-substat">
                <span className="dz-substat-label">Cost per dormant contact</span>
                <span className="dz-substat-value" style={{ color: '#A79014' }}>${fmtNum(perContact)}</span>
                <span className="dz-substat-meta">Expected annual value, unactivated</span>
              </div>
              <div className="dz-substat">
                <span className="dz-substat-label">Partner books in firm</span>
                <span className="dz-substat-value" style={{ color: '#225351' }}>
                  {books >= 10 ? books.toFixed(0) : books.toFixed(1)}
                </span>
                <span className="dz-substat-meta">
                  Firm-wide pipeline: <b>{fmtMoney(firmPipeline)}</b>
                </span>
              </div>
            </div>

            <div className="dz-breakdown">
              <header className="dz-breakdown-head">
                <span>◧ Where the money goes</span>
                <span className="dz-breakdown-total">
                  Total at stake <b>{fmtMoney(pipelinePerBook)}</b>
                </span>
              </header>
              {BREAKDOWN.map((b) => (
                <div className="dz-bar-row" key={b.label}>
                  <div className="dz-bar-row-top">
                    <span className="dz-bar-label">{b.label}</span>
                    <span className="dz-bar-pct">{b.pct}%</span>
                  </div>
                  <div className="dz-bar-track">
                    <div className="dz-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <span className="dz-bar-amount">{fmtMoney(pipelinePerBook * (b.pct / 100))}</span>
                </div>
              ))}
            </div>

            <div className="dz-compound">
              <div className="dz-compound-text">
                <p className="dz-compound-title">
                  The Dead Zone compounds<span className="dz-period">.</span>
                </p>
                <div className="dz-compound-stats">
                  <p className="dz-compound-stat">
                    <span className="dz-dash dz-dash-loss" aria-hidden="true">—</span>
                    5-yr no action
                    <span className="dz-compound-amount">{fmtMoney(noAction)}</span>
                  </p>
                  <p className="dz-compound-stat">
                    <span className="dz-dash dz-dash-rec" aria-hidden="true">—</span>
                    5-yr activated
                    <span className="dz-compound-amount">{fmtMoney(activatedTotal)}</span>
                  </p>
                </div>
              </div>
              <div className="dz-compound-chart" aria-hidden="true">
                <header className="dz-compound-chart-head">
                  <span>◧ 5-year trajectory</span>
                  <span className="dz-compound-legend">
                    <span><i className="dz-legend-swatch" style={{ background: '#BF461A' }} /> No action</span>
                    <span><i className="dz-legend-swatch" style={{ background: '#225351' }} /> Activated</span>
                  </span>
                </header>
                <div className="dz-compound-chart-body">
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
        </div>

        <div className="dz-quote">
          <span className="dz-quote-mark" aria-hidden="true">&ldquo;</span>
          <div className="dz-quote-body">
            <p className="dz-quote-text">
              We knew we were leaving money on the table. We didn&rsquo;t know it was an entire revenue line.
            </p>
            <p className="dz-quote-attr">Managing Partner / Mid-market Advisory Firm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
