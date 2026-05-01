// SECTION 07 — The Value (in their words)
// 3 verified case mini-cards + Adam anchor.

import { MABBLY_GOLD, MABBLY_DARK } from "@/lib/mabblyAnchors";

interface Props {
  primary: string;
}

interface CaseCard {
  client: string;
  quote: string;
  attribution: string;
}

const CASES: CaseCard[] = [
  {
    client: "Madcraft",
    quote: "$400K dormant proposal reactivated in 7 minutes.",
    attribution: "Stephen Cuccio · Head of New Client Strategy",
  },
  {
    client: "Calliope",
    quote: "2 dormant healthcare contacts. Both replied.",
    attribution: "Mary Tindall · Founder",
  },
  {
    client: "SPR",
    quote: "150 dormant enterprise contacts identified. 3 conversations restarted.",
    attribution: "Kyle Gams · Managing Director",
  },
];

export default function ValueInTheirWords({ primary }: Props) {
  return (
    <section
      id="v10-section-7"
      data-v10-section="7"
      className="py-10 md:py-12 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          07 · The value (in their words)
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-8"
        style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
      >
        What firms in the research found.
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {CASES.map((c) => (
          <figure
            key={c.client}
            className="bg-[#FBF8F4] border border-black/10 p-5 flex flex-col"
          >
            <p
              className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3"
              style={{ color: primary }}
            >
              {c.client}
            </p>
            <blockquote
              className="text-base font-medium leading-snug flex-1"
              style={{ fontFamily: "'Source Serif 4', 'IBM Plex Serif', Georgia, serif" }}
            >
              "{c.quote}"
            </blockquote>
            <figcaption className="text-[10px] uppercase tracking-[0.18em] mt-4 opacity-60">
              {c.attribution}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Adam anchor — Mabbly-locked identity, never re-skinned by client extraction */}
      <div
        className="mt-10 pt-8 flex items-start gap-4"
        style={{ borderTop: `1px solid ${MABBLY_GOLD}33` }}
      >
        <img
          src="/adam-fridman.png"
          alt="Adam Fridman"
          loading="lazy"
          className="w-20 h-20 rounded-full shrink-0 object-cover border-2"
          style={{
            borderColor: MABBLY_GOLD,
            backgroundColor: MABBLY_DARK,
          }}
        />
        <p className="text-sm md:text-base italic leading-relaxed opacity-85">
          I'm building this research with practitioners like you. The book gets sharper from your
          input. Let's discuss what we're learning from your firm.
          <span className="block not-italic mt-1 text-xs uppercase tracking-[0.22em] opacity-60">
            Adam Fridman
          </span>
        </p>
      </div>
    </section>
  );
}
