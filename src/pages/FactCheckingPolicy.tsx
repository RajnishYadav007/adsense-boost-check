import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function FactCheckingPolicy() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Fact-Checking Policy — {c.brandName}</title>
        <meta
          name="description"
          content={`How ${c.brandName} verifies every claim in its articles and tool recommendations.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/fact-checking-policy"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Fact-Checking Policy
        </h1>
        <p className="text-muted-foreground">
          Every article and recommendation on {c.brandName} is fact-checked
          against primary sources before publication and again on every
          scheduled review.
        </p>

        <h2 className="text-2xl font-bold mt-10">What counts as a primary source</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Official Google AdSense and Google Publisher policy pages</li>
          <li>Google Search Central documentation</li>
          <li>Web.dev articles published by the Chrome team</li>
          <li>Standards documents from W3C, WHATWG, and IETF</li>
          <li>
            Reproducible behavior of the audit tool against a known test
            domain, recorded with timestamp
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">How we verify</h2>
        <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
          <li>
            Each factual claim in a draft is annotated with the URL of its
            primary source.
          </li>
          <li>
            A reviewer (different from the author) opens every cited source
            and confirms the claim is supported as written.
          </li>
          <li>
            Numbers, dates, and quotes are checked character-by-character
            against the source.
          </li>
          <li>
            Claims that cannot be supported by a primary source are removed
            or reworded as opinion with a clear disclaimer.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10">Re-verification</h2>
        <p className="text-muted-foreground">
          Articles are re-fact-checked{" "}
          <Placeholder
            value={eeat.policies.reviewCadence}
            label="Review Cadence, e.g. every 90 days"
          />{" "}
          and immediately when a cited policy is updated. If a source is
          retired, the article is updated or marked outdated within{" "}
          <Placeholder
            value={eeat.policies.correctionTurnaround}
            label="Correction Turnaround, e.g. within 48 hours"
          />
          .
        </p>

        <h2 className="text-2xl font-bold mt-10">Report a factual error</h2>
        <p className="text-muted-foreground">
          Email{" "}
          <Placeholder value={c.editorialEmail} label="Editorial Email" />{" "}
          with the article URL, the specific claim, and the source that
          contradicts it. We respond per our{" "}
          <a href="/corrections-policy" className="text-primary underline">
            Corrections Policy
          </a>
          .
        </p>
      </article>
    </SiteLayout>
  );
}
