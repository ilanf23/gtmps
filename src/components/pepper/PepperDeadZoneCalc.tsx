import { useState } from "react";

export default function PepperDeadZoneCalc() {
  const [contacts, setContacts] = useState(500);
  const [value, setValue] = useState(120000);
  const [rate, setRate] = useState(5);
  const result = contacts * value * (rate / 100);

  return (
    <div className="bg-white border border-[#DDD5CC] rounded-xl overflow-hidden">
      <div className="bg-[#C65D3E] px-6 py-4">
        <h4 className="text-white font-semibold">Dead Zone Revenue Calculator</h4>
      </div>
      <div className="p-6 space-y-6">
        {[
          { label: "Dormant Contacts", min: 100, max: 2000, step: 50, val: contacts, set: setContacts, fmt: (v: number) => v.toLocaleString() },
          { label: "Avg New Client Engagement Value", min: 25000, max: 500000, step: 5000, val: value, set: setValue, fmt: (v: number) => `$${v.toLocaleString()}` },
          { label: "Reactivation Rate (Year 1)", min: 1, max: 20, step: 1, val: rate, set: setRate, fmt: (v: number) => `${v}%` },
        ].map((s) => (
          <div key={s.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6560]">{s.label}</span>
              <span className="font-semibold text-[#2D2A26]">{s.fmt(s.val)}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.val}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, #C65D3E ${((s.val - s.min) / (s.max - s.min)) * 100}%, #E8E2DA ${((s.val - s.min) / (s.max - s.min)) * 100}%)`,
              }}
            />
          </div>
        ))}
        <div className="text-center pt-4 border-t border-[#DDD5CC]">
          <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#C65D3E]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ${result.toLocaleString()}
          </div>
          <p className="text-sm text-[#6B6560] mt-1">from relationships you already earned</p>
        </div>
      </div>
    </div>
  );
}
