import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateMagnetSlug } from '@/lib/magnetSlug';

// ─────────────────────────────────────────────────────────────────────────────
// Per-step zod schemas — each step validates only its own field.
// ─────────────────────────────────────────────────────────────────────────────
const nameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter your name')
  .max(120, 'That looks too long');

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid work email')
  .max(255);

const websiteSchema = z
  .string()
  .trim()
  .url('Enter a valid URL (https://…)')
  .max(255);

// ─────────────────────────────────────────────────────────────────────────────
// Static + dynamic social proof
// ─────────────────────────────────────────────────────────────────────────────
const PROOF_FEED = [
  { name: 'Maria',  firm: 'Northwind Advisory' },
  { name: 'James',  firm: 'Brightpath Partners' },
  { name: 'Priya',  firm: 'Cedar & Vale' },
  { name: 'Marcus', firm: 'Hollis Group' },
  { name: 'Elena',  firm: 'Westover Strategy' },
  { name: 'Daniel', firm: 'Ironwood Consulting' },
  { name: 'Aisha',  firm: 'Meridian Capital Advisors' },
  { name: 'Tom',    firm: 'Foxbridge Studio' },
  { name: 'Nora',   firm: 'Larkfield & Co.' },
  { name: 'Owen',   firm: 'Sutter Strategy' },
];

const inputClass =
  'w-full bg-black/5 border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:border-[#B8933A] focus:outline-none focus:ring-0 rounded-none h-14 px-4 text-base transition-colors';

