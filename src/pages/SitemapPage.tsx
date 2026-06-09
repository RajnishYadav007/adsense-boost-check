import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";

const sections = [
  { title: "Main", links: [["Home", "/"], ["About", "/about"], ["Contact", "/contact"]] },
  { title: "Tools", links: [["All Tools", "/tools"], ["Revenue Calculator", "/tools/adsense-revenue-calculator"], ["Policy Generator", "/tools/policy-page-generator"], ["SEO Checklist", "/tools/seo-checklist"]] },
  { title: "Content", links: [["Blog", "/blog"], ["Guides", "/guides"], ["Resources", "/resources"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms-of-service"], ["Disclaimer", "/disclaimer"]] },
];

export default function SitemapPage() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Sitemap — AdSense Approval Checker</title>
        <meta name="description" content="HTML sitemap of every page on AdSense Approval Checker." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/sitemap" />
      </Helmet>
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Sitemap</h1>
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4">{s.title}</h2>
              <ul className="space-y-2">
                {s.links.map(([label, to]) => (
                  <li key={to}><Link to={to} className="text-primary hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
