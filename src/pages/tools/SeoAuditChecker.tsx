import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { UrlAuditCTA } from "@/components/tools/UrlAuditCTA";

export default function SeoAuditChecker() {
  return (
    <ToolPageShell
      slug="seo-audit-checker"
      keyword="seo audit tool"
      eyebrow="SEO Audit Checker"
      h1="Free SEO Audit Checker — Find What's Blocking Your Rankings"
      subheading="Run a complete on-page, technical, and structural SEO audit on any URL. Get every issue, prioritized by ranking impact, with the exact fix for each."
      metaTitle="Free SEO Audit Checker — Complete On-Page & Technical SEO Tool"
      metaDescription="Free SEO audit checker. Run a complete on-page, technical, and structural SEO audit on any URL in 20 seconds — every issue prioritized by ranking impact."
      widget={<UrlAuditCTA buttonLabel="Run free SEO audit" />}
      whatIs="The SEO Audit Checker runs a full technical and on-page SEO audit on any URL. It covers every signal Google's ranking algorithms use — title and meta optimization, heading hierarchy, internal linking, schema markup, image SEO, mobile usability, Core Web Vitals, HTTPS and security, crawlability, indexability, and canonical structure — and reports each issue with its priority weight and the exact fix. Built on the same engine as our AdSense Approval Checker, with the scoring recalibrated to weight SEO-impact signals rather than AdSense-policy signals. Use it as a fast first-pass audit, a pre-launch QA checklist, or a baseline before starting any SEO project."
      howItWorks={[
        { title: "Enter your URL", text: "Single URL — we fetch live and parse the rendered HTML." },
        { title: "On-page + technical scan", text: "Titles, meta, headings, links, images, schema, headers, CWV." },
        { title: "Issue prioritization", text: "Each issue ranked: critical / warning / opportunity by ranking impact." },
        { title: "Fix-list export", text: "Download the full audit as a PDF for your team or client." },
      ]}
      whatItChecks={[
        "Title tag (length, keyword, uniqueness)",
        "Meta description (length, CTR signals)",
        "Heading hierarchy (single H1, logical H2–H6)",
        "URL structure and canonicals",
        "Internal linking density and anchor text",
        "Image alt text and lazy loading",
        "Schema markup / JSON-LD",
        "robots.txt and XML sitemap",
        "Mobile responsiveness and viewport",
        "Core Web Vitals (LCP, CLS, INP)",
        "HTTPS, HSTS, and security headers",
        "Indexability and noindex / nofollow signals",
      ]}
      whoFor={[
        { name: "SEO consultants", text: "Run pre-engagement audits to scope client work and pricing." },
        { name: "Site owners", text: "Self-diagnose ranking drops or pre-launch a new site." },
        { name: "Developers", text: "Catch SEO regressions before deploying to production." },
        { name: "Marketing teams", text: "Track on-page SEO health across hundreds of landing pages." },
      ]}
      faqs={[
        { q: "What is an SEO audit checker?", a: "A tool that scans a URL against every documented Google ranking signal — technical, on-page, and structural — and reports issues with prioritized fixes." },
        { q: "How often should I run an SEO audit?", a: "Monthly for active sites, before every major release, and any time you see a ranking or traffic drop." },
        { q: "Is the SEO audit checker free?", a: "Yes. Unlimited audits, no login, no credit card. PDF export is also free." },
        { q: "Does it check Core Web Vitals?", a: "Yes. LCP, CLS, and INP are checked, plus the underlying causes (render-blocking assets, layout shifts, slow scripts)." },
        { q: "Can I use it for competitor SEO research?", a: "Yes. It works on any public URL — your site or any competitor's." },
      ]}
      related={[
        { to: "/tools/website-quality-score-checker", label: "Quality Score Checker" },
        { to: "/tools/adsense-approval-checker", label: "AdSense Approval Audit" },
        { to: "/tools/seo-checklist", label: "30-point SEO Checklist" },
      ]}
    />
  );
}
