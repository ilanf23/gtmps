import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/use-mobile';

const VIDEO_SRC = '/s6e1-hero-vertical.mp4';
const POSTER_SRC = '/s6e1-poster.jpg';
const SESSION_KEY = 'discover-float-video-dismissed';

export default function FloatingHeroVideo() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [pastHero, setPastHero] = useState(false);
  const [pastFinal, setPastFinal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const thumbVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Initial dismissed state from sessionStorage
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') setDismissed(true);
    } catch {}
  }, []);

  // Scroll listener (rAF-throttled)
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      setPastHero(window.scrollY > window.innerHeight - 100);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, isMobile]);

  // Watch for Final CTA entering viewport
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const target = document.getElementById('final-cta');
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPastFinal(true);
      },
      { rootMargin: '0px 0px -20% 0px' }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [reducedMotion, isMobile]);

  // Esc closes modal
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  // Try unmuted play when modal opens
  useEffect(() => {
    if (!expanded) return;
    const v = modalVideoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [expanded]);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
  }, []);

  // Hard guards
  if (reducedMotion || isMobile) return null;

  const visible = pastHero && !dismissed && !pastFinal;

  return (
    <>
      <style>{`
        .fhv-thumb {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 80;
          width: 160px;
          height: 285px;
          border-radius: 28px;
          background: linear-gradient(155deg, #2A2A2E 0%, #0A0A0C 100%);
          padding: 4px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          pointer-events: none;
          transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 200ms ease;
          border: 1px solid rgba(168, 146, 58,0.18);
        }
        .fhv-thumb.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .fhv-thumb:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(168, 146, 58,0.18);
        }
        .fhv-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          overflow: hidden;
          background: #000;
        }
        .fhv-island {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 16px;
          background: #000;
          border-radius: 9px;
          z-index: 2;
        }
        .fhv-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .fhv-dismiss {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(10,8,7,0.9);
          border: 1px solid rgba(168, 146, 58,0.5);
          color: #A8923A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: background 180ms ease, transform 180ms ease;
          padding: 0;
        }
        .fhv-dismiss:hover {
          background: rgba(168, 146, 58,0.2);
          transform: scale(1.08);
        }
        .fhv-caption {
          position: absolute;
          bottom: 6px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,241,232,0.85);
          z-index: 3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
          pointer-events: none;
        }

        /* Modal */
        .fhv-overlay {
          position: fixed;
          inset: 0;
          z-index: 110;
          background: rgba(8,6,4,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fhv-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }
        .fhv-modal-phone {
          position: relative;
          width: 280px;
          height: 580px;
          border-radius: 44px;
          background: linear-gradient(155deg, #2A2A2E 0%, #0A0A0C 100%);
          padding: 6px;
          box-shadow:
            0 30px 80px -20px rgba(0,0,0,0.8),
            0 0 0 1px rgba(168, 146, 58,0.18),
            0 0 100px -10px rgba(168, 146, 58,0.25);
          transform: scale(0.5);
          opacity: 0;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fhv-overlay.is-open .fhv-modal-phone {
          transform: scale(1);
          opacity: 1;
        }
        .fhv-modal-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 38px;
          overflow: hidden;
          background: #000;
        }
        .fhv-modal-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 96px;
          height: 26px;
          background: #000;
          border-radius: 14px;
          z-index: 2;
        }
        .fhv-modal-close {
          position: fixed;
          top: 28px;
          right: 28px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(10,8,7,0.85);
          border: 1px solid rgba(168, 146, 58,0.5);
          color: #A8923A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 120;
          transition: background 180ms ease, transform 180ms ease;
          padding: 0;
        }
        .fhv-modal-close:hover {
          background: rgba(168, 146, 58,0.2);
          transform: scale(1.06);
        }

        @media (max-width: 767px) {
          .fhv-thumb, .fhv-overlay { display: none !important; }
        }
      `}</style>

      <button
        type="button"
        className={`fhv-thumb ${visible ? 'is-visible' : ''}`}
        onClick={() => setExpanded(true)}
        aria-label="Expand S6E1 video"
      >
        <div className="fhv-screen">
          <div className="fhv-island" />
          <video
            ref={thumbVideoRef}
            className="fhv-video"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
          <span className="fhv-caption">S6E1</span>
        </div>
        <span
          role="button"
          tabIndex={0}
          className="fhv-dismiss"
          onClick={handleDismiss}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              setDismissed(true);
              try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
            }
          }}
          aria-label="Dismiss video"
        >
          <X size={14} strokeWidth={2.5} />
        </span>
      </button>

      <div
        className={`fhv-overlay ${expanded ? 'is-open' : ''}`}
        onClick={() => setExpanded(false)}
        role="dialog"
        aria-modal="true"
        aria-label="S6E1 video player"
      >
        <button
          type="button"
          className="fhv-modal-close"
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          aria-label="Close video"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="fhv-modal-phone" onClick={(e) => e.stopPropagation()}>
          <div className="fhv-modal-screen">
            <div className="fhv-modal-island" />
            {expanded && (
              <video
                ref={modalVideoRef}
                className="fhv-video"
                src={VIDEO_SRC}
                poster={POSTER_SRC}
                loop
                playsInline
                autoPlay
                controls
                preload="metadata"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
