const TABS = [
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
}

export default function PepperTabBar({ activeTab, onTabChange }: Props) {
  const progress = ((activeTab + 1) / TABS.length) * 100;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDD5CC]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide" role="tablist">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => onTabChange(i)}
              className={`whitespace-nowrap px-4 py-3 text-[13px] font-medium transition-colors border-b-2 ${
                activeTab === i
                  ? "text-[#C65D3E] border-[#C65D3E]"
                  : "text-[#A09890] border-transparent hover:text-[#6B6560]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-[2px] bg-[#F3EDE6]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #C65D3E, #C4A747)",
          }}
        />
      </div>
    </div>
  );
}
