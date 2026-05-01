// Centralized Calendly URL + popup helpers for the V10 microsite.
//
// All "Book Adam" CTAs route to https://calendly.com/adam-fridman/30min, with:
//  - UTM params for source attribution
//  - Prefilled name + firm from the breakdown
//  - Theme colors that match the brand-extracted microsite palette
//  - Confirmation redirect back to /m/<slug>?booked=true

const BASE_URL = "https://calendly.com/adam-fridman/30min";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";

export interface CalendlyContext {
  slug: string;
  firmName: string | null;
  firstName?: string | null;
  primary: string;
  background: string;
  text: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & { Calendly?: any };

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

/** Same builder for popup. */
export function buildCalendlyPopupUrl(ctx: CalendlyContext): string {
  return buildCalendlyEmbedUrl(ctx);
}

/**
 * Warm up Calendly assets as early as possible.
 * Safe to call multiple times. Loads the popup script + stylesheet so that by
 * the time a user actually clicks a CTA or scrolls to the inline widget, the
 * network round-trips are already done.
 */
export function prewarmCalendly(): void {
  if (typeof document === "undefined") return;

  // Stylesheet (used by both popup and inline widgets).
  if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLE_HREF;
    document.head.appendChild(link);
  }

  // widget.js — only needed for the popup. Inline mounts a direct iframe.
  if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }
}

/** Lazy-load the Calendly widget assets and resolve when ready (popup path). */
export function ensureCalendlyAssets(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  prewarmCalendly();
  const w = window as AnyWindow;

  return new Promise((resolve) => {
    if (w.Calendly?.initPopupWidget) {
      resolve();
      return;
    }
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (w.Calendly?.initPopupWidget) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - start > 5000) {
        window.clearInterval(timer);
        resolve(); // resolve anyway; caller can fall back
      }
    }, 60);
  });
}

/**
 * Initialize the inline widget in `parent` by mounting the Calendly iframe
 * directly. We deliberately bypass widget.js here because:
 *  - widget.js itself just creates the same iframe with the same URL
 *  - mounting directly removes a JS download + parse + a polling round-trip
 *  - the iframe still emits the `calendly.event_scheduled` postMessage that
 *    our listener relies on
 */
export function initCalendlyInline(
  parent: HTMLElement,
  ctx: CalendlyContext,
): void {
  const url = `${buildCalendlyEmbedUrl(ctx)}&embed_domain=${encodeURIComponent(
    window.location.hostname,
  )}&embed_type=Inline`;

  // Reuse an existing iframe if its URL is identical (avoids reload flicker).
  const existing = parent.querySelector("iframe");
  if (existing && existing.getAttribute("src") === url) return;

  parent.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = "Book a call with Adam";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.minHeight = "660px";
  iframe.style.border = "0";
  iframe.style.colorScheme = "normal";
  iframe.loading = "eager";
  iframe.allow = "fullscreen";
  parent.appendChild(iframe);
}

/** Open Calendly's popup widget. Falls back to a new tab if JS isn't ready. */
export function openCalendlyPopup(ctx: CalendlyContext): void {
  const url = buildCalendlyPopupUrl(ctx);
  void ensureCalendlyAssets().then(() => {
    const w = window as AnyWindow;
    if (w.Calendly?.initPopupWidget) {
      w.Calendly.initPopupWidget({ url });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
}
