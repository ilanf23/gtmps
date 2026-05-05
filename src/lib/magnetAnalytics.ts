// Lightweight client-side analytics for the V10 microsite.
// Writes to public.magnet_analytics_events (insert-only RLS).
//
// Every event is automatically stamped with the visitor's first-touch
// attribution (utm_source / utm_medium / utm_campaign) plus the per-tab
// session_id and per-browser visitor_fingerprint, so the channel funnel in
// /ops can credit conversions back to the channel that surfaced the lead.

import { supabase } from "@/integrations/supabase/client";
import { getCurrentAttribution } from "@/lib/magnetAttribution";
import { posthog, isPostHogReady, track } from "@/lib/posthog";
import type { CtaId } from "@/lib/eventTaxonomy";

export type MagnetEventName =
  | "section_view"
  | "cta_section5_click"
  | "cta_section5_chapter_submit"
  | "cta_section5_dismiss"
  | "cta_section8_view"
  | "cta_section8_click"
  | "share_click"
  | "save_click"
  | "save_submit"
  | "firm_name_corrected";

const SECTION_TO_CTA: Record<string, CtaId> = {
  cta_section5_click: "section5_compact",
  cta_section5_chapter_submit: "section5_compact",
  cta_section5_dismiss: "section5_compact",
  cta_section8_view: "section8_full",
  cta_section8_click: "section8_full",
};

function variantFromProps(props: Record<string, unknown>): string | null {
  const v = props.variant;
  return typeof v === "string" ? v : null;
}

export async function trackMagnetEvent(
  slug: string,
  event_name: MagnetEventName,
  props: Record<string, unknown> = {}
): Promise<void> {
  // Dual-write: PostHog first (synchronous, in-memory queue) so we never lose
  // the event if Supabase is slow or fails.
  if (isPostHogReady()) {
    try {
      posthog.capture(event_name, { slug, ...props });

      // Layer the new taxonomy on top of legacy CTA event names so PostHog
      // funnels can be built against a stable contract.
      const ctaId = SECTION_TO_CTA[event_name];
      if (ctaId) {
        if (event_name === "cta_section8_view") {
          track("cta_viewed", {
            slug,
            cta_id: ctaId,
            variant: variantFromProps(props),
          });
        } else {
          const outcome =
            event_name === "cta_section5_dismiss"
              ? "dismissed"
              : event_name === "cta_section5_chapter_submit"
                ? "submitted_chapter"
                : (props.outcome as
                    | "opened_calendly"
                    | "scheduled"
                    | "click"
                    | undefined) ?? "click";
          track("cta_clicked", {
            slug,
            cta_id: ctaId,
            variant: variantFromProps(props),
            outcome,
          });
        }
      }
    } catch (err) {
      if (typeof console !== "undefined") {
        console.debug("[magnet analytics] posthog capture failed", event_name, err);
      }
    }
  }

  try {
    const attr = getCurrentAttribution();
    await supabase
      .from("magnet_analytics_events")
      .insert({
        slug,
        event_name,
        props: props as never,
        utm_source: attr?.utm_source ?? null,
        utm_medium: attr?.utm_medium ?? null,
        utm_campaign: attr?.utm_campaign ?? null,
        session_id: attr?.session_id ?? null,
        visitor_fingerprint: attr?.visitor_fingerprint ?? null,
      });
  } catch (err) {
    // Analytics is best-effort. Never throw into the UI.
    if (typeof console !== "undefined") {
      console.debug("[magnet analytics] insert failed", event_name, err);
    }
  }
}
