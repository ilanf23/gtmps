// Centralized Calendly URL + popup helpers for the V10 microsite.
//
// All "Book Adam" CTAs route to https://calendly.com/adam-fridman/30min, with:
//  - UTM params for source attribution
//  - Prefilled name + firm from the breakdown
//  - Theme colors that match the brand-extracted microsite palette
//  - Confirmation redirect back to /m/<slug>?booked=true

const BASE_URL = "https://calendly.com/adam-fridman/30min";

export interface CalendlyContext {
  slug: string;
  firmName: string | null;
  firstName?: string | null;
  primary: string;
  background: string;
  text: string;
}

/** Build the Calendly URL for inline embedding. */
export function buildCalendlyEmbedUrl(ctx: CalendlyContext): string {
  const params = new URLSearchParams();
  params.set("hide_gdpr_banner", "1");
  params.set("background_color", ctx.background.replace("#", ""));
  params.set("text_color", ctx.text.replace("#", ""));
  params.set("primary_color", ctx.primary.replace("#", ""));

  // UTM attribution
  params.set("utm_source", "microsite");
  params.set("utm_medium", "map");
  params.set("utm_campaign", ctx.slug);

  // Prefill — Calendly accepts these query params on the booking widget.
  const displayName = [ctx.firstName, ctx.firmName].filter(Boolean).join(" · ");
  if (displayName) params.set("name", displayName);
  if (ctx.firmName) params.set("a1", ctx.firmName); // "Company" custom question
  return `${BASE_URL}?${params.toString()}`;
}

/** Build the Calendly URL for the popup widget (separate API but same params). */
export function buildCalendlyPopupUrl(ctx: CalendlyContext): string {
  // Same builder; Calendly popup respects the same query string.
  return buildCalendlyEmbedUrl(ctx);
}

/** Lazy-load the Calendly widget assets (script + stylesheet). */
export function ensureCalendlyAssets(): void {
  const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
  const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";
  if (typeof document === "undefined") return;
  if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLE_HREF;
    document.head.appendChild(link);
  }
  if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }
}

/** Open Calendly's popup widget. Falls back to opening in a new tab if the
 *  global isn't loaded yet (very first click before the script resolves). */
export function openCalendlyPopup(ctx: CalendlyContext): void {
  ensureCalendlyAssets();
  const url = buildCalendlyPopupUrl(ctx);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.Calendly?.initPopupWidget) {
    w.Calendly.initPopupWidget({ url });
    return;
  }
  // Script not ready — poll for up to 2s, then fallback to new tab.
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    if (w.Calendly?.initPopupWidget) {
      window.clearInterval(timer);
      w.Calendly.initPopupWidget({ url });
    } else if (tries > 20) {
      window.clearInterval(timer);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, 100);
}
