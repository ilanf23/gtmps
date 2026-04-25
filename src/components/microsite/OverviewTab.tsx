import type { SiteData } from "@/types/microsite";
import AnimatedCounter from "./AnimatedCounter";
import ExpandableRenderer from "./ExpandableRenderer";
import PersonalizationBanner from "./PersonalizationBanner";
import StrategicObservations from "./StrategicObservations";
import SoftCTA from "./SoftCTA";
import { useRevealRef, revealStyle } from "@/hooks/useRevealRef";

interface Props {
  data: SiteData["overview"];
  companyName: string;
  preparedFor: string;
  preparedDate?: string;
  discoveryDate?: string;
}

const RROS_STAGES = ["DISCOVER", "PROVE", "DESIGN", "ACTIVATE", "COMPOUND"];
const DEFAULT_JOURNEY_DESCRIPTIONS = [
  "Understanding your market and relationships",
  "Demonstrating capability with evidence",
  "Building your activation system",
  "Turning dormant relationships into pipeline",
  "Making growth self-sustaining",
];

export default function OverviewTab({ data, companyName, preparedFor, preparedDate, discoveryDate }: Props) {
  const headlineLines = data.headline.split("\n");

  return (
    <div className="space-y-20">
      {/* ─�� 1. HERO ── */}
      <section className="relative text-center max-w-[860px] mx-auto space-y-8 pt-4">
        {/* Atmospheric glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-60px", left: "50%", transform: "translateX(-50%)", width: "120%", height: "400px",
            background: "radial-gradient(ellipse 60% 80% at 50% 20%, rgba(198,93,62,0.05) 0%, transparent 60%)",
          }}
        />

        {/* Personalization banner */}
        <PersonalizationBanner
          preparedFor={preparedFor}
          companyName={companyName}
          preparedDate={preparedDate}
          discoveryDate={discoveryDate}
        />

        {/* Kicker */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px animate-[growRight_0.8s_ease-out_0.3s_both]" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#C65D3E", fontFamily: "'Inter', sans-serif" }}>
            Market Activation Profile
          </span>
          <span className="w-8 h-px animate-[growLeft_0.8s_ease-out_0.3s_both]" style={{ background: "linear-gradient(90deg, #C65D3E, transparent)" }} />
        </div>

        {/* Headline */}
        <h1
          className="relative text-[clamp(36px,5.5vw,64px)] leading-[1.0] font-bold text-[#2D2A26] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {headlineLines.map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
          <span style={{ color: "#C65D3E" }}>.</span>
        </h1>

        {/* Optional subtitle */}
        {data.headlineSub && (
          <p className="text-[#6B6560] text-lg leading-relaxed max-w-[600px] mx-auto">
            {data.headlineSub}
          </p>
        )}

        {/* Pull quote */}
        <div
          className="relative max-w-[720px] mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(251,248,244,0.8), rgba(243,237,230,0.6))",
            borderRadius: "16px",
            border: "1px solid rgba(198,93,62,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <div className="p-5 sm:p-8">
            <span className="absolute -top-3 left-6 sm:left-8 text-[56px] leading-none font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(198,93,62,0.15)" }}>"</span>
            <div className="flex gap-4 sm:gap-5">
              <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: "linear-gradient(180deg, #C65D3E, #C4A747)" }} />
              <div>
                <blockquote className="text-left text-[16px] sm:text-[17px] italic leading-[1.7] text-[#4A4540]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {data.pullQuote.text}
                </blockquote>
                <footer className="mt-4 text-left text-[12px] text-[#A09890] tracking-wide">
                  <span className="font-semibold text-[#6B6560]">{data.pullQuote.author}</span>
                  , {data.pullQuote.role}
                  {data.pullQuote.context && ` · ${data.pullQuote.context}`}
                </footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEY NUMBERS ── */}
      <KeyNumbersSection keyNumbers={data.keyNumbers} />

      {/* ── 3. DISCOVERY INSIGHTS ── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Discovery Insights</span>
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26] leading-tight tracking-[-0.01em]" style={{ fontFamily: "'Playfair Display', serif" }}>
            What You Said vs. What We Heard
          </h2>
        </div>
        <div className="space-y-4">
          {data.discoveryInsights.map((row, i) => (
            <InsightRow key={i} row={row} index={i} />
          ))}
        </div>
      </section>

      {/* ── 4. STRATEGIC OBSERVATIONS (replaces expandables) ── */}
      {data.strategicObservations && data.strategicObservations.length > 0 ? (
        <StrategicObservations observations={data.strategicObservations} />
      ) : (
        data.expandables.length > 0 && <ExpandableRenderer sections={data.expandables} />
      )}

      {/* ── 5. SOFT CTA ── */}
      {data.cta && (
        <SoftCTA
          buttonText={data.cta.buttonText}
          buttonUrl={data.cta.buttonUrl}
          subtext={data.cta.subtext}
        />
      )}

      {/* ── 6. JOURNEY PROGRESS ── */}
      <JourneyProgress
        currentStage={data.rrosCurrentStage}
        descriptions={data.journeyStageDescriptions}
      />
    </div>
  );
}

