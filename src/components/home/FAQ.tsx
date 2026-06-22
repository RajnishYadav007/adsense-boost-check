import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What is an AdSense approval checker?", a: "It's a free diagnostic tool that audits your website against Google AdSense program policies and predicts whether your application will be approved — before you actually apply." },
  { q: "Is this AdSense checker really free?", a: "Yes. 100% free with unlimited audits. No login, no credit card, no hidden tiers, no upsell." },
  { q: "How accurate is the AdSense eligibility score?", a: "Our 47-point audit mirrors Google's published AdSense program policies. Sites scoring 90+ get approved on first application about 96% of the time across our 50,000+ user dataset." },
  { q: "What score do I need for AdSense approval?", a: "Sites scoring 90+ are typically approved on first submission. 70–89 means borderline (fix warnings first). Below 70 you have critical blockers to address." },
  { q: "How long does Google take to approve AdSense in 2026?", a: "Most reviews complete in 24–72 hours, but it can take up to 2 weeks. We recommend a 90+ checker score before applying to minimize back-and-forth." },
  { q: "How many posts do I need for AdSense approval?", a: "There's no official minimum, but our data shows 20–30 substantive posts (800+ words each, original) is the practical threshold. New, thin sites are the #1 rejection reason." },
  { q: "Can I get AdSense approval with AI content?", a: "Yes if it's edited, fact-checked, original, and provides real value. Raw unedited AI output gets flagged as low-value content. Our content quality check catches what Google's reviewers catch." },
  { q: "Why does Google reject AdSense applications?", a: "The top reasons: insufficient/thin content, missing legal pages (Privacy, Terms, About, Contact), copied content, prohibited niches, broken navigation, and policy violations like deceptive layouts." },
  { q: "Can I re-apply after AdSense rejection?", a: "Yes, but wait at least 7 days and fix the flagged issues first. Re-applying without changes leads to permanent rejection. Run our checker to identify what to fix." },
  { q: "Does the AdSense checker work for Blogger and WordPress sites?", a: "Yes. The tool works on any publicly-accessible URL — WordPress, Blogger (with custom domain), Wix, Webflow, Shopify, or custom-built sites." },
  { q: "What niches are not eligible for AdSense?", a: "Adult content, gambling (in many regions), illegal drugs, weapons, hacking tools, violent/shock content, and content infringing copyright are permanently ineligible." },
  { q: "Does checking my site with this tool affect my SEO or AdSense?", a: "No. We perform a single passive fetch identical to any search-engine crawler. We don't inject anything, don't crawl repeatedly, and don't store your URL after the audit." },
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
