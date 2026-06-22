import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema, SITE_URL } from "@/lib/schema";

export interface ToolPageProps {
  slug: string;            // path after /tools/
  keyword: string;         // primary keyword
  eyebrow: string;
  h1: string;
  subheading: string;
  metaTitle: string;
  metaDescription: string;
  widget: ReactNode;
  whatIs: string;
  howItWorks: { title: string; text: string }[];
  whatItChecks: string[];
  whoFor: { name: string; text: string }[];
  faqs: { q: string; a: string }[];
  related?: { to: string; label: string }[];
}

export function ToolPageShell(p: ToolPageProps) {
  const url = `${SITE_URL}/tools/${p.slug}`;
  const schemas = [
    softwareApplicationSchema(),
    faqSchema(p.faqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: p.h1, url: `/tools/${p.slug}` },
    ]),
  ];

  return (
    <SiteLayout>
      <Helmet>
        <title>{p.metaTitle}</title>
        <meta name="description" content={p.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={p.metaTitle} />
        <meta property="og:description" content={p.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="container mx-auto px-4 pt-12 md:pt-20 pb-10 relative">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> · <Link to="/tools" className="hover:text-foreground">Tools</Link> · <span>{p.eyebrow}</span>
          </nav>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> Free tool · No login
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
              {p.h1}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-2">
              {p.subheading}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 100% Free</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No signup</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* WIDGET */}
      <section className="container mx-auto px-4 pb-10">
        <Card className="glass-card p-5 md:p-7 max-w-3xl mx-auto shadow-elegant">{p.widget}</Card>
      </section>

      {/* WHAT IS */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">What is the {p.eyebrow}?</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{p.whatIs}</p>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-14 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground">A transparent, repeatable process — no black-box scoring.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {p.howItWorks.map((s, i) => (
            <Card key={i} className="p-5 glass-card">
              <div className="text-xs text-muted-foreground mb-1">Step {i + 1}</div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* WHAT IT CHECKS */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6">What this tool checks</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {p.whatItChecks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 glass-card rounded-lg p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHO FOR */}
      <section className="container mx-auto px-4 py-14 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Who this tool is for</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {p.whoFor.map((w) => (
            <Card key={w.name} className="p-5 glass-card">
              <h3 className="font-semibold mb-1">{w.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="glass-card rounded-2xl px-6">
          {p.faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* RELATED */}
      {p.related && p.related.length > 0 && (
        <section className="container mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold mb-5 text-center">Related free tools</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {p.related.map((r) => (
              <Link key={r.to} to={r.to} className="glass-card rounded-full px-5 py-2 text-sm hover:bg-secondary inline-flex items-center gap-1.5">
                {r.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