// ──�� Key Numbers with staggered scroll reveal + dividers ───

function KeyNumbersSection({ keyNumbers }: { keyNumbers: SiteData["overview"]["keyNumbers"] }) {
  const { ref, isVisible } = useRevealRef();

  return (
    <section
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      style={{
        ...revealStyle(isVisible),
        background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
        boxShadow: "0 20px 60px rgba(26,26,46,0.3), 0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div className="absolute pointer-events-none" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "100%", background: "radial-gradient(ellipse at top, rgba(198,93,62,0.08) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0 p-8 md:p-10">
        {keyNumbers.map((s, i) => (
          <KeyNumberStat key={i} stat={s} index={i} total={keyNumbers.length} />
        ))}
      </div>
    </section>
  );
}

function KeyNumberStat({ stat, index, total }: { stat: SiteData["overview"]["keyNumbers"][0]; index: number; total: number }) {
  const { ref, isVisible } = useRevealRef(index * 100);
  const showDivider = index < total - 1;

  return (
    <div
      ref={ref}
      className="text-center px-4 py-4 relative"
      style={revealStyle(isVisible)}
    >
      {/* Vertical divider on desktop */}
      {showDivider && (
        <div
          className="absolute right-0 top-3 bottom-3 w-px hidden md:block"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      )}
      {/* Horizontal divider between rows on mobile */}
      {index === 1 && (
        <div
          className="absolute bottom-0 left-4 right-4 h-px md:hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      )}
      <div
        className="text-[clamp(36px,5vw,56px)] font-bold leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: stat.danger ? "#E85D4A" : stat.accent ? "#C65D3E" : "rgba(255,255,255,0.9)",
          textShadow: stat.accent ? "0 0 30px rgba(198,93,62,0.2)" : stat.danger ? "0 0 20px rgba(232,93,74,0.2)" : "none",
        }}
      >
        <AnimatedCounter end={stat.end} suffix={stat.suffix} />
      </div>
      <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</div>
    </div>
  );
}

// ─── Discovery Insight Row with scroll reveal + CSS hover ───

function InsightRow({ row, index }: { row: SiteData["overview"]["discoveryInsights"][0]; index: number }) {
  const { ref, isVisible } = useRevealRef(index * 100);

  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 gap-6 rounded-xl p-7 transition-all duration-300 cursor-default hover:shadow-lg hover:-translate-y-0.5"
      style={{
        ...revealStyle(isVisible),
        background: "white",
        border: "1px solid rgba(221,213,204,0.5)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      <p className="italic text-[#5A5550] text-[15px] leading-[1.7]" style={{ fontFamily: "'Playfair Display', serif" }}>{row.quote}</p>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-px bg-[#C65D3E]" />
          <span className="text-[11px] font-bold text-[#C65D3E] uppercase tracking-[0.15em]">{row.label}</span>
        </div>
        <p className="text-[#2D2A26] text-sm leading-relaxed">{row.insight}</p>
      </div>
    </div>
  );
}

// ─── Journey Progress (redesigned RROS) ───

function JourneyProgress({ currentStage, descriptions }: { currentStage: number; descriptions?: string[] }) {
  const stageDescriptions = descriptions ?? DEFAULT_JOURNEY_DESCRIPTIONS;
  const { ref, isVisible } = useRevealRef();

  return (
    <section ref={ref} className="space-y-6" style={revealStyle(isVisible)}>
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Your Journey</span>
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Where You Are in the Process
        </h3>
      </div>
      <div className="space-y-3">
        {RROS_STAGES.map((stage, i) => {
          const isCurrent = i === currentStage;
          const isCompleted = i < currentStage;
          const isFuture = i > currentStage;

          return (
            <div
              key={stage}
              className="flex items-start gap-4 rounded-xl p-4 transition-all duration-300"
              style={{
                background: isCurrent ? "rgba(198,93,62,0.03)" : "transparent",
                border: `1px solid ${isCurrent ? "rgba(198,93,62,0.12)" : "rgba(221,213,204,0.3)"}`,
                opacity: isFuture ? 0.5 : 1,
              }}
            >
              {/* Stage indicator */}
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: isCurrent
                      ? "linear-gradient(135deg, #C65D3E, #C4A747)"
                      : isCompleted
                      ? "#4A6741"
                      : "rgba(228,222,214,0.5)",
                    color: isCurrent || isCompleted ? "white" : "#A09890",
                    boxShadow: isCurrent ? "0 4px 12px rgba(198,93,62,0.25)" : "none",
                  }}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
              </div>

              {/* Stage content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13px] font-bold tracking-[0.08em]"
                    style={{
                      color: isCurrent ? "#C65D3E" : isCompleted ? "#4A6741" : "#A09890",
                    }}
                  >
                    {stage}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C65D3E]/10 text-[#C65D3E]">
                      You are here
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#6B6560] mt-1 leading-relaxed">
                  {stageDescriptions[i] ?? ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
