import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  VERTICAL_FLOWS,
  resolveVerticalSlug,
  type VerticalFlow,
  type VerticalFlowSlug,
} from '@/content/verticalFlow';

export interface ResolvedVerticalFlow {
  slug: VerticalFlowSlug;
  flow: VerticalFlow;
  /** True when the URL/override produced a real vertical (not the "general" fallback). */
  isVertical: boolean;
}

/**
 * Resolve the active vertical context for the post-CTA flow.
 *
 * Priority:
 *   1. `override` argument — used by /m/[slug] result pages that hydrate the
 *      vertical from the persisted submission row when the URL param is missing.
 *   2. `?vertical=<slug>` URL param.
 *   3. "general" fallback.
 *
 * Always returns a complete flow config so callers can read every field unconditionally.
 */
export function useVerticalFlow(override?: string | null): ResolvedVerticalFlow {
  const [params] = useSearchParams();
  const raw = override ?? params.get('vertical');

  return useMemo(() => {
    const slug = resolveVerticalSlug(raw);
    return {
      slug,
      flow: VERTICAL_FLOWS[slug],
      isVertical: slug !== 'general',
    };
  }, [raw]);
}
