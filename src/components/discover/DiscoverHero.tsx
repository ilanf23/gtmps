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
      toast.error('Something went wrong — please try again.');
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
          max-width: 760px;
          padding: 16px 8px 12px;
          opacity: 0;
          animation: klFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 2000ms forwards;
        }
        .kl-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .kl-map-tl, .kl-map-br {
          position: absolute;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--kl-depth);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .kl-map-tl { top: -4px; left: 8px; }
        .kl-map-br { bottom: -2px; right: 8px; opacity: 0.7; }
        .kl-map-tl-dot {
          width: 6px; height: 6px;
          background: var(--kl-care);
          border-radius: 50%;
          animation: klPulseDot 1.6s ease-in-out infinite;
        }

        /* Map SVG animations */
        .orbit { fill: none; stroke: var(--kl-depth); stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: klDrawOrbit 2200ms cubic-bezier(0.45, 0, 0.2, 1) forwards; }
        .orbit.o1 { animation-delay: 2100ms; opacity: 0.3;  stroke-width: 1.5; }
        .orbit.o2 { animation-delay: 2300ms; opacity: 0.45; stroke-width: 1.7; }
        .orbit.o3 { animation-delay: 2500ms; opacity: 0.6;  stroke-width: 1.9; }
        .orbit.o4 { animation-delay: 2700ms; opacity: 0.85; stroke-width: 2.1; }
        @keyframes klDrawOrbit { to { stroke-dashoffset: 0; } }

        .map-dot { opacity: 0; transform-origin: center; transform-box: fill-box; animation: klDotIn 600ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards; }
        .map-dot.you    { animation-delay: 3000ms; }
        .map-dot.signal { animation-delay: 3400ms; }
        .map-dot.q1     { animation-delay: 3700ms; }
        .map-dot.q2     { animation-delay: 3900ms; }
        .map-dot.q3     { animation-delay: 4100ms; }
        @keyframes klDotIn {
          0%   { opacity: 0; transform: scale(0.2); }
          60%  { transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }

        .map-pulse { transform-origin: center; transform-box: fill-box; animation: klRingPulse 2.4s ease-out 3200ms infinite; }
        @keyframes klRingPulse {
          0%   { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .connector {
          fill: none;
          stroke: var(--kl-care);
          stroke-width: 1.6;
          stroke-dasharray: 4 5;
          opacity: 0;
          animation:
            klConnectorIn 800ms ease-out 3600ms forwards,
            klDashShift 8s linear 3600ms infinite;
        }
        @keyframes klConnectorIn { to { opacity: 1; } }
        @keyframes klDashShift  { to { stroke-dashoffset: -90; } }

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
          .orbit, .map-dot, .map-pulse, .connector, .kl-submit::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .kl-h1 .word { opacity: 1; transform: none; }
          .kl-eyebrow, .kl-sub, .kl-form, .kl-trust, .kl-map-wrap, .kl-proof { opacity: 1; }
          .orbit { stroke-dashoffset: 0; }
          .map-dot, .connector { opacity: 1; transform: none; }
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
              <span className="word w3 kl-rotator">
                {reduceMotion ? (
                  <span className="kl-rotator-static">{ROTATOR_WORDS[0]}</span>
                ) : (
                  <GooeyText
                    texts={ROTATOR_WORDS}
                    morphTime={0.55}
                    cooldownTime={1.6}
                    className="kl-gooey"
                    textClassName="kl-gooey-text"
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
                — and the one chapter that fixes your biggest gap.
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
              <span className="kl-map-tl">
                <span className="kl-map-tl-dot" aria-hidden />
                Building map · 30-firm cohort
              </span>
              <span className="kl-map-br">Preview · Five Orbits framework</span>
              <svg className="kl-map-svg" viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <line x1="40" y1="120" x2="680" y2="120" stroke="#0F1E1D" strokeWidth="0.5" opacity="0.15" />
                <line x1="360" y1="20" x2="360" y2="220" stroke="#0F1E1D" strokeWidth="0.5" opacity="0.15" />
                <g stroke="#0F1E1D" strokeWidth="0.8" opacity="0.3">
                  <line x1="120" y1="118" x2="120" y2="122" />
                  <line x1="240" y1="118" x2="240" y2="122" />
                  <line x1="480" y1="118" x2="480" y2="122" />
                  <line x1="600" y1="118" x2="600" y2="122" />
                </g>
                <ellipse className="orbit o1" cx="360" cy="120" rx="300" ry="100" />
                <ellipse className="orbit o2" cx="360" cy="120" rx="225" ry="78" />
                <ellipse className="orbit o3" cx="360" cy="120" rx="150" ry="55" />
                <ellipse className="orbit o4" cx="360" cy="120" rx="80" ry="32" />
                <g className="map-dot you">
                  <circle cx="360" cy="120" r="9" fill="#FFBA1A" stroke="#0F1E1D" strokeWidth="2" />
                  <circle className="map-pulse" cx="360" cy="120" r="9" fill="none" stroke="#FFBA1A" strokeWidth="1.5" />
                </g>
                <g className="map-dot signal">
                  <circle cx="540" cy="155" r="7" fill="#BF461A" />
                  <circle className="map-pulse" cx="540" cy="155" r="7" fill="none" stroke="#BF461A" strokeWidth="1.5" />
                </g>
                <circle className="map-dot q1" cx="180" cy="80" r="5" fill="#0F1E1D" opacity="0.5" />
                <circle className="map-dot q2" cx="565" cy="68" r="4" fill="#0F1E1D" opacity="0.4" />
                <circle className="map-dot q3" cx="200" cy="170" r="5" fill="#0F1E1D" opacity="0.45" />
                <path className="connector" d="M 360 120 Q 450 115, 540 155" />
                <g fontFamily="'IBM Plex Mono', monospace" fontSize="10" letterSpacing="0.5">
                  <g className="map-dot you">
                    <text x="360" y="105" textAnchor="middle" fill="#0F1E1D" fontWeight="700">YOUR FIRM</text>
                  </g>
                  <g className="map-dot signal">
                    <text x="555" y="148" fill="#BF461A" fontWeight="700">DORMANT · $400K</text>
                  </g>
                </g>
                <text x="40" y="232" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fill="#0F1E1D" opacity="0.55" letterSpacing="1.5">RELATIONSHIP DEPTH →</text>
                <text x="680" y="232" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fill="#0F1E1D" opacity="0.55" letterSpacing="1.5" textAnchor="end">REVENUE OPPORTUNITY →</text>
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
