import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function PrivacyPolicy() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Privacy Policy — AdSense Approval Checker</title>
        <meta name="description" content="How AdSense Approval Checker collects, uses, and protects your information." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/privacy-policy" />
      </Helmet>
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-invert text-muted-foreground space-y-5">
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p>Effective date: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold text-foreground">1. Information we collect</h2>
        <p>When you submit a URL for analysis, we receive only the URL itself. We do not store the URL after the audit is complete unless you choose to save it locally. When you contact us or subscribe to our newsletter, we collect your name and email.</p>
        <h2 className="text-2xl font-bold text-foreground">2. Cookies</h2>
        <p>We use only essential cookies required for the site to function. We do not use third-party tracking cookies.</p>
        <h2 className="text-2xl font-bold text-foreground">3. Third-party services</h2>
        <p>We display Google AdSense advertising on some pages. AdSense may use cookies and device identifiers to serve personalized ads. See <a className="text-primary" href="https://policies.google.com/technologies/ads">Google's ads policy</a>.</p>
        <h2 className="text-2xl font-bold text-foreground">4. Your rights</h2>
        <p>You can request access, correction, or deletion of any personal data we hold about you by emailing hello@adsenseapprovalchecker.net.</p>
        <h2 className="text-2xl font-bold text-foreground">5. Changes</h2>
        <p>We may update this policy. Material changes will be announced on this page.</p>
      </article>
    </SiteLayout>
  );
}
