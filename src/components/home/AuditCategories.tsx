import { FileText, Search, ShieldCheck, Scale, Gauge, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    icon: FileText, title: "Content Quality", points: 10,
    items: ["Word count per page", "Original content detection", "Keyword density", "Readability score", "Content freshness", "Pages indexed"],
  },
  {
    icon: Search, title: "SEO Architecture", points: 8,
    items: ["Title tags", "Meta descriptions", "Heading structure (H1–H6)", "Canonical tags", "Robots.txt", "XML sitemap", "Structured data", "Internal linking"],
  },
  {
    icon: ShieldCheck, title: "Security & Trust", points: 7,
    items: ["SSL / HTTPS", "Content Security Policy", "HSTS header", "X-Frame-Options", "WHOIS age", "Domain authority signals"],
  },
  {
    icon: Scale, title: "Legal Compliance", points: 8,
    items: ["Privacy Policy", "Terms of Service", "Disclaimer", "About page", "Contact page", "Copyright notice", "Cookie consent"],
  },
  {
    icon: Gauge, title: "Performance", points: 7,
    items: ["Page speed score", "LCP / CLS / FID", "Mobile responsiveness", "Image optimization", "Compression (gzip/brotli)", "CDN detection"],
  },
  {
    icon: Megaphone, title: "AdSense Policy", points: 7,
    items: ["Content niche check", "Prohibited content scan", "Ad placement readiness", "Traffic source signals", "Account age compatibility"],
  },
];

export function AuditCategories() {
  return (
    <section className="container mx-auto px-4 py-20" aria-labelledby="audit-categories">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="secondary" className="mb-3">47-point audit</Badge>
        <h2 id="audit-categories" className="text-3xl md:text-4xl font-bold mb-3">
          What We Check, End to End
        </h2>
        <p className="text-muted-foreground">
          Six rigorously-tested categories that map to Google's AdSense program policies.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                {c.points} points
              </Badge>
            </div>
            <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {c.items.map((it) => (
                <li key={it} className="flex gap-2">
                  <span aria-hidden className="text-accent">›</span>
                  {it}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
