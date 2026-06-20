import jsPDF from "jspdf";
import type { CheckResult, AuditMeta } from "@/components/CheckResults";

const FIX_MAP: Record<string, string> = {
  "Site is not served over HTTPS": "Install a valid SSL certificate (Let's Encrypt is free) and force HTTPS redirects sitewide.",
  "No Privacy Policy page found": "Publish a Privacy Policy page at /privacy covering cookies, ads, and analytics.",
  "No Contact page found": "Add a Contact page with a working email address or contact form.",
  "Very thin content — not enough to evaluate": "Publish at least 15–20 original articles of 800+ words each before applying.",
  "robots.txt blocks site-wide crawling": "Edit robots.txt and remove `Disallow: /` so Googlebot can crawl your site.",
  "robots.txt blocks all crawlers": "Edit robots.txt and remove `Disallow: /` so Googlebot can crawl your site.",
  "Prohibited content patterns detected": "Remove adult, violent, hateful, or copyrighted material — these violate AdSense Program Policies.",
  "No AdSense code detected": "Once approved, paste the AdSense auto-ads snippet inside <head> of every page.",
};

function fixFor(blocker: string): string {
  for (const k of Object.keys(FIX_MAP)) {
    if (blocker.toLowerCase().includes(k.toLowerCase().slice(0, 18))) return FIX_MAP[k];
  }
  return "Review Google AdSense Program Policies and resolve this issue before reapplying.";
}

type RGB = [number, number, number];

