// SECTION 05 - Compact CTA: chapter capture.
// Mabbly hero brand reskin: sage panel, hand-drawn SVG illustration,
// care-orange shimmering pill. Brand-bridges from Discover Mabbly's
// research-publication register into mabbly.com's action-engagement register.
// Persists email to magnet_map_emails (tagged "chapter7").

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import "./CompactCtaCard.css";

interface Props {
  slug: string;
  vertical: string;
  primary: string;
  background: string;
  text: string;
  customerName: string;
  firstName?: string | null;
}

export default function CompactCtaCard({ slug, vertical }: Props) {
  void vertical;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      panel.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            panel.classList.add("is-in");
            io.unobserve(panel);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(panel);

    const fallback = window.setTimeout(() => {
      const rect = panel.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        panel.classList.add("is-in");
      }
    }, 100);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

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

  const handleDismiss = () => {
    trackMagnetEvent(slug, "cta_section5_dismiss", {});
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <section
      id="v10-section-5"
      data-v10-section="5"
      className="chapter-cta py-10 md:py-12"
    >
      <div className="container">
        <div ref={panelRef} className="cta-panel">
          <div className="cta-grid">
            <div className="illo" aria-hidden="true">
              <svg viewBox="0 0 600 510" xmlns="http://www.w3.org/2000/svg">
                {/* Olive scribble blob — verified Mabbly 9-point polygon */}
                <g transform="translate(12 -50) scale(0.95)">
                  <path
                    className="blob"
                    d="M537.319 540.412L227.81 609.6L34.3851 540.412L0 302.629L34.3851 34.5832L270.807 0L537.319 34.5832L576 259.406L537.319 540.412Z"
                  />
                </g>

                {/* Marker squiggles */}
                <path
                  className="squiggle s1"
                  d="M 130 200 C 90 160, 100 100, 160 90 C 220 80, 280 70, 340 80 C 400 90, 460 130, 470 190 C 480 250, 460 310, 410 350 C 360 390, 290 410, 230 390 C 170 370, 130 320, 120 270 C 110 220, 130 200, 130 200 Z"
                />
                <path
                  className="squiggle s2"
                  d="M 180 240 C 150 210, 160 170, 200 160 C 240 150, 290 150, 330 170 C 370 190, 400 230, 400 270 C 400 310, 370 340, 330 350 C 290 360, 240 350, 210 320 C 180 290, 175 260, 180 240 Z"
                />
                <path
                  className="squiggle s3"
                  d="M 80 110 C 110 80, 150 70, 200 90 C 240 105, 270 140, 250 180 C 230 220, 180 230, 150 210 C 130 200, 120 180, 130 160"
                />
                <path
                  className="squiggle s4"
                  d="M 480 380 C 460 410, 420 430, 380 420 C 340 410, 320 380, 340 340 C 360 310, 400 305, 430 320 C 450 330, 460 350, 470 370"
                />

                {/* L-bracket cropmarks */}
                <path className="cropmark cm-tl" d="M 220 220 L 220 240 M 220 220 L 240 220" />
                <path className="cropmark cm-tr" d="M 360 220 L 360 240 M 360 220 L 340 220" />
                <path className="cropmark cm-bl" d="M 220 320 L 220 300 M 220 320 L 240 320" />
                <path className="cropmark cm-br" d="M 360 320 L 360 300 M 360 320 L 340 320" />

                {/* Diamond gem */}
                <g className="diamond">
                  <path d="M 290 245 L 270 270 L 310 270 Z" fill="#E5582B" />
                  <path d="M 270 270 L 310 270 L 290 295 Z" fill="#BF461A" />
                  <path
                    d="M 290 245 L 270 270 L 290 295 Z"
                    fill="none"
                    stroke="#0F1E1D"
                    strokeWidth="0.8"
                    opacity="0.3"
                  />
                  <path
                    d="M 290 245 L 310 270 L 290 295 Z"
                    fill="none"
                    stroke="#0F1E1D"
                    strokeWidth="0.8"
                    opacity="0.3"
                  />
                  <path
                    d="M 290 245 L 270 270 L 310 270 Z"
                    fill="none"
                    stroke="#0F1E1D"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 270 270 L 310 270 L 290 295 Z"
                    fill="none"
                    stroke="#0F1E1D"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="290"
                    y1="245"
                    x2="290"
                    y2="295"
                    stroke="#0F1E1D"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                  <path
                    d="M 282 254 L 278 268"
                    stroke="#FFD68A"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </g>

                {/* Sparkle */}
                <g className="sparkle" transform="translate(330 240)">
                  <path
                    d="M 0 -6 L 1.2 -1.2 L 6 0 L 1.2 1.2 L 0 6 L -1.2 1.2 L -6 0 L -1.2 -1.2 Z"
                    fill="#FFBA1A"
                  />
                </g>
              </svg>
            </div>

            <div className="content">
              <div className="eyebrow">
                <span>05 · You're contributing to the research</span>
              </div>

              <h2 className="cta-headline">
                <span className="cta-headline-line">
                  <span className="word-mask"><span className="word-inner">WANT&nbsp;</span></span>
                  <span className="word-mask"><span className="word-inner">CHAPTER&nbsp;</span></span>
                  <span className="word-mask"><span className="word-inner">7&nbsp;</span></span>
                  <span className="word-mask"><span className="word-inner">OF&nbsp;</span></span>
                </span>
                <span className="cta-headline-line">
                  <span className="word-mask"><span className="word-inner">THE&nbsp;</span></span>
                  <span className="word-mask"><span className="word-inner">MANUSCRIPT</span></span>
                  <span className="word-mask"><span className="word-inner"><span className="qmark">?</span></span></span>
                </span>
              </h2>

              <p className="cta-body">
                The chapter that explains your <strong>highest leverage move</strong>. Drop your email and we'll send it when the next draft lands.
              </p>

              {submitted ? (
                <div className="cta-success" aria-live="polite">
                  Got it. Chapter 7 will arrive at <strong>{email.trim()}</strong>.
                </div>
              ) : (
                <form className="cta-form-row" onSubmit={handleSubmit}>
                  <label htmlFor="chapter7-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="chapter7-email"
                    className="cta-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourfirm.com"
                    required
                    disabled={submitting}
                  />
                  <button className="cta-pill" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send the Chapter"}
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2 7h10m0 0L8 3m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="cta-secondary"
                    onClick={handleDismiss}
                  >
                    Not now
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
