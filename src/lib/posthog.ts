import posthog from "posthog-js";
import type { EventName, EventProps, Surface } from "./eventTaxonomy";
import {
  getOrCreateSessionId,
  getOrCreateVisitorFingerprint,
} from "./magnetAttribution";

let initialized = false;

function readUtmFromUrl() {
  if (typeof window === "undefined") return {};
  try {
    const url = new URL(window.location.href);
    const get = (k: string) => {
      const v = url.searchParams.get(k);
      return v && v.trim() ? v.trim() : null;
    };
    return {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
    };
  } catch {
    return {};
  }
}

export function initPostHog(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host =
    (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
    "https://us.i.posthog.com";

  if (!key) {
    // No-op in environments without a key. Local dev still works.
    return;
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    capture_performance: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-pii]",
    },
    loaded: (ph) => {
      try {
        ph.register({
          ...readUtmFromUrl(),
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
          session_id: getOrCreateSessionId(),
          visitor_fingerprint: getOrCreateVisitorFingerprint(),
        });
      } catch {
        /* never break the app */
      }
    },
  });

  initialized = true;
}

export function isPostHogReady(): boolean {
  return initialized;
}

// Typed track wrapper. Throws at compile time if event name is wrong or props
// don't match the taxonomy.
export function track<E extends EventName>(
  event: E,
  props: EventProps[E],
): void {
  if (!initialized) return;
  try {
    posthog.capture(event, props as Record<string, unknown>);
  } catch {
    /* never break the app */
  }
}

// Set per-pageview surface context. Call from each page's top-level component.
export function setSurface(surface: Surface, extra?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    posthog.register({ surface, ...(extra || {}) });
  } catch {
    /* ignore */
  }
}

export function identifyByEmail(
  email: string,
  source: "assess" | "feedback" | "save",
): void {
  if (!initialized) return;
  if (!email || typeof email !== "string") return;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return;
  try {
    posthog.identify(trimmed, { email: trimmed });
    posthog.capture("email_captured", { source });
  } catch {
    /* ignore */
  }
}

export function capturePageview(path: string): void {
  if (!initialized) return;
  try {
    posthog.capture("$pageview", { $current_url: path });
  } catch {
    /* ignore */
  }
}

export function getFeatureFlagPayload(flag: string): unknown {
  if (!initialized) return null;
  try {
    return posthog.getFeatureFlagPayload(flag);
  } catch {
    return null;
  }
}

export function onFeatureFlagsReady(cb: () => void): void {
  if (!initialized) {
    cb();
    return;
  }
  try {
    posthog.onFeatureFlags(() => cb());
  } catch {
    cb();
  }
}

export { posthog };
