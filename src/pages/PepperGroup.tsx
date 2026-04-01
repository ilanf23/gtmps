import { useState, useEffect } from "react";
import PepperTopBar from "@/components/pepper/PepperTopBar";
import PepperTabBar from "@/components/pepper/PepperTabBar";
import PepperOverview from "@/components/pepper/PepperOverview";
import PepperIdentity from "@/components/pepper/PepperIdentity";
import PepperOrbits from "@/components/pepper/PepperOrbits";
import PepperSignals from "@/components/pepper/PepperSignals";
import PepperRoadmap from "@/components/pepper/PepperRoadmap";
import PepperContentEngine from "@/components/pepper/PepperContentEngine";

const TABS = [PepperOverview, PepperIdentity, PepperOrbits, PepperSignals, PepperRoadmap, PepperContentEngine];

export default function PepperGroup() {
  const [activeTab, setActiveTab] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const handleTabChange = (i: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveTab(i);
      setFadeIn(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  useEffect(() => {
    document.title = "Pepper Group — Market Activation Profile | Mabbly";
  }, []);

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="min-h-screen" style={{ background: "#FBF8F4", fontFamily: "'Inter', sans-serif" }}>
      <PepperTopBar />
      <PepperTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main
        className="max-w-[1000px] mx-auto px-6 pt-32 pb-20 transition-all duration-300"
        style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(12px)" }}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}
