import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MagnetBreakdown from '@/components/magnet/MagnetBreakdown';
import MagnetShell from '@/components/magnet/MagnetShell';

type Status = 'loading' | 'pending' | 'processing' | 'complete' | 'error';

const STEPS = [
  'Reading your website…',
  'Identifying your relationship orbits…',
  'Mapping your Dead Zone…',
  'Calibrating your Five Layers…',
  'Writing your GTM breakdown…',
];

// Polling tuning
const POLL_BASE_MS = 3000;       // start at 3s
const POLL_MAX_MS = 8000;        // cap backoff at 8s
const HARD_TIMEOUT_MS = 90_000;  // give up after 90s of polling
const MAX_FAILURES = 5;          // ~consecutive RPC errors before declaring error
// Tolerance window — if the submission row is missing right after redirect,
// keep polling for this long before treating "no submission" as a wrong slug.
const MISSING_ROW_GRACE_MS = 12_000;

export default function MagnetSite() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [firstName, setFirstName] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepVisible, setStepVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  // Polling for submission status — uses SECURITY DEFINER RPCs so the
  // anon client can read by slug without needing a Postgres GUC set.
  useEffect(() => {
    if (!slug) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    let consecutiveFailures = 0;
    let currentDelay = POLL_BASE_MS;
    const startedAt = Date.now();

    const clearPending = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const schedule = (ms: number) => {
      clearPending();
      timeoutRef.current = window.setTimeout(fetchStatus, ms);
    };

    async function fetchStatus() {
      if (cancelled) return;

      // Hard timeout — stop polling and surface error.
      if (Date.now() - startedAt > HARD_TIMEOUT_MS) {
        console.warn('Polling hard timeout reached', { slug });
        setStatus('error');
        clearPending();
        return;
      }

      // Query both RPCs in parallel — breakdown row is the source of truth.
      const [subRes, brkRes] = await Promise.all([
        supabase.rpc('get_magnet_submission_by_slug', { _slug: slug }),
        supabase.rpc('get_magnet_breakdown_by_slug', { _slug: slug }),
      ]);

      if (cancelled) return;

      // Tolerate transient network/RPC failures — back off and retry.
      if (subRes.error && brkRes.error) {
        consecutiveFailures += 1;
        console.warn(
          `Polling failure ${consecutiveFailures}/${MAX_FAILURES}`,
          subRes.error,
          brkRes.error,
        );
        if (consecutiveFailures >= MAX_FAILURES) {
          setStatus('error');
          clearPending();
          return;
        }
        currentDelay = Math.min(POLL_MAX_MS, Math.round(currentDelay * 1.5));
        schedule(currentDelay);
        return;
      }
      consecutiveFailures = 0;

      // RPCs return arrays of rows (TABLE return type) — take the first.
      const submissionRow = Array.isArray(subRes.data) ? subRes.data[0] : null;
      const breakdownRow = Array.isArray(brkRes.data) ? brkRes.data[0] : null;

      if (submissionRow?.first_name) {
        setFirstName(submissionRow.first_name);
      }

      const breakdownReady =
        breakdownRow &&
        !breakdownRow.enrichment_error &&
        breakdownRow.gtm_profile_observed;

      // Source of truth: breakdown row populated → complete.
      if (breakdownReady) {
        setStatus('complete');
        clearPending();
        return;
      }

      // Hard error from the enrichment pipeline.
      if (breakdownRow?.enrichment_error) {
        setStatus('error');
        clearPending();
        return;
      }

      // No submission row at all.
      if (!submissionRow) {
        // Tolerate brief missing-row window right after redirect from /assess
        // (replication/read-after-write lag). Only fail after grace window.
        if (Date.now() - startedAt < MISSING_ROW_GRACE_MS) {
          setStatus((prev) => (prev === 'loading' ? 'pending' : prev));
          // Reset to base delay during the grace window so we catch up fast.
          currentDelay = POLL_BASE_MS;
          schedule(currentDelay);
          return;
        }
        setStatus('error');
        clearPending();
        return;
      }

      const next = submissionRow.status as Status;
      if (next === 'complete') {
        // Submission marked complete but breakdown not visible yet — keep polling.
        setStatus('processing');
      } else if (next === 'error') {
        setStatus('error');
        clearPending();
        return;
      } else {
        setStatus(next === 'pending' ? 'pending' : 'processing');
      }

      // Reset to base interval once we're getting data; back off slightly while
      // waiting for breakdown completion to ease load.
      currentDelay = Math.min(POLL_MAX_MS, Math.round(currentDelay * 1.15));
      schedule(currentDelay);
    }

    fetchStatus();

    return () => {
      cancelled = true;
      clearPending();
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
      <MagnetShell firstName={firstName}>
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-[#B8933A]/30 border-t-[#B8933A] animate-spin"
            aria-label="Loading"
          />
        </div>
      </MagnetShell>
    );
  }

  if (status === 'complete') {
    return (
      <MagnetShell firstName={firstName}>
        <MagnetBreakdown slug={slug!} />
      </MagnetShell>
    );
  }

  if (status === 'error') {
    return (
      <MagnetShell firstName={firstName}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
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
      </MagnetShell>
    );
  }

  // Processing UI (pending | processing)
  return (
    <MagnetShell firstName={firstName}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
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

          <div className="mt-6 w-full h-[2px] bg-black/10 overflow-hidden">
            <div
              key={stepIndex}
              className="h-full bg-[#B8933A] magnet-bar-fill"
            />
          </div>
        </div>

        <div className="mt-16 w-2 h-2 rounded-full bg-[#B8933A] animate-pulse" aria-hidden />
      </div>
    </MagnetShell>
  );
}
