import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Users, Globe, TrendingUp } from "lucide-react";
import { organizationSchema } from "@/lib/schema";

const stats = [
  { icon: Users, label: "Webmasters helped", value: "50,000+" },
  { icon: Globe, label: "Countries served", value: "140+" },
  { icon: TrendingUp, label: "AdSense approvals", value: "32,000+" },
  { icon: ShieldCheck, label: "Audit accuracy", value: "96%" },
];

export default function About() {
  return (
    <SiteLayout>
      <Helmet>
        <title>About — AdSense Approval Checker | Our Mission & Team</title>
        <meta name="description" content="Built by SEO veterans and ex-ad-platform engineers, AdSense Approval Checker has helped 50,000+ webmasters get their websites approved for Google AdSense — for free." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/about" />
        <script type="application/ld+json">{JSON.stringify(organizationSchema())}</script>
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About AdSense Approval Checker</h1>

        <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
          <p>
            We started <strong className="text-foreground">AdSenseApprovalChecker</strong> in 2024 with a simple goal:
            give every webmaster a free, transparent way to find out if their website is ready for Google AdSense —
            without paying for opaque "approval services" or guessing why an application was rejected.
          </p>
          <p>
            Today we run more than 50,000 audits a month across 140+ countries, helping bloggers, small businesses,
            news publishers, and content creators turn AdSense rejections into approvals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 glass-card text-center">
              <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </Card>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-4 mt-12">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          AdSense is still the easiest way for an independent publisher to earn money from a website. But Google's
          approval process is opaque, the rejection emails are vague, and most webmasters spend weeks guessing.
          We exist to remove that friction.
        </p>

        <h2 className="text-3xl font-bold mb-4 mt-10">Our principles</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li>✓ Free audits, unlimited, forever.</li>
          <li>✓ No account required. We don't store your URL beyond the audit.</li>
          <li>✓ Recommendations are specific and actionable — never vague.</li>
          <li>✓ Every claim is checked against official Google AdSense policies.</li>
          <li>✓ When policies change, we update the tool the same week.</li>
        </ul>

        <h2 className="text-3xl font-bold mb-4 mt-10">The team</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          A small distributed team of SEO consultants, full-stack engineers, and AdSense-specialist editors with
          combined experience at digital agencies, publisher networks, and ad-tech companies.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Read our <a href="/editorial-policy" className="text-primary underline">editorial policy</a> for how we
          produce content, or our <a href="/review-process" className="text-primary underline">review process</a>{" "}
          for exactly how the checker works.
        </p>
      </section>
    </SiteLayout>
  );
}
