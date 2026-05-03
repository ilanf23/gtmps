// SECTION 08 - Book a Walkthrough.
// Deep Forest two-column card. Editorial copy on the left, live Calendly
// inline embed on the right. Keeps the original analytics + booking message
// wiring intact.

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { CtaVariantId } from "@/content/ctaVariants";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { ensureCalendlyAssets, initCalendlyInline } from "@/lib/calendly";
import "./FullCtaSection.css";

interface Props {
  slug: string;
  vertical: string;
  variantId: CtaVariantId;
  scoreAdaptiveHeadline: string;
  customerName: string;
  firstName?: string | null;
  primary: string;
  background: string;
  text: string;
  calendarCta: string;
}

export default function FullCtaSection({
  slug,
  vertical,
  variantId,
  customerName,
  firstName,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            trackMagnetEvent(slug, "cta_section8_view", { vertical, variant: variantId });
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [slug, vertical, variantId]);

  useEffect(() => {
    let cancelled = false;
    void ensureCalendlyAssets().then(() => {
      if (cancelled || !calendlyRef.current) return;
      initCalendlyInline(calendlyRef.current, {
        slug,
        firmName: customerName,
        firstName,
        primary: "#FFBA1A",
        background: "#0F1E1D",
        text: "#EDF5EC",
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, customerName, firstName]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e?.data as { event?: string } | undefined;
      if (data?.event === "calendly.event_scheduled") {
        trackMagnetEvent(slug, "cta_section8_click", {
          vertical,
          variant: variantId,
          outcome: "scheduled",
        });
        const params = new URLSearchParams(location.search);
        if (params.get("booked") !== "true") {
          params.set("booked", "true");
          navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [slug, vertical, variantId, navigate, location.pathname, location.search]);

  return (
    <section
      ref={sectionRef}
      id="v10-section-8"
      data-v10-section="8"
      data-v10-cta="primary"
      data-v10-variant={variantId}
      className="v10-book-section"
    >
      <div className="v10-book-card">
        <div className="v10-book-left">
          <div className="v10-book-eyebrow">
            <span className="v10-book-eyebrow-rule" aria-hidden />
            <p className="v10-book-eyebrow-label">08 · Book a Walkthrough with Adam</p>
          </div>

          <h2 className="v10-book-headline">
            Activate Your Dead Zone Like Madcraft Did.
          </h2>

          <span className="v10-book-client-tag">For {customerName}</span>

          <p className="v10-book-body">
            Madcraft pulled{" "}
            <strong>$400K from one dormant proposal in 7 minutes</strong>. Your analysis
            mapped where yours sits. 30 minutes turns it into your 90 day plan.
          </p>

          <div className="v10-book-proof" role="list">
            <div className="v10-book-proof-item" role="listitem">
              <span className="v10-book-proof-num">$400K</span>
              <span className="v10-book-proof-label">Dormant Recovered</span>
            </div>
            <div className="v10-book-proof-item" role="listitem">
              <span className="v10-book-proof-num">30 min</span>
              <span className="v10-book-proof-label">Walkthrough</span>
            </div>
            <div className="v10-book-proof-item" role="listitem">
              <span className="v10-book-proof-num">90 day</span>
              <span className="v10-book-proof-label">Action Plan</span>
            </div>
          </div>

          <span className="v10-book-free">Free call. No pitch.</span>
        </div>

        <div className="v10-book-embed-wrap">
          <div ref={calendlyRef} className="calendly-embed" />
        </div>
      </div>
    </section>
  );
}
