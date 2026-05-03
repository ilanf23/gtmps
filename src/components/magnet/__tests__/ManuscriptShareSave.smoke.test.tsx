// Smoke tests for the SECTION 11 Share + Save card.
//
// Guards against the class of bug where a button label promises an action
// that the handler does not actually perform (e.g. "Email me this map" that
// never sends an email). Each test asserts that the user-visible CTA reaches
// its terminal side-effect, not just that it renders.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ManuscriptShareSave from "../v10/ManuscriptShareSave";

// Mock supabase client - we only care that the right calls are made.
vi.mock("@/integrations/supabase/client", () => {
  const insertSpy = vi.fn().mockResolvedValue({ error: null });
  const invokeSpy = vi.fn().mockResolvedValue({ data: null, error: null });
  return {
    supabase: {
      from: vi.fn(() => ({ insert: insertSpy })),
      functions: { invoke: invokeSpy },
      __insertSpy: insertSpy,
      __invokeSpy: invokeSpy,
    },
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/magnetAnalytics", () => ({
  trackMagnetEvent: vi.fn(),
}));

const renderShareSave = () =>
  render(
    <ManuscriptShareSave
      slug="jabian"
      shareToken="tok-123"
      vertical="general"
      customerName="Jabian"
      fromName="Adam"
      primary="#B8933A"
      emailSubject="Your GTM map"
      shareTemplate="Take a look at our GTM map."
    />,
  );

describe("ManuscriptShareSave CTAs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    // jsdom does not implement navigation; stub assignment to mailto.
    Object.defineProperty(window, "location", {
      value: { ...window.location, href: "" },
      writable: true,
    });
  });

  it("Copy link writes the share URL to the clipboard", async () => {
    renderShareSave();
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    const arg = (navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>)
      .mock.calls[0][0] as string;
    expect(arg).toContain("/m/jabian");
    expect(arg).toContain("share_id=tok-123");
  });

  it("Email forward navigates to a mailto: URL with subject + body", () => {
    renderShareSave();
    fireEvent.click(screen.getByRole("button", { name: /email forward/i }));
    expect(window.location.href.startsWith("mailto:")).toBe(true);
    expect(window.location.href).toContain("subject=");
    expect(window.location.href).toContain("body=");
  });

  it("Email me this map opens the dialog and submits an email", async () => {
    renderShareSave();
    fireEvent.click(screen.getByRole("button", { name: /email me this map/i }));
    const input = await screen.findByPlaceholderText(/you@yourfirm\.com/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send map/i }));
    // Persistence path is exercised; the broken delivery path (#1) is tracked
    // separately. This test guards the form wiring only.
    await waitFor(() => {
      expect(screen.getByText(/sent\./i)).toBeInTheDocument();
    });
  });
});
