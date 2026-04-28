import { useMemo, useState } from "react";
import AletheiaSectionReveal from "./AletheiaSectionReveal";

const NAVY = "#0B1A2E";
const GOLD = "#C8963E";
const OFFWHITE = "#F5F1E8";
const SLATE = "#7A8AA0";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

const SliderRow = ({ label, value, min, max, step, format, onChange }: SliderRowProps) => (
  <div className="space-y-3">
    <div className="flex items-baseline justify-between">
      <label
        className="text-[11px] tracking-[0.28em]"
        style={{ color: SLATE, fontFamily: "'Inter Tight', sans-serif" }}
      >
        {label}
      </label>
      <span
        className="font-bold"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem",
          color: GOLD,
        }}
      >
        {format(value)}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
      style={{ accentColor: GOLD }}
    />
  </div>
);

const AletheiaRevenueCalc = () => {
  const [discoveries, setDiscoveries] = useState(10);
  const [conv, setConv] = useState(60);
  const [avg, setAvg] = useState(300_000);
  const [pool, setPool] = useState(40);
  const [reactConv, setReactConv] = useState(12);

  const { newRev, reactRev, total } = useMemo(() => {
    const newRev = discoveries * (conv / 100) * avg * 4;
    const reactRev = pool * (reactConv / 100) * avg;
    return { newRev, reactRev, total: newRev + reactRev };
  }, [discoveries, conv, avg, pool, reactConv]);

  return (
    <section className="py-32 md:py-48" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <AletheiaSectionReveal>
          <div
            className="text-xs tracking-[0.32em] mb-4"
            style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
          >
            FIELD 09 · REVENUE MATH
          </div>
          <p
            className="mb-16 text-lg"
            style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
          >
            Move the levers. Watch the year build.
          </p>
        </AletheiaSectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AletheiaSectionReveal delay={80}>
            <div
              className="border p-8 md:p-10 space-y-8"
              style={{ borderColor: `${GOLD}55`, backgroundColor: "rgba(245,241,232,0.02)" }}
            >
              <SliderRow
                label="DISCOVERIES PER QUARTER"
                value={discoveries}
                min={1}
                max={40}
                step={1}
                format={(v) => `${v}`}
                onChange={setDiscoveries}
              />
              <SliderRow
                label="CONVERSION RATE"
                value={conv}
                min={5}
                max={100}
                step={1}
                format={(v) => `${v}%`}
                onChange={setConv}
              />
              <SliderRow
                label="AVERAGE ENGAGEMENT VALUE"
                value={avg}
                min={50_000}
                max={1_000_000}
                step={25_000}
                format={fmt}
                onChange={setAvg}
              />
              <SliderRow
                label="REACTIVATION POOL"
                value={pool}
                min={0}
                max={250}
                step={5}
                format={(v) => `${v}`}
                onChange={setPool}
              />
              <SliderRow
                label="REACTIVATION CONVERSION"
                value={reactConv}
                min={0}
                max={50}
                step={1}
                format={(v) => `${v}%`}
                onChange={setReactConv}
              />
            </div>
          </AletheiaSectionReveal>

          <AletheiaSectionReveal delay={160}>
            <div
              className="border p-8 md:p-10 h-full flex flex-col justify-center"
              style={{ borderColor: GOLD, backgroundColor: `${GOLD}10` }}
            >
              <div
                className="text-[11px] tracking-[0.3em] mb-4"
                style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
              >
                YEAR ONE NEW REVENUE
              </div>
              <div
                className="font-bold mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.4rem",
                  color: OFFWHITE,
                }}
              >
                {fmt(newRev)}
              </div>
              <div
                className="text-xs mb-10"
                style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
              >
                Discoveries × Conversion × Average Value × four quarters
              </div>

              <div
                className="text-[11px] tracking-[0.3em] mb-4"
                style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
              >
                REACTIVATION REVENUE
              </div>
              <div
                className="font-bold mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.4rem",
                  color: OFFWHITE,
                }}
              >
                {fmt(reactRev)}
              </div>
              <div
                className="text-xs mb-10"
                style={{ color: SLATE, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
              >
                Pool × Reactivation Conversion × Average Value
              </div>

              <div className="border-t pt-6" style={{ borderColor: `${GOLD}55` }}>
                <div
                  className="text-[11px] tracking-[0.3em] mb-3"
                  style={{ color: GOLD, fontFamily: "'Inter Tight', sans-serif" }}
                >
                  TOTAL YEAR ONE
                </div>
                <div
                  className="font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3.2rem",
                    color: GOLD,
                    lineHeight: 1.05,
                  }}
                >
                  {fmt(total)}
                </div>
              </div>
            </div>
          </AletheiaSectionReveal>
        </div>
      </div>
    </section>
  );
};

export default AletheiaRevenueCalc;
