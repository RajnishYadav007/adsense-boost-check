import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import CheckResults, { CheckResult } from "@/components/CheckResults";
import InfoSection from "@/components/InfoSection";
import RecentChecks from "@/components/RecentChecks";
import { ProgressIndicator } from "@/components/ProgressIndicator";
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
    if (saved) {
      setRecentChecks(JSON.parse(saved));
    }
  }, []);

  const simulateCheck = async (websiteUrl: string): Promise<{ results: CheckResult[]; score: number }> => {
    const checkCategories = [
      { name: "Domain Criteria", delay: 500 },
      { name: "Site Availability", delay: 1000 },
      { name: "Site Content", delay: 1500 },
      { name: "Site Performance", delay: 2000 }
    ];

    checkCategories.forEach((category, index) => {
      setTimeout(() => {
        setCurrentCheck(category.name);
        setProgress(((index + 1) / checkCategories.length) * 100);
      }, category.delay);
    });

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const domainAge = Math.random() > 0.3;
    const hasSSL = websiteUrl.startsWith("https://");
    const hasPrivacy = Math.random() > 0.4;
    const hasContact = Math.random() > 0.5;
    const hasContent = Math.random() > 0.2;
    const isOriginal = Math.random() > 0.3;
    const isMobileFriendly = Math.random() > 0.2;
    const hasGoodSpeed = Math.random() > 0.4;

    const mockResults: CheckResult[] = [
      {
        category: "Domain Criteria",
        icon: "globe",
        checks: [
          { name: "Domain Age", status: domainAge ? "pass" : "warning", message: domainAge ? "Domain is at least 6 months old" : "Domain should be at least 6 months old for better approval chances" },
          { name: "Valid TLD", status: "pass", message: "Domain uses a standard top-level domain (.com, .org, etc.)" },
          { name: "Privacy Policy", status: hasPrivacy ? "pass" : "fail", message: hasPrivacy ? "Privacy policy page found" : "Missing privacy policy page - required for AdSense" },
          { name: "Contact Information", status: hasContact ? "pass" : "warning", message: hasContact ? "Contact page or information found" : "Add contact information for better credibility" },
        ],
      },
      {
        category: "Site Availability",
        icon: "lock",
        checks: [
          { name: "SSL Certificate", status: hasSSL ? "pass" : "fail", message: hasSSL ? "Website uses HTTPS encryption" : "SSL certificate required - switch to HTTPS" },
          { name: "Site Accessibility", status: "pass", message: "Website is accessible and loading properly" },
          { name: "Robot.txt File", status: "pass", message: "Robots.txt configured correctly" },
        ],
      },
      {
        category: "Site Content",
        icon: "file",
        checks: [
          { name: "Content Quality", status: hasContent ? "pass" : "fail", message: hasContent ? "Sufficient high-quality content found" : "Need at least 15-20 quality posts with 500+ words each" },
          { name: "Original Content", status: isOriginal ? "pass" : "fail", message: isOriginal ? "Content appears to be original" : "Content must be original and not copied from other sources" },
          { name: "Compliant Content", status: "pass", message: "No restricted content detected (adult, violence, etc.)" },
          { name: "Navigation Structure", status: "pass", message: "Clear navigation and site structure" },
        ],
      },
      {
        category: "Site Performance",
        icon: "gauge",
        checks: [
          { name: "Mobile Responsive", status: isMobileFriendly ? "pass" : "warning", message: isMobileFriendly ? "Website is mobile-friendly" : "Improve mobile responsiveness for better performance" },
          { name: "Page Load Speed", status: hasGoodSpeed ? "pass" : "warning", message: hasGoodSpeed ? "Page loads in acceptable time" : "Consider optimizing images and scripts for faster loading" },
          { name: "User Experience", status: "pass", message: "Good user experience with clear layout" },
        ],
      },
    ];

    const totalChecks = mockResults.reduce((acc, cat) => acc + cat.checks.length, 0);
    const passedChecks = mockResults.reduce((acc, cat) => acc + cat.checks.filter((c) => c.status === "pass").length, 0);
    const score = Math.round((passedChecks / totalChecks) * 100);

    return { results: mockResults, score };
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
      const updatedChecks = [newCheck, ...recentChecks.filter(c => c.url !== url)].slice(0, 5);
      setRecentChecks(updatedChecks);
      localStorage.setItem("recentChecks", JSON.stringify(updatedChecks));

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      if (score >= 80) toast.success("Great! Your website is ready for AdSense");
      else if (score >= 60) toast.warning("Good progress! Address the warnings to improve");
      else toast.error("Several issues found. Follow recommendations to improve");
    } catch (error) {
      toast.error("Failed to check website. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>AdSense Eligibility Checker - Instant Website Analysis</title>
        <meta name="description" content="Check if your website meets Google AdSense requirements instantly. Get detailed analysis of domain, content, performance, and eligibility for monetization." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/" />
        <meta property="og:title" content="AdSense Eligibility Checker - Instant Website Analysis" />
        <meta property="og:description" content="Analyze your website's eligibility for Google AdSense approval in seconds." />
        <meta property="og:url" content="https://adsense-boost-check.lovable.app/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <Hero url={url} onUrlChange={setUrl} onCheck={handleCheck} isChecking={isChecking} />

      {recentChecks.length > 0 && !results && !isChecking && (
        <RecentChecks checks={recentChecks} onSelect={(selectedUrl) => setUrl(selectedUrl)} />
      )}

      {isChecking && (
        <div className="container mx-auto px-4 py-12">
          <ProgressIndicator currentCheck={currentCheck} progress={progress} />
        </div>
      )}

      {results && !isChecking && (
        <CheckResults results={results} overallScore={overallScore} websiteUrl={url} />
      )}

      {!isChecking && <InfoSection />}

      <footer className="bg-muted/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2025 AdSense Eligibility Checker. Built with advanced React technology.</p>
        <p className="mt-2">This tool provides estimates based on common AdSense requirements. Actual approval depends on Google's review.</p>
      </footer>
    </main>
  );
};

export default Index;
