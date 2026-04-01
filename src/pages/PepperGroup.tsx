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
    }, 250);
  };

  useEffect(() => {
    document.title = "Pepper Group — Market Activation Profile | Mabbly";
  }, []);

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Warm parchment base */}
      <div className="fixed inset-0 -z-20" style={{ background: "#FBF8F4" }} />

      {/* Atmospheric gradient overlays */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(198,93,62,0.04) 0%, transparent 60%)",
        }}
      />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 80% 100%, rgba(196,167,71,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Subtle paper grain texture */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <PepperTopBar />
      <PepperTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main
        className="max-w-[1040px] mx-auto px-6 md:px-10 pt-36 pb-24 transition-all duration-400"
        style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(16px)",
          transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}
