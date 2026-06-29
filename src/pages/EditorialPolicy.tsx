import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function EditorialPolicy() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Editorial Policy — {c.brandName}</title>
        <meta
          name="description"
          content={`How ${c.brandName} researches, writes, reviews, and updates its content — our editorial standards in full.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/editorial-policy"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Editorial Policy</h1>

        <p className="text-muted-foreground">
          This policy explains how {c.brandName} produces, reviews, and
          maintains its tools, articles, and guides. It applies to every page
          on this site.
        </p>

        <h2 className="text-2xl font-bold mt-10">Editorial independence</h2>
        <p className="text-muted-foreground">
          {c.brandName} is operated by{" "}
          <Placeholder value={c.legalName} label="Legal Company Name" />. We
          are not affiliated with, endorsed by, or paid by Google or by Google
          AdSense. We do not accept payment for favorable reviews of tools,
          ad networks, hosts, or other services.
        </p>

        <h2 className="text-2xl font-bold mt-10">Sources we rely on</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Official Google AdSense Program Policies</li>
          <li>Google Publisher Policies and Restrictions</li>
          <li>Google Search Central documentation and Search Quality Guidelines</li>
          <li>Web.dev guidance on Core Web Vitals and performance</li>
          <li>W3C and WHATWG specifications for HTML, accessibility, and structured data</li>
          <li>
            Our own anonymized audit dataset of websites that have requested
            an AdSense readiness check
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">How an article is produced</h2>
        <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
          <li>
            <strong className="text-foreground">Topic brief.</strong> An editor
            scopes the topic, maps it to current AdSense and Search policies,
            and identifies the questions a reader needs answered.
          </li>
          <li>
            <strong className="text-foreground">Research.</strong> The author
            gathers primary sources from the list above and tests claims
            against live behavior of the checker where applicable.
          </li>
          <li>
            <strong className="text-foreground">Draft.</strong> The author
            writes the piece with citations to primary sources, runnable
            examples where relevant, and a clear recommendation.
          </li>
          <li>
            <strong className="text-foreground">Review.</strong> A second
            reviewer fact-checks every concrete claim against its cited source
            per our{" "}
            <a href="/fact-checking-policy" className="text-primary underline">
              Fact-Checking Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Publish & timestamp.</strong>{" "}
            The article ships with a visible author, reviewer, and last-updated
            date.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10">Update cadence</h2>
        <p className="text-muted-foreground">
          Every published article is re-reviewed{" "}
          <Placeholder
            value={eeat.policies.reviewCadence}
            label="Review Cadence, e.g. every 90 days"
          />
          . When Google publishes a policy change, we update affected articles
          and tools within the same week and add an entry to the article's
          changelog.
        </p>

        <h2 className="text-2xl font-bold mt-10">AI usage</h2>
        <p className="text-muted-foreground">
          How and where we use AI in our editorial and tooling pipeline is
          described in full in our{" "}
          <a href="/ai-usage-policy" className="text-primary underline">
            AI Usage Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10">Corrections</h2>
        <p className="text-muted-foreground">
          If we get something wrong, we correct it publicly. See our{" "}
          <a href="/corrections-policy" className="text-primary underline">
            Corrections Policy
          </a>{" "}
          for how to report an error and how we handle it.
        </p>

        <h2 className="text-2xl font-bold mt-10">Contact the editors</h2>
        <p className="text-muted-foreground">
          Email{" "}
          <Placeholder
            value={c.editorialEmail}
            label="Editorial Email"
          />{" "}
          for editorial questions, source requests, or to report an issue with
          an article.
        </p>
      </article>
    </SiteLayout>
  );
}
