import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import RevenueCalculator from "./pages/RevenueCalculator";
import PolicyGenerator from "./pages/PolicyGenerator";
import SEOChecklist from "./pages/SEOChecklist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";
import SitemapPage from "./pages/SitemapPage";
import Blog from "./pages/Blog";
import Guides from "./pages/Guides";
import EditorialPolicy from "./pages/EditorialPolicy";
import ReviewProcess from "./pages/ReviewProcess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/adsense-revenue-calculator" element={<RevenueCalculator />} />
          <Route path="/tools/policy-page-generator" element={<PolicyGenerator />} />
          <Route path="/tools/seo-checklist" element={<SEOChecklist />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="/review-process" element={<ReviewProcess />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
