import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MagnetBreakdown from '@/components/magnet/MagnetBreakdown';
import MagnetShell from '@/components/magnet/MagnetShell';
import MagnetWaitTheater from '@/components/magnet/MagnetWaitTheater';
import { useClientTheme } from '@/hooks/useClientTheme';

type Status = 'loading' | 'pending' | 'processing' | 'complete' | 'error';

interface NavState {
  websiteUrl?: string;
  email?: string;
  firstName?: string;
}

const POLL_BASE_MS = 3000;
const POLL_MAX_MS = 8000;
const HARD_TIMEOUT_MS = 120_000;
const MAX_FAILURES = 5;
const MISSING_ROW_GRACE_MS = 12_000;

export default function MagnetSite() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as NavState;
  const [status, setStatus] = useState<Status>('loading');
  const [firstName, setFirstName] = useState<string | null>(navState.firstName ?? null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  // Theme is loaded via the shell, but the loading scene also needs accent.
  const theme = useClientTheme(slug);

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

      if (Date.now() - startedAt > HARD_TIMEOUT_MS) {
        console.warn('Polling hard timeout reached', { slug });
        setStatus('error');
        clearPending();
        return;
      }

      const [subRes, brkRes] = await Promise.all([
        supabase.rpc('get_magnet_submission_by_slug', { _slug: slug }),
        supabase.rpc('get_magnet_breakdown_by_slug', { _slug: slug }),
      ]);

      if (cancelled) return;

      if (subRes.error && brkRes.error) {
        consecutiveFailures += 1;
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

      const submissionRow = Array.isArray(subRes.data) ? subRes.data[0] : null;
      const breakdownRow = Array.isArray(brkRes.data) ? brkRes.data[0] : null;

      if (submissionRow?.first_name) {
        setFirstName(submissionRow.first_name);
      }

      const breakdownReady =
        breakdownRow &&
        !breakdownRow.enrichment_error &&
        breakdownRow.gtm_profile_observed;

      if (breakdownReady) {
        setStatus('complete');
        clearPending();
        return;
      }

      if (breakdownRow?.enrichment_error) {
        setStatus('error');
        clearPending();
        return;
      }

      if (!submissionRow) {
        if (Date.now() - startedAt < MISSING_ROW_GRACE_MS) {
          setStatus((prev) => (prev === 'loading' ? 'pending' : prev));
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
        setStatus('processing');
      } else if (next === 'error') {
        setStatus('error');
        clearPending();
        return;
      } else {
        setStatus(next === 'pending' ? 'pending' : 'processing');
      }

      currentDelay = Math.min(POLL_MAX_MS, Math.round(currentDelay * 1.15));
      schedule(currentDelay);
    }

    fetchStatus();

    return () => {
      cancelled = true;
      clearPending();
    };
  }, [slug]);

  useEffect(() => {
    if (status !== 'pending' && status !== 'processing') return;
    const id = window.setInterval(() => {
      setStepVisible(false);
      window.setTimeout(() => {
        setStepIndex((i) => (i + 1) % STEPS.length);
        setStepVisible(true);
      }, 500);
    }, 14000);
    return () => window.clearInterval(id);
  }, [status]);

  if (status === 'loading') {
    return (
      <MagnetShell firstName={firstName}>
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{
              borderColor: `${theme.accent}33`,
              borderTopColor: theme.accent,
            }}
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
          <p
            className="text-xs uppercase tracking-[0.32em] mb-4"
            style={{ color: theme.accent }}
          >
            SOMETHING WENT WRONG
          </p>
          <p className="text-lg text-center max-w-md mb-8 opacity-80">
            We couldn't generate your breakdown. Please try again.
          </p>
          <button
            onClick={() => navigate('/assess')}
            className="h-12 px-8 font-semibold tracking-wide uppercase text-sm transition-colors"
            style={{
              backgroundColor: theme.accent,
              color: theme.accentForeground,
            }}
          >
            Try Again
          </button>
        </div>
      </MagnetShell>
    );
  }

  return (
    <MagnetShell firstName={firstName}>
      <MagnetLoadingScene
        firstName={firstName}
        stepIndex={stepIndex}
        stepVisible={stepVisible}
        steps={STEPS}
      />
    </MagnetShell>
  );
}