export default function MagnetAssess() {
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────────────────────────
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0=name, 1=email, 2=website
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when step changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // ── Founder video pause-on-typing ────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseFounderVideo = () => {
    const v = videoRef.current;
    if (v && !v.paused) v.pause();
  };

  // ── Continue / submit handlers per step ──────────────────────────────────
  const handleContinue = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (step === 0) {
      const r = nameSchema.safeParse(name);
      if (!r.success) {
        setError(r.error.issues[0]?.message ?? 'Invalid name');
        return;
      }
      // Dynamic social proof toast between Step 1 → 2
      const idx = Math.floor(Math.random() * PROOF_FEED.length);
      const p = PROOF_FEED[idx];
      const minsAgo = 2 + Math.floor(Math.random() * 9);
      toast(
        `${p.name} from ${p.firm} just completed her analysis · ${minsAgo} min ago`,
        { duration: 3500 }
      );
      setStep(1);
      return;
    }

    if (step === 1) {
      const r = emailSchema.safeParse(email);
      if (!r.success) {
        setError(r.error.issues[0]?.message ?? 'Invalid email');
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 — final submit
    const r = websiteSchema.safeParse(website);
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? 'Invalid URL');
      return;
    }
    await submit();
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const slug = generateMagnetSlug(email);

      const { error: insertError } = await supabase
        .from('magnet_submissions')
        .insert({
          slug,
          first_name: name.trim(),
          // role + linkedin_url are NOT NULL in the schema; insert empty
          // strings since the new flow no longer collects them.
          role: '',
          linkedin_url: '',
          website_url: website.trim(),
          email: email.trim(),
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

      navigate(`/m/${slug}`);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Something went wrong — please try again.');
      setSubmitting(false);
    }
  };

  // ── Progress / step labels ───────────────────────────────────────────────
  const progressPct = useMemo(() => {
    // 0 → 33%, 1 → 66%, 2 → 100% (fills as user completes the field)
    if (step === 0) return name.trim().length >= 2 ? 33 : 11;
    if (step === 1) return email.trim().length > 5 ? 66 : 44;
    return website.trim().length > 8 ? 100 : 77;
  }, [step, name, email, website]);

  const stepLabel = `Step ${step + 1} of 3`;

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008]">
      {/* ─── Sticky Top Bar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 bg-[#FBF8F4]/95 backdrop-blur-sm border-b border-black/10"
        style={{ height: 48 }}
      >
        <div className="max-w-lg mx-auto h-full px-6 flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#1C1008]/70 shrink-0">
            {stepLabel}
          </span>
          <div className="flex-1 h-1 bg-black/10 overflow-hidden">
            <div
              className="h-full bg-[#B8933A] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#1C1008]/50 shrink-0 w-9 text-right">
            {progressPct}%
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 md:py-16">
        {/* ─── Persistent intro block (always visible) ──────────────────── */}
        <p className="text-[11px] tracking-[0.18em] font-medium text-[#B8933A]">
          GET YOUR PERSONALIZED ANALYSIS
        </p>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
          Understand your firm's revenue potential in 90 seconds.
        </h1>
        <p className="text-sm opacity-70 mt-3 leading-relaxed">
          We analyze your website for gaps in positioning, messaging, and dormant
          relationship signals. Then we build your custom RROS map.
        </p>
        <p className="mt-4 text-[10px] tracking-[0.22em] font-semibold text-[#B8933A]/90 uppercase">
          Analyzes: Positioning · Messaging · CTAs · Consistency
        </p>

        {/* ─── Founder video card (placeholder until asset lands) ──────── */}
        <FounderVideoCard videoRef={videoRef} />

        {/* ─── Static social proof strip ───────────────────────────────── */}
        <p className="mt-6 text-xs text-[#1C1008]/55 italic leading-relaxed">
          Trusted by 60+ managing partners at PS firms $5M to $100M.
        </p>

        {/* ─── Stepper form ────────────────────────────────────────────── */}
        <form onSubmit={handleContinue} className="mt-10" noValidate>
          {/* Step 1 — Name */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-xs uppercase tracking-wider opacity-60 mb-3">
                Your name
              </label>
              <input
                ref={inputRef}
                type="text"
                autoComplete="name"
                className={inputClass}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                onFocus={pauseFounderVideo}
              />
            </div>
          )}

          {/* Step 2 — Email */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-xs uppercase tracking-wider opacity-60 mb-3">
                Work email
              </label>
              <input
                ref={inputRef}
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="jane@yourfirm.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                onFocus={pauseFounderVideo}
              />
            </div>
          )}

          {/* Step 3 — Website */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-xs uppercase tracking-wider opacity-60 mb-3">
                Company website
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
            </div>
          )}

          {error && <p className="mt-3 text-xs text-[#8B3A2A]">{error}</p>}

          {/* CTA + Back */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-[#120D05]/30 border-t-[#120D05] animate-spin" />
                  BUILDING YOUR ANALYSIS…
                </>
              ) : step === 2 ? (
                'BUILD MY ANALYSIS →'
              ) : (
                'CONTINUE →'
              )}
            </button>

            {step === 2 && !submitting && (
              <p className="text-xs text-center opacity-50">
                Free. 90 seconds. No credit card. Confidential.
              </p>
            )}

            {step > 0 && !submitting && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2);
                }}
                className="text-xs uppercase tracking-wider text-[#1C1008]/50 hover:text-[#1C1008]/80 transition-colors mt-1"
              >
                ← Back
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Founder video card — uses placeholder copy until the real asset is wired up.
// Shape is final; just drop the .mp4 / poster image into /public/founder/ when
// they land and update the src/poster paths below.
// ─────────────────────────────────────────────────────────────────────────────
function FounderVideoCard({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  // Real asset paths (drop files here when ready):
  //   /public/founder/adam-intro.mp4
  //   /public/founder/adam-intro-poster.jpg
  //   /public/founder/adam-intro.vtt
  const VIDEO_SRC = '/founder/adam-intro.mp4';
  const POSTER_SRC = '/founder/adam-intro-poster.jpg';

  const [hasAsset, setHasAsset] = useState(true);
  // If the video file 404s, fall back to the static placeholder card.
  const onError = () => setHasAsset(false);

  if (!hasAsset) {
    return (
      <div className="mt-8 border border-black/10 bg-black/[0.02] p-5 flex items-start gap-4">
        <div
          className="w-14 h-14 shrink-0 rounded-full border border-[#B8933A]/40 bg-[#B8933A]/10 flex items-center justify-center"
          aria-hidden
        >
          <span className="text-[#B8933A] text-lg font-serif italic">A</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#B8933A]/90">
            20 sec from Adam
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#1C1008]/85">
            "Hi, I'm Adam. We built this for managing partners at firms like
            yours. 20 seconds. Here's what we look at."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border border-black/10 bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-auto block"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        playsInline
        controls
        preload="metadata"
        onError={onError}
        crossOrigin="anonymous"
      >
        <track
          default
          kind="captions"
          srcLang="en"
          src="/founder/adam-intro.vtt"
        />
      </video>
    </div>
  );
}
