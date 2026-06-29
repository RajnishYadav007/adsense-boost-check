import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat } from "@/config/eeat";

export default function AIUsagePolicy() {
  const c = eeat.company;
  return (
    <SiteLayout>
      <Helmet>
        <title>AI Usage Policy — {c.brandName}</title>
        <meta
          name="description"
          content={`Where and how ${c.brandName} uses AI in its tools, recommendations, and editorial process.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/ai-usage-policy"
        />
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Usage Policy</h1>
        <p className="text-muted-foreground">
          {c.brandName} uses AI selectively and discloses where. This page
          describes exactly where AI is and is not used across our tools and
          our editorial content.
        </p>

        <h2 className="text-2xl font-bold mt-10">In the audit tools</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>
            <strong className="text-foreground">Deterministic first.</strong>{" "}
            Every check that produces a score (TLS, headers, policy pages,
            heading structure, ads.txt, schema, etc.) is performed by
            deterministic code, not by an AI model.
          </li>
          <li>
            <strong className="text-foreground">AI for summarisation.</strong>{" "}
            An LLM is used to convert deterministic findings into a plain-
            language summary, ranked recommendations, and example fixes.
          </li>
          <li>
            <strong className="text-foreground">AI for content quality.</strong>{" "}
            A separate model evaluates sampled page content for the qualitative
            signals Google describes (originality, depth, helpfulness). Its
            output is shown as a signal, not a verdict.
          </li>
          <li>
            <strong className="text-foreground">No autonomous actions.</strong>{" "}
            AI is never given the ability to apply for AdSense on your behalf,
            modify your site, or send email.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">In editorial content</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>
            Drafts may be outlined or rewritten for clarity with AI assistance,
            but every published article has a named human author and reviewer
            who is accountable for its content.
          </li>
          <li>
            AI-generated text is fact-checked against primary sources under our{" "}
            <a href="/fact-checking-policy" className="text-primary underline">
              Fact-Checking Policy
            </a>{" "}
            before publication.
          </li>
          <li>
            Articles that are substantially AI-assisted are labelled as such at
            the bottom of the page.
          </li>
          <li>We do not publish images that misrepresent real people or events.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">Your data</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>
            The only inputs sent to model providers are the URL you submit and
            the publicly fetched content of that URL.
          </li>
          <li>
            We do not send personal identifiers, account data, or contents of
            authenticated pages to any model provider.
          </li>
          <li>
            Model providers are configured, where the option is available, to
            not retain prompts for training.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10">Models in use</h2>
        <p className="text-muted-foreground">
          The specific model providers and model versions in use change as
          better options become available. Current providers are listed in our{" "}
          <a href="/privacy-policy" className="text-primary underline">
            Privacy Policy
          </a>{" "}
          under "Subprocessors". Questions can be sent to{" "}
          <Placeholder value={c.editorialEmail} label="Editorial Email" />.
        </p>
      </article>
    </SiteLayout>
  );
}
