import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateMagnetSlug } from '@/lib/magnetSlug';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─────────────────────────────────────────────────────────────────────────────
// Single-field validation — only website URL.
// ─────────────────────────────────────────────────────────────────────────────
const websiteSchema = z
  .string()
  .trim()
  .url('Enter a valid URL (https://…)')
  .max(255);

const inputClass =
  'w-full bg-black/5 border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:border-[#B8933A] focus:outline-none focus:ring-0 rounded-none h-14 px-4 text-base transition-colors';

export default function MagnetAssess() {
  const navigate = useNavigate();

  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the URL input on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Founder video pause-on-typing ────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseFounderVideo = () => {
    const v = videoRef.current;
    if (v && !v.paused) v.pause();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const r = websiteSchema.safeParse(website);
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? 'Invalid URL');
      return;
    }

    setSubmitting(true);
    try {
      // Slug is derived from the website URL since we no longer collect email.
      const slug = generateMagnetSlug(website.trim());

      const { error: insertError } = await supabase
        .from('magnet_submissions')
        .insert({
          slug,
          website_url: website.trim(),
          // first_name / role / linkedin_url / email are NOT NULL in the schema
          // but the simplified flow no longer collects them. Insert empty strings;
          // the enrich function gracefully treats blank values as "(not provided)".
          first_name: '',
          role: '',
          linkedin_url: '',
          email: '',
          status: 'pending',
          crm_size: null,
          deal_size: null,
          bd_challenge: null,
          case_studies_url: null,
          team_page_url: null,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Fire and forget — enrichment runs in the background.
      void supabase.functions
        .invoke('enrich-magnet', {
          body: {
            slug,
            crmSize: null,
            dealSize: null,
            bdChallenge: null,
            caseStudiesUrl: null,
            teamPageUrl: null,
          },
        })
        .catch((err) => console.error('Enrich invoke error:', err));

      // Pass website forward so the wait theater can show the right domain.
      navigate(`/m/${slug}`, {
        state: { websiteUrl: website.trim() },
      });
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Something went wrong — please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008]">
      <div className="max-w-lg mx-auto px-6 py-10 md:py-16">
        {/* ─── Eyebrow + headline ────────────────────────────────────────── */}
        <p className="text-[11px] tracking-[0.18em] font-medium text-[#B8933A]">
          GET YOUR PERSONALIZED ANALYSIS
        </p>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
          See exactly where your firm's revenue relationships are leaking.
        </h1>
        <p className="text-sm opacity-70 mt-3 leading-relaxed">
          90 seconds. We analyze your website and build your custom RROS map.
          No call required to see it.
        </p>
        <p className="mt-4 text-[10px] tracking-[0.22em] font-semibold text-[#B8933A]/90 uppercase">
          Analyzes positioning, messaging, CTAs, consistency.
        </p>

        {/* ─── Founder video card (S6E1 placeholder) ────────────────────── */}
        <FounderVideoCard videoRef={videoRef} />

        {/* ─── Single-field form ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="mt-10" noValidate>
          <label className="block text-xs uppercase tracking-wider opacity-60 mb-3">
            Your firm's website URL
          </label>
          <input
            ref={inputRef}
            type="url"
            autoComplete="url"
            className={inputClass}
            placeholder="https://yourfirm.com"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              if (error) setError(null);
            }}
            onFocus={pauseFounderVideo}
          />

          {error && <p className="mt-3 text-xs text-[#8B3A2A]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full h-14 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-[#120D05]/30 border-t-[#120D05] animate-spin" />
                BUILDING YOUR MAP…
              </>
            ) : (
              'Build My Map →'
            )}
          </button>

          <p className="mt-3 text-xs text-center opacity-60">
            Free. 90 seconds. Full map shown — no email required to see it.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Founder video card — vertical phone-frame mockup using the existing S6E1
// clip as a placeholder for Adam's purpose statement. When the bespoke
// 20-second intro lands, swap VIDEO_SRC / POSTER_SRC and update CAPTION below.
// ─────────────────────────────────────────────────────────────────────────────
function FounderVideoCard({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  // Placeholder assets (swap when the bespoke 20-sec intro is recorded):
  //   /public/s6e1-hero-vertical.mp4   →  /public/founder/adam-intro.mp4
  //   /public/s6e1-poster.jpg          →  /public/founder/adam-intro-poster.jpg
  const VIDEO_SRC = '/s6e1-hero-vertical.mp4';
  const POSTER_SRC = '/s6e1-poster.jpg';
  const CAPTION = 'ADAM FRIDMAN · WHY THIS RESEARCH EXISTS';

  const reducedMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false); // tracks first user-initiated play (reduced-motion path)

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {});
  };

  const handlePosterPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().then(() => setStarted(true)).catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().then(() => setStarted(true)).catch(() => {});
    });
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <style>{`
        .fvc-frame {
          position: relative;
          width: 200px;
          aspect-ratio: 9 / 16;
          border-radius: 28px;
          background: linear-gradient(155deg, #2A2A2E 0%, #0A0A0C 100%);
          padding: 4px;
          box-shadow:
            0 12px 32px -10px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(184, 147, 58, 0.18);
        }
        @media (max-width: 640px) {
          .fvc-frame { width: min(60vw, 220px); }
        }
        .fvc-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          overflow: hidden;
          background: #000;
        }
        .fvc-island {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 16px;
          background: #000;
          border-radius: 9px;
          z-index: 2;
          pointer-events: none;
        }
        .fvc-video, .fvc-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .fvc-sound-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(184, 147, 58, 0.95);
          color: #120D05;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          border: none;
          padding: 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
          transition: transform 180ms ease, background 180ms ease;
        }
        .fvc-sound-btn:hover {
          background: #B8933A;
          transform: scale(1.06);
        }
        .fvc-sound-btn:focus-visible {
          outline: 2px solid #B8933A;
          outline-offset: 2px;
        }
        .fvc-poster-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
          cursor: pointer;
          border: none;
          padding: 0;
          z-index: 3;
        }
        .fvc-poster-play-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(184, 147, 58, 0.95);
          color: #120D05;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="fvc-frame">
        <div className="fvc-screen">
          <div className="fvc-island" />

          {reducedMotion && !started ? (
            <>
              <img
                src={POSTER_SRC}
                alt="Adam Fridman intro"
                className="fvc-poster"
              />
              <button
                type="button"
                className="fvc-poster-play"
                onClick={handlePosterPlay}
                aria-label="Play Adam's intro"
              >
                <span className="fvc-poster-play-icon">
                  <Play size={20} fill="#120D05" strokeWidth={0} />
                </span>
              </button>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                className="fvc-video"
                src={VIDEO_SRC}
                poster={POSTER_SRC}
                muted={muted}
                loop
                playsInline
                autoPlay={!reducedMotion}
                preload="metadata"
              />
              <button
                type="button"
                className="fvc-sound-btn"
                onClick={toggleSound}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                aria-pressed={!muted}
              >
                {muted ? (
                  <VolumeX size={16} strokeWidth={2.25} />
                ) : (
                  <Volume2 size={16} strokeWidth={2.25} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <p
        className="mt-3 text-[10px] font-mono uppercase text-[#B8933A]"
        style={{ letterSpacing: '0.22em' }}
      >
        {CAPTION}
      </p>
    </div>
  );
}
