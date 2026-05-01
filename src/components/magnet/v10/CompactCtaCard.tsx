// SECTION 05 — Compact CTA: chapter capture.
// Trades the Calendly button for a single-line email capture that promises
// Chapter 7 of the manuscript. Persists to magnet_map_emails (tagged
// "chapter7"). No email is sent yet — delivery is a follow-up step.

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  slug: string;
  vertical: string;
  primary: string;
  background: string;
  text: string;
  customerName: string;
  firstName?: string | null;
}

export default function CompactCtaCard({
  slug,
  vertical,
  primary,
}: Props) {
  void vertical;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    setSubmitting(true);
    trackMagnetEvent(slug, "cta_section5_chapter_submit", { vertical: "chapter7" });
    const { error } = await supabase
      .from("magnet_map_emails")
      .insert({ slug, email: trimmed, vertical: "chapter7" });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't save your email. Try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list. Chapter 7 lands in your inbox soon.");
  };

  if (dismissed) return null;

  return (
    <section
      id="v10-section-5"
      data-v10-section="5"
      className="py-10 md:py-12 border-b border-black/10"
    >
      <div
        className="border-2 p-5 sm:p-6 md:p-8"
        style={{
          borderColor: `var(--brand-bg, var(--client-primary, ${primary}))`,
          backgroundColor: `color-mix(in srgb, var(--brand-bg, ${primary}) 10%, transparent)`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-px w-6"
            style={{ backgroundColor: MABBLY_GOLD }}
            aria-hidden
          />
          <p
            className="text-[11px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: `var(--brand-accent, ${MABBLY_GOLD})` }}
          >
            05 · You're contributing to the research
          </p>
        </div>
        <h2
          className="font-bold leading-tight text-xl md:text-2xl mb-2"
          style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
        >
          Want Chapter 7 of the manuscript?
        </h2>
        <p className="text-base md:text-sm opacity-75 mb-5 max-w-prose">
          The chapter that explains your highest leverage move. Drop your email and we'll send it when the next draft lands.
        </p>

        {submitted ? (
          <div
            className="text-sm font-medium"
            style={{ color: `var(--brand-accent, ${MABBLY_GOLD})` }}
            aria-live="polite"
          >
            Got it. Chapter 7 will arrive at <span className="font-semibold">{email.trim()}</span>.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-3"
          >
            <label htmlFor="chapter7-email" className="sr-only">
              Your email
            </label>
            <input
              id="chapter7-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourfirm.com"
              disabled={submitting}
              className="flex-1 h-12 min-h-[48px] px-4 text-base bg-white text-[#1C1008] placeholder:text-black/30 border border-black/10 focus:outline-none focus:ring-0 rounded-none disabled:opacity-50"
              style={{ borderColor: "rgba(0,0,0,0.15)" }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 h-12 min-h-[48px] px-6 font-semibold tracking-wide uppercase text-base sm:text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: `var(--brand-bg, ${primary})`,
                color: `var(--brand-bg-fg, #fff)`,
              }}
            >
              {submitting ? "Sending…" : (
                <>
                  Send the chapter <span aria-hidden>→</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                trackMagnetEvent(slug, "cta_section5_dismiss", {});
                setDismissed(true);
              }}
              className="h-12 min-h-[48px] px-4 text-sm uppercase tracking-wide font-medium opacity-60 hover:opacity-90 transition-opacity"
              style={{ color: "inherit" }}
            >
              Not now
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
