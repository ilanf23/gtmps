import StickyNav from "@/components/v1/StickyNav";
import HeroSection from "@/components/v1/HeroSection";
import DefinitionBanner from "@/components/v1/DefinitionBanner";
import SocialProofBar from "@/components/v1/SocialProofBar";
import MissionSection from "@/components/v1/MissionSection";
import EpisodeSection from "@/components/v1/EpisodeSection";
import BookSection from "@/components/v1/BookSection";
import AuthorsSection from "@/components/v1/AuthorsSection";

import ResultsSection from "@/components/v1/ResultsSection";

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
        
        <ResultsSection />
        
      </main>
      <Footer />
    </>
  );
};

export default IndexV1;
