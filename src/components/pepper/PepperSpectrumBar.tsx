import { useEffect, useRef, useState } from "react";

export default function PepperSpectrumBar() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimate(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      <div
        className="relative h-8 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #8B3A3A 0%, #C65D3E 30%, #C4A747 60%, #4A6741 100%)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Gloss overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
            borderRadius: "inherit",
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all ease-out"
          style={{
            left: animate ? "37.5%" : "0%",
            transform: `translate(-50%, -50%)`,
            transitionDuration: "1.2s",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Tooltip */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg whitespace-nowrap text-[11px] font-bold"
            style={{
              background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
              color: "#C65D3E",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            You: 1.5
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ background: "#1A1A2E" }}
            />
          </div>
          {/* Dot with glow */}
          <div
            className="w-6 h-6 rounded-full border-[3px] border-white relative"
            style={{
              background: "#2D2A26",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </div>
      <div className="flex justify-between text-[10px] sm:text-[11px] tracking-wide" style={{ color: "#A09890" }}>
        <span className="text-left">0 — <span className="hidden sm:inline">Relationship </span>Dependent</span>
        <span className="text-center">2 — <span className="hidden sm:inline">Trans</span>actional</span>
        <span className="text-right">4 — System<span className="hidden sm:inline">-Driven</span></span>
      </div>
    </div>
  );
}
