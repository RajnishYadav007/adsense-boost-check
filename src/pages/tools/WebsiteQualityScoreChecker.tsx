import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { UrlAuditCTA } from "@/components/tools/UrlAuditCTA";

export default function WebsiteQualityScoreChecker() {
  return (
    <ToolPageShell
      slug="website-quality-score-checker"
      keyword="website quality checker"
      eyebrow="Website Quality Score Checker"
      h1="Website Quality Score Checker — Measure Your Site Like Google Does"
      subheading="Get a single 0–100 website quality score covering content, EEAT, technical SEO, security, UX, and performance — the same signals Google uses to rank sites and approve them for AdSense."
      metaTitle="Website Quality Score Checker — Free Site Audit Tool"
      metaDescription="Free website quality score checker. Get a 0–100 quality score for any website — content, EEAT, SEO, security, UX, and performance — in 20 seconds."
      widget={<UrlAuditCTA buttonLabel="Get my quality score" />}
      whatIs="The Website Quality Score Checker condenses every signal that matters to Google — content depth and originality, EEAT signals (Experience, Expertise, Authoritativeness, Trustworthiness), technical SEO foundations, security posture, mobile usability, Core Web Vitals, and on-page structure — into a single 0–100 quality score. Use it to benchmark your site against competitors, track quality improvements over time, qualify sites for AdSense or other monetization programs, or as part of a broader SEO audit. The score is built on the same 47-point audit that powers our AdSense Approval Checker, recalibrated to weight overall site quality rather than AdSense-specific compliance."
      howItWorks={[
        { title: "Enter your URL", text: "We fetch the homepage and inner pages live." },
        { title: "Multi-signal scoring", text: "Content, EEAT, SEO, security, UX, and performance scored independently." },
        { title: "Weighted composite", text: "Signals weighted by how strongly Google's algorithms prioritize them in 2026." },
        { title: "Improvement plan", text: "Prioritized fix list ranked by score impact." },
      ]}
      whatItChecks={[
        "Content depth, originality, and readability",
        "EEAT signals (author bylines, About, Contact, sources)",
        "Title tag and meta description quality",
        "Heading structure (H1–H6 hierarchy)",
        "Internal linking density",
        "Image optimization and alt text",
        "Mobile responsiveness",
        "Core Web Vitals (LCP, CLS, INP)",
        "SSL / HTTPS and security headers",
        "Schema markup and structured data",
        "robots.txt and XML sitemap",
        "Indexability and canonical tags",
      ]}
      whoFor={[
        { name: "SEO professionals", text: "Use the quality score as a fast first-pass diagnostic during client audits." },
        { name: "Publishers", text: "Benchmark editorial quality across multiple sites or sections." },
        { name: "M&A buyers", text: "Pre-qualify website acquisitions based on objective quality signals." },
        { name: "Agencies", text: "Track quality improvements month over month as part of retainer reporting." },
      ]}
      faqs={[
        { q: "What is a good website quality score?", a: "85+ is high quality. 70–84 is solid. 50–69 needs work. Below 50 indicates fundamental issues that hurt rankings and monetization." },
        { q: "How does this differ from a Google Quality Score?", a: "Google's internal quality scores are proprietary. Ours is a transparent, reproducible composite built on the same publicly-documented signals Google's Search Quality Rater Guidelines describe." },
        { q: "Does the quality score predict Google rankings?", a: "It predicts ranking potential, not specific positions. A high score means the site has the foundational quality to rank — but content-market fit and backlinks still drive specific keyword rankings." },
        { q: "Can I improve my quality score quickly?", a: "Yes. Fixing technical SEO issues (broken links, missing meta, slow pages) typically moves the score in days. Content improvements take weeks." },
      ]}
      related={[
        { to: "/tools/adsense-approval-checker", label: "AdSense Approval Audit" },
        { to: "/tools/seo-audit-checker", label: "SEO Audit Checker" },
        { to: "/tools/content-quality-checker", label: "Content Quality Checker" },
      ]}
    />
  );
}
