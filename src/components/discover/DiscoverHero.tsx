import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { submitMagnetUrl } from '@/lib/magnetSubmit';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ROTATOR_WORDS = ['client', 'partner', 'retainer', 'deal', 'case', 'mandate'];

const PROOF_STATS = [
  { value: 500, label: 'Practitioner Interviews' },
  { value: 30, label: 'Firms in Cohort' },
  { value: 8, label: 'Verticals Translated' },
];

export default function DiscoverHero() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reduceMotion = useReducedMotion();
  const proofRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dormantMarkerRef = useRef<SVGGElement | null>(null);
  const dormantLabelRef = useRef<SVGGElement | null>(null);
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

  // Five Orbits - DORMANT marker spins around orbit 4 (rx=475, ry=200).
  // Period 28s. Each frame updates marker position, connector Q-curve,
  // and label x-anchor (flips sides based on which half of the orbit).
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const cx = 740;
    const cy = 380;
    const orbitRx = 475;
    const orbitRy = 200;
    const period = 28000;
    const startAngle = 0.32;

    const marker = dormantMarkerRef.current;
    const connector = connectorRef.current;
    const label = dormantLabelRef.current;
    if (!marker || !connector || !label) return;

    const compute = (angle: number) => {
      const x = cx + orbitRx * Math.cos(angle);
      const y = cy + orbitRy * Math.sin(angle);
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const sx = cx + ux * 16;
      const sy = cy + uy * 16;
      const ex = x - ux * 18;
      const ey = y - uy * 18;
      const cpX = (sx + ex) / 2;
      const cpY = (sy + ey) / 2 + 16;
      const labelOffsetX = x >= cx ? 22 : -170;
      return { x, y, sx, sy, ex, ey, cpX, cpY, labelOffsetX };
    };

    const apply = (p: ReturnType<typeof compute>) => {
      marker.setAttribute('transform', `translate(${p.x}, ${p.y})`);
      connector.setAttribute(
        'd',
        `M ${p.sx} ${p.sy} Q ${p.cpX} ${p.cpY} ${p.ex} ${p.ey}`
      );
      label.setAttribute('transform', `translate(${p.x + p.labelOffsetX}, ${p.y})`);
    };

    if (reduced) {
      apply(compute(startAngle));
      return;
    }

    const startTime = performance.now();
    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = (now - startTime) % period;
      const angle = startAngle + (elapsed / period) * 2 * Math.PI;
      apply(compute(angle));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Count-up on proof numbers
  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const rafIds: number[] = [];
    const start = window.setTimeout(() => {
      proofRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = PROOF_STATS[i]?.value ?? 0;
        if (reduced) {
          el.textContent = String(target);
          return;
        }
        const duration = 1400;
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(eased * target));
          if (t < 1) rafIds.push(requestAnimationFrame(step));
        };
        rafIds.push(requestAnimationFrame(step));
      });
    }, 2400);
    return () => {
      window.clearTimeout(start);
      rafIds.forEach((id) => cancelAnimationFrame(id));
    };
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
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
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
          margin: 28px 0 24px;
          font-weight: 900;
          font-size: clamp(58px, 8.4vw, 144px);
          line-height: 0.9;
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
          max-width: 60ch;
          margin: 0 auto 32px;
          font-family: 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 19px;
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
          max-width: 580px;
          margin: 0 auto 16px;
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
          margin: 0 auto 56px;
        }
        .kl-trust-sep {
          color: var(--kl-care);
          padding: 0 8px;
          font-weight: 700;
        }

        /* Map */
        .kl-map-wrap {
          position: relative;
          margin: 24px auto 56px;
          max-width: 1040px;
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

        /* Proof strip */
        .kl-proof {
          position: relative;
          width: 100%;
          background: rgba(255,255,255,0.4);
          border-top: 1px solid rgba(15,30,29,0.08);
          border-bottom: 1px solid rgba(15,30,29,0.08);
          padding: 28px 24px;
          opacity: 0;
          animation: klFadeIn 700ms ease-out 2400ms forwards;
          z-index: 2;
        }
        .kl-proof-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .kl-proof-col {
          padding-left: 16px;
          border-left: 3px solid var(--kl-care);
          text-align: left;
        }
        .kl-proof-num {
          font-family: 'Inter Tight', 'Arial Black', sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 3vw, 42px);
          letter-spacing: -0.025em;
          line-height: 1;
          color: var(--kl-depth);
        }
        .kl-proof-num .unit { color: var(--kl-purpose); }
        .kl-proof-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0.7;
          color: var(--kl-depth);
          margin: 8px 0 0;
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
          .kl-proof-inner { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .kl-form-row { flex-direction: column; }
          .kl-submit { width: 100%; }
          .kl-blob.small { display: none; }
          .kl-trust { font-size: 12px; }
        }
        @media (max-width: 540px) {
          .kl-proof-inner { grid-template-columns: 1fr; }
          .kl-marquee-item { font-size: 11px; padding: 0 18px; gap: 18px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .kl-eyebrow, .kl-h1 .word, .kl-sub, .kl-form, .kl-trust, .kl-map-wrap, .kl-proof,
          .kl-eyebrow-dot, .kl-period, .kl-blob.big, .kl-blob.small,
          .orbit-connector, .orbit-firm-glow, .orbit-dormant-pulse, .kl-submit::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .kl-h1 .word { opacity: 1; transform: none; }
          .kl-eyebrow, .kl-sub, .kl-form, .kl-trust, .kl-map-wrap, .kl-proof { opacity: 1; }
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
                      Get My Map <span className="kl-submit-arrow" aria-hidden>→</span>
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

                {/* Atmospheric speckle dots */}
                <g fill="#0F1E1D" opacity="0.18">
                  <circle cx="160" cy="380" r="0.9" />
                  <circle cx="1320" cy="380" r="0.9" />
                  <circle cx="240" cy="430" r="0.8" />
                  <circle cx="1240" cy="320" r="1" />
                  <circle cx="380" cy="190" r="0.9" />
                  <circle cx="1100" cy="565" r="0.8" />
                  <circle cx="610" cy="125" r="1" />
                  <circle cx="870" cy="635" r="0.9" />
                </g>

                {/* Five static dark planet spheres */}
                <g>
                  <ellipse cx="540" cy="276" rx="14" ry="3" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="540" cy="270" r="11" fill="url(#planetGrad)" />
                  <circle cx="536" cy="266" r="3" fill="#7A8A85" opacity="0.35" />
                </g>
                <g>
                  <ellipse cx="430" cy="386" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="430" cy="382" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="427" cy="379" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>
                <g>
                  <ellipse cx="595" cy="404" rx="9" ry="2" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="595" cy="400" r="7" fill="url(#planetGrad)" />
                  <circle cx="593" cy="398" r="2" fill="#7A8A85" opacity="0.35" />
                </g>
                <g>
                  <ellipse cx="1180" cy="326" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="1180" cy="320" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="1177" cy="317" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>
                <g>
                  <ellipse cx="500" cy="496" rx="11" ry="2.5" fill="rgba(15, 30, 29, 0.18)" />
                  <circle cx="500" cy="490" r="8.5" fill="url(#planetGrad)" />
                  <circle cx="497" cy="487" r="2.4" fill="#7A8A85" opacity="0.35" />
                </g>

                {/* Dashed connector (animated by JS) */}
                <path
                  ref={connectorRef}
                  className="orbit-connector"
                  fill="none"
                  stroke="#BF461A"
                  strokeWidth="1.4"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  d=""
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

                {/* DORMANT marker group (animated by JS) */}
                <g ref={dormantMarkerRef}>
                  <ellipse cx="0" cy="14" rx="14" ry="2.5" fill="rgba(15, 30, 29, 0.20)" filter="url(#softShadow)" />
                  <circle cx="0" cy="0" r="10" fill="url(#dormantGrad)" filter="url(#softShadow)" />
                  <ellipse cx="-3" cy="-4" rx="3.4" ry="2.2" fill="rgba(255, 255, 255, 0.40)" />
                </g>

                {/* DORMANT label (animated by JS) */}
                <g ref={dormantLabelRef}>
                  <rect x="0" y="-15" width="148" height="30" rx="15" fill="#FCFAF4" stroke="#BF461A" strokeWidth="1.5" />
                  <text x="14" y="4" fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace" fontSize="11" letterSpacing="2.2" fill="#BF461A" fontWeight="700">
                    DORMANT
                  </text>
                  <text x="86" y="4" fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace" fontSize="11" fill="#9AA09C" fontWeight="700">
                    ·
                  </text>
                  <text x="100" y="5" fontFamily="'Arial Black', 'Inter Tight', sans-serif" fontSize="13" letterSpacing="-0.52" fill="#0F1E1D" fontWeight="900">
                    $400K
                  </text>
                </g>

                {/* Bottom-left axis label */}
                <g transform="translate(56 644)">
                  <g transform="translate(0 -12)">
                    <circle cx="16" cy="16" r="16" fill="#FCFAF4" stroke="rgba(15, 30, 29, 0.20)" strokeWidth="1.5" />
                    <g transform="translate(8 8)" fill="none" stroke="#0F1E1D" strokeWidth="1.2" strokeLinecap="round">
                      <circle cx="5" cy="6" r="2.2" />
                      <circle cx="11" cy="6" r="2.2" />
                      <path d="M2 13 c 0 -2 1.5 -3 3 -3 c 1.5 0 3 1 3 3" />
                      <path d="M8 13 c 0 -2 1.5 -3 3 -3 c 1.5 0 3 1 3 3" />
                    </g>
                  </g>
                  <text
                    x="46"
                    y="9"
                    fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace"
                    fontSize="13"
                    letterSpacing="2.86"
                    fill="#0F1E1D"
                    fontWeight="700"
                  >
                    RELATIONSHIP DEPTH
                  </text>
                  <text x="287" y="9" fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace" fontSize="16" fill="#BF461A" fontWeight="700">
                    →
                  </text>
                  <line x1="46" y1="22" x2="320" y2="22" stroke="#BF461A" strokeWidth="1" />
                </g>

                {/* Bottom-right axis label */}
                <g transform="translate(1424 644)">
                  <text
                    x="-46"
                    y="9"
                    textAnchor="end"
                    fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace"
                    fontSize="13"
                    letterSpacing="2.86"
                    fill="#0F1E1D"
                    fontWeight="700"
                  >
                    REVENUE OPPORTUNITY
                  </text>
                  <text x="-30" y="9" fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace" fontSize="16" fill="#BF461A" fontWeight="700">
                    →
                  </text>
                  <g transform="translate(-32 -12)">
                    <circle cx="16" cy="16" r="16" fill="#FCFAF4" stroke="rgba(15, 30, 29, 0.20)" strokeWidth="1.5" />
                    <g transform="translate(8 8)" fill="#0F1E1D">
                      <rect x="2.5" y="9" width="2.4" height="5" rx="0.4" />
                      <rect x="6.8" y="6" width="2.4" height="8" rx="0.4" />
                      <rect x="11.1" y="3" width="2.4" height="11" rx="0.4" />
                    </g>
                  </g>
                  <line x1="-320" y1="22" x2="-46" y2="22" stroke="#BF461A" strokeWidth="1" />
                </g>

                {/* PREVIEW caption (bottom-right) */}
                <g transform="translate(1424 712)">
                  <text
                    x="0"
                    y="0"
                    textAnchor="end"
                    fontFamily="'JetBrains Mono', 'IBM Plex Mono', monospace"
                    fontSize="11"
                    letterSpacing="2.42"
                    fill="#6B7370"
                    fontWeight="700"
                  >
                    <tspan>PREVIEW</tspan>
                    <tspan dx="6" fill="#BF461A">·</tspan>
                    <tspan dx="6">FIVE ORBITS FRAMEWORK</tspan>
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="kl-proof">
          <div className="kl-proof-inner">
            {PROOF_STATS.map((stat, i) => (
              <div className="kl-proof-col" key={stat.label}>
                <div className="kl-proof-num">
                  <span ref={(el) => { proofRefs.current[i] = el; }}>0</span>
                </div>
                <p className="kl-proof-label">{stat.label}</p>
              </div>
            ))}
            <div className="kl-proof-col">
              <div className="kl-proof-num">
                $1.2<span className="unit">M</span>
              </div>
              <p className="kl-proof-label">Verified · AArete reactivation</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
