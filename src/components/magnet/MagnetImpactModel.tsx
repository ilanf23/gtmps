import { useState } from "react";

interface MagnetImpactModelProps {
  crmEstimate?: number;
  dealSizeEstimate?: number;
  companyName: string;
  primaryColor?: string;
}

const DORMANCY_RATE = 0.81;
const DZ_CONVERSION = 0.03;
const ACQ_MULTIPLIER = 7;
const BASE_CONTACTS = 200;
const BASE_WITHOUT = 78000;
const BASE_WITH = 486000;
const BASE_DEAL = 150000;

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return "$" + (Math.round(n / 100_000) / 10).toFixed(1) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "K";
  return "$" + Math.round(n);
}

export default function MagnetImpactModel({
  crmEstimate,
  dealSizeEstimate,
  companyName,
  primaryColor,
}: MagnetImpactModelProps) {
  const [crm, setCrm] = useState<number>(crmEstimate ?? 1500);
  const [deal, setDeal] = useState<number>(dealSizeEstimate ?? 150_000);

  const dormant = Math.round(crm * DORMANCY_RATE);
  const deadZoneValue = Math.round(dormant * deal * DZ_CONVERSION);
  const replaceCost = Math.round(deadZoneValue * ACQ_MULTIPLIER);
  const scale = (dormant / BASE_CONTACTS) * (deal / BASE_DEAL);
  const pipelineWithout = Math.round(BASE_WITHOUT * scale);
  const pipelineWith = Math.round(BASE_WITH * scale);
  const multiplier =
    pipelineWithout > 0 ? (pipelineWith / pipelineWithout).toFixed(1) : "6.2";

  const grayBarWidth =
    pipelineWith > 0
      ? Math.round((pipelineWithout / pipelineWith) * 100) + "%"
      : "16%";

  const accent = /^#[0-9a-fA-F]{6}$/.test(primaryColor ?? "")
    ? (primaryColor as string)
    : "#A8923A";
  const labelClass = "text-xs uppercase tracking-widest mb-4";
  const labelStyle = { color: accent } as const;
  const cardClass = "bg-black/[0.03] border border-black/10 p-5";
  const dividerClass = "border-t border-black/10 my-8";

  const displayCompany = companyName?.trim() ? companyName : "Your";

  return (
    <div className="bg-transparent text-[#0F1E1D]">
      {/* SECTION 1: Monday Morning Test header */}
      <div>
        <p className={labelClass} style={labelStyle}>THE MONDAY MORNING TEST</p>
        <p className="text-sm opacity-75 mt-1 leading-relaxed">
          "Open your CRM. Count the contacts you haven't spoken to in 90 days.
          Multiply by your average deal size. Multiply by 3%."
        </p>
        <p className="text-xs opacity-60 mt-1 italic">
          From Chapter 1: The Dead Zone
        </p>
      </div>

      <div className={dividerClass} />

      {/* SECTION 2: Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-[#0F1E1D]/60 mb-2 block">
            Contacts in your CRM
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={100}
              max={10_000}
              step={100}
              value={crm}
              onChange={(e) => setCrm(Number(e.target.value))}
              className="accent-[#A8923A] w-full"
            />
            <span className="text-sm font-semibold text-[#0F1E1D] min-w-[60px] text-right">
              {crm.toLocaleString()}
            </span>
          </div>
          {typeof crmEstimate === "number" && crmEstimate > 0 ? (
            <p className="text-xs opacity-60 mt-2">Estimated from your website</p>
          ) : null}
        </div>

        <div>
          <label className="text-xs text-[#0F1E1D]/60 mb-2 block">
            Average engagement size
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={25_000}
              max={500_000}
              step={25_000}
              value={deal}
              onChange={(e) => setDeal(Number(e.target.value))}
              className="accent-[#A8923A] w-full"
            />
            <span className="text-sm font-semibold text-[#0F1E1D] min-w-[60px] text-right">
              {fmtMoney(deal)}
            </span>
          </div>
          {typeof dealSizeEstimate === "number" && dealSizeEstimate > 0 ? (
            <p className="text-xs opacity-60 mt-2">Estimated from your market</p>
          ) : null}
        </div>
      </div>

      <div className={dividerClass} />

      {/* SECTION 3: Three metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardClass}>
          <p className="text-[#A8923A] text-xs uppercase tracking-widest">
            DORMANT CONTACTS
          </p>
          <p className="text-3xl font-bold text-[#0F1E1D] mt-3">
            {dormant.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2 leading-relaxed">
            Sitting silent in your CRM. Not lost. Not gone. Waiting.
          </p>
        </div>

        <div className="border-[#A8923A]/40 bg-transparent border p-5">
          <p className="text-[#A8923A] text-xs uppercase tracking-widest">
            YOUR DEAD ZONE VALUE
          </p>
          <p className="text-3xl font-bold text-[#A8923A] mt-3">
            {fmtMoney(deadZoneValue)}
          </p>
          <p className="text-xs opacity-75 mt-2 leading-relaxed">
            What you're leaving on the table every quarter you do nothing.
          </p>
        </div>

        <div className={cardClass}>
          <p className="text-[#A8923A] text-xs uppercase tracking-widest">
            COST TO REPLACE THIS PIPELINE
          </p>
          <p className="text-3xl font-bold text-[#0F1E1D] mt-3">
            {fmtMoney(replaceCost)}
          </p>
          <p className="text-xs opacity-75 mt-2 leading-relaxed">
            7× more expensive to acquire new clients than reactivate these.
          </p>
        </div>
      </div>

      <div className={dividerClass} />

      {/* SECTION 4: The Formula multiplier */}
      <div>
        <p className={labelClass} style={labelStyle}>
          THE FORMULA MULTIPLIER, SAME {displayCompany.toUpperCase()} CONTACTS,
          DIFFERENT SYSTEM
        </p>
        <p className="text-xs opacity-70 mb-6 leading-relaxed">
          Verified case: 200 contacts, same firm, same time period. $78K pipeline
          without the Formula. $486K with it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black/[0.03] border border-black/10 p-5">
            <p className="text-xs opacity-70 uppercase tracking-wider mb-3">
              WITHOUT THE FORMULA
            </p>
            <p className="text-3xl font-bold opacity-70">
              {fmtMoney(pipelineWithout)}
            </p>
            <p className="text-xs opacity-60 mt-2 leading-relaxed">
              Generic outreach. No signal, no proof, no context. 1.3% reply rate
              on the same contacts.
            </p>
          </div>

          <div className="bg-[#A8923A]/10 border border-[#A8923A]/30 p-5">
            <p className="text-[#A8923A] text-xs uppercase tracking-wider mb-3">
              WITH THE FORMULA
            </p>
            <p className="text-[#A8923A] text-3xl font-bold">
              {fmtMoney(pipelineWith)}
            </p>
            <p className="text-xs opacity-75 mt-2 leading-relaxed">
              Signal + Proof + Context. 8.1% reply rate. 37% win rate on
              reactivated pipeline.
            </p>
          </div>
        </div>

        {/* Multiplier bar */}
        <div className="bg-black/[0.03] p-4 mt-4">
          <div className="flex justify-between mb-3">
            <span className="text-xs opacity-70">Pipeline multiplier</span>
            <span className="text-sm font-semibold text-[#A8923A]">
              {multiplier}× from the same contacts
            </span>
          </div>

          <div className="h-2 bg-black/10 rounded-full mb-2 overflow-hidden">
            <div
              className="h-full bg-black/30 rounded-full"
              style={{ width: grayBarWidth }}
            />
          </div>
          <p className="text-xs opacity-60 mb-3">
            Without: {fmtMoney(pipelineWithout)}
          </p>

          <div className="h-2 bg-[#A8923A] rounded-full" style={{ width: "100%" }} />
          <div className="flex justify-between mt-2">
            <span className="text-xs opacity-75">
              With: {fmtMoney(pipelineWith)}
            </span>
            <span className="text-xs opacity-60">
              Scaled from verified $78K to $486K case
            </span>
          </div>
        </div>
      </div>

      <div className={dividerClass} />

      {/* SECTION 5: Four stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            n: "74%",
            l: "First seller to respond after a trigger wins the deal",
          },
          {
            n: "8.1%",
            l: "Reply rate with signal-activated outreach vs. 1.3% generic",
          },
          {
            n: "7×",
            l: "More expensive to acquire a new client than reactivate one",
          },
          {
            n: "60 to 70%",
            l: "Conversion rate from existing relationships vs. 5 to 20% new",
          },
        ].map((s) => (
          <div key={s.n} className="bg-black/[0.03] border border-black/10 p-4">
            <p className="text-2xl font-bold text-[#0F1E1D]">{s.n}</p>
            <p className="text-xs opacity-70 mt-1 leading-relaxed">{s.l}</p>
          </div>
        ))}
      </div>

      <div className={dividerClass} />

      {/* SECTION 6: Verified in Practice */}
      <div>
        <p className={labelClass} style={labelStyle}>VERIFIED IN PRACTICE</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border-l-2 border-[#A8923A]/50 pl-4">
            <p className="text-sm font-semibold text-[#0F1E1D] mb-1">
              Stephen at Madcraft
            </p>
            <p className="text-xs opacity-75 leading-relaxed">
              $400K proposal dormant 10 months. One signal-triggered email. Reply
              in 7 minutes. Closed in 3 weeks.
            </p>
          </div>
          <div className="border-l-2 border-[#A8923A]/50 pl-4">
            <p className="text-sm font-semibold text-[#0F1E1D] mb-1">SPR</p>
            <p className="text-xs opacity-75 leading-relaxed">
              150 dormant enterprise contacts. 43 signal-activated emails. ~7%
              reply rate. Benchmark: less than 1% cold.
            </p>
          </div>
          <div className="border-l-2 border-[#A8923A]/50 pl-4">
            <p className="text-sm font-semibold text-[#0F1E1D] mb-1">AArete</p>
            <p className="text-xs opacity-75 leading-relaxed">
              160 dormant proposals found in HubSpot. Not a pipeline problem. A
              parking lot full of Ferraris with the keys still in them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
