import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MagnetBreakdown from '@/components/magnet/MagnetBreakdown';

type Status = 'loading' | 'pending' | 'processing' | 'complete' | 'error';

const STEPS = [
  'Reading your website…',
  'Identifying your relationship orbits…',
  'Mapping your Dead Zone…',
  'Calibrating your Five Layers…',
  'Writing your GTM breakdown…',
];

export default function MagnetSite() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [firstName, setFirstName] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepVisible, setStepVisible] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Polling for submission status
  useEffect(() => {
    if (!slug) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    let consecutiveFailures = 0;
    const MAX_FAILURES = 5; // ~15s of failed polls before giving up

    const fetchStatus = async () => {
      // Query both tables in parallel — breakdown row is the source of truth.
      // If the breakdown exists with no enrichment_error, we're done regardless
      // of what magnet_submissions.status says (the final status flip can lag
      // or be lost if the edge function is killed after writing the breakdown).
      const [subRes, brkRes] = await Promise.all([
        supabase
          .from('magnet_submissions')
          .select('status, first_name')
          .eq('slug', slug)
          .maybeSingle(),
        supabase
          .from('magnet_breakdowns')
          .select('enrichment_error, gtm_profile_observed')
          .eq('slug', slug)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      // Tolerate transient network failures — don't fail the page on a single
      // failed poll. Only escalate to error after several consecutive failures.
      if (subRes.error && brkRes.error) {
        consecutiveFailures += 1;
        console.warn(
          `Polling failure ${consecutiveFailures}/${MAX_FAILURES}`,
          subRes.error,
          brkRes.error,
        );
        if (consecutiveFailures >= MAX_FAILURES) {
          setStatus('error');
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        return;
      }
      consecutiveFailures = 0;

      if (subRes.data?.first_name) {
        setFirstName(subRes.data.first_name);
      }

      const breakdown = brkRes.data;
      const breakdownReady =
        breakdown &&
        !breakdown.enrichment_error &&
        breakdown.gtm_profile_observed;

      // Source of truth: breakdown row populated → complete.
      if (breakdownReady) {
        setStatus('complete');
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // Hard error from the enrichment pipeline.
      if (breakdown?.enrichment_error) {
        setStatus('error');
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // No submission row at all → wrong slug.
      if (!subRes.data) {
        setStatus('error');
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const next = subRes.data.status as Status;
      if (next === 'complete') {
        // Submission marked complete but breakdown not visible yet — keep polling
        // briefly. If breakdown is missing entirely after submission complete,
        // surface error.
        setStatus('processing');
      } else if (next === 'error') {
        setStatus('error');
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setStatus(next === 'pending' ? 'pending' : 'processing');
      }
    };

    fetchStatus();
    intervalRef.current = window.setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [slug]);

  // Cycle processing steps every 4s
  useEffect(() => {
    if (status !== 'pending' && status !== 'processing') return;

    const id = window.setInterval(() => {
      setStepVisible(false);
      window.setTimeout(() => {
        setStepIndex((i) => (i + 1) % STEPS.length);
        setStepVisible(true);
      }, 300);
    }, 4000);

    return () => window.clearInterval(id);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#120D05] flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-[#B8933A]/30 border-t-[#B8933A] animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (status === 'complete') {
    return <MagnetBreakdown slug={slug!} />;
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#120D05] text-[#F5EFE0] flex flex-col items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.32em] text-[#B8933A] mb-4">
          SOMETHING WENT WRONG
        </p>
        <p className="text-lg text-center max-w-md mb-8 opacity-80">
          We couldn't generate your breakdown. Please try again.
        </p>
        <button
          onClick={() => navigate('/assess')}
          className="h-12 px-8 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold tracking-wide uppercase text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Processing UI (pending | processing)
  return (
    <div className="min-h-screen bg-[#120D05] text-[#F5EFE0] flex flex-col items-center justify-center px-6">
      <style>{`
        @keyframes magnet-bar-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .magnet-bar-fill {
          animation: magnet-bar-fill 4s linear infinite;
        }
      `}</style>

      <h1 className="text-xl md:text-2xl font-semibold text-center max-w-xl mb-12">
        {firstName
          ? `Hey ${firstName} — we're building your map.`
          : 'Building your GTM breakdown…'}
      </h1>

      <div className="w-full max-w-md flex flex-col items-center">
        <p
          className="text-[#B8933A] text-sm uppercase tracking-widest text-center min-h-[1.5rem] transition-opacity duration-300"
          style={{ opacity: stepVisible ? 1 : 0 }}
          key={stepIndex}
        >
          {STEPS[stepIndex]}
        </p>

        <div className="mt-6 w-full h-[2px] bg-white/10 overflow-hidden">
          <div
            key={stepIndex}
            className="h-full bg-[#B8933A] magnet-bar-fill"
          />
        </div>
      </div>

      <div className="mt-16 w-2 h-2 rounded-full bg-[#B8933A] animate-pulse" aria-hidden />
    </div>
  );
}
