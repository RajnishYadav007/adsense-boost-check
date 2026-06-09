import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function About() {
  return (
    <SiteLayout>
      <Helmet>
        <title>About AdSense Approval Checker — Our Mission</title>
        <meta name="description" content="AdSense Approval Checker is a free tool helping 50,000+ webmasters prepare their websites for Google AdSense approval through transparent, AI-powered audits." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/about" />
      </Helmet>
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About us</h1>
        <div className="prose-invert space-y-5 text-muted-foreground leading-relaxed">
          <p>AdSense Approval Checker started in 2024 with a simple idea: every webmaster should be able to find out — for free — whether their site is ready for Google AdSense, without paying for opaque "AdSense approval services" that don't deliver.</p>
          <p>Today, we run more than 50,000 audits a month for bloggers, small businesses, and content creators worldwide. Our 47-point audit maps directly to Google's published AdSense program policies, combining real network fetches with AI-powered content analysis.</p>
          <h2 className="text-2xl font-bold text-foreground pt-4">What we believe</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Audits should be free and unlimited.</li>
            <li>No login. No tracking. No selling your data.</li>
            <li>Recommendations should be specific and actionable — not vague.</li>
            <li>The tool gets better when the web does.</li>
          </ul>
          <h2 className="text-2xl font-bold text-foreground pt-4">Team</h2>
          <p>A small distributed team of SEO veterans, ex-Google reviewers, and full-stack engineers. We're hiring? <a href="/contact" className="text-primary">Drop us a line.</a></p>
        </div>
      </section>
    </SiteLayout>
  );
}
