import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MagnetBreakdown from '@/components/magnet/MagnetBreakdown';
import MagnetShell from '@/components/magnet/MagnetShell';
import MagnetWaitTheater from '@/components/magnet/MagnetWaitTheater';
import { useClientTheme } from '@/hooks/useClientTheme';
import { resolveVerticalSlug } from '@/content/verticalFlow';
import { displayNameFromSlug, isCanonicalNameMismatch } from '@/lib/magnetSlug';
import { track } from '@/lib/posthog';

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
  const [retryNonce, setRetryNonce] = useState(0);
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
    let lastReportedStatus: Status = 'loading';
    let terminalReported = false;
    const startedAt = Date.now();

    track('magnet_polling_started', { slug });

    const setTrackedStatus = (next: Status) => {
      if (next !== lastReportedStatus) {
        track('magnet_status_transition', {
          slug,
          from: lastReportedStatus,
          to: next,
        });
        lastReportedStatus = next;
      }
      setStatus(next);
    };

    const reportComplete = (gtmObserved: boolean) => {
      if (terminalReported) return;
      terminalReported = true;
      track('magnet_enrichment_complete', {
        slug,
        latency_ms: Date.now() - startedAt,
        gtm_profile_observed: !!gtmObserved,
      });
    };

    const reportFailed = (
      reason: 'timeout' | 'enrichment_error' | 'rpc_error',
    ) => {
      if (terminalReported) return;
      terminalReported = true;
      track('magnet_enrichment_failed', {
        slug,
        reason,
        latency_ms: Date.now() - startedAt,
      });
    };

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
        reportFailed('timeout');
        setTrackedStatus('error');
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
          reportFailed('rpc_error');
          setTrackedStatus('error');
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
        reportComplete(!!breakdownRow.gtm_profile_observed);
        setTrackedStatus('complete');
        clearPending();
        return;
      }

      if (breakdownRow?.enrichment_error) {
        reportFailed('enrichment_error');
        setTrackedStatus('error');
        clearPending();
        return;
      }

      if (!submissionRow) {
        if (Date.now() - startedAt < MISSING_ROW_GRACE_MS) {
          if (lastReportedStatus === 'loading') setTrackedStatus('pending');
          currentDelay = POLL_BASE_MS;
          schedule(currentDelay);
          return;
        }
        reportFailed('rpc_error');
        setTrackedStatus('error');
        clearPending();
        return;
      }

      const next = submissionRow.status as Status;
      if (next === 'complete') {
        setTrackedStatus('processing');
      } else if (next === 'error') {
        reportFailed('enrichment_error');
        setTrackedStatus('error');
        clearPending();
        return;
      } else {
        setTrackedStatus(next === 'pending' ? 'pending' : 'processing');
      }

      currentDelay = Math.min(POLL_MAX_MS, Math.round(currentDelay * 1.15));
      schedule(currentDelay);
    }

    fetchStatus();

    return () => {
      cancelled = true;
      clearPending();
    };
  }, [slug, retryNonce]);

  const retryEnrichment = () => {
    setStatus('loading');
    setRetryNonce((n) => n + 1);
  };

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
              color: '#EDF5EC',
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
    const websiteUrl = navState.websiteUrl ?? slug ?? 'unknown';
    const mailtoSubject = encodeURIComponent(`Map for ${websiteUrl} is stuck`);
    const mailtoBody = encodeURIComponent(
      `Hi Mabbly team,\n\nMy map at /m/${slug} didn't finish generating. Please email me when it's ready.\n\nWebsite: ${websiteUrl}\nFirst name: ${firstName ?? '-'}\n\nThanks.`,
    );
    const mailtoHref = `mailto:beta@mabbly.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    return (
      <MagnetShell firstName={firstName}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div
            className="w-full max-w-[520px] flex flex-col items-center text-center"
          >
            <p
              className="text-xs uppercase tracking-[0.32em] mb-5"
              style={{ color: theme.accent }}
            >
              Something held this up
            </p>
            <h1
              className="font-display mb-4"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: theme.text,
                fontWeight: 500,
              }}
            >
              Your map isn't ready yet.
            </h1>
            <p
              className="mb-10"
              style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 16,
                lineHeight: 1.55,
                color: theme.text,
                opacity: 0.72,
                fontWeight: 400,
              }}
            >
              Enrichment took longer than expected. This usually means the site
              we read needed a closer look. We'll keep working on it - you
              can retry now, or have us email you the moment it's ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center justify-center mb-6">
              <button
                type="button"
                onClick={retryEnrichment}
                className="h-12 px-7 font-semibold tracking-[0.12em] uppercase text-[13px] transition-colors"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentForeground,
                  borderRadius: 25,
                }}
              >
                Try again now
              </button>
              <a
                href={mailtoHref}
                className="h-12 px-7 inline-flex items-center justify-center font-semibold tracking-[0.12em] uppercase text-[13px] transition-colors"
                style={{
                  background: 'transparent',
                  color: theme.text,
                  border: `1px solid ${theme.text}1a`,
                  borderRadius: 25,
                  textDecoration: 'none',
                }}
              >
                Email me when ready
              </a>
            </div>

            <button
              type="button"
              onClick={() => navigate('/#hero')}
              className="text-[13px] underline underline-offset-4 transition-opacity hover:opacity-100"
              style={{
                color: theme.text,
                opacity: 0.55,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Back to the homepage
            </button>
          </div>
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
        slug={slug}
        onRetry={retryEnrichment}
      />
    </MagnetShell>
  );
}
