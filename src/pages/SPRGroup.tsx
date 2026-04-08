import { useState, useEffect } from "react";
import SPRTopBar from "@/components/spr/SPRTopBar";
import SPRTabBar from "@/components/spr/SPRTabBar";
import SPROverview from "@/components/spr/SPROverview";
import SPROrbits from "@/components/spr/SPROrbits";
import SPRProof from "@/components/spr/SPRProof";
import SPRWhatIf from "@/components/spr/SPRWhatIf";
const TABS = [SPROverview, SPROrbits, SPRProof, SPRWhatIf];

export default function SPRGroup() {
  const [activeTab, setActiveTab] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const handleTabChange = (i: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveTab(i);
      setFadeIn(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 250);
  };

  useEffect(() => {
    const title = "SPR — Market Activation Profile | Mabbly";
    const description = "A personalized market activation profile prepared for Doug, Tom Ryan & Rebecca Butman by Mabbly.";
    const ogImage = `${window.location.origin}/og-spr.jpg`;

    document.title = title;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(property.startsWith("og:") ? "property" : "name", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:image", ogImage);
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
  }, []);

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 -z-20" style={{ background: "#FBF8F4" }} />
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
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <SPRTopBar />
      <SPRTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main
        className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-10 pt-28 md:pt-36 pb-16 md:pb-24 transition-all duration-400"
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
