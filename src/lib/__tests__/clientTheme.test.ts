/**
 * Tests for `buildClientTheme` — focused on the v2 dark-body guard
 * (the Cravath failure mode surfaced in the audit).
 *
 * The guard is gated behind VITE_CLIENT_THEME_V2. We toggle it via
 * import.meta.env using vi.stubEnv so each test runs in a known mode.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildClientTheme,
  MABBLY_DEFAULTS,
  DARK_BODY_LUMINANCE_THRESHOLD,
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

describe("buildClientTheme — v2 dark-body guard OFF (legacy behavior)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CLIENT_THEME_V2", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("Cravath case: keeps extracted dark navy as body bg (legacy, broken)", () => {
    const raw: RawBranding = {
      client_company_name: "Cravath, Swaine & Moore",
      client_brand_color: "#A99054",
      client_background_color: "#0B1A2E",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe("#0b1a2e");
    // bgIsDark → text defaults to white
    expect(theme.text).toBe("#FFFFFF");
  });

  it("Slalom case: keeps a medium-blue body bg (no dark-body issue)", () => {
    const raw: RawBranding = {
      client_company_name: "Slalom",
      client_brand_color: "#0066CC",
      client_background_color: "#0066CC",
    };
    const theme = buildClientTheme(raw);
    // 0066CC is below the threshold but legacy doesn't gate.
    expect(theme.background.toLowerCase()).toBe("#0066cc");
  });
});

describe("buildClientTheme — v2 dark-body guard ON (Cravath fix)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CLIENT_THEME_V2", "true");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("Cravath case: forces cream body bg, keeps brand chrome dark", () => {
    const raw: RawBranding = {
      client_company_name: "Cravath, Swaine & Moore",
      client_brand_color: "#A99054",
      client_background_color: "#0B1A2E",
      brand_background: "#0B1A2E", // chrome bg stays dark
    };
    const theme = buildClientTheme(raw);
    // Body bg now Mabbly cream.
    expect(theme.background.toLowerCase()).toBe(MABBLY_DEFAULTS.background.toLowerCase());
    // Text flips to ink (cream + ink AA: 16:1).
    expect(theme.text).toBe(MABBLY_DEFAULTS.text);
    // Chrome bg preserved as the extracted navy.
    expect(theme.brandBackground.toLowerCase()).toBe("#0b1a2e");
  });

  it("Slalom case: medium-blue body bg also forced cream when below threshold", () => {
    // 0066CC luminance ≈ 0.13, below threshold (0.35), so v2 forces cream.
    const raw: RawBranding = {
      client_company_name: "Slalom",
      client_brand_color: "#0066CC",
      client_background_color: "#0066CC",
      brand_background: "#0066CC",
    };
    const theme = buildClientTheme(raw);
    expect(theme.background.toLowerCase()).toBe(MABBLY_DEFAULTS.background.toLowerCase());
    // Brand chrome retains the extracted blue.
    expect(theme.brandBackground.toLowerCase()).toBe("#0066cc");
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

  it("Missing color: falls back to Mabbly default cream regardless of flag", () => {
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
    // This is the v2 P0 'missing firm name' bug — Sprint 3 wires the fallback
    // separately via getDisplayName(). Here we just confirm current contract.
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
