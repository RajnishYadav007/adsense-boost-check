import { Link } from "react-router-dom";
import { DollarSign, FileText, ListChecks, BookOpen, ArrowRight } from "lucide-react";

const tools = [
  { to: "/tools/adsense-revenue-calculator", icon: DollarSign, title: "Revenue Calculator", desc: "Estimate monthly AdSense earnings by niche & traffic." },
  { to: "/tools/policy-page-generator", icon: FileText, title: "Policy Page Generator", desc: "Instantly create Privacy, Terms, Disclaimer & more." },
  { to: "/tools/seo-checklist", icon: ListChecks, title: "SEO Checklist", desc: "Interactive 30-point checklist with progress tracking." },
  { to: "/guides", icon: BookOpen, title: "AdSense Approval Guide", desc: "Step-by-step 2026 approval guide for beginners." },
];

export function ToolsHubPreview() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Free Tools to Boost Your Approval Chances</h2>
        <p className="text-muted-foreground">Everything you need to get from rejected to approved.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1.5">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t.desc}</p>
            <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-1.5 gap-1 transition-all">
              Use tool <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
