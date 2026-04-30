// SECTION 08 — Full CTA section (SECOND CTA, primary conversion target).
// Score-adaptive headline + variant copy + inline Calendly widget + microlines.

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CTA_VARIANTS, type CtaVariantId } from "@/content/ctaVariants";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { ensureCalendlyAssets, initCalendlyInline } from "@/lib/calendly";

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
  scoreAdaptiveHeadline,
  customerName,
  firstName,
  primary,
  background,
  text,
  calendarCta,
}: Props) {
  const variant = CTA_VARIANTS[variantId];
  const sectionRef = useRef<HTMLElement>(null);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track section view once
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

  // Lazy-load Calendly script + initialize the inline widget when ready.
  useEffect(() => {
    let cancelled = false;
    void ensureCalendlyAssets().then(() => {
      if (cancelled || !calendlyRef.current) return;
      initCalendlyInline(calendlyRef.current, {
        slug,
        firmName: customerName,
        firstName,
        primary,
        background,
        text,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, customerName, firstName, primary, background, text]);

  // Capture booking events (and route to ?booked=true).
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
      className="py-16 md:py-24 border-b border-black/10"
    >
      <div
        className="p-6 md:p-8 border-2"
        style={{
          backgroundColor: `color-mix(in srgb, var(--brand-bg, ${primary}) 10%, transparent)`,
          borderColor: `var(--brand-bg, var(--client-primary, ${primary}))`,
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
          <p
            className="text-[11px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: MABBLY_GOLD }}
          >
            08 · {calendarCta || "Your 30-minute conversation"}
          </p>
        </div>

        <h2
          className="font-bold leading-tight text-2xl md:text-3xl mb-2 max-w-2xl"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {scoreAdaptiveHeadline}
        </h2>
        <p className="text-sm opacity-55 mb-6">For {customerName}.</p>

        <div className="space-y-4 max-w-xl text-sm md:text-base leading-relaxed mb-6">
          {variant.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {variant.bullets && (
            <>
              <p className="font-semibold mt-2">What we'll discuss:</p>
              <ul className="space-y-1.5 pl-1">
                {variant.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: `var(--client-primary, ${primary})` }} aria-hidden>·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="font-semibold" style={{ color: `var(--client-primary, ${primary})` }}>
            {variant.closer}
          </p>
        </div>

        {/* Inline Calendly — initialized via initCalendlyInline() in the effect above. */}
        <div
          ref={calendlyRef}
          className="w-full border border-black/10"
          style={{ minWidth: "320px", height: "720px" }}
        />

        {/* Microlines */}
        <div className="mt-4 flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs opacity-65">
          <span>Adam typically has 4–6 slots open this week.</span>
          <span className="hidden sm:inline opacity-40" aria-hidden>·</span>
          <span>30 minutes. No pitch. No commitment.</span>
        </div>
      </div>
    </section>
  );
}
