// SECTION 05 — Compact CTA card (FIRST CTA).
// Smooth-scrolls to #v10-section-8 (full inline calendar).

import { trackMagnetEvent } from "@/lib/magnetAnalytics";

interface Props {
  slug: string;
  vertical: string;
  primary: string;
}

export default function CompactCtaCard({ slug, vertical, primary }: Props) {
  const handleClick = () => {
    trackMagnetEvent(slug, "cta_section5_click", { vertical });
    const target = document.getElementById("v10-section-8");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
          borderColor: primary,
          backgroundColor: "rgba(184,147,58,0.06)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-px w-6"
            style={{ backgroundColor: primary }}
            aria-hidden
          />
          <p
            className="text-[11px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: primary }}
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
            backgroundColor: primary,
            color: "#120D05",
          }}
        >
          See Available Times <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
