import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ListChecks } from "lucide-react";

const checklist: { section: string; items: string[] }[] = [
  {
    section: "Technical SEO",
    items: [
      "HTTPS / valid SSL certificate installed",
      "robots.txt exists and is reachable",
      "XML sitemap exists and is submitted to Google Search Console",
      "Canonical tags set on every page",
      "Mobile-friendly responsive design",
      "Core Web Vitals (LCP < 2.5s, CLS < 0.1)",
    ],
  },
  {
    section: "On-page SEO",
    items: [
      "Unique <title> tag (<60 chars) per page",
      "Unique meta description (<160 chars) per page",
      "Exactly one H1 per page",
      "Heading hierarchy uses H2–H4 logically",
      "Descriptive alt text on all images",
      "Internal linking between related pages",
      "URL slugs are short and keyword-aware",
    ],
  },
  {
    section: "Content",
    items: [
      "At least 15–20 published, original articles",
      "Average post length 800+ words",
      "Updated/refreshed articles in last 6 months",
      "Topical clusters covering one main niche",
      "No duplicate or scraped content",
      "Author bio on each post",
    ],
  },
  {
    section: "Trust & Legal",
    items: [
      "Privacy Policy page",
      "Terms of Service page",
      "Disclaimer page",
      "About page with author info",
      "Contact page or working contact form",
      "Cookie consent banner (if EU traffic)",
    ],
  },
  {
    section: "Discoverability",
    items: [
      "Google Search Console verified",
      "Google Analytics or alternative installed",
      "Schema.org structured data (Article / Organization)",
      "Open Graph + Twitter Card meta on all pages",
      "Indexed in Google (site: search returns results)",
    ],
  },
];

export default function SEOChecklist() {
  const all = checklist.flatMap((s) => s.items);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("seo-checklist");
    if (saved) setDone(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("seo-checklist", JSON.stringify(done));
  }, [done]);

  const completed = all.filter((i) => done[i]).length;
  const pct = Math.round((completed / all.length) * 100);

  return (
    <SiteLayout>
      <Helmet>
        <title>Interactive SEO Checklist — 30 Points for AdSense Sites</title>
        <meta name="description" content="A 30-point interactive SEO checklist for AdSense-ready websites. Progress is saved automatically in your browser." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/tools/seo-checklist" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="text-center mb-8">
          <ListChecks className="h-10 w-10 mx-auto text-primary mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Interactive SEO Checklist</h1>
          <p className="text-muted-foreground">Tick items as you implement them. Progress saves automatically.</p>
        </header>

        <div className="glass-card rounded-2xl p-6 mb-6 sticky top-20 z-10">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">{completed} / {all.length} complete</span>
            <span className="text-gradient font-bold">{pct}%</span>
          </div>
          <Progress value={pct} />
        </div>

        <div className="space-y-6">
          {checklist.map((sec) => (
            <div key={sec.section} className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4">{sec.section}</h2>
              <ul className="space-y-3">
                {sec.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Checkbox
                      checked={!!done[item]}
                      onCheckedChange={(v) => setDone({ ...done, [item]: !!v })}
                      id={item}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={item}
                      className={`text-sm cursor-pointer ${done[item] ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