const COLORS = {
  brand: [79, 70, 229] as RGB,
  brandDark: [55, 48, 163] as RGB,
  ink: [17, 24, 39] as RGB,
  body: [55, 65, 81] as RGB,
  muted: [107, 114, 128] as RGB,
  rule: [229, 231, 235] as RGB,
  bgSoft: [249, 250, 251] as RGB,
  success: [22, 163, 74] as RGB,
  warn: [202, 138, 4] as RGB,
  danger: [220, 38, 38] as RGB,
  info: [37, 99, 235] as RGB,
};

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
  const CONTENT_W = W - M * 2;
  let y = 0;

  const setColor = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  const ensureSpace = (needed: number) => {
    if (y + needed > H - 70) {
      drawFooter();
      doc.addPage();
      y = M;
    }
  };

  const text = (
    txt: string,
    x: number,
    size = 10,
    weight: "normal" | "bold" = "normal",
    color: RGB = COLORS.body,
    maxW?: number
  ) => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(txt, maxW ?? CONTENT_W);
    for (const ln of lines) {
      ensureSpace(size * 1.35);
      doc.text(ln, x, y);
      y += size * 1.35;
    }
  };

  const sectionTitle = (label: string) => {
    ensureSpace(34);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(COLORS.brand);
    doc.text(label.toUpperCase(), M, y, { charSpace: 1.2 });
    y += 6;
    setDraw(COLORS.brand);
    doc.setLineWidth(1);
    doc.line(M, y, M + 36, y);
    setDraw(COLORS.rule);
    doc.setLineWidth(0.5);
    doc.line(M + 40, y, W - M, y);
    y += 14;
  };

  // ---------- Page 1 Header ----------
  setFill(COLORS.brand);
  doc.rect(0, 0, W, 110, "F");
  setFill(COLORS.brandDark);
  doc.rect(0, 100, W, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor([255, 255, 255]);
  doc.text("ADSENSE APPROVAL CHECKER", M, 42, { charSpace: 1.5 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Eligibility Audit Report", M, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString(), W - M, 42, { align: "right" });
  doc.text("Confidential", W - M, 72, { align: "right" });

  y = 138;

  // ---------- Site URL ----------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(COLORS.muted);
  doc.text("AUDITED WEBSITE", M, y, { charSpace: 1.2 });
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setColor(COLORS.ink);
  doc.text(websiteUrl, M, y);
  y += 22;

  // ---------- Verdict / Score Card ----------
  const verdictColor: RGB =
    audit?.verdict === "approved" ? COLORS.success
    : audit?.verdict === "likely" ? COLORS.info
    : audit?.verdict === "needs_work" ? COLORS.warn
    : audit?.verdict === "not_eligible" ? COLORS.danger
    : COLORS.brand;

  const cardH = 130;
  setFill(COLORS.bgSoft);
  setDraw(COLORS.rule);
  doc.setLineWidth(0.75);
  doc.roundedRect(M, y, CONTENT_W, cardH, 10, 10, "FD");

  // Left accent bar
  setFill(verdictColor);
  doc.roundedRect(M, y, 6, cardH, 3, 3, "F");
  doc.rect(M + 3, y, 4, cardH, "F");

  // Score column
  const colScoreX = M + 26;
  const colScoreW = 130;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor(COLORS.muted);
  doc.text("OVERALL SCORE", colScoreX, y + 22, { charSpace: 1 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(46);
  setColor(verdictColor);
  doc.text(`${overallScore}`, colScoreX, y + 70);
  doc.setFontSize(18);
  const scoreW = doc.getTextWidth(`${overallScore}`);
  doc.text("/100", colScoreX + scoreW + 4, y + 70);

  // Mini progress bar
  const barX = colScoreX;
  const barY = y + 86;
  const barW = colScoreW - 20;
  setFill([229, 231, 235]);
  doc.roundedRect(barX, barY, barW, 6, 3, 3, "F");
  setFill(verdictColor);
  const fillW = Math.max(4, (barW * Math.min(100, Math.max(0, overallScore))) / 100);
  doc.roundedRect(barX, barY, fillW, 6, 3, 3, "F");

  // Divider
  setDraw(COLORS.rule);
  doc.setLineWidth(0.5);
  doc.line(M + 26 + colScoreW, y + 18, M + 26 + colScoreW, y + cardH - 18);

  // Verdict column
  const colVerdictX = M + 26 + colScoreW + 18;
  const colVerdictW = CONTENT_W - (colScoreW + 26 + 18) - 140;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor(COLORS.muted);
  doc.text("VERDICT", colVerdictX, y + 22, { charSpace: 1 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setColor(verdictColor);
  doc.text(audit?.verdictLabel ?? "Pending", colVerdictX, y + 44);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setColor(COLORS.body);
  const reason = doc.splitTextToSize(audit?.verdictReason ?? "Run an audit to see the verdict.", colVerdictW);
  doc.text(reason.slice(0, 4), colVerdictX, y + 62, { lineHeightFactor: 1.4 });

  // Right column - approval probability
  const rightX = W - M - 130;
  setDraw(COLORS.rule);
  doc.line(rightX - 14, y + 18, rightX - 14, y + cardH - 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor(COLORS.muted);
  doc.text("APPROVAL PROBABILITY", rightX, y + 22, { charSpace: 1 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setColor(verdictColor);
  doc.text(`${audit?.approvalProbability ?? "—"}%`, rightX, y + 60);

  // AdSense pill
  const pillY = y + 86;
  const pillTxt = audit?.adsense.active
    ? "AdSense detected"
    : "No AdSense code";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const pillTxtW = doc.getTextWidth(pillTxt);
  const pillW = pillTxtW + 18;
  const pillBg: RGB = audit?.adsense.active ? COLORS.success : COLORS.muted;
  setFill(pillBg);
  doc.roundedRect(rightX, pillY, pillW, 16, 8, 8, "F");
  setColor([255, 255, 255]);
  doc.text(pillTxt, rightX + pillW / 2, pillY + 11, { align: "center" });

  if (audit?.adsense.publisherId) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(COLORS.muted);
    doc.text(audit.adsense.publisherId, rightX, pillY + 28);
  }

  y += cardH + 20;

  // ---------- Blockers ----------
  if (audit && audit.blockers.length > 0) {
    sectionTitle("Critical Blockers & Recommended Fixes");
    audit.blockers.forEach((b, i) => {
      ensureSpace(60);
      const boxY = y;
      setFill([254, 242, 242]);
      setDraw(COLORS.danger);
      doc.setLineWidth(0.4);
      const fixLines = doc.splitTextToSize(fixFor(b), CONTENT_W - 56);
      const blockerLines = doc.splitTextToSize(b, CONTENT_W - 56);
      const boxH = 22 + blockerLines.length * 13 + fixLines.length * 12 + 12;
      doc.roundedRect(M, boxY, CONTENT_W, boxH, 6, 6, "FD");

      // Number circle
      setFill(COLORS.danger);
      doc.circle(M + 20, boxY + 22, 11, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor([255, 255, 255]);
      doc.text(`${i + 1}`, M + 20, boxY + 26, { align: "center" });

      // Blocker
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      setColor(COLORS.danger);
      let ty = boxY + 18;
      blockerLines.forEach((ln: string) => {
        doc.text(ln, M + 40, ty);
        ty += 13;
      });

      // Fix
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(COLORS.muted);
      doc.text("RECOMMENDED FIX", M + 40, ty + 4, { charSpace: 1 });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setColor(COLORS.body);
      ty += 16;
      fixLines.forEach((ln: string) => {
        doc.text(ln, M + 40, ty);
        ty += 12;
      });

      y = boxY + boxH + 10;
    });
  }

  // ---------- Pages Crawled ----------
  if (audit?.fetchedUrls && audit.fetchedUrls.length > 0) {
    sectionTitle("Pages Crawled During Audit");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    audit.fetchedUrls.forEach((u) => {
      ensureSpace(14);
      setColor(COLORS.muted);
      doc.text("•", M + 4, y);
      setColor(COLORS.info);
      doc.text(u, M + 16, y);
      y += 14;
    });
    y += 4;
  }

  // ---------- Detailed Results ----------
  sectionTitle("Detailed Check Results");

  results.forEach((cat) => {
    ensureSpace(40);
    const pass = cat.checks.filter((c) => c.status === "pass").length;
    const total = cat.checks.length;

    // Category header bar
    setFill([243, 244, 246]);
    doc.roundedRect(M, y, CONTENT_W, 26, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(COLORS.ink);
    doc.text(cat.category, M + 12, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(COLORS.muted);
    doc.text(`${pass} / ${total} passed`, W - M - 12, y + 17, { align: "right" });
    y += 36;

    cat.checks.forEach((c) => {
      const color: RGB =
        c.status === "pass" ? COLORS.success : c.status === "fail" ? COLORS.danger : COLORS.warn;
      const label = c.status === "pass" ? "PASS" : c.status === "fail" ? "FAIL" : "WARN";

      const msgLines = doc.splitTextToSize(c.message, CONTENT_W - 70);
      const rowH = 16 + msgLines.length * 11 + 6;
      ensureSpace(rowH);

      // Status badge
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const badgeW = 36;
      setFill(color);
      doc.roundedRect(M + 4, y - 9, badgeW, 13, 3, 3, "F");
      setColor([255, 255, 255]);
      doc.text(label, M + 4 + badgeW / 2, y, { align: "center" });

      // Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setColor(COLORS.ink);
      doc.text(c.name, M + 4 + badgeW + 10, y);

      // Message
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(COLORS.body);
      let my = y + 12;
      msgLines.forEach((ln: string) => {
        doc.text(ln, M + 4 + badgeW + 10, my);
        my += 11;
      });

      y = my + 6;
      // separator
      setDraw([243, 244, 246]);
      doc.setLineWidth(0.4);
      doc.line(M + 4, y - 3, W - M - 4, y - 3);
    });
    y += 8;
  });

  // ---------- Footers ----------
  function drawFooter() {
    const pY = H - 36;
    setDraw(COLORS.rule);
    doc.setLineWidth(0.5);
    doc.line(M, pY, W - M, pY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(COLORS.muted);
    doc.text("AdSense Approval Checker", M, pY + 14);
    doc.text(websiteUrl, W / 2, pY + 14, { align: "center" });
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    drawFooter();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(COLORS.muted);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 22, { align: "right" });
  }

  const safe = websiteUrl.replace(/^https?:\/\//, "").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
  doc.save(`adsense-report-${safe}-${Date.now()}.pdf`);
}
