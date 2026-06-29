import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat, isMissing } from "@/config/eeat";
import { organizationSchema } from "@/lib/schema";

export default function About() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>About {c.brandName} — Who We Are & Why We Built This</title>
        <meta
          name="description"
          content={`Learn about ${c.brandName}, the team behind it, our mission, and how we help webmasters get approved for Google AdSense.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/about"
        />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema())}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About {c.brandName}
        </h1>

        <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
          <p>
            <strong className="text-foreground">{c.brandName}</strong> is
            operated by{" "}
            <Placeholder value={c.legalName} label="Legal Company Name" />,
            founded in{" "}
            <Placeholder value={c.foundedYear} label="Founded Year" />. We
            build free, transparent tools that help independent publishers
            understand whether their website is ready for Google AdSense.
          </p>
          <p>
            This page describes who we are, where we are based, and how to
            reach us. For how we produce content, see our{" "}
            <a href="/editorial-policy" className="text-primary underline">
              Editorial Policy
            </a>
            ; for how the checker itself works, see our{" "}
            <a href="/review-process" className="text-primary underline">
              Review Process
            </a>
            .
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-4 mt-12">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          Google AdSense remains one of the most accessible monetization paths
          for independent publishers, but its approval process is opaque and
          rejection emails are vague. Our mission is to remove that friction
          with checks that map directly to Google's published policies, written
          in plain language with concrete fixes.
        </p>

        <h2 className="text-3xl font-bold mb-4 mt-10">Our principles</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li>✓ Free audits, no account required.</li>
          <li>
            ✓ Recommendations map to specific lines of Google's published
            policies — never speculation.
          </li>
          <li>
            ✓ When AdSense policy changes, we update the checker and the
            affected articles, and we publish a changelog entry.
          </li>
          <li>
            ✓ We disclose how AI is used in our content — see our{" "}
            <a href="/ai-usage-policy" className="text-primary underline">
              AI Usage Policy
            </a>
            .
          </li>
          <li>
            ✓ We correct errors quickly and publicly — see our{" "}
            <a href="/corrections-policy" className="text-primary underline">
              Corrections Policy
            </a>
            .
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-4 mt-10">Where we are</h2>
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
          Email:{" "}
          <Placeholder value={c.contactEmail} label="Contact Email" />
          <br />
          Phone: <Placeholder value={c.phone} label="Phone (optional)" />
        </address>

        <h2 className="text-3xl font-bold mb-4 mt-10">The team</h2>
        <p className="text-muted-foreground leading-relaxed">
          Read short bios for every author and reviewer on our{" "}
          <a href="/team" className="text-primary underline">
            Meet the Team
          </a>{" "}
          page, or browse{" "}
          <a href="/authors" className="text-primary underline">
            individual author profiles
          </a>
          .
        </p>
      </article>
    </SiteLayout>
  );
}
