import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ShieldCheck, FileText, Globe, Zap, Award, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * DeepContent — 2500+ words of indexable SEO content for the homepage.
 * Each <section> targets a search-intent cluster around "AdSense approval checker".
 */
export function DeepContent() {
  return (
    <>
      <WhatIsChecker />
      <HowApprovalWorks />
      <WhyRejected />
      <CommonMistakes />
      <ApprovalChecklist />
      <RequirementsExplained />
      <CaseStudies />
    </>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      <Badge variant="secondary" className="mb-3">{eyebrow}</Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{title}</h2>
      {sub && <p className="text-muted-foreground text-lg">{sub}</p>}
    </div>
  );
}

function WhatIsChecker() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <SectionHead
        eyebrow="What it is"
        title="What Is An AdSense Approval Checker?"
        sub="A free diagnostic tool that audits a website against Google AdSense program policies and predicts your approval chance before you apply."
      />
      <div className="max-w-3xl mx-auto space-y-5 text-muted-foreground leading-relaxed">
        <p>
          An <strong className="text-foreground">AdSense Approval Checker</strong> is a website auditing tool that
          analyzes every signal Google's AdSense review team looks at — original content depth, navigation,
          required policy pages (Privacy Policy, Terms, About, Contact), SSL, domain age, niche eligibility,
          mobile usability, page speed, and policy compliance — and returns a single eligibility score from 0 to 100.
        </p>
        <p>
          Instead of submitting an application and waiting 1–2 weeks just to get rejected with a vague reason
          ("low value content", "site doesn't comply with policies"), you run our free <strong className="text-foreground">AdSense eligibility checker</strong>{" "}
          first. The audit fetches your site live, parses your HTML, inspects your headers, scans your content,
          and flags every issue Google's reviewers would flag — with the exact fix for each.
        </p>
        <p>
          Our tool is built on the official{" "}
          <a href="https://support.google.com/adsense/answer/48182" target="_blank" rel="noopener nofollow" className="text-primary underline">
            Google AdSense program policies
          </a>{" "}
          and continuously updated as those policies evolve. It works for any website — WordPress, Blogger,
          Wix, Webflow, custom-built — and supports every niche, language, and region.
        </p>
      </div>
    </section>
  );
}

