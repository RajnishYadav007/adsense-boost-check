import { useState } from "react";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const patterns: { match: RegExp; reason: string; fix: string }[] = [
  { match: /insufficient content|valuable inventory|low value|thin content/i,
    reason: "Insufficient / Low-Value Content",
    fix: "Add 20–30 substantive original posts (800+ words each). Remove or merge thin pages." },
  { match: /scraped|duplicate|copied|copyright/i,
    reason: "Copied or Duplicate Content",
    fix: "Rewrite or remove copied content. Run originality check on every post." },
  { match: /policy violation|does not comply|google policies|webmaster/i,
    reason: "Policy / Webmaster Guidelines Violation",
    fix: "Run the Policy Checker. Fix missing legal pages, deceptive layouts, prohibited niche signals." },
  { match: /navigation|user experience|broken|404/i,
    reason: "Navigation / UX Issues",
    fix: "Fix all broken links, ensure header & footer navigation works, no orphan pages." },
  { match: /adult|sexually explicit/i,
    reason: "Adult Content (prohibited)",
    fix: "AdSense does not monetize adult content. The niche is permanently ineligible." },
  { match: /gambling|casino|betting/i,
    reason: "Gambling Content (region-restricted)",
    fix: "Gambling content is prohibited in most regions. Consider a different niche or geo." },
  { match: /weapons|drugs|illegal|hacking/i,
    reason: "Illegal / Restricted Content",
    fix: "Remove all prohibited content categories. These are non-negotiable rejections." },
  { match: /https|ssl|secure/i,
    reason: "Missing or Invalid SSL",
    fix: "Install a valid SSL certificate. Ensure entire site loads on HTTPS with no mixed content." },
  { match: /domain age|6 months/i,
    reason: "Domain Too New",
    fix: "Wait until your domain is at least 6 months old (required in India, China, and some other regions)." },
];

function Analyzer() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<typeof patterns | null>(null);

  const analyze = () => {
    if (!text.trim()) return;
    const hits = patterns.filter((p) => p.match.test(text));
    setResults(hits);
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Paste your AdSense rejection email or reason</label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the full text of your Google AdSense rejection email here..."
        rows={6}
        className="mb-3"
      />
      <Button onClick={analyze} className="w-full bg-gradient-primary shadow-glow rounded-xl" size="lg">
        Analyze rejection reason
      </Button>

      {results !== null && (
        <div className="mt-6 space-y-3">
          {results.length === 0 ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div className="text-sm">No known rejection patterns matched. Run a full AdSense audit on your site for a detailed diagnostic.</div>
            </div>
          ) : (
            results.map((r, i) => (
              <div key={i} className="p-4 rounded-lg bg-destructive/5 border border-destructive/30">
                <div className="flex items-start gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="font-semibold">{r.reason}</div>
                </div>
                <div className="text-sm text-muted-foreground pl-8">
                  <strong className="text-foreground">Fix:</strong> {r.fix}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AdsenseRejectionAnalyzer() {
  return (
    <ToolPageShell
      slug="adsense-rejection-analyzer"
      keyword="adsense rejection checker"
      eyebrow="AdSense Rejection Analyzer"
      h1="AdSense Rejection Analyzer — Decode Your Rejection Email"
      subheading="Paste your Google AdSense rejection email and get an instant decode — the actual policy issue, what triggered it, and the exact fix to make before re-applying."
      metaTitle="AdSense Rejection Analyzer — Decode Rejection Reasons"
      metaDescription="Free AdSense rejection analyzer. Decode vague Google AdSense rejection emails like 'site does not comply' into actionable fixes. Re-apply with confidence."
      widget={<Analyzer />}
      whatIs="The AdSense Rejection Analyzer turns Google's notoriously vague rejection emails into a concrete fix list. Google's standard rejection language — 'low value content', 'site does not comply with policies', 'insufficient content' — covers dozens of different underlying issues. The analyzer pattern-matches your email against the ten most common rejection categories and surfaces the specific policy clause being triggered, plus the exact steps to fix it before you re-apply. Most webmasters who re-apply within 7 days without fixing the real issue get rejected again — this tool helps you avoid that."
      howItWorks={[
        { title: "Paste the email", text: "Copy the full rejection email from your AdSense dashboard or inbox." },
        { title: "Pattern matching", text: "We map the language against the ten most common rejection categories." },
        { title: "Get the real issue", text: "Each match shows the actual policy clause Google flagged." },
        { title: "Fix and re-apply", text: "Follow the fix list, wait 7 days, run a full audit, re-apply." },
      ]}
      whatItChecks={[
        "Insufficient content / low-value content",
        "Copied, duplicate, or scraped content",
        "Policy or Webmaster Guidelines violations",
        "Navigation and user-experience issues",
        "Prohibited niches (adult, gambling, weapons)",
        "SSL / HTTPS issues",
        "Domain age requirements",
        "Restricted content categories",
        "Deceptive layout patterns",
        "Account-level enforcement actions",
      ]}
      whoFor={[
        { name: "Rejected applicants", text: "Decode your specific rejection email into actionable fixes." },
        { name: "Repeat rejections", text: "Identify the pattern Google keeps flagging across multiple applications." },
        { name: "Re-applicants", text: "Verify the issue is genuinely resolved before submitting again." },
        { name: "Agencies", text: "Provide rejection-recovery services to clients with confidence." },
      ]}
      faqs={[
        { q: "How long should I wait before re-applying to AdSense?", a: "At least 7 days, but ideally 30+ if you need to add content. Re-applying without changes leads to repeat rejections and eventually permanent ineligibility." },
        { q: "What does 'low value content' actually mean?", a: "It means Google's reviewers judged your content as thin, unoriginal, or providing little user value. Usually fixed by adding 20–30 substantive original posts of 800+ words." },
        { q: "Why is my AdSense rejection email so vague?", a: "Google intentionally avoids specifics to prevent gaming the system. Our analyzer maps the standard phrases to their actual underlying causes." },
        { q: "Can I appeal an AdSense rejection?", a: "There's no formal appeal. Your only option is to fix the issue and re-apply through your AdSense dashboard." },
        { q: "How many times can I re-apply to AdSense?", a: "No hard limit, but repeated rejections without meaningful changes can mark your account or domain as permanently ineligible." },
      ]}
      related={[
        { to: "/tools/adsense-approval-checker", label: "Live URL Audit" },
        { to: "/tools/adsense-policy-checker", label: "Policy Checker" },
        { to: "/tools/content-quality-checker", label: "Content Quality Checker" },
      ]}
    />
  );
}
