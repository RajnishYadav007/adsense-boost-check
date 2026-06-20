import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import NewHero from "@/components/NewHero";
import { SiteLayout } from "@/components/layout/SiteLayout";
import CheckResults, { CheckResult, AuditMeta } from "@/components/CheckResults";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const Index = () => {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [audit, setAudit] = useState<AuditMeta | undefined>();
  const [recentChecks, setRecentChecks] = useState<Array<{ url: string; score: number; date: string }>>([]);
  const [currentCheck, setCurrentCheck] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("recentChecks");
    if (saved) setRecentChecks(JSON.parse(saved));
  }, []);

  const runAudit = async (websiteUrl: string) => {
    const stages = [
      { label: "🔍 Fetching homepage...", pct: 20, delay: 200 },
      { label: "📄 Parsing HTML & meta...", pct: 40, delay: 900 },
      { label: "🔒 Checking SSL & headers...", pct: 60, delay: 1500 },
      { label: "⚖️ Looking for legal pages...", pct: 75, delay: 2100 },
      { label: "💰 Detecting AdSense code...", pct: 90, delay: 2700 },
    ];
    stages.forEach((s) =>
      setTimeout(() => { setCurrentCheck(s.label); setProgress(s.pct); }, s.delay)
    );

    const { data, error } = await supabase.functions.invoke("audit-website", {
      body: { url: websiteUrl },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    setProgress(100);
    setCurrentCheck("Done");
    return data as {
      results: CheckResult[];
      score: number;
      approvalProbability: number;
      verdict: AuditMeta["verdict"];
      verdictLabel: string;
      verdictReason: string;
      adsense: AuditMeta["adsense"];
      blockers: string[];
    };
  };

  const handleCheck = async () => {
    if (!url) {
      toast.error("Please enter a valid website URL");
      return;
    }
    setIsChecking(true);
    setResults(null);
    setAudit(undefined);
    setProgress(0);
    setCurrentCheck("Initializing...");
    toast.info("Auditing your website...");
    try {
      const data = await runAudit(url);
      setResults(data.results);
      setOverallScore(data.score);
      setAudit({
        verdict: data.verdict,
        verdictLabel: data.verdictLabel,
        verdictReason: data.verdictReason,
        approvalProbability: data.approvalProbability,
        adsense: data.adsense,
        blockers: data.blockers,
        fetchedUrls: (data as any).fetchedUrls,
      });
      const newCheck = { url, score: data.score, date: new Date().toISOString() };
      const updated = [newCheck, ...recentChecks.filter((c) => c.url !== url)].slice(0, 5);
      setRecentChecks(updated);
      localStorage.setItem("recentChecks", JSON.stringify(updated));
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
      if (data.verdict === "approved") toast.success(data.verdictLabel);
      else if (data.verdict === "likely") toast.success(data.verdictLabel);
      else if (data.verdict === "needs_work") toast.warning(data.verdictLabel);
      else toast.error(data.verdictLabel);
    } catch (e) {
      toast.error((e as Error).message || "Failed to audit website. Please try again.");
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
          <CheckResults results={results} overallScore={overallScore} websiteUrl={url} audit={audit} />
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
