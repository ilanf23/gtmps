// P0 event taxonomy. Every analytics call goes through this map so events are
// compile-checked and consistent. When adding an event, define it here first.

export type Surface =
  | "discover"
  | "vertical"
  | "microsite"
  | "magnet"
  | "editorial";

export type CtaId =
  | "section5_compact"
  | "section8_full"
  | "sticky_bottom"
  | "vertical_score"
  | "discover_hero"
  | "microsite_cta";

export type EventProps = {
  // Funnel entry
  assess_form_viewed: { entry_point: CtaId };
  assess_form_submitted: {
    website_url: string;
    entry_point: CtaId;
    vertical: string | null;
  };
  assess_submit_failed: {
    reason: "validation" | "rpc_error" | "network" | "unknown";
    entry_point: CtaId;
    detail?: string;
  };

  // Magnet lifecycle
  magnet_polling_started: { slug: string };
  magnet_status_transition: {
    slug: string;
    from: string;
    to: string;
  };
  magnet_enrichment_complete: {
    slug: string;
    latency_ms: number;
    gtm_profile_observed: boolean;
  };
  magnet_enrichment_failed: {
    slug: string;
    reason: "timeout" | "enrichment_error" | "rpc_error";
    latency_ms: number;
  };
  magnet_map_rendered: {
    slug: string;
    score: number | null;
    deal_size_estimate: string | null;
    cta_variant: string | null;
  };

  // MAP engagement
  section_view: { slug: string; section: string };
  cta_viewed: { slug: string; cta_id: CtaId; variant: string | null };
  cta_clicked: {
    slug: string;
    cta_id: CtaId;
    variant: string | null;
    outcome:
      | "opened_calendly"
      | "dismissed"
      | "submitted_chapter"
      | "scheduled"
      | "click";
  };
  booking_completed: {
    slug: string;
    cta_id: CtaId;
    variant: string | null;
  };

  // Book + feedback
  book_chat_opened: { slug: string };
  book_chat_message_sent: {
    slug: string;
    message_length: number;
    is_suggested_prompt: boolean;
  };
  book_chat_error: {
    slug: string;
    code: "rate_limited" | "credits" | "network" | "unknown";
  };
  book_reader_opened: { slug: string };
  book_reader_page_changed: {
    slug: string;
    page_number: number;
    direction: "next" | "prev";
    method: "key" | "click" | "button";
  };
  book_reader_fullscreen_toggled: { slug: string; entered: boolean };
  feedback_submitted: { slug: string };
  feedback_submit_failed: { slug: string; reason: string };

  // Vertical landings
  vertical_audit_answered: {
    vertical: string;
    question_id: number;
    answer: "yes" | "no";
    yes_count_after: number;
  };
  vertical_audit_alert_triggered: {
    vertical: string;
    yes_count: number;
  };
  vertical_cta_clicked: { vertical: string; cta_id: CtaId };

  // Microsite
  microsite_tab_switched: {
    microsite_slug: string;
    from_tab: string;
    to_tab: string;
  };
  microsite_cta_clicked: { microsite_slug: string; cta_id: string };

  // Share / save (legacy names preserved for dual-write parity)
  share_click: { slug: string; channel: "copy" | "email"; vertical?: string };
  save_submit: { slug: string; vertical?: string };

  // Identity
  email_captured: { source: "assess" | "feedback" | "save" };

  // Channel attribution mirror (PostHog backstop for the per-channel funnel)
  channel_view: {
    path: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    ref_code: string | null;
    referrer_url: string | null;
  };
  channel_map_submitted: {
    slug: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    ref_code: string | null;
    source: "url" | "localStorage" | "referrer" | "none";
  };
};

export type EventName = keyof EventProps;
