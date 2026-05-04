import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import IndexV1 from "./pages/IndexV1.tsx";
import Discover from "./pages/Discover.tsx";
import Manuscript from "./pages/Manuscript.tsx";
import NotFound from "./pages/NotFound.tsx";
import PepperGroup from "./pages/microsites/PepperGroup.tsx";
import Google from "./pages/microsites/Google.tsx";
import SPRGroup from "./pages/SPRGroup.tsx";
import Consulting from "./pages/verticals/Consulting.tsx";
import Law from "./pages/verticals/Law.tsx";
import Accounting from "./pages/verticals/Accounting.tsx";
import Msp from "./pages/verticals/Msp.tsx";
import Advisory from "./pages/verticals/Advisory.tsx";
import Ae from "./pages/verticals/Ae.tsx";
import Recruiting from "./pages/verticals/Recruiting.tsx";
import Agency from "./pages/verticals/Agency.tsx";
import MagnetSite from "./pages/MagnetSite.tsx";
import MagnetBook from "./pages/MagnetBook.tsx";
import MagnetBookChatPage from "./pages/MagnetBookChatPage.tsx";
import MagnetBookReaderPage from "./pages/MagnetBookReaderPage.tsx";
import MagnetFeedbackPage from "./pages/MagnetFeedbackPage.tsx";
import MagnetCohortPage from "./pages/MagnetCohortPage.tsx";
import Awards from "./pages/Awards.tsx";
import About from "./pages/About.tsx";
import Aletheia from "./pages/Aletheia.tsx";
import Ops from "./pages/Ops.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SkipLink from "./components/SkipLink.tsx";
import useScrollRestoration from "./hooks/useScrollRestoration.ts";
import useFocusOnRouteChange from "./hooks/useFocusOnRouteChange.ts";

const queryClient = new QueryClient();

const ScrollRestoration = () => {
  useScrollRestoration();
  return null;
};

const FocusOnRouteChange = () => {
  useFocusOnRouteChange();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollRestoration />
        <ScrollToTop />
        <FocusOnRouteChange />
        <SkipLink />
        <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/v1" element={<Index />} />
          <Route path="/1" element={<IndexV1 />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/pepper-group" element={<PepperGroup />} />
          <Route path="/google" element={<Google />} />
          <Route path="/spr" element={<SPRGroup />} />
          <Route path="/manuscript" element={<Manuscript />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/law" element={<Law />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/msp" element={<Msp />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/ae" element={<Ae />} />
          <Route path="/recruiting" element={<Recruiting />} />
          <Route path="/agency" element={<Agency />} />
          <Route path="/m/:slug" element={<MagnetSite />} />
          <Route path="/m/:slug/chat" element={<MagnetBookChatPage />} />
          <Route path="/m/:slug/read" element={<MagnetBookReaderPage />} />
          <Route path="/m/:slug/feedback" element={<MagnetFeedbackPage />} />
          <Route path="/m/:slug/cohort" element={<MagnetCohortPage />} />
          <Route path="/book" element={<MagnetBook />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/about" element={<About />} />
          <Route path="/aletheia" element={<Aletheia />} />
          <Route path="/ops" element={<Ops />} />
          {/* ADD NEW MICROSITE ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
