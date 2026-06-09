import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";

type Inputs = {
  siteName: string; siteUrl: string; owner: string; email: string; country: string;
  collectsEmail: boolean; usesCookies: boolean; showsAds: boolean;
};

const defaults: Inputs = {
  siteName: "My Website", siteUrl: "https://example.com", owner: "Your Name",
  email: "you@example.com", country: "United States",
  collectsEmail: true, usesCookies: true, showsAds: true,
};

function generate(type: string, i: Inputs): string {
  const date = new Date().toLocaleDateString();
  const intro = `Effective date: ${date}\n\nWebsite: ${i.siteName} (${i.siteUrl})\nOwner: ${i.owner}\nContact: ${i.email}\nJurisdiction: ${i.country}\n\n`;
  switch (type) {
    case "privacy":
      return `# Privacy Policy\n\n${intro}This Privacy Policy describes how ${i.siteName} ("we", "us") collects, uses, and protects your information.\n\n## 1. Information we collect\nWe collect information you provide directly${i.collectsEmail ? ", including email addresses submitted via forms," : ""} and information collected automatically, such as IP address, browser type, and pages visited.\n\n## 2. Cookies\n${i.usesCookies ? "We use cookies and similar tracking technologies to operate and improve the site." : "This site does not set first-party tracking cookies."}\n\n## 3. Third-party services\n${i.showsAds ? "We display advertising provided by Google AdSense, which may set cookies and use device identifiers to serve personalized ads. See https://policies.google.com/technologies/ads." : "We do not currently display third-party advertising."}\n\n## 4. Your rights\nDepending on your jurisdiction, you may have the right to access, correct, or delete the personal data we hold about you. Contact us at ${i.email}.\n\n## 5. Changes\nWe may update this policy from time to time. Changes are effective when posted.\n\n## 6. Contact\nQuestions? Email ${i.email}.`;
    case "terms":
      return `# Terms of Service\n\n${intro}By accessing ${i.siteName}, you agree to these Terms of Service.\n\n## 1. Use of the site\nYou may use ${i.siteName} for lawful purposes only. You agree not to misuse the site or attempt to disrupt its operation.\n\n## 2. Intellectual property\nAll content on ${i.siteName} is owned by ${i.owner} or its licensors and is protected by copyright laws.\n\n## 3. Disclaimer\nThe site is provided "as is" without warranties of any kind.\n\n## 4. Limitation of liability\nTo the maximum extent permitted by law, ${i.owner} will not be liable for any indirect or consequential damages.\n\n## 5. Governing law\nThese Terms are governed by the laws of ${i.country}.\n\n## 6. Contact\nQuestions about these Terms: ${i.email}.`;
    case "disclaimer":
      return `# Disclaimer\n\n${intro}The information provided by ${i.siteName} is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.\n\n${i.showsAds ? "## Advertising disclosure\nWe display ads via Google AdSense and may receive compensation when readers click on ads.\n\n" : ""}## Professional advice\nNothing on ${i.siteName} constitutes professional advice. Always seek the advice of a qualified professional.\n\n## External links\nThe site may contain links to other websites. We are not responsible for the content of those sites.\n\n## Contact\n${i.email}`;
    case "cookies":
      return `# Cookie Policy\n\n${intro}This Cookie Policy explains how ${i.siteName} uses cookies.\n\n## What are cookies?\nCookies are small text files placed on your device by websites you visit.\n\n## Cookies we use\n- Essential cookies for site functionality\n${i.showsAds ? "- Advertising cookies set by Google AdSense to personalize ads\n" : ""}- Analytics cookies to understand usage patterns\n\n## Managing cookies\nYou can control or delete cookies through your browser settings. Disabling cookies may impair site functionality.\n\n## Contact\n${i.email}`;
    case "about":
      return `# About ${i.siteName}\n\n${i.siteName} is operated by ${i.owner} and publishes high-quality content for our readers.\n\n## Our mission\nTo provide accurate, helpful, and original content that informs and helps our audience succeed.\n\n## Editorial standards\nAll content is reviewed for accuracy. We update older articles regularly to keep information current.\n\n## Contact\nReach us at ${i.email} or via the contact page at ${i.siteUrl}/contact.`;
    case "contact":
      return `# Contact ${i.siteName}\n\nWe'd love to hear from you. Reach out using any of the methods below.\n\n## Email\n${i.email}\n\n## Website\n${i.siteUrl}\n\n## Response time\nWe typically respond within 2 business days.\n\n## Business inquiries\nFor partnerships, advertising, or collaborations, please mention "Business" in your subject line.`;
    default:
      return "";
  }
}

const tabs = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "cookies", label: "Cookies" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function PolicyGenerator() {
  const [inputs, setInputs] = useState<Inputs>(defaults);
  const [active, setActive] = useState("privacy");
  const output = useMemo(() => generate(active, inputs), [active, inputs]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${active}-${inputs.siteName.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <SiteLayout>
      <Helmet>
        <title>Free Privacy Policy & Terms Generator for AdSense — 2026</title>
        <meta name="description" content="Generate Privacy Policy, Terms, Disclaimer, Cookie Policy, About and Contact pages for your AdSense-ready site in one click. Free, no signup." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/tools/policy-page-generator" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-10">
          <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Policy Page Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate Privacy Policy, Terms of Service, Disclaimer, Cookie Policy, About, and Contact pages instantly. AdSense-ready and customizable.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
          <div className="glass-card rounded-2xl p-6 space-y-4 h-fit">
            <h2 className="font-semibold mb-2">Your details</h2>
            {[
              ["siteName", "Website name"], ["siteUrl", "Website URL"],
              ["owner", "Owner / Company"], ["email", "Email address"],
              ["country", "Country"],
            ].map(([k, l]) => (
              <div key={k}>
                <Label className="mb-1.5 block">{l}</Label>
                <Input
                  value={(inputs as any)[k]}
                  onChange={(e) => setInputs({ ...inputs, [k]: e.target.value })}
                />
              </div>
            ))}
            <div className="space-y-3 pt-2">
              {[
                ["collectsEmail", "Site collects emails?"],
                ["usesCookies", "Site uses cookies?"],
                ["showsAds", "Site shows ads?"],
              ].map(([k, l]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span>{l}</span>
                  <Switch
                    checked={(inputs as any)[k]}
                    onCheckedChange={(v) => setInputs({ ...inputs, [k]: v })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="w-full flex-wrap h-auto">
                {tabs.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
              </TabsList>
              <TabsContent value={active} className="mt-4">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <Button size="sm" variant="outline" onClick={copy}><Copy className="h-4 w-4 mr-1.5" />Copy</Button>
                  <Button size="sm" variant="outline" onClick={download}><Download className="h-4 w-4 mr-1.5" />Download</Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm font-mono p-4 rounded-lg bg-secondary/50 max-h-[600px] overflow-auto border border-border">
                  {output}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
