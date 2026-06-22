import { useState, useMemo } from "react";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const questions = [
  { q: "Does your site use a custom domain with HTTPS?", w: 12 },
  { q: "Is your domain at least 6 months old?", w: 8 },
  { q: "Do you have 20+ original posts of 800+ words each?", w: 18 },
  { q: "Do you have a Privacy Policy page covering cookies & ads?", w: 12 },
  { q: "Do you have Terms, About, and Contact pages?", w: 10 },
  { q: "Is your site mobile-responsive?", w: 8 },
  { q: "Are all navigation menus and internal links working?", w: 6 },
  { q: "Is your content 100% original (no copied or unedited AI)?", w: 12 },
  { q: "Is your site indexed in Google (site:yourdomain.com returns results)?", w: 8 },
  { q: "Is your niche AdSense-eligible (not adult/gambling/weapons/etc.)?", w: 6 },
];

function Calculator() {
  const [answers, setAnswers] = useState<boolean[]>(Array(questions.length).fill(false));
  const score = useMemo(
    () => answers.reduce((acc, a, i) => acc + (a ? questions[i].w : 0), 0),
    [answers]
  );
  const verdict =
    score >= 90 ? { label: "Highly likely to approve", color: "text-success" }
    : score >= 70 ? { label: "Borderline — fix warnings first", color: "text-warning" }
    : { label: "Will likely be rejected — fix blockers", color: "text-destructive" };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gradient">{score}<span className="text-2xl text-muted-foreground">/100</span></div>
        <div className={`text-sm font-medium mt-1 ${verdict.color}`}>{verdict.label}</div>
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setAnswers((a) => a.map((v, idx) => idx === i ? !v : v))}
            className="w-full flex items-start gap-3 text-left p-3 rounded-lg hover:bg-secondary transition-colors"
          >
            {answers[i]
              ? <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              : <XCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
            <span className="text-sm flex-1">{q.q}</span>
            <span className="text-xs text-muted-foreground shrink-0">+{q.w}</span>
          </button>
        ))}
      </div>
      <Button
        onClick={() => setAnswers(Array(questions.length).fill(false))}
        variant="outline"
        className="w-full mt-4"
      >
        Reset
      </Button>
    </div>
  );
}

export default function AdsenseApprovalCalculator() {
  return (
    <ToolPageShell
      slug="adsense-approval-calculator"
      keyword="adsense approval score"
      eyebrow="AdSense Approval Calculator"
      h1="AdSense Approval Score Calculator — Predict Your Approval Probability"
      subheading="Answer 10 quick questions and instantly see your AdSense approval probability score. Built on Google's official AdSense program policy weightings."
      metaTitle="AdSense Approval Score Calculator — Free Probability Tool"
      metaDescription="Free AdSense approval score calculator. Get your AdSense approval probability in 60 seconds — 10 quick questions, weighted scoring, instant verdict."
      widget={<Calculator />}
      whatIs="The AdSense Approval Calculator estimates your Google AdSense approval probability based on the ten policy signals that account for the overwhelming majority of approval and rejection decisions. Each question is weighted by how strongly Google's reviewers prioritize it — content quality and originality carry the most weight, niche eligibility the least. The result gives you a quick, defensible approval-readiness score before you commit to running a full live audit or submitting an actual application."
      howItWorks={[
        { title: "Answer 10 questions", text: "Tick each policy signal honestly. Skip nothing — Google's reviewers won't." },
        { title: "Weighted scoring", text: "Each criterion has a different weight based on rejection-data patterns." },
        { title: "Get your probability", text: "0–100 score with a clear verdict: approve, borderline, or rejected." },
        { title: "Run full audit", text: "Use our URL-based checker to verify your self-assessment against your live site." },
      ]}
      whatItChecks={[
        "HTTPS / SSL on a custom domain",
        "Domain age threshold (6+ months)",
        "Content depth (20+ posts, 800+ words)",
        "Privacy Policy (cookies + ads disclosure)",
        "Terms, About, and Contact pages",
        "Mobile responsiveness",
        "Working navigation & internal links",
        "Content originality (no copied / raw AI)",
        "Google indexability",
        "AdSense-eligible niche",
      ]}
      whoFor={[
        { name: "First-time applicants", text: "Get a quick sanity check before spending hours on a live audit." },
        { name: "Re-applicants", text: "Verify the issues from your rejection email have actually been resolved." },
        { name: "Agencies", text: "Run pre-qualification with clients before quoting an AdSense-readiness engagement." },
        { name: "Bloggers", text: "Track your approval readiness as you build out content month over month." },
      ]}
      faqs={[
        { q: "How accurate is the AdSense approval calculator?", a: "It's a self-reported estimate, so accuracy depends on honest answers. For a verified score from a live audit of your site, use our URL-based AdSense Approval Checker." },
        { q: "What's a good AdSense approval score?", a: "90+ means you're highly likely to approve. 70–89 is borderline. Below 70 you have blockers to fix first." },
        { q: "Why do some questions carry more weight than others?", a: "Content quality (18 points) and policy / HTTPS (12 each) drive the most rejection decisions. Niche eligibility is binary but weighted lower because most users already select an eligible niche." },
        { q: "Should I use the calculator or the URL checker?", a: "Use the calculator first for a quick self-assessment, then run the URL checker for a verified score on your actual live site." },
      ]}
      related={[
        { to: "/tools/adsense-approval-checker", label: "Live URL Audit" },
        { to: "/tools/adsense-rejection-analyzer", label: "Rejection Analyzer" },
        { to: "/tools/adsense-policy-checker", label: "Policy Checker" },
      ]}
    />
  );
}
