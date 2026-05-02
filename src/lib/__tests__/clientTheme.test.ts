/**
 * Tests for `buildClientTheme` — focused on the dark-body guard
 * (the Cravath failure mode surfaced in the audit). The guard is
 * now always-on; the previously-gated VITE_CLIENT_THEME_V2 flag
 * was removed once the path was proven via fixtures.
 */

import { describe, it, expect } from "vitest";
import {
  buildClientTheme,
  shouldForceDarkBodyFallback,
  MABBLY_DEFAULTS,
  DARK_BODY_LUMINANCE_THRESHOLD,
  INDUSTRY_FALLBACK_BG,
  type RawBranding,
} from "../clientTheme";

describe("buildClientTheme — null/undefined input", () => {
  it("returns Mabbly defaults when raw is null", () => {
    expect(buildClientTheme(null)).toEqual(MABBLY_DEFAULTS);
  });

  it("returns Mabbly defaults when raw is undefined", () => {
    expect(buildClientTheme(undefined)).toEqual(MABBLY_DEFAULTS);
  });
});

describe("buildClientTheme — dark-body guard (Cravath fix)", () => {
  it("Cravath case: forces cream body bg, switches chrome to safe navy", () => {
    const raw: RawBranding = {
      client_company_name: "Cravath, Swaine & Moore",
      client_brand_color: "#A99054",
      client_background_color: "#0B1A2E",
      brand_background: "#0B1A2E",
    };
    const theme = buildClientTheme(raw);
    // Body bg now Mabbly cream.
    expect(theme.background.toLowerCase()).toBe(MABBLY_DEFAULTS.background.toLowerCase());
    // Text flips to ink (cream + ink AA: 16:1).
    expect(theme.text).toBe(MABBLY_DEFAULTS.text);
    // Chrome bg switched to design-system fallback navy (cream-compatible
    // via the existing color-mix logic in MagnetShell). The firm's accent
    // color stays in brandAccent for links and accent rules.
    expect(theme.brandBackground.toLowerCase()).toBe(INDUSTRY_FALLBACK_BG.toLowerCase());
    expect(theme.brandAccent.toLowerCase()).toBe("#a99054");
  });

  it("Slalom case (light body, blue chrome): no override, brand colors preserved", () => {
    // Realistic Slalom extraction: body bg already light (cream-ish), chrome
    // bg navy-blue. Dark-body guard does NOT trigger because body is light.
    const raw: RawBranding = {
      client_company_name: "Slalom",
      client_brand_color: "#0066CC",
      client_background_color: "#FBF8F4",
      brand_background: "#0066CC",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe("#fbf8f4");
    expect(theme.brandBackground.toLowerCase()).toBe("#0066cc");
    expect(theme.brandAccent.toLowerCase()).toBe("#0066cc");
  });

  it("Both body AND chrome dark: chrome-safety swaps brandBackground to fallback navy", () => {
    // Cravath-class: extracted body is deep navy AND brand_background is also
    // deep navy. Forces body cream AND swaps chrome to INDUSTRY_FALLBACK_BG
    // so the inner-section color-mix logic in MagnetShell remains legible.
    const raw: RawBranding = {
      client_company_name: "DeepNavyCo",
      client_brand_color: "#A99054",
      client_background_color: "#002554",
      brand_background: "#001a3d",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe(MABBLY_DEFAULTS.background.toLowerCase());
    expect(theme.brandBackground.toLowerCase()).toBe(INDUSTRY_FALLBACK_BG.toLowerCase());
    // Firm's accent color stays — links, button text, accent rules use this.
    expect(theme.brandAccent.toLowerCase()).toBe("#a99054");
  });

  it("Light-bg firm: above threshold, body bg untouched", () => {
    const raw: RawBranding = {
      client_company_name: "BrightCo",
      client_brand_color: "#005ec3",
      client_background_color: "#FFFFFF",
    };
    const theme = buildClientTheme(raw);
    // White is above threshold (lum = 1.0), no override.
    expect(theme.background.toLowerCase()).toBe("#ffffff");
  });

  it("Cream-bg firm (typical): body bg untouched", () => {
    const raw: RawBranding = {
      client_company_name: "WarmCo",
      client_brand_color: "#B8933A",
      client_background_color: "#F5F1E8",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe("#f5f1e8");
  });

  it("Missing color: falls back to Mabbly default cream", () => {
    const raw: RawBranding = {
      client_company_name: "NoColorFirm",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe(MABBLY_DEFAULTS.background.toLowerCase());
  });

  it("Threshold edge: bg comfortably above threshold is NOT forced cream", () => {
    // #BCBCBC has luminance ~0.50 — well above threshold (0.35).
    const raw: RawBranding = {
      client_company_name: "EdgeCo",
      client_brand_color: "#3D5A4A",
      client_background_color: "#BCBCBC",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe("#bcbcbc");
  });
});

describe("buildClientTheme — companyName preservation", () => {
  it("preserves the extracted company name when present", () => {
    const raw: RawBranding = { client_company_name: "Marcum LLP" };
    expect(buildClientTheme(raw).companyName).toBe("Marcum LLP");
  });

  it("returns null when company name is missing", () => {
    // The 'missing firm name' bug — Sprint 3 wires the fallback separately
    // via getDisplayName(). Here we just confirm current contract.
    const raw: RawBranding = {};
    expect(buildClientTheme(raw).companyName).toBe(null);
  });
});

describe("DARK_BODY_LUMINANCE_THRESHOLD", () => {
  it("is exported and within a sensible range", () => {
    expect(DARK_BODY_LUMINANCE_THRESHOLD).toBeGreaterThan(0.2);
    expect(DARK_BODY_LUMINANCE_THRESHOLD).toBeLessThan(0.5);
  });
});

describe("shouldForceDarkBodyFallback (shared helper)", () => {
  it("true for deep navy", () => {
    expect(shouldForceDarkBodyFallback("#0B1A2E")).toBe(true);
  });

  it("true for medium-dark blue below threshold", () => {
    expect(shouldForceDarkBodyFallback("#0066CC")).toBe(true);
  });

  it("false for cream", () => {
    expect(shouldForceDarkBodyFallback("#F5F1E8")).toBe(false);
  });

  it("false for white", () => {
    expect(shouldForceDarkBodyFallback("#FFFFFF")).toBe(false);
  });

  it("false for invalid hex", () => {
    expect(shouldForceDarkBodyFallback("not-a-hex")).toBe(false);
  });
});
