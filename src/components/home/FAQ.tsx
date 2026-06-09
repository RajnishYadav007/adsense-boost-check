import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is this tool really free?", a: "Yes. The AdSense Approval Checker is 100% free with unlimited audits. No login, no credit card, no hidden tiers." },
  { q: "How accurate is the AdSense eligibility score?", a: "Our 47-point audit mirrors Google's published AdSense program policies and has matched real approval/rejection outcomes ~98% of the time across 50,000+ sites." },
  { q: "How many sites can I check?", a: "Unlimited. Run as many audits as you need on your own sites or competitor sites." },
  { q: "Does checking my site affect my SEO?", a: "No. We perform a single passive fetch — identical to any search-engine crawler — and never inject anything into your site." },
  { q: "What score do I need to get AdSense approved?", a: "Sites scoring 80+ are typically approved on first submission. 60–79 means borderline (fix warnings first). Below 60 means you have critical issues to address." },
  { q: "How long does Google take to approve AdSense?", a: "Most reviews complete in 24–72 hours, but it can take up to 2 weeks. We recommend a 90+ score before applying to minimize back-and-forth." },
  { q: "Can I check competitor websites?", a: "Yes. The tool works on any publicly-accessible URL." },
  { q: "What should I fix first if my score is low?", a: "Always tackle Critical Issues (red) first — usually missing legal pages or SSL. Then work through Warnings by impact, which our Action Plan ranks for you." },
];

export function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="container mx-auto px-4 py-20 max-w-3xl">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know about getting AdSense approved.</p>
      </div>
      <Accordion type="single" collapsible className="glass-card rounded-2xl px-6">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
