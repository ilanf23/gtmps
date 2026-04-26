import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function DiscoverHero() {
  // Video state for the Hero phone-frame S6E1 clip
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  // Attempt muted autoplay on mount unless user prefers reduced motion
  useEffect(() => {
    const v = videoRef.current;
    if (!v || videoFailed) return;
    if (reducedMotion) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [reducedMotion, videoFailed]);

  const handleVideoTap = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(() => {
        v.muted = true;
        v.play().then(() => {
          setIsPlaying(true);
          setIsMuted(true);
        }).catch(() => setIsPlaying(false));
      });
    } else {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }
  }, []);

  return (
    <>
      <style>{`
        .dh-root {
          width: 100%;
          min-height: 100vh;
          background: #1C1008;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter Tight', 'Inter', sans-serif;
          padding: 96px 40px;
        }
        .dh-glow {
          position: absolute;
          width: 640px;
          height: 640px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,147,58,.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .dh-inner {
          display: flex;
          align-items: center;
          gap: 64px;
          max-width: 1180px;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        .dh-phone-wrap {
          flex: 0 0 40%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .dh-copy { flex: 1; min-width: 0; }
        @media (max-width: 1023px) {
          .dh-inner { gap: 40px; }
        }
        @media (max-width: 768px) {
          .dh-root { padding: 80px 24px; }
          .dh-inner { flex-direction: column; gap: 36px; }
          .dh-copy { text-align: center; }
          .dh-ctas { justify-content: center; }
          .dh-phone-wrap { order: -1; width: 100%; flex: 0 0 auto; }
          .dh-mini-calc { margin-left: auto; margin-right: auto; }
        }

        /* ── Industry strip eyebrow ── */
        .dh-industry {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px 10px;
          font-family: 'DM Mono', 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0 0 24px;
        }
        .dh-industry-lead {
          color: #B8933A;
          opacity: 0.85;
        }
        .dh-industry-dot {
          color: rgba(184,147,58,0.5);
          padding: 0 2px;
        }
        @media (max-width: 768px) {
          .dh-industry {
            font-size: 10px;
            justify-content: center;
            letter-spacing: 0.16em;
          }
        }

        /* ── S6E1 Hero phone frame + video ── */
        .dh-phone {
          position: relative;
          width: 220px;
          height: 460px;
          border-radius: 44px;
          background: linear-gradient(155deg, #2A2A2E 0%, #0A0A0C 100%);
          padding: 6px;
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(184, 147, 58, 0.12),
            0 0 80px -20px rgba(184, 147, 58, 0.18);
        }
        .dh-phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 38px;
          overflow: hidden;
          background: #000;
        }
        .dh-phone-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 88px;
          height: 24px;
          background: #000;
          border-radius: 14px;
          z-index: 3;
        }
        .dh-phone-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dh-phone-btn-side {
          position: absolute;
          right: -2px;
          top: 110px;
          width: 3px;
          height: 56px;
          background: linear-gradient(90deg, #1A1A1C, #2A2A2E);
          border-radius: 2px;
        }
        .dh-phone-btn-vol1 {
          position: absolute;
          left: -2px;
          top: 90px;
          width: 3px;
          height: 32px;
          background: linear-gradient(90deg, #2A2A2E, #1A1A1C);
          border-radius: 2px;
        }
        .dh-phone-btn-vol2 {
          position: absolute;
          left: -2px;
          top: 134px;
          width: 3px;
          height: 56px;
          background: linear-gradient(90deg, #2A2A2E, #1A1A1C);
          border-radius: 2px;
        }
        .dh-phone-control {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          border-radius: 50%;
          border: none;
          background: #B8933A;
          color: #0A0807;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 4;
          box-shadow: 0 0 22px rgba(184, 147, 58, 0.55), 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: transform 200ms ease, background 200ms ease;
        }
        .dh-phone-control:hover,
        .dh-phone-control:focus-visible {
          background: #D4AE48;
          transform: translateX(-50%) scale(1.06);
          outline: none;
        }
        .dh-phone-caption {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8933A;
          text-align: center;
          margin: 0;
          max-width: 280px;
          line-height: 1.5;
        }

        /* Mobile: full-width video, no phone frame */
        @media (max-width: 768px) {
          .dh-phone {
            width: 100%;
            max-width: 420px;
            height: auto;
            aspect-ratio: 9 / 16;
            border-radius: 18px;
            padding: 0;
            background: #000;
            box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.6);
          }
          .dh-phone-screen { border-radius: 18px; }
          .dh-phone-island,
          .dh-phone-btn-side,
          .dh-phone-btn-vol1,
          .dh-phone-btn-vol2 { display: none; }
          .dh-phone-control {
            bottom: 14px;
            left: auto;
            right: 14px;
            transform: none;
          }
          .dh-phone-control:hover,
          .dh-phone-control:focus-visible {
            transform: scale(1.06);
          }
        }

        /* Audio fallback styling */
        .dh-audio-fallback {
          width: 220px;
          padding: 24px 20px;
          background: rgba(245, 239, 224, 0.04);
          border: 1px solid rgba(184, 147, 58, 0.25);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          text-align: center;
        }
        .dh-audio-fallback p {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B8933A;
          margin: 0;
        }
        .dh-audio-fallback audio {
          width: 100%;
          min-height: 48px;
        }
        @media (max-width: 768px) {
          .dh-audio-fallback { width: 100%; max-width: 420px; }
        }

        /* ── Headline + sub ── */
        .dh-headline {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #F5EFE0;
          margin-bottom: 24px;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .dh-headline em { font-style: normal; color: #B8933A; }
        .dh-sub {
          font-size: 20px;
          font-weight: 300;
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: rgba(245,239,224,0.70);
          max-width: 520px;
          margin: 0 0 32px;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        @media (max-width: 768px) {
          .dh-sub { margin-left: auto; margin-right: auto; }
        }

        /* ── CTA pair ── */
        .dh-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-bottom: 28px;
        }
        .dh-cta-primary {
          display: inline-block;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #0D1117;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 6px 24px -8px rgba(184,147,58,0.55);
        }
        .dh-cta-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px -8px rgba(184,147,58,0.7); }
        .dh-cta-secondary {
          display: inline-block;
          background: transparent;
          color: #B8933A;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 13px 26px;
          border: 1px solid rgba(184,147,58,0.55);
          border-radius: 999px;
          text-decoration: none;
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
        }
        .dh-cta-secondary:hover {
          background: rgba(184,147,58,0.12);
          color: #F5EFE0;
          border-color: #B8933A;
        }

        /* ── Mini calculator ── */
        .dh-mini-or {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(184,147,58,0.65);
          margin: 0 0 8px;
        }
        .dh-mini-calc {
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dh-mini-label {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: rgba(245,239,224,0.7);
        }
        .dh-mini-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }
        .dh-mini-input {
          flex: 1;
          min-width: 0;
          background: rgba(245,239,224,0.05);
          border: 1px solid rgba(184,147,58,0.35);
          border-radius: 6px;
          padding: 12px 14px;
          color: #F5EFE0;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 180ms ease, background 180ms ease;
          min-height: 48px;
        }
        .dh-mini-input::placeholder { color: rgba(245,239,224,0.35); }
        .dh-mini-input:focus { border-color: #B8933A; background: rgba(184,147,58,0.06); }
        .dh-mini-go {
          background: transparent;
          border: 1px solid rgba(184,147,58,0.55);
          color: #B8933A;
          padding: 0 18px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
          min-height: 48px;
        }
        .dh-mini-go:hover { background: rgba(184,147,58,0.12); color: #F5EFE0; }
        .dh-mini-foot {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          color: rgba(245,239,224,0.55);
          margin: 0;
        }
        .dh-mini-foot strong {
          color: #B8933A;
          font-weight: 600;
        }
        .dh-mini-link {
          background: none;
          border: none;
          padding: 0;
          color: #B8933A;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          margin-top: 4px;
          align-self: flex-start;
        }
        @media (max-width: 768px) {
          .dh-mini-row { flex-direction: column; }
          .dh-mini-go { padding: 14px 18px; }
          .dh-mini-link { align-self: center; }
        }

        /* ── Vertical chips row ── */
        .dh-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 4px 0 0;
        }
        .dh-chip {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 8px 16px;
          border: 1px solid rgba(184,147,58,0.55);
          border-radius: 999px;
          color: #B8933A;
          text-decoration: none;
          background: transparent;
          transition: background 180ms, color 180ms, border-color 180ms;
        }
        .dh-chip:hover {
          background: #B8933A;
          color: #0D1117;
          border-color: #B8933A;
        }
        @media (max-width: 768px) {
          .dh-chip-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            scrollbar-width: none;
            margin: 4px -24px 0;
            padding: 4px 24px;
          }
          .dh-chip-row::-webkit-scrollbar { display: none; }
          .dh-chip { flex-shrink: 0; }
        }
      `}</style>

      <section className="dh-root">
        <div className="dh-glow" />
        <div className="dh-inner">
          {/* S6E1 phone-frame video — left of headline on desktop, top on mobile */}
          <div className="dh-phone-wrap">
            {videoFailed ? (
              <div className="dh-audio-fallback">
                <p>Cold open · S6E1</p>
                <audio
                  src="/s6e1-cold-open.mp3"
                  controls
                  preload="metadata"
                  aria-label="S6E1 cold open audio"
                />
              </div>
            ) : (
              <div className="dh-phone" role="group" aria-label="S6E1 video player">
                <span aria-hidden className="dh-phone-btn-side" />
                <span aria-hidden className="dh-phone-btn-vol1" />
                <span aria-hidden className="dh-phone-btn-vol2" />
                <div className="dh-phone-screen">
                  <span aria-hidden className="dh-phone-island" />
                  <video
                    ref={videoRef}
                    className="dh-phone-video"
                    src="/s6e1-hero-vertical.mp4"
                    poster="/s6e1-poster.jpg"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls={typeof window !== 'undefined' && window.innerWidth < 769}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setVideoFailed(true)}
                  />
                  <button
                    type="button"
                    className="dh-phone-control"
                    onClick={(e) => { e.stopPropagation(); handleVideoTap(); }}
                    aria-label={
                      !isPlaying
                        ? 'Play with sound'
                        : isMuted
                        ? 'Unmute'
                        : 'Mute'
                    }
                  >
                    {!isPlaying ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : isMuted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            <p className="dh-phone-caption">
              Adam Fridman, S6E1 of GTM for Professional Services
            </p>
          </div>

          <div className="dh-copy">
            <p className="dh-industry">
              <span className="dh-industry-lead">The First Research on How PS Firms Grow</span>
            </p>
            <h1 className="dh-headline">
              Your next client already knows you<em>.</em>
            </h1>
            <p className="dh-sub">
              The largest research on GTM in professional services. 500 practitioner interviews. Validated by Copulsky. Take the 10 min diagnostic. Peer benchmark. The chapter that fixes your biggest gap.
            </p>

            <div className="dh-ctas">
              <a
                href="/assess"
                className="dh-cta-primary"
                data-cta="add-your-firm"
              >
                Add Your Firm →
              </a>
            </div>
            <p className="dh-mini-foot" style={{ marginTop: -10, marginBottom: 0 }}>
              Free. 10 minutes. Confidential. Benchmarked against peer firms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
