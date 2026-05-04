import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  __resetAttributionForTests,
  captureAttribution,
  getCurrentAttribution,
  getOrCreateSessionId,
  getOrCreateVisitorFingerprint,
} from "@/lib/magnetAttribution";

function setUrl(href: string) {
  // jsdom: navigate the location object via window.history.replaceState so
  // window.location.href / searchParams reflect the new URL.
  window.history.replaceState({}, "", href);
}

describe("magnetAttribution", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    __resetAttributionForTests();
    setUrl("/m/acme");
    Object.defineProperty(document, "referrer", {
      configurable: true,
      get: () => "",
    });
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    __resetAttributionForTests();
  });

  it("returns null context with no UTMs and no stored first-touch", () => {
    const ctx = captureAttribution("acme");
    expect(ctx.utm_source).toBeNull();
    expect(ctx.utm_medium).toBeNull();
    expect(ctx.utm_campaign).toBeNull();
    expect(localStorage.getItem("mabbly:magnet:firstTouch:acme")).toBeNull();
  });

  it("captures and persists first-touch UTMs", () => {
    setUrl("/m/acme?utm_source=linkedin&utm_medium=post&utm_campaign=may-launch");
    const ctx = captureAttribution("acme");
    expect(ctx.utm_source).toBe("linkedin");
    expect(ctx.utm_medium).toBe("post");
    expect(ctx.utm_campaign).toBe("may-launch");
    const stored = JSON.parse(
      localStorage.getItem("mabbly:magnet:firstTouch:acme")!,
    );
    expect(stored.utm_source).toBe("linkedin");
  });

  it("preserves first-touch when a second visit arrives with new UTMs", () => {
    setUrl("/m/acme?utm_source=linkedin&utm_medium=post&utm_campaign=may-launch");
    captureAttribution("acme");
    __resetAttributionForTests();

    setUrl("/m/acme?utm_source=twitter&utm_medium=tweet&utm_campaign=other");
    const ctx = captureAttribution("acme");
    expect(ctx.utm_source).toBe("linkedin");
    expect(ctx.utm_medium).toBe("post");
    expect(ctx.utm_campaign).toBe("may-launch");
  });

  it("ignores empty/whitespace UTM values", () => {
    setUrl("/m/acme?utm_source=&utm_medium=%20&utm_campaign=");
    const ctx = captureAttribution("acme");
    expect(ctx.utm_source).toBeNull();
    expect(ctx.utm_medium).toBeNull();
    expect(localStorage.getItem("mabbly:magnet:firstTouch:acme")).toBeNull();
  });

  it("captures partial UTMs (source-only is enough to mint a first-touch)", () => {
    setUrl("/m/acme?utm_source=email");
    const ctx = captureAttribution("acme");
    expect(ctx.utm_source).toBe("email");
    expect(ctx.utm_medium).toBeNull();
    expect(localStorage.getItem("mabbly:magnet:firstTouch:acme")).not.toBeNull();
  });

  it("getCurrentAttribution returns the last captured context", () => {
    setUrl("/m/acme?utm_source=linkedin");
    const captured = captureAttribution("acme");
    expect(getCurrentAttribution()).toEqual(captured);
  });

  it("session and fingerprint ids are stable across calls", () => {
    const s1 = getOrCreateSessionId();
    const s2 = getOrCreateSessionId();
    expect(s1).toBe(s2);
    const f1 = getOrCreateVisitorFingerprint();
    const f2 = getOrCreateVisitorFingerprint();
    expect(f1).toBe(f2);
  });

  it("first-touch is per-slug (different slugs get independent records)", () => {
    setUrl("/m/acme?utm_source=linkedin");
    captureAttribution("acme");
    __resetAttributionForTests();

    setUrl("/m/beta?utm_source=email");
    const beta = captureAttribution("beta");
    expect(beta.utm_source).toBe("email");

    __resetAttributionForTests();
    setUrl("/m/acme");
    const acme = captureAttribution("acme");
    expect(acme.utm_source).toBe("linkedin");
  });
});
