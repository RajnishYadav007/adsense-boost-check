import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function TermsOfService() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Terms of Service — AdSense Approval Checker</title>
        <meta name="description" content="The terms governing your use of AdSense Approval Checker." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/terms-of-service" />
      </Helmet>
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-invert text-muted-foreground space-y-5">
        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
        <p>By using AdSense Approval Checker (the "Service"), you agree to these terms.</p>
        <h2 className="text-2xl font-bold text-foreground">1. Use of the service</h2>
        <p>The Service is provided free of charge for lawful use. You agree not to abuse the audit endpoint, scrape the site, or attempt to disrupt operation.</p>
        <h2 className="text-2xl font-bold text-foreground">2. No guarantee</h2>
        <p>Our audit scores estimate likelihood of AdSense approval based on Google's published policies, but Google makes the final approval decision. We do not guarantee approval.</p>
        <h2 className="text-2xl font-bold text-foreground">3. Intellectual property</h2>
        <p>All content and software on the site are owned by us or our licensors.</p>
        <h2 className="text-2xl font-bold text-foreground">4. Limitation of liability</h2>
        <p>The Service is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from its use.</p>
        <h2 className="text-2xl font-bold text-foreground">5. Changes</h2>
        <p>We may update these terms; updates take effect when posted.</p>
      </article>
    </SiteLayout>
  );
}
