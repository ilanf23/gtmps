import StickyNav from "@/components/StickyNav";
import HeroSection from "@/components/HeroSection";
import DefinitionBanner from "@/components/DefinitionBanner";
import SocialProofBar from "@/components/SocialProofBar";
import MissionSection from "@/components/MissionSection";
import EpisodeSection from "@/components/EpisodeSection";
import BookSection from "@/components/BookSection";
import AuthorsSection from "@/components/AuthorsSection";
import DeeperSection from "@/components/DeeperSection";
import ResultsSection from "@/components/ResultsSection";
import ApplySection from "@/components/ApplySection";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
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

export default Index;
