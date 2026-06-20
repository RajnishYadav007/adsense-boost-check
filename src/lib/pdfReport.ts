import jsPDF from "jspdf";
import type { CheckResult, AuditMeta } from "@/components/CheckResults";

const FIX_MAP: Record<string, string> = {
  "Site is not served over HTTPS": "Install a valid SSL certificate (Let's Encrypt is free) and force HTTPS redirects.",
  "No Privacy Policy page found": "Publish a Privacy Policy page at /privacy covering cookies, ads and analytics.",
  "No Contact page found": "Add a Contact page with a working email or contact form.",
  "Very thin content — not enough to evaluate": "Publish at least 15–20 original articles of 800+ words each before applying.",
  "robots.txt blocks site-wide crawling": "Edit robots.txt and remove `Disallow: /` so Googlebot can crawl your site.",
  "Prohibited content patterns detected": "Remove adult, violent, hateful, or copyrighted material — these violate AdSense Program Policies.",
  "No AdSense code detected": "Once approved, paste the AdSense auto-ads snippet inside <head> of every page.",
};

function fixFor(blocker: string): string {
  for (const k of Object.keys(FIX_MAP)) if (blocker.toLowerCase().includes(k.toLowerCase().slice(0, 18))) return FIX_MAP[k];
  return "Review Google AdSense Program Policies and address this issue before reapplying.";
}

export function generatePdfReport(opts: {
  websiteUrl: string;
  overallScore: number;
  results: CheckResult[];
  audit?: AuditMeta & { fetchedUrls?: string[] };
}) {
  const { websiteUrl, overallScore, results, audit } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  const line = (txt: string, size = 11, bold = false, color: [number, number, number] = [30, 30, 30]) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const wrapped = doc.splitTextToSize(txt, W - M * 2);
    for (const l of wrapped) {
      if (y > H - M) { doc.addPage(); y = M; }
      doc.text(l, M, y);
      y += size * 1.35;
    }
  };
  const space = (n = 8) => { y += n; };
  const rule = () => { doc.setDrawColor(220); doc.line(M, y, W - M, y); y += 12; };

  // Header band
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text("AdSense Eligibility Report", M, 44);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(new Date().toLocaleString(), W - M, 44, { align: "right" });
  y = 100;

  line(websiteUrl, 13, true);
  space(4);

  // Score + verdict box
  const verdictColor: [number, number, number] =
    audit?.verdict === "approved" ? [34, 197, 94]
    : audit?.verdict === "likely" ? [59, 130, 246]
    : audit?.verdict === "needs_work" ? [234, 179, 8]
    : [239, 68, 68];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...verdictColor);
  doc.setLineWidth(1.5);
  doc.roundedRect(M, y, W - M * 2, 90, 8, 8, "FD");
  doc.setTextColor(...verdictColor);
  doc.setFont("helvetica", "bold"); doc.setFontSize(28);
  doc.text(`${overallScore}%`, M + 20, y + 50);
  doc.setFontSize(12);
  doc.text(audit?.verdictLabel ?? "Overall Score", M + 110, y + 35);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(60, 60, 60);
  const reason = doc.splitTextToSize(audit?.verdictReason ?? "", W - M * 2 - 130);
  doc.text(reason, M + 110, y + 52);
  if (audit) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...verdictColor);
    doc.text(`${audit.approvalProbability}% approval probability`, W - M - 20, y + 35, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80);
    doc.text(audit.adsense.active
      ? `AdSense detected${audit.adsense.publisherId ? " · " + audit.adsense.publisherId : ""}`
      : "No AdSense code on site", W - M - 20, y + 52, { align: "right" });
  }
  y += 110;

  // Blockers + fixes
  if (audit && audit.blockers.length > 0) {
    line("Critical Blockers & Recommended Fixes", 14, true, [180, 30, 30]);
    rule();
    audit.blockers.forEach((b, i) => {
      line(`${i + 1}. ${b}`, 11, true);
      line(`   Fix: ${fixFor(b)}`, 10, false, [70, 70, 70]);
      space(4);
    });
    space(6);
  }

  // Fetched URLs
  if (audit?.fetchedUrls && audit.fetchedUrls.length > 0) {
    line("Pages Crawled During Audit", 14, true);
    rule();
    audit.fetchedUrls.forEach((u) => line(`• ${u}`, 10, false, [50, 80, 160]));
    space(6);
  }

  // Detailed results
  line("Detailed Check Results", 14, true);
  rule();
  results.forEach((cat) => {
    line(cat.category, 12, true, [40, 40, 40]);
    cat.checks.forEach((c) => {
      const mark = c.status === "pass" ? "[PASS]" : c.status === "fail" ? "[FAIL]" : "[WARN]";
      const color: [number, number, number] =
        c.status === "pass" ? [34, 130, 60] : c.status === "fail" ? [200, 40, 40] : [180, 130, 20];
      line(`  ${mark} ${c.name}`, 10, true, color);
      line(`        ${c.message}`, 9, false, [80, 80, 80]);
    });
    space(6);
  });

  // Footer on each page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(140);
    doc.text(`AdSense Approval Checker · Page ${i}/${pages}`, W / 2, H - 18, { align: "center" });
  }

  const safe = websiteUrl.replace(/^https?:\/\//, "").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
  doc.save(`adsense-report-${safe}-${Date.now()}.pdf`);
}
