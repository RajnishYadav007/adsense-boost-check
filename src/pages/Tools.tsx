import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  ShieldCheck, Calculator, FileWarning, DollarSign, AlertTriangle,
  Gauge, FileText, Search, ListChecks, FilePen, ArrowRight, Sparkles
} from "lucide-react";

const tools = [
  {
    to: "/tools/adsense-approval-checker", icon: ShieldCheck,
    title: "AdSense Approval Checker",
    desc: "Audit any website against 47+ Google AdSense policy points and predict your approval probability in 20 seconds.",
    badge: "Most popular",
  },
  {
    to: "/tools/adsense-approval-calculator", icon: Calculator,
    title: "AdSense Approval Calculator",
    desc: "Answer 10 weighted questions and instantly see your AdSense approval probability score.",
  },
  {
    to: "/tools/adsense-policy-checker", icon: FileWarning,
    title: "AdSense Policy Checker",
    desc: "Scan your website for Google AdSense program policy violations before Google does.",
  },
  {
    to: "/tools/adsense-revenue-calculator", icon: DollarSign,
    title: "AdSense Revenue Calculator",
    desc: "Estimate monthly AdSense earnings based on niche, traffic, country, and ad placement.",
  },
  {
    to: "/tools/adsense-rejection-analyzer", icon: AlertTriangle,
    title: "AdSense Rejection Analyzer",
    desc: "Paste your AdSense rejection email and decode the real policy issue, with the exact fix.",
  },
  {
    to: "/tools/website-quality-score-checker", icon: Gauge,
    title: "Website Quality Score Checker",
    desc: "Get a 0–100 site quality score covering content, EEAT, SEO, security, UX, and performance.",
  },
  {
    to: "/tools/content-quality-checker", icon: FileText,
    title: "Content Quality Checker",
    desc: "Paste any article and score it on depth, readability, vocabulary richness, and AdSense-readiness.",
  },
  {
    to: "/tools/seo-audit-checker", icon: Search,
    title: "SEO Audit Checker",
    desc: "Run a complete on-page, technical, and structural SEO audit on any URL.",
  },
  {
    to: "/tools/policy-page-generator", icon: FilePen,
    title: "Policy Page Generator",
    desc: "Generate Privacy Policy, Terms, Disclaimer, About, Cookie, and Contact pages instantly.",
  },
  {
    to: "/tools/seo-checklist", icon: ListChecks,
    title: "Interactive SEO Checklist",
    desc: "30-point SEO checklist with progress tracking — tick items as you implement them.",
  },
];

export default function Tools() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Free AdSense & SEO Tools — Complete Toolkit for Webmasters</title>
        <meta name="description" content="10 free AdSense and SEO tools — approval checker, policy scanner, revenue calculator, rejection analyzer, quality scoring, and more. No login required." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/tools" />
      </Helmet>

      <section className="container mx-auto px-4 py-16 text-center max-w-3xl">
        <Sparkles className="h-8 w-8 mx-auto text-primary mb-3" />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Free AdSense & SEO Tools</h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to get your website approved for Google AdSense and ranking in search — fully free, no signup.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all relative"
            >
              {t.badge && (
                <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {t.badge}
                </span>
              )}
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                <t.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold mb-2">{t.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t.desc}</p>
              <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-1.5 gap-1 transition-all">
                Open tool <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
