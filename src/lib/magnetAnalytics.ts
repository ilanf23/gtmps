// Lightweight client-side analytics for the V10 microsite.
// Writes to public.magnet_analytics_events (insert-only RLS).
//
// Every event is automatically stamped with the visitor's first-touch
// attribution (utm_source / utm_medium / utm_campaign) plus the per-tab
// session_id and per-browser visitor_fingerprint, so the channel funnel in
// /ops can credit conversions back to the channel that surfaced the lead.

import { supabase } from "@/integrations/supabase/client";
import { getCurrentAttribution } from "@/lib/magnetAttribution";

export type MagnetEventName =
  | "section_view"
  | "cta_section5_click"
  | "cta_section5_chapter_submit"
  | "cta_section5_dismiss"
  | "cta_section8_view"
  | "cta_section8_click"
  | "share_click"
  | "save_click"
  | "save_submit";

export async function trackMagnetEvent(
  slug: string,
  event_name: MagnetEventName,
  props: Record<string, unknown> = {}
): Promise<void> {
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
