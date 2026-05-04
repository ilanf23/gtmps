import { useEffect, useRef, useState } from "react";

const STATEMENT_WORDS = ["The", "ones", "that", "move", "first", "set", "the terms."];

export default function WhyNow() {
  const statRef = useRef<HTMLParagraphElement | null>(null);
  const [statValue, setStatValue] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  useEffect(() => {
    const el = statRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStatValue(73);
      return;
    }
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          if (reduceMotion) {
            setStatValue(73);
            return;
          }
          const target = 73;
          const duration = 1600;
          timeoutId = setTimeout(() => {
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setStatValue(Math.round(eased * target));
              if (t < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
          }, 200);
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      id="why-now"
      style={{
        background: "#F5F1E8",
        borderTop: "1px solid rgba(15, 30, 29, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .wn-blob {
          position: absolute;
          top: -200px;
          left: -180px;
          width: 720px;
          height: auto;
          opacity: 0.32;
          pointer-events: none;
          animation: wnBlobRotate 100s linear infinite;
          z-index: 0;
        }
        @keyframes wnBlobRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .wn-inner {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
        }
        .wn-header {
          padding: 80px 56px 36px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .wn-header-left { max-width: 720px; }
        .wn-body {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 44px;
          padding: 12px 56px 56px;
        }
        .wn-kicker-wrap {
          padding: 36px 56px 80px;
          border-top: 1px solid rgba(15, 30, 29, 0.08);
        }
        @media (max-width: 1100px) {
          .wn-body { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 720px) {
          .wn-header     { padding: 56px 22px 24px; }
          .wn-body       { padding: 8px 22px 40px; gap: 28px; }
          .wn-kicker-wrap{ padding: 28px 22px 60px; }
        }

        .wn-eyebrow-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: rgba(167, 144, 20, 0.10);
          border: 1px solid rgba(167, 144, 20, 0.28);
          border-radius: 999px;
          margin-bottom: 18px;
          opacity: 0;
          animation: wnFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 0ms both;
        }
        .wn-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #BF461A;
          box-shadow: 0 0 8px rgba(191, 70, 26, 0.6);
          animation: wnPulseDot 1.6s ease-in-out infinite;
        }
        .wn-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #A79014;
          margin: 0;
          font-weight: 600;
        }
        .wn-headline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(34px, 4.4vw, 60px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          margin: 0;
          max-width: 14ch;
        }
        .wn-headline .wn-accent {
          color: #BF461A;
          font-style: italic;
          font-weight: 700;
        }
        .wn-headline .wn-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: wnWordIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin-right: 0.24em;
        }
        .wn-headline .wn-word:nth-child(1) { animation-delay: 300ms; }
        .wn-headline .wn-word:nth-child(2) { animation-delay: 400ms; }
        .wn-headline .wn-word:nth-child(3) { animation-delay: 500ms; }
        .wn-headline .wn-word:nth-child(4) { animation-delay: 600ms; }
        .wn-care-period { color: #BF461A; }

        .wn-deck {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.5;
          color: #0F1E1D;
          opacity: 0.7;
          margin: 14px 0 0;
          max-width: 36ch;
          opacity: 0;
          animation: wnFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 750ms both;
        }
        .wn-deck-strong { color: #235351; font-weight: 600; opacity: 1; }

        .wn-card-fadein {
          opacity: 0;
          transform: translateY(24px);
          animation: wnCardIn 700ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
        }
        .wn-left  { animation-delay: 1300ms; }
        .wn-right { animation-delay: 1500ms; }

        /* Video card */
        .wn-video-wrap {
          position: relative;
          aspect-ratio: 16 / 10;
          border-radius: 16px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 30% 30%, rgba(120, 33, 191, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(34, 83, 81, 0.25) 0%, transparent 60%),
            linear-gradient(135deg, #0F1E1D 0%, #1c2e2c 100%);
          cursor: pointer;
          box-shadow: 0 24px 60px -20px rgba(15, 30, 29, 0.4);
          transition: transform 300ms cubic-bezier(0.13, 0.28, 0.3, 1), box-shadow 300ms;
          outline: none;
        }
        .wn-video-wrap:hover,
        .wn-video-wrap:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 32px 80px -20px rgba(15, 30, 29, 0.55);
        }
        .wn-video-wrap:focus-visible {
          box-shadow: 0 32px 80px -20px rgba(15, 30, 29, 0.55), 0 0 0 3px rgba(255, 186, 26, 0.55);
        }
        .wn-play-triangle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          color: #0F1E1D;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          pointer-events: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          transition: transform 200ms ease, background 200ms ease;
        }
        .wn-play-triangle svg {
          margin-left: 4px;
        }
        .wn-video-wrap:hover .wn-play-triangle,
        .wn-video-wrap:focus-visible .wn-play-triangle {
          background: #ffffff;
          transform: translate(-50%, -50%) scale(1.05);
        }
        .wn-video-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(237, 245, 236, 0.015) 0,
            rgba(237, 245, 236, 0.015) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 1;
        }

        .wn-video-meta-tl {
          position: absolute;
          top: 16px;
          left: 18px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #EDF5EC;
          opacity: 0.92;
        }
        .wn-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #BF461A;
          box-shadow: 0 0 10px rgba(191, 70, 26, 0.7);
          animation: wnPulseDot 1.6s ease-in-out infinite;
        }
        .wn-video-duration {
          position: absolute;
          top: 14px;
          right: 16px;
          z-index: 4;
          padding: 5px 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #EDF5EC;
          background: rgba(15, 30, 29, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(237, 245, 236, 0.18);
          border-radius: 999px;
        }

        .wn-play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          width: 88px;
          height: 88px;
          background: #BF461A;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px -8px rgba(191, 70, 26, 0.7);
          transition: transform 250ms cubic-bezier(0.13, 0.28, 0.3, 1), background 250ms;
        }
        .wn-play-button:hover,
        .wn-video-wrap:hover .wn-play-button {
          background: #EDF5EC;
          transform: translate(-50%, -50%) scale(1.06);
        }
        .wn-play-button:hover .wn-play-icon,
        .wn-video-wrap:hover .wn-play-button .wn-play-icon {
          color: #BF461A;
        }
        .wn-play-icon {
          color: #EDF5EC;
          margin-left: 5px;
          transition: color 250ms;
        }
        .wn-play-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          border: 2px solid #BF461A;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: wnPlayRing 2.4s ease-out infinite;
          z-index: 2;
        }
        .wn-play-ring.r2 { animation-delay: 1.2s; }

        .wn-video-caption {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 16px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .wn-video-speaker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .wn-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b89870, #6d4c2c);
          border: 1.5px solid #FFBA1A;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .wn-avatar svg { display: block; width: 100%; height: 100%; }
        .wn-video-speaker-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .wn-video-speaker-text .name {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 14px;
          color: #EDF5EC;
        }
        .wn-video-speaker-text .role {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #EDF5EC;
          opacity: 0.7;
          margin-top: 2px;
        }
        .wn-video-tag {
          padding: 6px 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0F1E1D;
          background: #FFBA1A;
          border-radius: 999px;
          white-space: nowrap;
        }

        @media (max-width: 720px) {
          .wn-play-button, .wn-play-ring { width: 64px; height: 64px; }
          .wn-play-icon { width: 24px; height: 24px; }
          .wn-video-caption { flex-direction: column; align-items: flex-start; gap: 8px; }
        }

        /* Right column: stat box + body */
        .wn-stat-box {
          background: linear-gradient(140deg, #FFFDF6 0%, #FAF3DF 100%);
          border: 1px solid rgba(167, 144, 20, 0.28);
          border-radius: 14px;
          padding: 24px 22px 22px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.7) inset,
            0 18px 38px -22px rgba(167, 144, 20, 0.35);
        }
        .wn-stat-box::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #A79014 0%, #FFBA1A 50%, #BF461A 100%);
        }
        .wn-stat-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #BF461A;
          font-weight: 600;
          margin: 0 0 10px;
        }
        .wn-stat-tag::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #BF461A;
        }
        .wn-stat-num {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(54px, 6.2vw, 84px);
          line-height: 0.9;
          letter-spacing: -0.035em;
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: linear-gradient(135deg, #A79014 0%, #BF461A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wn-stat-num .wn-pct {
          font-size: 0.55em;
          font-weight: 700;
          background: linear-gradient(135deg, #A79014 0%, #BF461A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wn-stat-line {
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.45;
          color: #0F1E1D;
          opacity: 0.82;
          margin: 12px 0 0;
        }
        .wn-stat-line strong {
          color: #235351;
          font-weight: 600;
        }
        .wn-sup {
          color: #BF461A;
          font-size: 0.65em;
          vertical-align: super;
          margin-left: 1px;
          font-weight: 600;
        }
        .wn-source {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.04em;
          color: #0F1E1D;
          opacity: 0.5;
          margin: 12px 0 22px;
          line-height: 1.5;
        }
        .wn-body-p {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
          color: #0F1E1D;
          margin: 0;
          opacity: 0.88;
        }
        .wn-highlight {
          background: linear-gradient(to top, rgba(167, 144, 20, 0.35) 40%, transparent 40%);
          font-weight: 600;
          padding: 0 2px;
          color: #0F1E1D;
          opacity: 1;
        }
        .wn-highlight-rust {
          background: linear-gradient(to top, rgba(191, 70, 26, 0.22) 40%, transparent 40%);
          color: #BF461A;
          font-weight: 600;
          padding: 0 2px;
        }

        /* Kicker */
        .wn-kicker-row {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 14px;
        }
        .wn-kicker-bar {
          width: 28px;
          height: 2px;
          background: #BF461A;
          flex-shrink: 0;
          transform: translateY(-6px);
        }
        .wn-italic-kicker {
          font-family: 'Playfair Display', Fraunces, Georgia, 'Times New Roman', serif;
          font-weight: 500;
          font-style: italic;
          font-size: clamp(20px, 2.2vw, 28px);
          line-height: 1.2;
          color: #BF461A;
          margin: 0;
          opacity: 0;
          animation: wnFadeUp 700ms cubic-bezier(0.13, 0.28, 0.3, 1) 1700ms both;
        }
        .wn-statement {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(28px, 3.6vw, 52px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #0F1E1D;
          margin: 0;
          max-width: 22ch;
        }
        .wn-statement .wn-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: wnWordIn 600ms cubic-bezier(0.13, 0.28, 0.3, 1) forwards;
          margin-right: 0.22em;
        }
        .wn-statement .wn-emph {
          color: #235351;
          font-style: italic;
          font-weight: 700;
        }

        /* Keyframes */
        @keyframes wnFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wnDrawLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes wnWordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wnCardIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wnPulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.2); opacity: 0.5; }
        }
        @keyframes wnPlayRing {
          0%   { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0;   transform: translate(-50%, -50%) scale(2.2); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wn-eyebrow,
          .wn-rule,
          .wn-headline .wn-word,
          .wn-card-fadein,
          .wn-italic-kicker,
          .wn-statement .wn-word,
          .wn-blob,
          .wn-live-dot,
          .wn-play-ring {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <svg
        className="wn-blob"
        viewBox="0 0 576 610"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
          fill="#CBD3CA"
        />
      </svg>

      <div className="wn-inner">
        <div className="wn-header">
          <div className="wn-header-left">
            <span className="wn-eyebrow-row">
              <span className="wn-eyebrow-dot" aria-hidden />
              <p className="wn-eyebrow">Why Now</p>
            </span>
            <h2 className="wn-headline">
              <span className="wn-word">Why</span>
              <span className="wn-word">this</span>
              <span className="wn-word">matters</span>
              <span className="wn-word">
                <span className="wn-accent">now</span>
                <span className="wn-care-period">.</span>
              </span>
            </h2>
            <p className="wn-deck">
              The window to position as <span className="wn-deck-strong">AI-native</span> is closing —
              and buyers are already deciding who's on which side.
            </p>
          </div>
        </div>

        <div className="wn-body">
          <div className="wn-card-fadein wn-left">
            <div
              className="wn-video-wrap"
              role="button"
              tabIndex={0}
              aria-label="Play video: Adam Fridman on why now (90 seconds)"
              onClick={handlePlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePlay();
                }
              }}
            >
              <video
                ref={videoRef}
                src="/discover/videos/why-now.mp4"
                poster="/discover/videos/why-now-poster.jpg"
                preload="metadata"
                playsInline
                controls={isPlaying}
                onEnded={() => setIsPlaying(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />
              {!isPlaying && (
                <span className="wn-play-triangle" aria-hidden>
                  <svg width="28" height="32" viewBox="0 0 24 28" fill="currentColor">
                    <polygon points="2,2 22,14 2,26" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          <div className="wn-card-fadein wn-right">
            <div className="wn-stat-box">
              <p className="wn-stat-tag">Buyer signal · 2025</p>
              <p className="wn-stat-num" ref={statRef} data-target="73">
                <span className="num-val">{statValue}</span>
                <span className="wn-pct">%</span>
              </p>
              <p className="wn-stat-line">
                of PS buyers say they will evaluate an <strong>AI-native firm</strong> before 2026
                <span className="wn-sup">1</span>
              </p>
            </div>
            <p className="wn-source">
              <span className="wn-sup">1</span>
              Source: Mabbly cohort survey, n=30 PS firms, 2025.
            </p>
            <p className="wn-body-p">
              The firms building a relationship system{" "}
              <span className="wn-highlight">now</span> will own the categories
              their competitors are still trying to define. The firms that wait
              will <span className="wn-highlight-rust">compete on price</span>.
            </p>
          </div>
        </div>

        <div className="wn-kicker-wrap">
          <div className="wn-kicker-row">
            <span className="wn-kicker-bar" aria-hidden />
            <p className="wn-italic-kicker">Most firms will wait.</p>
          </div>
          <p className="wn-statement" aria-label="The ones that move first set the terms.">
            {STATEMENT_WORDS.map((w, i) => {
              const isEmph = w === "first" || w === "the terms.";
              return (
                <span
                  key={i}
                  className={`wn-word${isEmph ? " wn-emph" : ""}`}
                  style={{ animationDelay: `${1900 + i * 70}ms` }}
                >
                  {i === STATEMENT_WORDS.length - 1 ? (
                    <>
                      {w.replace(".", "")}
                      <span className="wn-care-period">.</span>
                    </>
                  ) : (
                    w
                  )}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
