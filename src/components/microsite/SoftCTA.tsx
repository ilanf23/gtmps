import { useRevealRef, revealStyle } from "@/hooks/useRevealRef";

interface Props {
  buttonText: string;
  buttonUrl?: string;
  subtext: string;
}

export default function SoftCTA({ buttonText, buttonUrl, subtext }: Props) {
  const { ref, isVisible } = useRevealRef();

  return (
    <section ref={ref} style={revealStyle(isVisible)}>
      <div
        className="relative rounded-2xl p-8 sm:p-12 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(251,248,244,0.9), rgba(243,237,230,0.7))",
          border: "1px solid rgba(196,167,71,0.15)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Subtle gold glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-30%", left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "60%",
            background: "radial-gradient(ellipse, rgba(196,167,71,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative space-y-6">
          <h2
            className="text-[clamp(24px,3.5vw,36px)] font-bold text-[#2D2A26] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Walk Through This Together?
          </h2>
          <p className="text-[#6B6560] text-[16px] max-w-[480px] mx-auto leading-relaxed">
            {subtext}
          </p>
          <button
            className="relative overflow-hidden font-semibold px-10 py-4 rounded-xl text-[16px] transition-all duration-300 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #C65D3E, #A84D32)",
              color: "white",
              boxShadow: "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(198,93,62,0.35), 0 4px 12px rgba(0,0,0,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onClick={() => buttonUrl && window.open(buttonUrl, "_blank")}
          >
            {buttonText}
          </button>
          <p className="text-[13px] text-[#A09890] italic">
            No preparation needed. We've done the work.
          </p>
        </div>
      </div>
    </section>
  );
}
