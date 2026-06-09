import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function Disclaimer() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Disclaimer — AdSense Approval Checker</title>
        <meta name="description" content="Important disclaimers about the audit results and information provided on AdSense Approval Checker." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/disclaimer" />
      </Helmet>
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-invert text-muted-foreground space-y-5">
        <h1 className="text-4xl font-bold text-foreground">Disclaimer</h1>
        <p>The information provided by AdSense Approval Checker is for general informational purposes only. All information is provided in good faith; we make no warranty of any kind regarding its accuracy or completeness.</p>
        <h2 className="text-2xl font-bold text-foreground">Not affiliated with Google</h2>
        <p>AdSense Approval Checker is an independent tool and is not affiliated with, endorsed by, or sponsored by Google LLC. "Google AdSense" is a trademark of Google LLC.</p>
        <h2 className="text-2xl font-bold text-foreground">No guarantee of approval</h2>
        <p>Our scores estimate AdSense eligibility based on public program policies. Final approval decisions are made by Google and may differ from our score.</p>
        <h2 className="text-2xl font-bold text-foreground">Advertising disclosure</h2>
        <p>This site may display Google AdSense and other affiliate links. We may receive compensation when visitors click on certain links.</p>
      </article>
    </SiteLayout>
  );
}
