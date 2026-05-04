import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { submitMagnetUrl } from '@/lib/magnetSubmit';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ROTATOR_WORDS = ['client', 'partner', 'retainer', 'deal', 'case', 'mandate'];

const ORBIT_CX = 740;
const ORBIT_CY = 380;

type Planet = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  period: number;
  startAngle: number;
};

const buildPlanet = (x: number, y: number, rx: number, ry: number, period: number): Planet => ({
  x,
  y,
  rx,
  ry,
  period,
  startAngle: Math.atan2((y - ORBIT_CY) / ry, (x - ORBIT_CX) / rx),
});

// Each planet is snapped to one of the five existing orbit ellipses by closest distance.
// Order matches the rotator words used as labels during the connect phase.
const PLANETS: Planet[] = [
  buildPlanet(595, 432, 105, 44, 18000),  // CLIENT — innermost, fastest
  buildPlanet(572, 290, 220, 92, 24000),  // PARTNER
  buildPlanet(508, 519, 345, 146, 30000), // RETAINER
  buildPlanet(390, 440, 475, 200, 36000), // DEAL
  buildPlanet(1092, 340, 610, 252, 44000), // CASE — outermost, slowest
];

export default function DiscoverHero() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reduceMotion = useReducedMotion();
  const planetRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRef = useRef<SVGGElement | null>(null);
  const labelTextRef = useRef<SVGTextElement | null>(null);
  const connectorRef = useRef<SVGPathElement | null>(null);

  const rotatorMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rotatorEmWidths, setRotatorEmWidths] = useState<number[]>([]);
  const [rotatorIdx, setRotatorIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const widths = ROTATOR_WORDS.map((_, i) => {
        const el = rotatorMeasureRefs.current[i];
        if (!el) return 5.4;
        const parent = el.parentElement;
        if (!parent) return 5.4;
        const fontSize = parseFloat(getComputedStyle(parent).fontSize);
        if (!fontSize) return 5.4;
        return el.getBoundingClientRect().width / fontSize;
      });
      setRotatorEmWidths(widths);
    };
    if (typeof document !== 'undefined' && (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready) {
      (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready.then(measure);
    } else {
      measure();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const rotatorWidthEm = rotatorEmWidths[rotatorIdx];

  // Five Orbits — two-phase animation.
  // Phase A (0..10s): YOUR FIRM connects to each planet in turn (2s each),
  //   showing a rotator-word label above the active planet.
  // Phase B (10s+): connector + label fade out and all five planets orbit
  //   YOUR FIRM on their assigned ellipses at their own periods.
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const connector = connectorRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;
    if (!connector || !label || !labelText) return;

    const STEP_MS = 2000;
    const SEQUENCE_END = STEP_MS * PLANETS.length;
    const FADE_MS = 600;

    const drawConnector = (px: number, py: number) => {
      const dx = px - ORBIT_CX;
      const dy = py - ORBIT_CY;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const sx = ORBIT_CX + ux * 16;
      const sy = ORBIT_CY + uy * 16;
      const ex = px - ux * 14;
      const ey = py - uy * 14;
      const cpX = (sx + ex) / 2;
      const cpY = (sy + ey) / 2 + 16;
      connector.setAttribute('d', `M ${sx} ${sy} Q ${cpX} ${cpY} ${ex} ${ey}`);
    };

    const placeLabel = (px: number, py: number, word: string) => {
      const offsetX = px >= ORBIT_CX ? 22 : -150;
      label.setAttribute('transform', `translate(${px + offsetX}, ${py})`);
      labelText.textContent = word.toUpperCase();
    };

    // Synchronous initial frame so first paint matches phase A frame 0
    // even before RAF starts ticking.
    {
      const p = PLANETS[0];
      drawConnector(p.x, p.y);
      placeLabel(p.x, p.y, ROTATOR_WORDS[0]);
      label.style.opacity = '1';
      connector.style.opacity = '1';
    }

    if (reduced) return;

    const t0 = performance.now();
    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = now - t0;

      if (elapsed < SEQUENCE_END) {
        // Phase A — advance every 2s.
        const stepIdx = Math.min(PLANETS.length - 1, Math.floor(elapsed / STEP_MS));
        const p = PLANETS[stepIdx];
        // Reset planet transforms in case we re-enter phase A on hot reload.
        planetRefs.current.forEach((g) => {
          if (g) g.setAttribute('transform', 'translate(0,0)');
        });
        drawConnector(p.x, p.y);
        placeLabel(p.x, p.y, ROTATOR_WORDS[stepIdx]);
        label.style.opacity = '1';
        connector.style.opacity = '1';
      } else {
        // Phase B — connector + label fade, planets orbit.
        const fadeT = Math.min(1, (elapsed - SEQUENCE_END) / FADE_MS);
        const opacity = String(1 - fadeT);
        label.style.opacity = opacity;
        connector.style.opacity = opacity;

        const tOrbit = elapsed - SEQUENCE_END;
        PLANETS.forEach((p, i) => {
          const g = planetRefs.current[i];
          if (!g) return;
          const angle = p.startAngle + (tOrbit / p.period) * 2 * Math.PI;
          const x = ORBIT_CX + p.rx * Math.cos(angle);
          const y = ORBIT_CY + p.ry * Math.sin(angle);
          g.setAttribute('transform', `translate(${x - p.x}, ${y - p.y})`);
        });
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitMagnetUrl(website, { verticalSlug: 'general' });
      if (!result.ok) {
        if (result.validation) setError(result.error);
        else toast.error(result.error);
        setSubmitting(false);
        return;
      }
      navigate(result.destination, { state: { websiteUrl: result.normalizedUrl } });
    } catch (err) {
      console.error('Hero submit error:', err);
      toast.error('Something went wrong - please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --kl-elevation: #EDF5EC;
          --kl-depth: #0F1E1D;
          --kl-care: #BF461A;
          --kl-energy: #FFBA1A;
          --kl-purpose: #A79014;
          --kl-olive: #CBD3CA;
          --kl-transparency: #D5DED4;
        }

        .kl-root {
          position: relative;
          width: 100%;
          background: var(--kl-elevation);
          overflow: hidden;
          font-family: 'Inter Tight', 'Arial Black', 'Helvetica Neue', Impact, system-ui, sans-serif;
        }

        /* ── Hero body ── */
        .kl-hero {
          position: relative;
          padding: 96px 24px 72px;
          z-index: 2;
        }
        .kl-inner {
          max-width: 1320px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .kl-split {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.5fr);
          gap: 32px;
          align-items: center;
          text-align: left;
        }
        .kl-split-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .kl-split-map {
          position: relative;
          width: 130%;
          margin-right: -30%;
        }
        @media (max-width: 1024px) {
          .kl-split {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          .kl-split-copy { align-items: center; }
          .kl-split-map { width: 100%; margin-right: 0; }
        }

        /* Watermark blobs */
        .kl-blob {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .kl-blob.big {
          top: 50%; left: 50%;
          width: 1100px; height: 1100px;
          margin: -550px 0 0 -550px;
          opacity: 0.55;
          animation: klRotateBlob 90s linear infinite;
        }
        .kl-blob.small {
          top: 18%; right: -200px;
          width: 600px; height: 600px;
          opacity: 0.45;
          animation: klRotateBlob2 60s linear infinite;
        }

        /* Eyebrow chip */
        .kl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(15,30,29,0.18);
          border-radius: 999px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--kl-depth);
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 400ms forwards;
        }
        .kl-eyebrow-dot {
          width: 8px; height: 8px;
          background: var(--kl-care);
          border-radius: 50%;
          animation: klPulseDot 1.6s ease-in-out infinite;
        }
        /* Headline */
        .kl-h1 {
          margin: 20px 0 20px;
          font-weight: 900;
          font-size: clamp(40px, 4.6vw, 76px);
          line-height: 0.92;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: var(--kl-depth);
        }
        .kl-h1 .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          animation: klWordIn 800ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin: 0 0.18em 0 0;
        }
        .kl-h1 .word:last-child { margin-right: 0; }
        .kl-h1 .word.w1 { animation-delay: 600ms; }
        .kl-h1 .word.w2 { animation-delay: 700ms; }
        .kl-h1 .word.w3 { animation-delay: 800ms; }
        .kl-h1 .word.w4 { animation-delay: 900ms; }
        .kl-h1 .word.w5 { animation-delay: 1000ms; }
        .kl-h1 .word.w6 { animation-delay: 1100ms; }

        .kl-rotator {
          position: relative;
          display: inline-block;
          vertical-align: baseline;
          color: var(--kl-care);
          background: linear-gradient(to top, rgba(191, 70, 26, 0.16) 22%, transparent 22%);
          padding: 0 0.12em;
          width: 5.4em;
          height: 0.95em;
          transition: width 0.45s cubic-bezier(0.13, 0.28, 0.3, 1);
        }
        .kl-rotator-measure {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          top: 0;
          left: 0;
          white-space: nowrap;
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
        }
        .kl-rotator-measure > span {
          display: inline-block;
        }
        .kl-rotator-static {
          display: inline-block;
          width: 100%;
          text-align: center;
          line-height: 1;
        }
        .kl-gooey {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 1;
        }
        .kl-gooey > span:last-child {
          width: 100%;
          height: 100%;
        }
        .kl-gooey-text {
          font: inherit;
          color: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          line-height: 1;
        }
        @media (max-width: 540px) {
          .kl-rotator { width: 5em; }
        }

        .kl-period {
          color: var(--kl-energy);
          animation: klBlink 1.4s ease-in-out 1500ms infinite;
        }

        /* Sub */
        .kl-sub {
          max-width: 56ch;
          margin: 0 0 28px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 16px;
          line-height: 1.55;
          letter-spacing: -0.025em;
          color: var(--kl-depth);
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1300ms forwards;
        }
        .kl-sub-inner { opacity: 0.78; }
        .kl-hl {
          background: linear-gradient(to top, rgba(255, 186, 26, 0.45) 38%, transparent 38%);
          font-weight: 700;
        }

        /* Form */
        .kl-form {
          width: 100%;
          max-width: 560px;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1500ms forwards;
        }
        .kl-form-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }
        .kl-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .kl-input {
          width: 100%;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(15,30,29,0.22);
          border-radius: 8px;
          padding: 14px 16px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 16px;
          letter-spacing: -0.02em;
          color: var(--kl-depth);
          outline: none;
          transition: border-color 250ms ease, box-shadow 250ms ease, background 250ms ease;
          min-height: 54px;
        }
        .kl-input::placeholder { color: rgba(15,30,29,0.42); }
        .kl-input:focus {
          border-color: var(--kl-care);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(191, 70, 26, 0.12);
        }
        .kl-submit {
          position: relative;
          background: var(--kl-care);
          color: var(--kl-elevation);
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-weight: 900;
          font-size: 16px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          border: none;
          border-radius: 999px;
          padding: 0 28px;
          min-height: 54px;
          cursor: pointer;
          overflow: hidden;
          transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }
        .kl-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .kl-submit-arrow {
          display: inline-block;
          transition: transform 350ms cubic-bezier(0.85, 0, 0.15, 1);
        }
        .kl-submit::after {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 60%; height: 200%;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: rotate(8deg);
          animation: klShimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .kl-submit:hover:not(:disabled) {
          background: var(--kl-depth);
          transform: translateY(-1px);
        }
        .kl-submit:hover:not(:disabled) .kl-submit-arrow {
          transform: translateX(6px);
        }
        .kl-spin {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(237,245,236,0.35);
          border-top-color: var(--kl-elevation);
          animation: klSpin 700ms linear infinite;
        }
        .kl-error {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: var(--kl-care);
          margin: 4px 0 0;
        }

        /* Trust line */
        .kl-trust {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: -0.02em;
          color: var(--kl-depth);
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1700ms forwards;
          margin: 0 0 0;
        }
        .kl-trust-sep {
          color: var(--kl-care);
          padding: 0 8px;
          font-weight: 700;
        }

        /* Map */
        .kl-map-wrap {
          position: relative;
          margin: 0;
          width: 100%;
          padding: 0;
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2000ms forwards;
        }
        .kl-map-svg {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        /* Five Orbits visualization animations */
        .orbit-connector {
          animation: orbitDashShift 32s linear infinite;
        }
        @keyframes orbitDashShift { to { stroke-dashoffset: -200; } }

        .orbit-firm-glow {
          transform-origin: 740px 380px;
          animation: orbitFirmPulse 3.6s ease-in-out infinite;
        }
        @keyframes orbitFirmPulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.55; }
        }

        .orbit-dormant-pulse {
          transform-origin: center;
          transform-box: fill-box;
          animation: orbitDormantPulse 2.4s ease-out infinite;
        }
        @keyframes orbitDormantPulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0;   transform: scale(2.3); }
        }

        /* Keyframes */
        @keyframes klFadeIn { to { opacity: 1; } }
        @keyframes klFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes klWordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes klBlink {
          0%, 100% { opacity: 1; }
          80%      { opacity: 0.25; }
        }
        @keyframes klPulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.18); opacity: 0.5; }
        }
        @keyframes klShimmer {
          0%   { left: -60%; }
          50%  { left: 120%; }
          100% { left: 120%; }
        }
        @keyframes klRotateBlob {
          to { transform: rotate(360deg); }
        }
        @keyframes klRotateBlob2 {
          to { transform: rotate(-360deg); }
        }
        @keyframes klSpin { to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 900px) {
          .kl-hero { padding: 72px 20px 56px; }
          .kl-form-row { flex-direction: column; }
          .kl-submit { width: 100%; }
          .kl-blob.small { display: none; }
          .kl-trust { font-size: 12px; }
        }
        @media (max-width: 540px) {
          .kl-marquee-item { font-size: 11px; padding: 0 18px; gap: 18px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .kl-eyebrow, .kl-h1 .word, .kl-sub, .kl-form, .kl-trust, .kl-map-wrap,
          .kl-eyebrow-dot, .kl-period, .kl-blob.big, .kl-blob.small,
          .orbit-connector, .orbit-firm-glow, .orbit-dormant-pulse, .kl-submit::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .kl-h1 .word { opacity: 1; transform: none; }
          .kl-eyebrow, .kl-sub, .kl-form, .kl-trust, .kl-map-wrap { opacity: 1; }
        }
      `}</style>

      <section className="kl-root" aria-label="Hero">
        <div className="kl-hero">
          <svg
            className="kl-blob big"
            viewBox="0 0 576 610"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z" fill="#CBD3CA" />
          </svg>
          <svg
            className="kl-blob small"
            viewBox="0 0 576 610"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z" fill="#D5DED4" />
          </svg>

          <div className="kl-inner">
           <div className="kl-split">
            <div className="kl-split-copy">
            <h1 className="kl-h1">
              <span className="word w1">Your</span>
              <span className="word w2">next</span>
              <span
                className="word w3 kl-rotator"
                style={rotatorWidthEm ? { width: `${rotatorWidthEm + 0.24}em` } : undefined}
              >
                <span className="kl-rotator-measure" aria-hidden>
                  {ROTATOR_WORDS.map((w, i) => (
                    <span
                      key={w}
                      ref={(el) => {
                        rotatorMeasureRefs.current[i] = el;
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </span>
                {reduceMotion ? (
                  <span className="kl-rotator-static">{ROTATOR_WORDS[0]}</span>
                ) : (
                  <GooeyText
                    texts={ROTATOR_WORDS}
                    morphTime={0.55}
                    cooldownTime={1.6}
                    className="kl-gooey"
                    textClassName="kl-gooey-text"
                    onIndexChange={setRotatorIdx}
                  />
                )}
              </span>
              <br />
              <span className="word w4">already</span>
              <span className="word w5">knows</span>
              <span className="word w6">
                you<span className="kl-period">.</span>
              </span>
            </h1>

            <p className="kl-sub">
              <span className="kl-sub-inner">
                The largest research on GTM in professional services.{' '}
                <span className="kl-hl">500 practitioner interviews.</span> Validated by Copulsky.
                The map shows where your firm sits in the <span className="kl-hl">Dead Zone</span>{' '}
                - and the one chapter that fixes your biggest gap.
              </span>
            </p>

            <form className="kl-form" onSubmit={handleSubmit} noValidate data-cta="add-your-firm">
              <div className="kl-form-row">
                <div className="kl-input-wrap">
                  <input
                    type="url"
                    autoComplete="url"
                    className="kl-input"
                    placeholder="yourfirm.com"
                    aria-label="Your firm's website URL"
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>
                <button type="submit" disabled={submitting} className="kl-submit">
                  {submitting ? (
                    <>
                      <span className="kl-spin" aria-hidden />
                      Building…
                    </>
                  ) : (
                    <>
                      Add Your Firm <span className="kl-submit-arrow" aria-hidden>→</span>
                    </>
                  )}
                </button>
              </div>
              {error && <p className="kl-error">{error}</p>}
            </form>

            <p className="kl-trust">
              Free<span className="kl-trust-sep">·</span>90 seconds
              <span className="kl-trust-sep">·</span>No email required
              <span className="kl-trust-sep">·</span>Confidential
              <span className="kl-trust-sep">·</span>Peer-benchmarked
            </p>
            </div>
            <div className="kl-split-map">
            <div className="kl-map-wrap">
              <svg
                className="kl-map-svg"
                viewBox="0 0 1480 740"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <radialGradient id="firmGrad" cx="32%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFF6CC" />
                    <stop offset="22%" stopColor="#FFD64A" />
                    <stop offset="62%" stopColor="#E89500" />
                    <stop offset="100%" stopColor="#7A4A00" />
                  </radialGradient>
                  <radialGradient id="firmGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD64A" stopOpacity="0.55" />
                    <stop offset="40%" stopColor="#FFBA1A" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#FFBA1A" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="planetGrad" cx="32%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#566660" />
                    <stop offset="40%" stopColor="#2A3936" />
                    <stop offset="100%" stopColor="#0A1311" />
                  </radialGradient>

                  <radialGradient id="dormantGrad" cx="32%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFC9A8" />
                    <stop offset="22%" stopColor="#FF8050" />
                    <stop offset="60%" stopColor="#C2461C" />
                    <stop offset="100%" stopColor="#5A1F0A" />
                  </radialGradient>
                  <radialGradient id="dormantGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF6A2C" stopOpacity="0.55" />
                    <stop offset="40%" stopColor="#BF461A" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#BF461A" stopOpacity="0" />
                  </radialGradient>

                  <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="3" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.35" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Crosshair axes */}
                <line x1="60" y1="380" x2="1420" y2="380" stroke="rgba(15, 30, 29, 0.14)" strokeWidth="0.6" />
                <line x1="740" y1="100" x2="740" y2="660" stroke="rgba(15, 30, 29, 0.12)" strokeWidth="0.6" strokeDasharray="2 3" />
                <path d="M 70 374 L 60 380 L 70 386" fill="none" stroke="rgba(15, 30, 29, 0.30)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 1410 374 L 1420 380 L 1410 386" fill="none" stroke="rgba(15, 30, 29, 0.30)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

                {/* Five orbit ellipses */}
                <ellipse cx="740" cy="380" rx="105" ry="44" fill="none" stroke="#0F1E1D" strokeWidth="0.7" strokeOpacity="0.30" />
                <ellipse cx="740" cy="380" rx="220" ry="92" fill="none" stroke="#0F1E1D" strokeWidth="0.5" strokeOpacity="0.40" strokeDasharray="1.5 3" />
                <ellipse cx="740" cy="380" rx="345" ry="146" fill="none" stroke="#0F1E1D" strokeWidth="0.7" strokeOpacity="0.30" />
                <ellipse cx="740" cy="380" rx="475" ry="200" fill="none" stroke="#0F1E1D" strokeWidth="0.5" strokeOpacity="0.40" strokeDasharray="1.5 3" />
                <ellipse cx="740" cy="380" rx="610" ry="252" fill="none" stroke="#0F1E1D" strokeWidth="0.7" strokeOpacity="0.18" />

                {/* Atmospheric speckle dots — kept off the horizontal axis
                    and clearly outside the orbit ellipses. */}
                <g fill="#0F1E1D" opacity="0.18">
                  <circle cx="160" cy="356" r="0.9" />
                  <circle cx="1320" cy="404" r="0.9" />
                  <circle cx="240" cy="446" r="0.8" />
                  <circle cx="1240" cy="306" r="1" />
                  <circle cx="340" cy="158" r="0.9" />
                  <circle cx="1140" cy="600" r="0.8" />
                  <circle cx="610" cy="110" r="1" />
                  <circle cx="870" cy="650" r="0.9" />
                </g>

                {/* Five planets — each indexed into PLANETS so the JS animation
                    can move them. Group transform="translate(dx,dy)" deltas
                    are applied on top of the authored cx/cy. */}
                <g ref={(el) => { planetRefs.current[1] = el; }}>
                  <ellipse cx="572" cy="296" rx="14" ry="3" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="572" cy="290" r="11" fill="url(#planetGrad)" />
                  <circle cx="568" cy="286" r="3" fill="#7A8A85" opacity="0.35" />
                </g>
                <g ref={(el) => { planetRefs.current[3] = el; }}>
                  <ellipse cx="390" cy="444" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="390" cy="440" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="387" cy="437" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>
                <g ref={(el) => { planetRefs.current[0] = el; }}>
                  <ellipse cx="595" cy="436" rx="9" ry="2" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="595" cy="432" r="7" fill="url(#planetGrad)" />
                  <circle cx="593" cy="430" r="2" fill="#7A8A85" opacity="0.35" />
                </g>
                <g ref={(el) => { planetRefs.current[4] = el; }}>
                  <ellipse cx="1092" cy="346" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="1092" cy="340" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="1089" cy="337" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>
                <g ref={(el) => { planetRefs.current[2] = el; }}>
                  <ellipse cx="508" cy="525" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="508" cy="519" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="505" cy="516" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>

                {/* Dashed connector (animated by JS) — initial d pre-rendered for planet 0 */}
                <path
                  ref={connectorRef}
                  className="orbit-connector"
                  fill="none"
                  stroke="#BF461A"
                  strokeWidth="1.4"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  d="M 729 396 Q 731 414 597 432"
                />

                {/* YOUR FIRM at center */}
                <ellipse cx="740" cy="395" rx="22" ry="4" fill="rgba(15, 30, 29, 0.15)" filter="url(#softShadow)" />
                <circle cx="740" cy="380" r="14" fill="url(#firmGrad)" filter="url(#softShadow)" />
                <ellipse cx="736" cy="375" rx="4.5" ry="3" fill="rgba(255, 255, 255, 0.45)" />

                {/* YOUR FIRM black-pill label */}
                <g transform="translate(740 322)">
                  <rect x="-52" y="-15" width="104" height="28" rx="6" fill="#0F1E1D" />
                  <path d="M -8 13 L 0 22 L 8 13 Z" fill="#0F1E1D" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace"
                    fontSize="11"
                    letterSpacing="2.2"
                    fill="#F5F2EA"
                    fontWeight="700"
                  >
                    YOUR FIRM
                  </text>
                </g>

                {/* Active rotator-word label (animated by JS) — initial transform/text pre-rendered for planet 0 */}
                <g ref={labelRef} transform="translate(445, 432)">
                  <rect x="0" y="-15" width="118" height="30" rx="15" fill="#FCFAF4" stroke="#BF461A" strokeWidth="1.5" />
                  <text
                    ref={labelTextRef}
                    x="14"
                    y="4"
                    fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace"
                    fontSize="11"
                    letterSpacing="2.2"
                    fill="#BF461A"
                    fontWeight="700"
                  >
                    CLIENT
                  </text>
                </g>

              </svg>
            </div>
            </div>
           </div>
          </div>
        </div>

      </section>
    </>
  );
}
