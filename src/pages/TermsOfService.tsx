import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function TermsOfService() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Terms of Service — {c.brandName}</title>
        <meta
          name="description"
          content={`The terms that govern your use of ${c.brandName}.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/terms-of-service"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Effective date:{" "}
          <Placeholder
            value={eeat.policies.legalEffectiveDate}
            label="Effective Date (YYYY-MM-DD)"
          />
          .
        </p>

        <p className="text-muted-foreground mt-4">
          These Terms govern your use of {c.brandName} (the "Service") operated
          by <Placeholder value={c.legalName} label="Legal Company Name" /> (
          "we", "us"). By using the Service you agree to these Terms.
        </p>

        <h2 className="text-2xl font-bold mt-10">1. The Service</h2>
        <p className="text-muted-foreground">
          The Service provides automated audits and educational content about
          Google AdSense eligibility. We are not affiliated with Google. Audit
          results are informational and do not guarantee approval — only
          Google can approve a site.
        </p>

        <h2 className="text-2xl font-bold mt-10">2. Acceptable use</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>You will only submit URLs that you are authorised to test.</li>
          <li>
            You will not use the Service to scan, probe, or attack
            infrastructure you do not own or have permission to test.
          </li>
          <li>
            You will not attempt to reverse engineer, scrape at scale, or
            circumvent rate limits on the Service.
          </li>
          <li>
            You will not upload or submit unlawful, infringing, or harmful
            content.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">3. Accounts</h2>
        <p className="text-muted-foreground">
          You are responsible for activity under your account and for keeping
          your credentials secure. We may suspend or terminate accounts that
          violate these Terms.
        </p>

        <h2 className="text-2xl font-bold mt-10">4. Intellectual property</h2>
        <p className="text-muted-foreground">
          The Service, including its source code, tooling, brand, and original
          editorial content, is owned by{" "}
          <Placeholder value={c.legalName} label="Legal Company Name" />.
          You retain ownership of content you submit; you grant us a limited
          licence to process it solely to provide the Service to you.
        </p>

        <h2 className="text-2xl font-bold mt-10">5. Disclaimers</h2>
        <p className="text-muted-foreground">
          The Service is provided "as is" without warranties of any kind. We do
          not warrant that audit results are complete, error-free, or that
          following our recommendations will result in AdSense approval.
        </p>

        <h2 className="text-2xl font-bold mt-10">6. Limitation of liability</h2>
        <p className="text-muted-foreground">
          To the maximum extent permitted by law, we will not be liable for
          indirect, incidental, special, consequential, or punitive damages,
          or for lost profits or revenues, arising out of your use of the
          Service.
        </p>

        <h2 className="text-2xl font-bold mt-10">7. Termination</h2>
        <p className="text-muted-foreground">
          You may stop using the Service at any time. We may suspend or
          terminate access for breach of these Terms or to comply with law.
        </p>

        <h2 className="text-2xl font-bold mt-10">8. Changes</h2>
        <p className="text-muted-foreground">
          We may update these Terms. Continued use after an update constitutes
          acceptance of the revised Terms; the effective date at the top will
          reflect the latest version.
        </p>

        <h2 className="text-2xl font-bold mt-10">9. Governing law</h2>
        <p className="text-muted-foreground">
          These Terms are governed by the laws of{" "}
          <Placeholder
            value={eeat.policies.governingLaw}
            label="Governing Jurisdiction, e.g. England & Wales"
          />
          , without regard to its conflict-of-laws rules.
        </p>

        <h2 className="text-2xl font-bold mt-10">10. Contact</h2>
        <p className="text-muted-foreground">
          Legal notices:{" "}
          <Placeholder value={c.legalEmail} label="Legal Email" />.
        </p>
      </article>
    </SiteLayout>
  );
}
