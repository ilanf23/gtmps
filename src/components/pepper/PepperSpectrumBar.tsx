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
    <div ref={ref} className="space-y-3">
      <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, #8B3A3A, #C65D3E, #C4A747, #4A6741)" }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#2D2A26] shadow-lg transition-all duration-1000 ease-out"
          style={{ left: animate ? "37.5%" : "0%", transform: `translate(-50%, -50%)` }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-[11px] px-2 py-0.5 rounded whitespace-nowrap">
            You: 1.5
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-[#A09890]">
        <span>0 — Relationship Dependent</span>
        <span>2 — Transactional</span>
        <span>4 — System-Driven</span>
      </div>
    </div>
  );
}
