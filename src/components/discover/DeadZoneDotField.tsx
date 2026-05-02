import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  /** Total dots ~ cols × rows. */
  cols?: number;
  rows?: number;
  /** Fraction of dots that remain "alive" (gold) at rest state. 0..1 */
  aliveFraction?: number;
  className?: string;
}

/**
 * A field of dots representing a CRM. On scroll-into-view, ~70% of dots
 * fade from gold to dim — the Dead Zone happening before the viewer's eyes.
 * Reduced-motion fallback: dots render in their final state immediately.
 */
const DeadZoneDotField = ({
  cols = 60,
  rows = 28,
  aliveFraction = 0.30,
  className = "",
}: Props) => {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [trigger, setTrigger] = useState(false);

  // Deterministic pseudo-random so SSR + repeat renders match
  const dots = useMemo(() => {
    const arr: { x: number; y: number; alive: boolean; delay: number }[] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const r1 = rand();
        const r2 = rand();
        arr.push({
          x: c,
          y: r,
          alive: r1 < aliveFraction,
          delay: r2 * 1100,
        });
      }
    }
    return arr;
  }, [cols, rows, aliveFraction]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrigger(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const w = cols * 16;
  const h = rows * 16;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    >
      {dots.map((d, i) => {
        // initial: all gold; final: only "alive" dots stay gold, rest go dim
        const isFinal = trigger || reduced;
        const opacity = isFinal ? (d.alive ? 0.85 : 0.10) : 0.85;
        const fill = d.alive ? "#A8923A" : "#3A3326";
        return (
          <circle
            key={i}
            cx={d.x * 16 + 8}
            cy={d.y * 16 + 8}
            r={1.6}
            fill={fill}
            style={{
              opacity,
              transition: reduced
                ? "none"
                : `opacity 1100ms cubic-bezier(0.6, 0, 0.4, 1) ${d.delay}ms, fill 1100ms cubic-bezier(0.6, 0, 0.4, 1) ${d.delay}ms`,
            }}
          />
        );
      })}
    </svg>
  );
};

export default DeadZoneDotField;
