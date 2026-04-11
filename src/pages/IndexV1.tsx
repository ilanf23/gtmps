import StickyNav from "@/components/v1/StickyNav";
import HeroSection from "@/components/v1/HeroSection";
import DefinitionBanner from "@/components/v1/DefinitionBanner";
import SocialProofBar from "@/components/v1/SocialProofBar";
import MissionSection from "@/components/v1/MissionSection";
import EpisodeSection from "@/components/v1/EpisodeSection";
import BookSection from "@/components/v1/BookSection";
import AuthorsSection from "@/components/v1/AuthorsSection";
import DeeperSection from "@/components/v1/DeeperSection";
import ResultsSection from "@/components/v1/ResultsSection";
import ApplySection from "@/components/v1/ApplySection";
import Footer from "@/components/v1/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const IndexV1 = () => {
  useScrollReveal();

  return (
    <>
      <StickyNav />
      <main>
        <HeroSection />
        <DefinitionBanner />
        <SocialProofBar />
        <MissionSection />
        <EpisodeSection />
        <BookSection />
        <AuthorsSection />
        <DeeperSection />
        <ResultsSection />
        <ApplySection />
      </main>
      <Footer />
    </>
  );
};

export default IndexV1;
