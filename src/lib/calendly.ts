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

/** Lazy-load the Calendly widget assets and resolve when ready. */
export function ensureCalendlyAssets(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const w = window as AnyWindow;

  if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLE_HREF;
    document.head.appendChild(link);
  }

  let script = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_SRC}"]`,
  );
  if (!script) {
    script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }

  return new Promise((resolve) => {
    if (w.Calendly?.initInlineWidget) {
      resolve();
      return;
    }
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (w.Calendly?.initInlineWidget) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - start > 5000) {
        window.clearInterval(timer);
        resolve(); // resolve anyway; caller can fall back
      }
    }, 80);
  });
}

/** Initialize the inline widget in `parent`. Clears any prior render. */
export function initCalendlyInline(
  parent: HTMLElement,
  ctx: CalendlyContext,
): void {
  const url = buildCalendlyEmbedUrl(ctx);
  const w = window as AnyWindow;
  // Clear any prior placeholder text or previously-mounted iframe.
  parent.innerHTML = "";
  if (w.Calendly?.initInlineWidget) {
    w.Calendly.initInlineWidget({ url, parentElement: parent });
  } else {
    // Fallback: raw iframe so users still see the booker even if the JS fails.
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = "Book a call with Adam";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.allow = "fullscreen";
    parent.appendChild(iframe);
  }
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
