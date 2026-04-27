// SECTION 07 — The Value (in their words)
// 3 verified case mini-cards + Adam anchor.

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
      className="py-16 md:py-24 border-b border-black/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: primary }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: primary }}
        >
          07 · The value (in their words)
        </p>
      </div>
      <h2
        className="font-bold leading-tight text-2xl md:text-3xl mb-8"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
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
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              "{c.quote}"
            </blockquote>
            <figcaption className="text-[10px] uppercase tracking-[0.18em] mt-4 opacity-60">
              — {c.attribution}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Adam anchor */}
      <div className="mt-10 pt-8 border-t border-black/10 flex items-start gap-4">
        <div
          className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-base font-bold border-2"
          style={{
            backgroundColor: "#1C1008",
            color: primary,
            borderColor: primary,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
          aria-label="Adam Fridman"
        >
          AF
        </div>
        <p className="text-sm md:text-base italic leading-relaxed opacity-85">
          I'm building this research with practitioners like you. The book gets sharper from your
          input. Let's discuss what we're learning from your firm.
          <span className="block not-italic mt-1 text-xs uppercase tracking-[0.22em] opacity-60">
            — Adam Fridman
          </span>
        </p>
      </div>
    </section>
  );
}
