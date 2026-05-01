// Lightweight client-side analytics for the V10 microsite.
// Writes to public.magnet_analytics_events (insert-only RLS).

import { supabase } from "@/integrations/supabase/client";

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
    await supabase
      .from("magnet_analytics_events")
      .insert({ slug, event_name, props: props as never });
  } catch (err) {
    // Analytics is best-effort. Never throw into the UI.
    if (typeof console !== "undefined") {
      console.debug("[magnet analytics] insert failed", event_name, err);
    }
  }
}
