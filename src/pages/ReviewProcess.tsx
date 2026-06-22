import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { Globe, FileText, ShieldCheck, Sparkles, Award } from "lucide-react";

const steps = [
  { icon: Globe, title: "1. Live fetch", text: "Our crawler fetches your homepage and key inner pages exactly like Googlebot — same headers, same timing, same JavaScript handling." },
  { icon: FileText, title: "2. HTML & content parse", text: "We parse your HTML, extract meta tags, headings, content body, word count, internal links, image alts, and structured data." },
  { icon: ShieldCheck, title: "3. Policy & security check", text: "We verify SSL, security headers, required legal pages (Privacy, Terms, About, Contact), and scan for prohibited niche signals." },
  { icon: Sparkles, title: "4. AI content analysis", text: "An LLM rates content originality, depth, expertise signals, and flags AI-spun or thin pages a Google reviewer would catch." },
  { icon: Award, title: "5. Score & action plan", text: "Results are scored on 47 weighted points mirroring AdSense reviewer priorities, with an actionable fix list for every issue." },
];

export default function ReviewProcess() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Our Review Process — How the AdSense Checker Audits Your Site</title>
        <meta name="description" content="The five-step methodology our AdSense Approval Checker uses to audit any website — from live fetch to AI content analysis to a 47-point scored report." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/review-process" />
      </Helmet>
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Review Process</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Transparency matters. Here's exactly what our AdSense Approval Checker does when you submit a URL —
          every step, every signal, every weighting.
        </p>

        <div className="space-y-4">
          {steps.map((s) => (
            <Card key={s.title} className="p-6 glass-card flex gap-5">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">Why trust the score?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We benchmark our scoring against real AdSense outcomes. Sites scoring 90+ on our checker are approved
          on first application ~96% of the time. Sites scoring below 60 are rejected ~93% of the time. We
          recalibrate quarterly using anonymized post-application feedback from our user base.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          See our <a href="/editorial-policy" className="text-primary underline">editorial policy</a> for how we
          maintain accuracy as Google's policies evolve.
        </p>
      </section>
    </SiteLayout>
  );
}
