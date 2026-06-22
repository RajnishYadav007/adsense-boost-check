import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { UrlAuditCTA } from "@/components/tools/UrlAuditCTA";

export default function AdsensePolicyChecker() {
  return (
    <ToolPageShell
      slug="adsense-policy-checker"
      keyword="adsense policy checker"
      eyebrow="AdSense Policy Checker"
      h1="AdSense Policy Checker — Find Policy Violations Before Google Does"
      subheading="Scan your website against every Google AdSense program policy and Webmaster Guideline. Catch violations before they cost you your account or your application."
      metaTitle="AdSense Policy Checker — Free Policy Violation Scanner"
      metaDescription="Free AdSense policy checker. Scan any website for Google AdSense program policy violations — content, layout, prohibited niches, and webmaster guideline breaches."
      widget={<UrlAuditCTA buttonLabel="Scan for policy violations" />}
      whatIs="The AdSense Policy Checker scans your website against Google's published AdSense program policies, Restricted Content rules, Ad Placement policies, and Webmaster Quality Guidelines. It detects the violations that trigger 'site does not comply with policies' rejections — missing or incomplete legal pages, prohibited niche signals, deceptive layout patterns, content categories Google won't monetize, and structural issues like broken navigation or copyright-violating media. Use it before applying, before re-applying after a rejection, or any time you make significant content changes."
      howItWorks={[
        { title: "Enter your URL", text: "We fetch the homepage and key inner pages." },
        { title: "Policy mapping", text: "Every signal is mapped against current AdSense program policies." },
        { title: "Violation list", text: "Each violation includes the exact policy clause and how to fix it." },
        { title: "Re-scan after fixes", text: "Run again as you fix issues to confirm full policy compliance." },
      ]}
      whatItChecks={[
        "Privacy Policy presence + cookie/ad disclosure",
        "Terms of Service / Terms & Conditions",
        "About Us page authenticity",
        "Contact page with real contact method",
        "Disclaimer page (mandatory for YMYL niches)",
        "Prohibited content signals (adult, gambling, weapons)",
        "Copyrighted media / piracy indicators",
        "Deceptive layout patterns (fake download buttons)",
        "Encouraging clicks / 'click here' language",
        "Restricted content categories",
        "AdSense terms violations (duplicate accounts, etc.)",
        "Misleading site purpose or navigation",
      ]}
      whoFor={[
        { name: "Previously rejected sites", text: "Diagnose 'site does not comply with policies' rejection emails." },
        { name: "Existing AdSense publishers", text: "Audit new posts and pages to avoid account-level violations." },
        { name: "Niche site builders", text: "Pre-qualify potential niches before investing in content." },
        { name: "Agencies", text: "Bundle policy compliance as part of monthly AdSense management retainers." },
      ]}
      faqs={[
        { q: "What is the AdSense policy checker?", a: "A free scanner that maps your site against Google's published AdSense program policies and Webmaster Guidelines to find violations before Google does." },
        { q: "What are the most common AdSense policy violations?", a: "Missing or incomplete Privacy Policy, deceptive download buttons, copied content, prohibited niches (adult, gambling), and encouraging clicks." },
        { q: "Can a policy violation get my AdSense account banned?", a: "Yes. Serious or repeat violations result in account-level enforcement — usually termination with no appeal." },
        { q: "Does the policy checker detect AI-generated content?", a: "Yes. Our content quality analysis flags raw, unedited AI output that Google's reviewers classify as 'low value content' under the Spam Policies." },
        { q: "How often should I run the policy checker?", a: "Run it before every application, after every site redesign, and quarterly to catch policy drift as Google updates its rules." },
      ]}
      related={[
        { to: "/tools/adsense-approval-checker", label: "Full Approval Audit" },
        { to: "/tools/adsense-rejection-analyzer", label: "Rejection Analyzer" },
        { to: "/tools/content-quality-checker", label: "Content Quality Checker" },
      ]}
    />
  );
}
