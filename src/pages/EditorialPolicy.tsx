import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function EditorialPolicy() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Editorial Policy — AdSense Approval Checker</title>
        <meta name="description" content="How we research, write, fact-check, and update content on AdSense Approval Checker — our editorial standards and process." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/editorial-policy" />
      </Helmet>
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Editorial Policy</h1>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>AdSense Approval Checker publishes diagnostic tools, guides, and case studies to help webmasters get their websites approved for Google AdSense. This editorial policy explains how we produce, review, and update that content.</p>

          <h2 className="text-2xl font-bold text-foreground pt-4">Editorial independence</h2>
          <p>We are not affiliated with, endorsed by, or paid by Google. We do not accept payment for favorable reviews of tools, networks, or services. All recommendations are based on independent testing across 50,000+ audited sites.</p>

          <h2 className="text-2xl font-bold text-foreground pt-4">Sources we rely on</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Official Google AdSense program policies and Help Center documentation</li>
            <li>Google Search Central and Webmaster Guidelines</li>
            <li>Public AdSense approval / rejection emails shared by users (anonymized)</li>
            <li>Our own audit dataset of approved vs. rejected sites</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground pt-4">Writing & review process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong className="text-foreground">Research</strong> — an editor maps the topic against current AdSense policy and search-intent data.</li>
            <li><strong className="text-foreground">Drafting</strong> — a writer with hands-on AdSense experience produces the first draft.</li>
            <li><strong className="text-foreground">Technical review</strong> — a second editor verifies every policy claim against official Google documentation.</li>
            <li><strong className="text-foreground">Tool validation</strong> — recommendations involving our checker are tested against live sites.</li>
            <li><strong className="text-foreground">Publishing & dating</strong> — every article shows its publish and last-updated date.</li>
          </ol>

          <h2 className="text-2xl font-bold text-foreground pt-4">Corrections & updates</h2>
          <p>AdSense policies change. We review every published article at least every 6 months and update sooner whenever Google publishes a policy change. Material corrections are noted at the bottom of the article. If you spot an error, please <a href="/contact" className="text-primary underline">contact us</a>.</p>

          <h2 className="text-2xl font-bold text-foreground pt-4">Affiliate disclosure</h2>
          <p>Some outbound links are affiliate links. We never recommend a tool we have not used. Affiliate relationships never affect editorial judgment or rankings.</p>
        </div>
      </article>
    </SiteLayout>
  );
}
