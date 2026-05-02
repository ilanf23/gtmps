/**
 * Tests for magnetSlug helpers, focused on the slug-vs-canonical
 * disambiguation logic added in Track D of audit sprint 2.
 *
 * Audit case in scope: user submits "marcum.com" → enrichment resolves to
 * "CBIZ" (because Marcum was acquired). The slug stays `marcum` but the
 * canonical name is "CBIZ" — the page should surface that mismatch.
 */

import { describe, it, expect } from "vitest";
import {
  displayNameFromSlug,
  generateMagnetSlug,
  isCanonicalNameMismatch,
  normalizeFirmName,
} from "../magnetSlug";

describe("generateMagnetSlug", () => {
  it("strips protocol and www", () => {
    expect(generateMagnetSlug("https://www.aarete.com")).toBe("aarete");
  });

  it("keeps the leftmost label only", () => {
    expect(generateMagnetSlug("foo-bar.co.uk/path?x=1")).toBe("foo-bar");
  });

  it("falls back when input is empty", () => {
    expect(generateMagnetSlug("")).toMatch(/^firm-[a-z0-9]{3}$/);
  });
});

describe("displayNameFromSlug", () => {
  it("title-cases simple slugs", () => {
    expect(displayNameFromSlug("calliope")).toBe("Calliope");
  });

  it("strips collision suffixes", () => {
    expect(displayNameFromSlug("aarete-x7k")).toBe("Aarete");
  });

  it("returns null for the generic firm fallback", () => {
    expect(displayNameFromSlug("firm-x7k")).toBeNull();
  });
});

describe("normalizeFirmName", () => {
  it("strips legal suffixes", () => {
    expect(normalizeFirmName("Marcum LLP")).toBe("marcum");
    expect(normalizeFirmName("CBIZ, Inc.")).toBe("cbiz");
    expect(normalizeFirmName("Foo & Bar Group")).toBe("fooandbar");
  });

  it("collapses punctuation and whitespace", () => {
    expect(normalizeFirmName("foo-bar")).toBe("foobar");
    expect(normalizeFirmName("  Foo   Bar  ")).toBe("foobar");
  });

  it("returns empty for nullish input", () => {
    expect(normalizeFirmName(null)).toBe("");
    expect(normalizeFirmName(undefined)).toBe("");
    expect(normalizeFirmName("")).toBe("");
  });
});

describe("isCanonicalNameMismatch", () => {
  it("flags the Marcum → CBIZ acquisition case", () => {
    expect(isCanonicalNameMismatch("Marcum", "CBIZ")).toBe(true);
  });

  it("does not flag the same firm with a legal suffix", () => {
    expect(isCanonicalNameMismatch("Marcum", "Marcum LLP")).toBe(false);
    expect(isCanonicalNameMismatch("aarete", "AArete Consulting")).toBe(false);
  });

  it("does not flag identical names", () => {
    expect(isCanonicalNameMismatch("Cravath", "Cravath")).toBe(false);
  });

  it("does not flag when one name is empty (no signal yet)", () => {
    expect(isCanonicalNameMismatch("Marcum", "")).toBe(false);
    expect(isCanonicalNameMismatch(null, "CBIZ")).toBe(false);
  });

  it("does not flag punctuation-only differences", () => {
    expect(isCanonicalNameMismatch("foo bar", "Foo  Bar,  Inc.")).toBe(false);
  });
});
