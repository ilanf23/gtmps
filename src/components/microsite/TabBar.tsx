const DEFAULT_TABS = [
  "Overview",
  "Identity",
  "Orbits + Spectrum",
  "Live Signals",
  "Roadmap",
  "Your Content Engine",
];

interface Props {
  activeTab: number;
  onTabChange: (i: number) => void;
  tabLabels?: string[];
  ctaUrl?: string;
  onCtaClick?: () => void;
}

export default function TabBar({ activeTab, onTabChange, tabLabels, ctaUrl, onCtaClick }: Props) {
  const tabs = tabLabels ?? DEFAULT_TABS;
  const progress = ((activeTab + 1) / tabs.length) * 100;

  return (
    <div
      className="fixed top-14 left-0 right-0 z-40"
      style={{
        background: "rgba(251,248,244,0.92)",
        backdropFilter: "blur(12px) saturate(1.3)",
        WebkitBackdropFilter: "blur(12px) saturate(1.3)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-2 sm:px-6 md:px-10">
        <div
          className="flex gap-0 overflow-x-auto scrollbar-hide"
          role="tablist"
          style={{
            WebkitOverflowScrolling: "touch",
            maskImage: "linear-gradient(90deg, transparent, black 8px, black calc(100% - 8px), transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 8px, black calc(100% - 8px), transparent)",
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => onTabChange(i)}
              className="relative whitespace-nowrap px-3 sm:px-5 py-3 sm:py-3.5 text-[11px] sm:text-[12px] font-medium tracking-wide transition-all duration-300"
              style={{
                color: activeTab === i ? "#C65D3E" : "#A09890",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              {tab}
              <span
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-300"
                style={{
                  background: activeTab === i ? "linear-gradient(90deg, #C65D3E, #C4A747)" : "transparent",
                  opacity: activeTab === i ? 1 : 0,
                  transform: activeTab === i ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          ))}
          {/* CTA pill */}
          {ctaUrl && (
            <button
              onClick={() => {
                onCtaClick?.();
                window.open(ctaUrl, "_blank");
              }}
              className="whitespace-nowrap px-4 py-1.5 my-2 ml-2 text-[10px] sm:text-[11px] font-semibold tracking-wide rounded-full transition-all duration-300 cursor-pointer shrink-0"
              style={{
                background: "linear-gradient(135deg, #C65D3E, #A84D32)",
                color: "white",
                boxShadow: "0 2px 8px rgba(198,93,62,0.2)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(198,93,62,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(198,93,62,0.2)"; }}
            >
              Book Review →
            </button>
          )}
        </div>
      </div>
      <div className="h-[1.5px]" style={{ background: "rgba(0,0,0,0.03)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #C65D3E, #C4A747)",
            boxShadow: "0 0 8px rgba(198,93,62,0.3)",
          }}
        />
      </div>
    </div>
  );
}
