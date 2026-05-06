import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Eager: the homepage. It is the most-visited route and we want it in the
// main bundle for the fastest possible LCP. Everything else is code-split
// by route via React.lazy below so a homepage hit no longer drags the PDF
// reader, ops dashboard, microsites, vertical landings, etc. into the wire.
import Discover from "./pages/Discover.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SkipLink from "./components/SkipLink.tsx";
import PostHogPageview from "./components/PostHogPageview.tsx";
import RefAttributionCapture from "./components/RefAttributionCapture.tsx";
import useScrollRestoration from "./hooks/useScrollRestoration.ts";
import useFocusOnRouteChange from "./hooks/useFocusOnRouteChange.ts";

// Lazy route chunks. Each becomes its own JS file fetched on navigation.
const Index = lazy(() => import("./pages/Index.tsx"));
const IndexV1 = lazy(() => import("./pages/IndexV1.tsx"));
const Manuscript = lazy(() => import("./pages/Manuscript.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PepperGroup = lazy(() => import("./pages/microsites/PepperGroup.tsx"));
const Google = lazy(() => import("./pages/microsites/Google.tsx"));
const SPRGroup = lazy(() => import("./pages/SPRGroup.tsx"));
const Consulting = lazy(() => import("./pages/verticals/Consulting.tsx"));
const Law = lazy(() => import("./pages/verticals/Law.tsx"));
const Accounting = lazy(() => import("./pages/verticals/Accounting.tsx"));
const Msp = lazy(() => import("./pages/verticals/Msp.tsx"));
const Advisory = lazy(() => import("./pages/verticals/Advisory.tsx"));
const Ae = lazy(() => import("./pages/verticals/Ae.tsx"));
const Recruiting = lazy(() => import("./pages/verticals/Recruiting.tsx"));
const Agency = lazy(() => import("./pages/verticals/Agency.tsx"));
const MagnetSite = lazy(() => import("./pages/MagnetSite.tsx"));
const MagnetBook = lazy(() => import("./pages/MagnetBook.tsx"));
const MagnetBookChatPage = lazy(() => import("./pages/MagnetBookChatPage.tsx"));
const MagnetBookReaderPage = lazy(() => import("./pages/MagnetBookReaderPage.tsx"));
const MagnetFeedbackPage = lazy(() => import("./pages/MagnetFeedbackPage.tsx"));
const MagnetCohortPage = lazy(() => import("./pages/MagnetCohortPage.tsx"));
const Awards = lazy(() => import("./pages/Awards.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Aletheia = lazy(() => import("./pages/Aletheia.tsx"));
const Ops = lazy(() => import("./pages/Ops.tsx"));

const queryClient = new QueryClient();

const ScrollRestoration = () => {
  useScrollRestoration();
  return null;
};

const FocusOnRouteChange = () => {
  useFocusOnRouteChange();
  return null;
};

// Bare `/m` or `/m/` (no slug) is a common foot-gun in channel-tagged links.
// Redirect to the homepage and preserve the query string so any UTMs ride
// through and RefAttributionCapture can record them.
const MagnetIndexRedirect = () => {
  const location = useLocation();
  return <Navigate to={{ pathname: "/", search: location.search }} replace />;
};

// Transparent fallback. Sub-200ms route chunks finish before any spinner
// would even be useful, and a flash of empty cream is less jarring than a
// loading indicator.
const RouteFallback = () => (
  <div style={{ minHeight: "100vh", background: "#F5F1E8" }} aria-hidden />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollRestoration />
        <ScrollToTop />
        <FocusOnRouteChange />
        <PostHogPageview />
        <RefAttributionCapture />
        <SkipLink />
        <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
        <Suspense fallback={<RouteFallback />}>
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
          <Route path="/m" element={<MagnetIndexRedirect />} />
          <Route path="/m/" element={<MagnetIndexRedirect />} />
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
        </Suspense>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
