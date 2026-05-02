/**
 * Tests for getDisplayName — the firm-name fallback resolver.
 *
 * Covers the v2 P0 bug surfaced on /m/cravath:
 *   client_company_name = "" → existing `??` chain passed through → hero blank.
 */

import { describe, it, expect } from "vitest";
import { getDisplayName, isGenericFallback } from "../companyName";

describe("getDisplayName", () => {
  it("uses companyName when set and non-empty", () => {
    expect(getDisplayName({ companyName: "Cravath", slug: "cravath" })).toBe("Cravath");
  });

  it("uses companyName when set with multiple words", () => {
    expect(getDisplayName({ companyName: "Cravath, Swaine & Moore", slug: "cravath" }))
      .toBe("Cravath, Swaine & Moore");
  });

  it("trims surrounding whitespace from companyName", () => {
    expect(getDisplayName({ companyName: "  Slalom  ", slug: "slalom" })).toBe("Slalom");
  });

  it("falls through empty companyName to slug-derived name (the Cravath bug)", () => {
    expect(getDisplayName({ companyName: "", slug: "cravath" })).toBe("Cravath");
  });

  it("falls through whitespace-only companyName to slug", () => {
    expect(getDisplayName({ companyName: "   ", slug: "marcumllp" })).toBe("Marcumllp");
  });

  it("falls through null companyName to slug", () => {
    expect(getDisplayName({ companyName: null, slug: "slalom" })).toBe("Slalom");
  });

  it("falls through undefined companyName to slug", () => {
    expect(getDisplayName({ slug: "ag-consulting-partners" })).toBe("Ag Consulting Partners");
  });

  it("strips collision suffix from slug-derived name", () => {
    expect(getDisplayName({ companyName: null, slug: "calliope-x7k" })).toBe("Calliope");
  });

  it("falls back to default when both companyName and slug are missing", () => {
    expect(getDisplayName({})).toBe("Your firm");
  });

  it("falls back to default when slug is the generated 'firm' placeholder", () => {
    expect(getDisplayName({ companyName: "", slug: "firm" })).toBe("Your firm");
  });

  it("respects a custom fallback string", () => {
    expect(getDisplayName({ slug: null, fallback: "your practice" })).toBe("your practice");
  });

  it("never returns an empty string", () => {
    expect(getDisplayName({ companyName: "" })).not.toBe("");
    expect(getDisplayName({ companyName: null })).not.toBe("");
    expect(getDisplayName({})).not.toBe("");
    expect(getDisplayName({ slug: "" })).not.toBe("");
  });
});

describe("isGenericFallback", () => {
  it("false when companyName is set", () => {
    expect(isGenericFallback({ companyName: "Cravath" })).toBe(false);
  });

  it("false when slug yields a real name", () => {
    expect(isGenericFallback({ slug: "cravath" })).toBe(false);
  });

  it("true when both are missing", () => {
    expect(isGenericFallback({})).toBe(true);
  });

  it("true when companyName is empty AND slug is the 'firm' placeholder", () => {
    expect(isGenericFallback({ companyName: "", slug: "firm" })).toBe(true);
  });
});
