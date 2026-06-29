import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function CorrectionsPolicy() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>Corrections Policy — {c.brandName}</title>
        <meta
          name="description"
          content={`How ${c.brandName} reports, labels, and fixes errors in published articles and tool results.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/corrections-policy"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Corrections Policy
        </h1>
        <p className="text-muted-foreground">
          {c.brandName} corrects errors openly. This page explains how to
          report one and what happens next.
        </p>

        <h2 className="text-2xl font-bold mt-10">What we correct</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Factual inaccuracies (numbers, dates, policy statements)</li>
          <li>Outdated information when a Google policy has changed</li>
          <li>Misattributed quotes or sources</li>
          <li>Broken links to cited sources</li>
          <li>Material errors in tool output caused by a logic bug</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">How to report an error</h2>
        <p className="text-muted-foreground">
          Email{" "}
          <Placeholder value={c.editorialEmail} label="Editorial Email" />{" "}
          with:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>The exact article URL</li>
          <li>The specific sentence or claim that is wrong</li>
          <li>A link to a primary source that contradicts it, if available</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">Our response</h2>
        <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
          <li>
            We acknowledge every report within{" "}
            <Placeholder
              value={eeat.policies.correctionTurnaround}
              label="Correction Turnaround, e.g. within 48 hours"
            />
            .
          </li>
          <li>
            If the report is correct, we publish the correction in the article
            with a dated note explaining what changed and why.
          </li>
          <li>
            Significant corrections add a visible "Corrected on YYYY-MM-DD"
            label at the top of the article.
          </li>
          <li>
            Minor copy edits (typos, formatting) are made silently and do not
            require a correction note.
          </li>
          <li>
            If we cannot reproduce the error or disagree with the report, we
            reply with our reasoning and the source we relied on.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10">Retractions</h2>
        <p className="text-muted-foreground">
          If a whole article is materially wrong and cannot be saved by a
          correction, we retract it. Retracted articles remain at their URL
          with a clear retraction notice instead of the original content, so
          inbound links continue to land somewhere honest.
        </p>
      </article>
    </SiteLayout>
  );
}
