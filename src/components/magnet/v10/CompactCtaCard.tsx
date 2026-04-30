// SECTION 05 — Compact CTA card (FIRST CTA).
// Opens Calendly popup directly so visitors can book without scrolling.

import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { openCalendlyPopup } from "@/lib/calendly";

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
  background,
  text,
  customerName,
  firstName,
}: Props) {
  const handleClick = () => {
    trackMagnetEvent(slug, "cta_section5_click", { vertical });
    openCalendlyPopup({
      slug,
      firmName: customerName,
      firstName,
      primary,
      background,
      text,
    });
  };

  return (
    <section
      id="v10-section-5"
      data-v10-section="5"
      className="py-14 md:py-20 border-b border-black/10"
    >
      <div
        className="border-2 p-6 md:p-8"
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
            style={{ color: MABBLY_GOLD }}
          >
            05 · Want to discuss what you're seeing?
          </p>
        </div>
        <h2
          className="font-bold leading-tight text-xl md:text-2xl mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Skip ahead. Book Adam now.
        </h2>
        <p className="text-sm opacity-75 mb-5">
          30 minutes. Free. No pitch. No obligation.
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-2 h-12 min-h-[48px] px-6 font-semibold tracking-wide uppercase text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: `var(--brand-bg, ${primary})`,
            color: `var(--brand-bg-fg, #fff)`,
          }}
        >
          See Available Times <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
