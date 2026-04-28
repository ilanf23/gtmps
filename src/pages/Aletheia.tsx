import { useEffect } from "react";
import AletheiaNav from "@/components/aletheia/AletheiaNav";
import AletheiaHero from "@/components/aletheia/AletheiaHero";
import AletheiaCore from "@/components/aletheia/AletheiaCore";
import AletheiaLanguageLock from "@/components/aletheia/AletheiaLanguageLock";
import AletheiaSaidHeard from "@/components/aletheia/AletheiaSaidHeard";
import AletheiaICPLock from "@/components/aletheia/AletheiaICPLock";
import AletheiaProvenProcess from "@/components/aletheia/AletheiaProvenProcess";
import AletheiaCalendar from "@/components/aletheia/AletheiaCalendar";
import AletheiaEverythingBuilt from "@/components/aletheia/AletheiaEverythingBuilt";
import AletheiaChapters from "@/components/aletheia/AletheiaChapters";
import AletheiaRevenueCalc from "@/components/aletheia/AletheiaRevenueCalc";
import AletheiaVision from "@/components/aletheia/AletheiaVision";
import AletheiaDeadZone from "@/components/aletheia/AletheiaDeadZone";
import AletheiaFinalCTA from "@/components/aletheia/AletheiaFinalCTA";

const Aletheia = () => {
  useEffect(() => {
    document.title = "Aletheia · Market Activation Profile · April 2026";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "The 48 hour Market Activation Profile for Aletheia. Doctrine, diagnosis, category build. Prepared by Mabbly.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  return (
    <main style={{ backgroundColor: "#0B1A2E", color: "#F5F1E8" }}>
      <AletheiaNav />
      <AletheiaHero />
      <AletheiaCore />
      <AletheiaLanguageLock />
      <AletheiaSaidHeard />
      <AletheiaICPLock />
      <AletheiaProvenProcess />
      <AletheiaCalendar />
      <AletheiaEverythingBuilt />
      <AletheiaChapters />
      <AletheiaRevenueCalc />
      <AletheiaVision />
      <AletheiaDeadZone />
      <AletheiaFinalCTA />
    </main>
  );
};

export default Aletheia;
