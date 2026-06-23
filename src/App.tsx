import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdsenseApprovalCheckerTool from "./pages/tools/AdsenseApprovalCheckerTool";
import AdsenseApprovalCalculator from "./pages/tools/AdsenseApprovalCalculator";
import AdsensePolicyChecker from "./pages/tools/AdsensePolicyChecker";
import AdsenseRejectionAnalyzer from "./pages/tools/AdsenseRejectionAnalyzer";
import WebsiteQualityScoreChecker from "./pages/tools/WebsiteQualityScoreChecker";
import ContentQualityChecker from "./pages/tools/ContentQualityChecker";
import SeoAuditChecker from "./pages/tools/SeoAuditChecker";
import HighCpcOpportunityFinder from "./pages/tools/HighCpcOpportunityFinder";
import NotFound from "./pages/NotFound";
import GuideDetail from "./pages/GuideDetail";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/adsense-approval-checker" element={<AdsenseApprovalCheckerTool />} />
          <Route path="/tools/adsense-approval-calculator" element={<AdsenseApprovalCalculator />} />
          <Route path="/tools/adsense-policy-checker" element={<AdsensePolicyChecker />} />
          <Route path="/tools/adsense-revenue-calculator" element={<RevenueCalculator />} />
          <Route path="/tools/adsense-rejection-analyzer" element={<AdsenseRejectionAnalyzer />} />
          <Route path="/tools/website-quality-score-checker" element={<WebsiteQualityScoreChecker />} />
          <Route path="/tools/content-quality-checker" element={<ContentQualityChecker />} />
          <Route path="/tools/seo-audit-checker" element={<SeoAuditChecker />} />
          <Route path="/tools/high-cpc-opportunity-finder" element={<HighCpcOpportunityFinder />} />
          <Route path="/tools/policy-page-generator" element={<PolicyGenerator />} />
          <Route path="/tools/seo-checklist" element={<SEOChecklist />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="/review-process" element={<ReviewProcess />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
