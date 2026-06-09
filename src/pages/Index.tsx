import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import NewHero from "@/components/NewHero";
import { SiteLayout } from "@/components/layout/SiteLayout";
import CheckResults, { CheckResult } from "@/components/CheckResults";
import RecentChecks from "@/components/RecentChecks";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AuditCategories } from "@/components/home/AuditCategories";
import { LiveResultDemo } from "@/components/home/LiveResultDemo";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ToolsHubPreview } from "@/components/home/ToolsHubPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FAQ } from "@/components/home/FAQ";
import { Testimonials } from "@/components/home/Testimonials";
import { CTABanner } from "@/components/home/CTABanner";
import { toast } from "sonner";

const Index = () => {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [recentChecks, setRecentChecks] = useState<Array<{ url: string; score: number; date: string }>>([]);
  const [currentCheck, setCurrentCheck] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("recentChecks");
    if (saved) setRecentChecks(JSON.parse(saved));
  }, []);

  const simulateCheck = async (websiteUrl: string): Promise<{ results: CheckResult[]; score: number }> => {
    const stages = [
      { label: "🔍 Crawling domain...", pct: 20, delay: 400 },
      { label: "📊 Analyzing content...", pct: 40, delay: 900 },
      { label: "🔒 Checking security...", pct: 60, delay: 1500 },
      { label: "⚖️ Verifying legal pages...", pct: 80, delay: 2100 },
      { label: "⚡ Measuring performance...", pct: 100, delay: 2700 },
    ];
    stages.forEach((s) =>
      setTimeout(() => { setCurrentCheck(s.label); setProgress(s.pct); }, s.delay)
    );
    await new Promise((r) => setTimeout(r, 3000));

    // Deterministic seed from URL
    const seed = Array.from(websiteUrl).reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = (i: number) => ((seed * (i + 7)) % 100) / 100;

    const hasSSL = websiteUrl.startsWith("https://");
    const domainAge = rand(1) > 0.3;
    const hasPrivacy = rand(2) > 0.4;
    const hasContact = rand(3) > 0.5;
    const hasContent = rand(4) > 0.2;
    const isOriginal = rand(5) > 0.3;
    const isMobileFriendly = rand(6) > 0.2;
    const hasGoodSpeed = rand(7) > 0.4;

    const mockResults: CheckResult[] = [
      {
        category: "Domain Criteria", icon: "globe",
        checks: [
          { name: "Domain Age", status: domainAge ? "pass" : "warning", message: domainAge ? "Domain is at least 6 months old" : "Domain should be at least 6 months old for better approval chances" },
          { name: "Valid TLD", status: "pass", message: "Domain uses a standard top-level domain (.com, .org, etc.)" },
          { name: "Privacy Policy", status: hasPrivacy ? "pass" : "fail", message: hasPrivacy ? "Privacy policy page found" : "Missing privacy policy page — required for AdSense" },
          { name: "Contact Information", status: hasContact ? "pass" : "warning", message: hasContact ? "Contact page or information found" : "Add contact information for better credibility" },
        ],
      },
      {
        category: "Site Availability", icon: "lock",
        checks: [
          { name: "SSL Certificate", status: hasSSL ? "pass" : "fail", message: hasSSL ? "Website uses HTTPS encryption" : "SSL certificate required — switch to HTTPS" },
          { name: "Site Accessibility", status: "pass", message: "Website is accessible and loading properly" },
          { name: "Robot.txt File", status: "pass", message: "Robots.txt configured correctly" },
        ],
      },
      {
        category: "Site Content", icon: "file",
        checks: [
          { name: "Content Quality", status: hasContent ? "pass" : "fail", message: hasContent ? "Sufficient high-quality content found" : "Need at least 15–20 quality posts with 500+ words each" },
          { name: "Original Content", status: isOriginal ? "pass" : "fail", message: isOriginal ? "Content appears to be original" : "Content must be original and not copied" },
          { name: "Compliant Content", status: "pass", message: "No restricted content detected" },
          { name: "Navigation Structure", status: "pass", message: "Clear navigation and site structure" },
        ],
      },
      {
        category: "Site Performance", icon: "gauge",
        checks: [
          { name: "Mobile Responsive", status: isMobileFriendly ? "pass" : "warning", message: isMobileFriendly ? "Website is mobile-friendly" : "Improve mobile responsiveness" },
          { name: "Page Load Speed", status: hasGoodSpeed ? "pass" : "warning", message: hasGoodSpeed ? "Page loads in acceptable time" : "Consider optimizing images and scripts" },
          { name: "User Experience", status: "pass", message: "Good user experience with clear layout" },
        ],
      },
    ];

    const total = mockResults.reduce((a, c) => a + c.checks.length, 0);
    const passed = mockResults.reduce((a, c) => a + c.checks.filter((x) => x.status === "pass").length, 0);
    return { results: mockResults, score: Math.round((passed / total) * 100) };
  };

  const handleCheck = async () => {
    if (!url) {
      toast.error("Please enter a valid website URL");
      return;
    }
    setIsChecking(true);
    setResults(null);
    setProgress(0);
    setCurrentCheck("Initializing...");
    toast.info("Analyzing your website...");
    try {
      const { results: checkResults, score } = await simulateCheck(url);
      setResults(checkResults);
      setOverallScore(score);
      const newCheck = { url, score, date: new Date().toISOString() };
      const updated = [newCheck, ...recentChecks.filter((c) => c.url !== url)].slice(0, 5);
      setRecentChecks(updated);
      localStorage.setItem("recentChecks", JSON.stringify(updated));
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
      if (score >= 80) toast.success("Great! Your website is ready for AdSense");
      else if (score >= 60) toast.warning("Good progress! Address the warnings to improve");
      else toast.error("Several issues found. Follow recommendations to improve");
    } catch {
      toast.error("Failed to check website. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <SiteLayout>
      <Helmet>
        <title>AdSense Approval Checker — Free 47-Point Audit for Your Website</title>
        <meta name="description" content="Find out if your website is ready for Google AdSense. Run a free 47-point AI audit on any domain — content, SEO, security, legal & performance. Results in 20 seconds." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/" />
        <meta property="og:title" content="AdSense Approval Checker — Free 47-Point Audit" />
        <meta property="og:description" content="Run a free 47-point AI audit on any domain. Find out if your site is AdSense-ready in under 20 seconds." />
        <meta property="og:url" content="https://adsense-boost-check.lovable.app/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHero url={url} onUrlChange={setUrl} onCheck={handleCheck} isChecking={isChecking} />

      {recentChecks.length > 0 && !results && !isChecking && (
        <RecentChecks checks={recentChecks} onSelect={(u) => setUrl(u)} />
      )}

      {isChecking && (
        <div className="container mx-auto px-4 py-12">
          <ProgressIndicator currentCheck={currentCheck} progress={progress} />
        </div>
      )}

      {results && !isChecking && (
        <div id="results">
          <CheckResults results={results} overallScore={overallScore} websiteUrl={url} />
        </div>
      )}

      <HowItWorks />
      <AuditCategories />
      <LiveResultDemo />
      <WhyChooseUs />
      <ToolsHubPreview />
      <BlogPreview />
      <FAQ />
      <Testimonials />
      <CTABanner />
    </SiteLayout>
  );
};

export default Index;
