import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DollarSign, FileText, ListChecks, BookOpen, ArrowRight, Sparkles } from "lucide-react";

const tools = [
  {
    to: "/tools/adsense-revenue-calculator", icon: DollarSign,
    title: "AdSense Revenue Calculator",
    desc: "Estimate your monthly Google AdSense earnings based on niche, traffic, country, and ad placement.",
    badge: "Most popular",
  },
  {
    to: "/tools/policy-page-generator", icon: FileText,
    title: "Policy Page Generator",
    desc: "Generate Privacy Policy, Terms of Service, Disclaimer, About, Cookie Policy and Contact pages instantly.",
  },
  {
    to: "/tools/seo-checklist", icon: ListChecks,
    title: "Interactive SEO Checklist",
    desc: "30-point SEO checklist with progress tracking. Tick items off as you implement them.",
  },
  {
    to: "/guides", icon: BookOpen,
    title: "AdSense Approval Guides",
    desc: "Step-by-step guides covering the full 2026 AdSense approval workflow for beginners.",
  },
];

export default function Tools() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Free AdSense Tools — Revenue Calculator, Policy Generator & More</title>
        <meta name="description" content="A free toolkit for AdSense approval: revenue calculator, policy page generator, SEO checklist, and step-by-step approval guides." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/tools" />
      </Helmet>

      <section className="container mx-auto px-4 py-16 text-center max-w-3xl">
        <Sparkles className="h-8 w-8 mx-auto text-primary mb-3" />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Free AdSense Tools</h1>
        <p className="text-muted-foreground">
          Everything you need to prepare your website for Google AdSense approval — fully free, no sign-up.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group glass-card rounded-2xl p-7 hover:shadow-elegant hover:-translate-y-0.5 transition-all relative"
            >
              {t.badge && (
                <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {t.badge}
                </span>
              )}
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                <t.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
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
