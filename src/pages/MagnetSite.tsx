import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MagnetBreakdown from '@/components/magnet/MagnetBreakdown';
import MagnetShell from '@/components/magnet/MagnetShell';
import MagnetWaitTheater from '@/components/magnet/MagnetWaitTheater';
import { useClientTheme } from '@/hooks/useClientTheme';
import { resolveVerticalSlug } from '@/content/verticalFlow';
import { displayNameFromSlug, isCanonicalNameMismatch } from '@/lib/magnetSlug';

type Status = 'loading' | 'pending' | 'processing' | 'complete' | 'error';

interface NavState {
  websiteUrl?: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlVertical = searchParams.get('vertical');
  const [status, setStatus] = useState<Status>('loading');
  const [firstName, setFirstName] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [vertical, setVertical] = useState<string>(() => resolveVerticalSlug(urlVertical));
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
      // Hydrate vertical from the persisted row when the URL doesn't carry it,
      // so a refresh after Calendly redirects (etc.) keeps the right copy.
      const rowVertical: string | null =
        (submissionRow as { vertical?: string | null } | null)?.vertical ?? null;
      if (rowVertical && !urlVertical) {
        const resolved = resolveVerticalSlug(rowVertical);
        if (resolved !== 'general' && resolved !== vertical) {
          setVertical(resolved);
          // Reflect in URL so deep-share links keep working without losing context.
          const next = new URLSearchParams(searchParams);
          next.set('vertical', resolved);
          setSearchParams(next, { replace: true });
        }
      }
      if (breakdownRow?.client_company_name) {
        setCompanyName(breakdownRow.client_company_name);
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

  // (Step rotation is now handled internally by MagnetWaitTheater.)

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
    const booked = searchParams.get('booked') === 'true';
    // Disambiguation: if the slug-derived name diverges from the canonical
    // name resolved by enrichment (e.g. user submitted "marcum.com" but the
    // domain now redirects to CBIZ post-acquisition), surface that explicitly
    // so the page doesn't silently rebrand the URL the user typed.
    const submittedName = displayNameFromSlug(slug);
    const showDisambiguation =
      !!submittedName &&
      !!companyName &&
      isCanonicalNameMismatch(submittedName, companyName);
    return (
      <MagnetShell firstName={firstName}>
        {booked && (
          <div
            role="status"
            className="sticky top-0 z-40 px-4 py-3 text-center text-sm font-semibold border-b"
            style={{
              backgroundColor: '#1B5E20',
              color: '#FBF8F4',
              borderColor: 'rgba(0,0,0,0.15)',
            }}
          >
            Booked. Adam will see you on the call. Check your email for the
            confirmation.
          </div>
        )}
        {showDisambiguation && (
          <div
            role="status"
            aria-live="polite"
            data-testid="magnet-name-disambiguation"
            className="px-4 py-2.5 text-center text-xs sm:text-sm border-b"
            style={{
              backgroundColor: `color-mix(in srgb, ${theme.accent} 10%, transparent)`,
              color: theme.text,
              borderColor: `color-mix(in srgb, ${theme.accent} 24%, transparent)`,
            }}
          >
            <span className="opacity-70">Submitted as</span>{' '}
            <span className="font-semibold">{submittedName}</span>{' '}
            <span className="opacity-70">·</span>{' '}
            <span className="opacity-70">resolved to</span>{' '}
            <span className="font-semibold">{companyName}</span>
          </div>
        )}
        <MagnetBreakdown
          slug={slug!}
          vertical={vertical}
          shareId={searchParams.get('share_id')}
        />
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
            onClick={() => navigate('/#hero')}
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
      <MagnetWaitTheater
        firstName={firstName}
        websiteUrl={navState.websiteUrl}
        companyName={companyName}
        enrichmentReady={false}
        vertical={vertical}
      />
    </MagnetShell>
  );
}