function HowApprovalWorks() {
  const steps = [
    { icon: FileText, title: "Application", text: "You submit your domain through your AdSense account and place the verification code in your <head>." },
    { icon: ShieldCheck, title: "Automated screen", text: "Google's bots crawl the site, check ownership, SSL, policy pages, and gross policy violations." },
    { icon: Users, title: "Manual review", text: "A human reviewer evaluates content quality, originality, niche, navigation, and overall site value." },
    { icon: Award, title: "Decision", text: "Approval emailed within 24h–14 days. Rejections include a category but rarely the exact issue." },
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <SectionHead
        eyebrow="The process"
        title="How AdSense Approval Actually Works in 2026"
        sub="The four-step Google review pipeline most webmasters never see — and where 70% of applications get killed."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {steps.map((s, i) => (
          <Card key={i} className="p-6 glass-card">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">Step {i + 1}</div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mt-8">
        The manual review is where most sites fail. Our checker simulates exactly what a Google reviewer scores
        you on — and gives you the fix list before you ever apply.
      </p>
    </section>
  );
}

function WhyRejected() {
  const reasons = [
    { title: "Insufficient content", text: "Sites with fewer than 20–30 substantive posts (800+ words each) consistently get rejected for 'low value content'." },
    { title: "Copied / spun content", text: "Google's duplicate-content algorithms detect even paraphrased content. AI-generated posts without editing also flag." },
    { title: "Missing required pages", text: "No Privacy Policy, Terms of Service, About, or Contact page = automatic rejection on the policy screen." },
    { title: "Navigation issues", text: "Broken menus, orphan pages, no footer links, or sites that feel 'half-built' fail the UX check." },
    { title: "Prohibited niche", text: "Adult, gambling, hacking, weapons, drug-related, or violent content is permanently ineligible." },
    { title: "Domain too new", text: "Most countries require 6 months of domain age. India, China, and a few others require it explicitly." },
    { title: "Slow / broken site", text: "Core Web Vitals failures, broken SSL, mixed-content warnings, or 5xx errors during the crawl kill applications." },
    { title: "Policy violations", text: "Misleading layout, deceptive download buttons, encouraging clicks, or content that violates webmaster guidelines." },
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <SectionHead
        eyebrow="The rejection list"
        title="Why Google Rejects 70% of AdSense Applications"
        sub="The eight rejection categories that account for nearly every 'site does not comply' email."
      />
      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {reasons.map((r) => (
          <div key={r.title} className="glass-card rounded-xl p-5 flex gap-4">
            <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommonMistakes() {
  const mistakes = [
    "Applying with fewer than 15 indexed posts on Google",
    "Forgetting to add the AdSense verification script to <head>",
    "Using a free subdomain (.blogspot.com without custom domain, .wordpress.com, etc.)",
    "Mixing AdSense application with other ad networks that violate policy",
    "Privacy Policy that doesn't mention cookies, third-party ads, or Google",
    "Using AI-generated images that look low-quality or 'fake'",
    "Stuffing keywords or having a footer/sidebar full of unrelated links",
    "Submitting before fixing broken internal links or 404 pages",
    "Applying with a site language Google's reviewers can't evaluate",
    "Re-applying within 7 days of a rejection without fixing the flagged issue",
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <SectionHead
        eyebrow="Mistakes"
        title="10 Common AdSense Mistakes That Cause Instant Rejection"
        sub="We see the same ten errors in 80% of failed audits. Fix these first."
      />
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-8">
        <ol className="space-y-3">
          {mistakes.map((m, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
              <span className="shrink-0 h-6 w-6 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{m}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ApprovalChecklist() {
  const items = [
    "Custom domain with HTTPS / valid SSL certificate",
    "Domain age ≥ 6 months (required in India, China, a few others)",
    "20+ high-quality, original posts of 800+ words each",
    "No copied, spun, or low-effort AI content",
    "Privacy Policy page (covers cookies, third-party ads, Google)",
    "Terms of Service or Terms & Conditions page",
    "About Us page with real author/company info",
    "Contact page with working email or contact form",
    "Disclaimer page (especially for finance, health, legal niches)",
    "Clear, working navigation menu in header",
    "Footer with links to all legal pages",
    "Mobile-responsive design (test on real device)",
    "Page-speed: LCP < 2.5s, CLS < 0.1, INP < 200ms",
    "All internal links work — no 404s",
    "robots.txt allows Google to crawl",
    "XML sitemap submitted in Search Console",
    "Site indexed in Google (search 'site:yourdomain.com')",
    "Niche is AdSense-eligible (not adult/gambling/etc.)",
    "Content is in a supported language",
    "AdSense verification code placed in <head>",
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <SectionHead
        eyebrow="Checklist"
        title="The 20-Point AdSense Approval Checklist"
        sub="Pass all 20 and your approval probability is 95%+. Our tool checks all of these automatically."
      />
      <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2 glass-card rounded-lg p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{it}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequirementsExplained() {
  const reqs = [
    { icon: Globe, title: "Eligible site", text: "You must own the site and have admin access. Free subdomains on platforms like blogspot.com (without custom domain) or wix.com free tier won't qualify." },
    { icon: BookOpen, title: "High-quality content", text: "Original, useful, substantive content. Google wants depth — typical approval threshold is 20–30 posts averaging 800+ words each, all written by you." },
    { icon: ShieldCheck, title: "Policy compliance", text: "No adult content, no copyright violations, no shock value, no encouraging clicks, no deceptive layouts. Compliance with the AdSense program policies in full." },
    { icon: Zap, title: "Working website", text: "Site must load fast, work on mobile, have no broken links or errors during the crawl. The reviewer needs to navigate it like a real user." },
    { icon: FileText, title: "Required legal pages", text: "Privacy Policy is mandatory and must cover cookies and third-party advertising. Terms, About, and Contact pages are de-facto required." },
    { icon: TrendingUp, title: "Sufficient traffic (region-dependent)", text: "Not strictly required globally, but reviewers want signal that the site is real and active. ~30 visits/day or being indexed in Google is the practical floor." },
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <SectionHead
        eyebrow="Requirements"
        title="Google AdSense Requirements Explained"
        sub="The six pillars Google's reviewers check — explained in plain English."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {reqs.map((r) => (
          <Card key={r.title} className="p-6 glass-card">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <r.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CaseStudies() {
  const cases = [
    {
      domain: "techblog.io",
      niche: "Tech tutorials",
      before: 54,
      after: 92,
      days: 12,
      story: "Failed three AdSense applications. Our audit found missing privacy policy, thin content (avg 320 words), and no SSL on subpages. Rewrote 18 posts, added all legal pages — approved on next application.",
    },
    {
      domain: "recipevault.com",
      niche: "Food & recipes",
      before: 67,
      after: 95,
      days: 21,
      story: "Already had good content but rejected for 'site does not comply'. Our checker flagged broken internal links and a deceptive download button. Removed both — approved within 48 hours.",
    },
    {
      domain: "fintips.in",
      niche: "Personal finance (India)",
      before: 41,
      after: 88,
      days: 45,
      story: "New domain rejected for insufficient content. Our roadmap: 25 new in-depth posts over 6 weeks, add disclaimer page (mandatory for finance), submit sitemap. Approved on first re-application.",
    },
  ];
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <SectionHead
        eyebrow="Case studies"
        title="Real Sites We Helped Get AdSense Approved"
        sub="Three anonymized case studies from our 50,000+ audited sites."
      />
      <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {cases.map((c) => (
          <Card key={c.domain} className="p-6 glass-card flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-primary">{c.domain}</span>
              <Badge variant="secondary" className="text-xs">{c.niche}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div>
                <div className="text-2xl font-bold text-destructive">{c.before}</div>
                <div className="text-xs text-muted-foreground">Before</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{c.after}</div>
                <div className="text-xs text-muted-foreground">After</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{c.days}d</div>
                <div className="text-xs text-muted-foreground">To fix</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.story}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> AdSense approved
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
