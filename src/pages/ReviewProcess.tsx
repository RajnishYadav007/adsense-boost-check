import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function ReviewProcess() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Review Process — {c.brandName}</title>
        <meta
          name="description"
          content={`Exactly how the ${c.brandName} audit works: what we fetch, what we check, how we score, and what we don't do.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/review-process"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Review Process</h1>
        <p className="text-muted-foreground">
          This page documents exactly what happens when you submit a URL to the
          {` ${c.brandName}`} checker — what we fetch, what we look at, how we
          score, and what we explicitly do not do.
        </p>

        <h2 className="text-2xl font-bold mt-10">What the scanner does</h2>
        <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
          <li>
            <strong className="text-foreground">URL validation.</strong> The
            URL is normalized and validated. Loopback, private network, and
            link-local hosts are rejected to prevent SSRF.
          </li>
          <li>
            <strong className="text-foreground">Homepage fetch.</strong> We
            fetch the homepage HTML with a documented user-agent and a request
            timeout. Redirects are followed but re-validated at each hop.
          </li>
          <li>
            <strong className="text-foreground">Static analysis.</strong> The
            HTML is parsed for meta tags, headings, structured data, internal
            links, ad placements, AdSense code, and references to policy pages.
          </li>
          <li>
            <strong className="text-foreground">Transport checks.</strong> We
            check the TLS certificate, HTTP response headers, robots.txt, and
            ads.txt.
          </li>
          <li>
            <strong className="text-foreground">Policy page detection.</strong>{" "}
            We look for Privacy Policy, Terms, Contact, and About pages at
            common paths and verify they return 200.
          </li>
          <li>
            <strong className="text-foreground">Content quality signals.</strong>{" "}
            We sample a small number of internal URLs and run heuristic
            content-quality checks — word count, originality signals, internal
            linking depth, and template duplication.
          </li>
          <li>
            <strong className="text-foreground">AI-assisted summary.</strong>{" "}
            A large language model is used only to summarise findings and
            generate human-readable recommendations from the deterministic
            check results — never to invent results. See our{" "}
            <a href="/ai-usage-policy" className="text-primary underline">
              AI Usage Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Score & verdict.</strong>{" "}
            Each check contributes a weighted score; the overall verdict is
            one of <em>approved</em>, <em>likely</em>, <em>needs work</em>, or{" "}
            <em>not ready</em>, with the specific blockers listed.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10">What we don't do</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>We do not submit your site to Google AdSense.</li>
          <li>We do not have access to your AdSense account or earnings.</li>
          <li>
            We do not store your URL beyond the lifetime of producing your
            report unless you create an account and save it.
          </li>
          <li>
            We do not guarantee approval — only Google can approve a site.
            Our verdict is a probability based on observable signals.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">How checks are weighted</h2>
        <p className="text-muted-foreground">
          Hard blockers (missing privacy policy, prohibited content categories,
          a non-resolving domain) reduce the score sharply because Google will
          reject for any one of them. Soft signals (heading structure,
          alt-text coverage, internal-link depth) reduce the score gently and
          appear as recommendations rather than blockers.
        </p>

        <h2 className="text-2xl font-bold mt-10">Maintenance & accuracy</h2>
        <p className="text-muted-foreground">
          The check list is reviewed{" "}
          <Placeholder
            value={eeat.policies.reviewCadence}
            label="Review Cadence, e.g. every 90 days"
          />{" "}
          and immediately whenever Google publishes a relevant policy change.
          Methodology questions can be sent to{" "}
          <Placeholder value={c.editorialEmail} label="Editorial Email" />.
        </p>
      </article>
    </SiteLayout>
  );
}
