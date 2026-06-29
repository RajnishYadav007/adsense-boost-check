import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat, isMissing } from "@/config/eeat";

export default function PrivacyPolicy() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Privacy Policy — {c.brandName}</title>
        <meta
          name="description"
          content={`How ${c.brandName} collects, uses, stores, and shares information.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/privacy-policy"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Effective date:{" "}
          <Placeholder
            value={eeat.policies.legalEffectiveDate}
            label="Effective Date (YYYY-MM-DD)"
          />
          .
        </p>

        <p className="text-muted-foreground mt-4">
          This Privacy Policy explains how{" "}
          <Placeholder value={c.legalName} label="Legal Company Name" /> (
          "we", "us") operating {c.brandName} (the "Service") collects, uses,
          and shares information.
        </p>

        <h2 className="text-2xl font-bold mt-10">Information we collect</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>
            <strong className="text-foreground">URLs you submit</strong> to the
            audit tools, and the publicly accessible HTML/headers we fetch from
            them.
          </li>
          <li>
            <strong className="text-foreground">Account data</strong> if you
            sign up: email address and any profile fields you provide.
          </li>
          <li>
            <strong className="text-foreground">Audit reports</strong>{" "}
            generated for you, when you choose to save them.
          </li>
          <li>
            <strong className="text-foreground">Usage telemetry</strong>:
            standard server logs (IP, user-agent, timestamp) and aggregate
            product analytics.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">How we use information</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>To run the audit you requested and show you the results.</li>
          <li>To operate, maintain, and improve the Service.</li>
          <li>To detect and prevent abuse, fraud, and security incidents.</li>
          <li>To respond to support requests you send us.</li>
        </ul>
        <p className="text-muted-foreground">
          We do not sell personal information.
        </p>

        <h2 className="text-2xl font-bold mt-10">Subprocessors</h2>
        <p className="text-muted-foreground">
          We use a small number of trusted infrastructure providers (hosting,
          managed database and authentication, AI model providers, email
          delivery, error monitoring). The current list and what data each one
          processes is available on request to{" "}
          <Placeholder value={c.privacyEmail} label="Privacy Email" />.
        </p>

        <h2 className="text-2xl font-bold mt-10">Cookies and analytics</h2>
        <p className="text-muted-foreground">
          We use strictly necessary cookies to keep you signed in and to
          remember your preferences. Any analytics or advertising cookies, if
          enabled, are described in the cookie banner shown on first visit and
          can be withdrawn at any time.
        </p>

        <h2 className="text-2xl font-bold mt-10">Retention</h2>
        <p className="text-muted-foreground">
          Audit reports you generate without an account are kept only as long
          as needed to display the result. Saved reports are kept while your
          account is active. Server logs are retained for a short period for
          security and debugging.
        </p>

        <h2 className="text-2xl font-bold mt-10">Your rights</h2>
        <p className="text-muted-foreground">
          Depending on your location (including under the GDPR and the CCPA),
          you may have the right to access, correct, export, or delete your
          personal information, and to object to or restrict certain
          processing. Email{" "}
          <Placeholder value={c.privacyEmail} label="Privacy Email" /> to
          exercise any of these rights.
        </p>

        <h2 className="text-2xl font-bold mt-10">Children</h2>
        <p className="text-muted-foreground">
          The Service is not directed to children under 13 (or the applicable
          age in your jurisdiction), and we do not knowingly collect
          information from them.
        </p>

        <h2 className="text-2xl font-bold mt-10">Changes to this policy</h2>
        <p className="text-muted-foreground">
          If we make material changes we will update the effective date at the
          top of this page and, where appropriate, notify account holders by
          email.
        </p>

        <h2 className="text-2xl font-bold mt-10">Contact</h2>
        <address className="not-italic text-muted-foreground leading-relaxed">
          <Placeholder value={c.legalName} label="Legal Company Name" />
          <br />
          <Placeholder value={c.addressLine1} label="Street Address" />
          {!isMissing(c.addressLine2) && (
            <>
              <br />
              {c.addressLine2}
            </>
          )}
          <br />
          <Placeholder value={c.city} label="City" />,{" "}
          <Placeholder value={c.region} label="State / Region" />{" "}
          <Placeholder value={c.postalCode} label="Postal Code" />
          <br />
          <Placeholder value={c.country} label="Country" />
          <br />
          <br />
          Privacy enquiries:{" "}
          <Placeholder value={c.privacyEmail} label="Privacy Email" />
        </address>
      </article>
    </SiteLayout>
  );
}
