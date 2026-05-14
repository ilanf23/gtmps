import { supabase } from "@/integrations/supabase/client";
import {
  getOrCreateSessionId,
  getOrCreateVisitorFingerprint,
} from "@/lib/magnetAttribution";

export interface LeadInput {
  source: string;            // e.g. "beta_reader", "notify_ai", "notify_com"
  variant?: string | null;   // e.g. "ai" | "com"
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  firm?: string | null;
  message?: string | null;
}

/** Fire-and-forget insert into lead_signups. Never throws. */
export async function captureLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  try {
    const params =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const payload = {
      source: input.source,
      variant: input.variant ?? null,
      email: input.email.trim(),
      first_name: input.first_name?.trim() || null,
      last_name: input.last_name?.trim() || null,
      firm: input.firm?.trim() || null,
      message: input.message?.trim() || null,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      referrer_url: typeof document !== "undefined" ? document.referrer || null : null,
      utm_source: params?.get("utm_source") || null,
      utm_medium: params?.get("utm_medium") || null,
      utm_campaign: params?.get("utm_campaign") || null,
      visitor_fingerprint: getOrCreateVisitorFingerprint(),
      session_id: getOrCreateSessionId(),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    };
    const { error } = await supabase.from("lead_signups").insert(payload);
    if (error) {
      console.warn("captureLead failed", error);
      return { ok: false, error: error.message };
    }
    // Fire-and-forget Slack notification to #microsite-gtmps.
    void supabase.functions.invoke("notify-lead-slack", {
      body: {
        source: payload.source,
        variant: payload.variant,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        firm: payload.firm,
        page_path: payload.page_path,
      },
    }).catch(() => { /* best-effort */ });
    return { ok: true };
  } catch (e) {
    console.warn("captureLead exception", e);
    return { ok: false, error: String(e) };
  }
}