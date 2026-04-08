import { useState } from "react";
import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";

export default function SPRDeadZoneCalc() {
  const [contacts, setContacts] = useState(8000);
  const [value, setValue] = useState(0);
  const [rate, setRate] = useState(3);
  const result = contacts * value * (rate / 100);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "white",
        border: "1px solid rgba(221,213,204,0.5)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="px-7 py-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #C8963E, #A07830)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)" }}
        />
        <h4
          className="text-white font-semibold text-[17px] relative"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dead Zone Revenue Calculator
        </h4>
        <p className="text-white/60 text-[12px] mt-1 relative">Adjust the sliders to see your potential</p>
      </div>
      <div className="p-7 space-y-7">
        {[
          { label: "Dormant Contacts", min: 1000, max: 15000, step: 500, val: contacts, set: setContacts, fmt: (v: number) => v.toLocaleString() },
          { label: "Avg Engagement Value", min: 0, max: 500000, step: 10000, val: value, set: setValue, fmt: (v: number) => v === 0 ? "$0" : `$${v.toLocaleString()}`, note: "We do not have this number. This is the most important input. Ask Tom's team." },
          { label: "Reactivation Rate (Year 1)", min: 1, max: 10, step: 1, val: rate, set: setRate, fmt: (v: number) => `${v}%` },
        ].map((s) => {
          const pct = ((s.val - s.min) / (s.max - s.min)) * 100;
          return (
            <div key={s.label} className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6B6560]">
                  {s.label}
                  {(s as any).note && <span className="block text-[10px] text-[#A09890] italic mt-0.5">{(s as any).note}</span>}
                </span>
                <span className="font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.fmt(s.val)}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.val}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #C8963E ${pct}%, rgba(228,222,214,0.6) ${pct}%)` }}
              />
            </div>
          );
        })}
        <div className="text-center pt-6 mt-2 relative" style={{ borderTop: "1px solid rgba(221,213,204,0.4)" }}>
          {value === 0 ? (
            <p className="text-[16px] italic" style={{ color: "#A09890" }}>
              Enter your average engagement size to see your Dead Zone Value.
            </p>
          ) : (
            <div
              className="text-[clamp(40px,6vw,64px)] font-bold leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#C8963E",
                textShadow: "0 0 30px rgba(200,150,62,0.15)",
              }}
            >
              $<PepperAnimatedCounter end={Math.round(result)} />
            </div>
          )}
          <p className="text-[13px] text-[#A09890] mt-2">from relationships you already earned</p>
        </div>
      </div>
    </div>
  );
}
