// ─────────────────────────────────────────────────────────────────────────────
// Shared Magnet URL submission helper.
//
// Used by the embedded hero URL fields on the Discover homepage and every
// vertical landing. Keeps the slug-generation, collision-retry, Supabase
// insert, and edge-function dispatch logic in one place so the surfaces stay
// in sync.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { generateMagnetSlug, magnetSlugSuffix } from '@/lib/magnetSlug';
import { track } from '@/lib/posthog';
import type { CtaId } from '@/lib/eventTaxonomy';
import { getRefAttribution, clearRefAttribution } from '@/lib/refAttribution';

/** Trim, prepend `https://` if missing, and validate via WHATWG URL. */
export function normalizeUrl(input: string): string | null {
  const trimmed = (input ?? '').trim();
  if (!trimmed) return null;
  if (/\s/.test(trimmed)) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes('.')) return null;
    return `https://${u.hostname.toLowerCase()}${u.pathname === '/' ? '' : u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

export const websiteSchema = z
  .string()
  .trim()
  .max(255)
  .refine((v) => normalizeUrl(v) !== null, {
    message: 'Enter a valid URL (e.g. yourfirm.com)',
  });

export interface SubmitMagnetUrlOptions {
  /** Vertical slug (from useVerticalFlow). Defaults to 'general'. */
  verticalSlug?: string;
  /** Where the form lives, for analytics. */
  entryPoint?: CtaId;
}

export interface SubmitMagnetUrlResult {
  ok: boolean;
  /** Final slug (after any collision-retry suffix). */
  slug?: string;
  /** Normalized URL persisted to the row. */
  normalizedUrl?: string;
  /** Path to navigate to (`/m/:slug` or `/m/:slug?vertical=...`). */
  destination?: string;
  /** Human-readable error to surface to the form. */
  error?: string;
  /** Validation kind, when the failure was the URL itself. */
  validation?: boolean;
}

/**
 * Validate, persist, and dispatch enrichment for a Magnet URL submission.
 *
 * Mirrors the flow:
 *   1. Validate via `websiteSchema` (URL only, bare domains accepted).
 *   2. Generate slug from the domain root.
 *   3. Insert into `magnet_submissions` with collision-retry (4 attempts).
 *   4. Fire-and-forget `enrich-magnet` edge function.
 *   5. Return the destination path the caller should navigate to.
 */
export async function submitMagnetUrl(
  rawUrl: string,
  opts: SubmitMagnetUrlOptions = {},
): Promise<SubmitMagnetUrlResult> {
  const verticalSlug = opts.verticalSlug ?? 'general';
  const entryPoint: CtaId = opts.entryPoint ?? 'discover_hero';

  const parsed = websiteSchema.safeParse(rawUrl);
  if (!parsed.success) {
    track('assess_submit_failed', {
      reason: 'validation',
      entry_point: entryPoint,
      detail: parsed.error.issues[0]?.message,
    });
    return {
      ok: false,
      validation: true,
      error: parsed.error.issues[0]?.message ?? 'Invalid URL',
    };
  }

  const normalizedUrl = normalizeUrl(rawUrl) ?? rawUrl.trim();
  const baseSlug = generateMagnetSlug(normalizedUrl);

  track('assess_form_submitted', {
    website_url: normalizedUrl,
    entry_point: entryPoint,
    vertical: verticalSlug === 'general' ? null : verticalSlug,
  });

  let slug = baseSlug;
  let insertError: { code?: string; message?: string } | null = null;

  const refAttr = getRefAttribution();

  // Collision-retry loop: if the slug exists for a prior submitter, append
  // a 3-char suffix and try again, up to 4 attempts total.
  for (let attempt = 0; attempt < 4; attempt++) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${magnetSlugSuffix()}`;
    const res = await supabase.from('magnet_submissions').insert({
      slug: candidate,
      website_url: normalizedUrl,
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
      vertical: verticalSlug,
      ref_code: refAttr?.ref_code ?? null,
      utm_source: refAttr?.utm_source ?? null,
      utm_medium: refAttr?.utm_medium ?? null,
      utm_campaign: refAttr?.utm_campaign ?? null,
      referrer_url: refAttr?.referrer_url ?? null,
    });

    if (!res.error) {
      slug = candidate;
      insertError = null;
      break;
    }
    // 23505 = unique_violation. Anything else is fatal.
    if (res.error.code !== '23505') {
      insertError = res.error;
      break;
    }
    insertError = res.error;
  }

  if (insertError) {
    console.error('Insert error:', insertError);
    track('assess_submit_failed', {
      reason: 'rpc_error',
      entry_point: entryPoint,
      detail: insertError.code,
    });
    return {
      ok: false,
      error: 'Something went wrong. Please try again.',
    };
  }

  try {
    const RECENT_KEY = 'magnet:my_slugs';
    const LEGACY_KEY = 'magnet:my_slug';
    const MAX_RECENT = 10;

    let existing: string[] = [];
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed.filter((s) => typeof s === 'string' && s);
    } else {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) existing = [legacy];
    }

    const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    localStorage.setItem(LEGACY_KEY, slug);
  } catch {
    /* private mode / storage disabled - non-fatal */
  }

  // Fire and forget - enrichment runs in the background.
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

  const destination =
    verticalSlug === 'general' ? `/m/${slug}` : `/m/${slug}?vertical=${verticalSlug}`;

  return {
    ok: true,
    slug,
    normalizedUrl,
    destination,
  };
}
