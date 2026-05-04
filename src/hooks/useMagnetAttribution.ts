import { useEffect, useState } from "react";
import {
  AttributionContext,
  captureAttribution,
  getCurrentAttribution,
} from "@/lib/magnetAttribution";

/**
 * Capture first-touch UTM/session/fingerprint context for a magnet slug.
 * Idempotent across re-renders; safe to call from any /m/:slug/* page or
 * from the shared MagnetShell.
 */
export function useMagnetAttribution(
  slug: string | null | undefined,
): AttributionContext | null {
  const [ctx, setCtx] = useState<AttributionContext | null>(() =>
    getCurrentAttribution(),
  );

  useEffect(() => {
    if (!slug) return;
    const next = captureAttribution(slug);
    setCtx(next);
  }, [slug]);

  return ctx;
}
