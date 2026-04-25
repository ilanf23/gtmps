import type { StrategicObservation } from "@/types/microsite";
import { useRevealRef, revealStyle } from "@/hooks/useRevealRef";

interface Props {
  observations: StrategicObservation[];
}

export default function StrategicObservations({ observations }: Props) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">
          What We Noticed
        </span>
        <h2
          className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] leading-tight tracking-[-0.01em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          3 Things That Stood Out
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {observations.map((obs, i) => (
          <ObservationCard key={i} observation={obs} index={i} />
        ))}
      </div>
    </section>
  );
}

function ObservationCard({ observation, index }: { observation: StrategicObservation; index: number }) {
  const { ref, isVisible } = useRevealRef(index * 150);

  return (
    <div
      ref={ref}
      style={revealStyle(isVisible)}
      className="rounded-xl p-7 relative overflow-hidden transition-all duration-300 group"
    >
      {/* Top accent gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }}
      />

      {/* Card styling */}
      <div
        className="absolute inset-0 -z-10 transition-shadow duration-300"
        style={{
          background: "white",
          border: "1px solid rgba(221,213,204,0.5)",
          borderRadius: "inherit",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      />

      {/* Number accent */}
      <span
        className="text-[48px] font-bold leading-none absolute top-5 right-6 select-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "rgba(198,93,62,0.06)",
        }}
      >
        {index + 1}
      </span>

      <h3
        className="font-semibold text-[#2D2A26] text-[17px] mb-3 relative"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {observation.title}
      </h3>
      <p className="text-[14px] text-[#6B6560] leading-[1.7] relative">
        {observation.text}
      </p>
    </div>
  );
}
