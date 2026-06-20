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

export interface PdfTheme {
  brand?: RGB;
  brandDark?: RGB;
  companyName?: string;
  productName?: string;
  logoDataUrl?: string; // PNG/JPG data URL
  footerNote?: string;
}

const DEFAULT_THEME: Required<Omit<PdfTheme, "logoDataUrl">> = {
  brand: [79, 70, 229],
  brandDark: [55, 48, 163],
  companyName: "AdSense Approval Checker",
  productName: "Eligibility Audit Report",
  footerNote: "Confidential — generated report",
};

const BASE_COLORS = {
  ink: [17, 24, 39] as RGB,
  body: [55, 65, 81] as RGB,
  muted: [107, 114, 128] as RGB,
  rule: [229, 231, 235] as RGB,
  bgSoft: [249, 250, 251] as RGB,
  success: [22, 163, 74] as RGB,
  warn: [202, 138, 4] as RGB,
  danger: [220, 38, 38] as RGB,
  info: [37, 99, 235] as RGB,
  white: [255, 255, 255] as RGB,
};

export function generatePdfReport(opts: {
  websiteUrl: string;
  overallScore: number;
  results: CheckResult[];
  audit?: AuditMeta & { fetchedUrls?: string[] };
  theme?: PdfTheme;
  pageSize?: "a4" | "letter";
}) {
  const { websiteUrl, overallScore, results, audit } = opts;
  const theme = { ...DEFAULT_THEME, ...(opts.theme ?? {}) };
  const pageSize = opts.pageSize ?? "a4";

  const doc = new jsPDF({ unit: "pt", format: pageSize });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Print-safe margins (~0.6in left/right, 0.75in top/bottom)
  const M = { left: 48, right: 48, top: 56, bottom: 64 };
  const CONTENT_W = W - M.left - M.right;
  const CONTENT_BOTTOM = H - M.bottom;

  let y = M.top;
  let isCoverPage = true;

  const setColor = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  const drawPageHeader = () => {
    if (isCoverPage) return;
    // Slim brand bar
    setFill(theme.brand);
    doc.rect(0, 0, W, 4, "F");

    // Logo or initial
    const headerY = 24;
    if (theme.logoDataUrl) {
      try {
        doc.addImage(theme.logoDataUrl, "PNG", M.left, headerY - 10, 22, 22);
      } catch {
        // ignore bad image
      }
    } else {
      setFill(theme.brand);
      doc.roundedRect(M.left, headerY - 10, 22, 22, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      setColor(BASE_COLORS.white);
      doc.text(theme.companyName.charAt(0).toUpperCase(), M.left + 11, headerY + 5, { align: "center" });
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(BASE_COLORS.ink);
    doc.text(theme.companyName, M.left + 30, headerY + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(BASE_COLORS.muted);
    doc.text(theme.productName, M.left + 30, headerY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(BASE_COLORS.muted);
    doc.text(websiteUrl, W - M.right, headerY + 2, { align: "right" });
    doc.text(new Date().toLocaleDateString(), W - M.right, headerY + 14, { align: "right" });

    setDraw(BASE_COLORS.rule);
    doc.setLineWidth(0.5);
    doc.line(M.left, 48, W - M.right, 48);
  };

  const drawPageFooter = (pageNum: number, totalPages: number) => {
    const fy = H - 32;
    setDraw(BASE_COLORS.rule);
    doc.setLineWidth(0.5);
    doc.line(M.left, fy, W - M.right, fy);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(BASE_COLORS.muted);
    doc.text(theme.companyName, M.left, fy + 14);
    doc.text(theme.footerNote, W / 2, fy + 14, { align: "center" });
    doc.text(`Page ${pageNum} of ${totalPages}`, W - M.right, fy + 14, { align: "right" });
  };

  const newPage = () => {
    doc.addPage();
    isCoverPage = false;
    drawPageHeader();
    y = 68; // below header
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > CONTENT_BOTTOM) newPage();
  };

  const text = (
    txt: string,
    x: number,
    size = 10,
    weight: "normal" | "bold" = "normal",
    color: RGB = BASE_COLORS.body,
    maxW?: number
  ) => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(txt, maxW ?? CONTENT_W);
    const lh = size * 1.4;
    for (const ln of lines) {
      ensureSpace(lh);
      doc.text(ln, x, y);
      y += lh;
    }
  };

  const sectionTitle = (label: string) => {
    ensureSpace(40);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(theme.brand);
    doc.text(label.toUpperCase(), M.left, y, { charSpace: 1.2 });
    y += 8;
    setDraw(theme.brand);
    doc.setLineWidth(1.2);
    doc.line(M.left, y, M.left + 36, y);
    setDraw(BASE_COLORS.rule);
    doc.setLineWidth(0.5);
    doc.line(M.left + 40, y, W - M.right, y);
    y += 16;
  };

  const verdictColor: RGB =
    audit?.verdict === "approved" ? BASE_COLORS.success
    : audit?.verdict === "likely" ? BASE_COLORS.info
    : audit?.verdict === "needs_work" ? BASE_COLORS.warn
    : audit?.verdict === "not_eligible" ? BASE_COLORS.danger
    : theme.brand;

  // ========================================================
  // COVER PAGE
  // ========================================================
  setFill(theme.brand);
  doc.rect(0, 0, W, H * 0.42, "F");
  setFill(theme.brandDark);
  doc.rect(0, H * 0.42 - 8, W, 8, "F");

  // Logo / brand badge
  const coverHeaderY = M.top + 8;
  if (theme.logoDataUrl) {
    try {
      doc.addImage(theme.logoDataUrl, "PNG", M.left, coverHeaderY, 40, 40);
    } catch {
      // ignore
    }
  } else {
    setFill(BASE_COLORS.white);
    doc.roundedRect(M.left, coverHeaderY, 40, 40, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    setColor(theme.brand);
    doc.text(theme.companyName.charAt(0).toUpperCase(), M.left + 20, coverHeaderY + 27, { align: "center" });
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setColor(BASE_COLORS.white);
  doc.text(theme.companyName.toUpperCase(), M.left + 52, coverHeaderY + 18, { charSpace: 1.5 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(theme.productName, M.left + 52, coverHeaderY + 33);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  setColor(BASE_COLORS.white);
  doc.text("AdSense Eligibility", M.left, H * 0.42 - 70);
  doc.text("Audit Report", M.left, H * 0.42 - 34);

  // Cover card
  const cardX = M.left;
  const cardY = H * 0.42 + 28;
  const cardW = CONTENT_W;
  const cardH = 230;
  setFill(BASE_COLORS.white);
  setDraw(BASE_COLORS.rule);
  doc.setLineWidth(0.75);
  doc.roundedRect(cardX, cardY, cardW, cardH, 12, 12, "FD");
  // accent stripe
  setFill(verdictColor);
  doc.roundedRect(cardX, cardY, cardW, 6, 12, 12, "F");
  doc.rect(cardX, cardY + 4, cardW, 4, "F");

  let cy = cardY + 32;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(BASE_COLORS.muted);
  doc.text("TESTED WEBSITE", cardX + 24, cy, { charSpace: 1.1 });
  cy += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setColor(BASE_COLORS.ink);
  const urlLines = doc.splitTextToSize(websiteUrl, cardW - 48);
  doc.text(urlLines.slice(0, 2), cardX + 24, cy);
  cy += urlLines.length > 1 ? 36 : 22;

  // Two columns: Verdict + Score
  const colW = (cardW - 48 - 24) / 2;
  // Verdict
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(BASE_COLORS.muted);
  doc.text("VERDICT", cardX + 24, cy, { charSpace: 1.1 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setColor(verdictColor);
  doc.text(audit?.verdictLabel ?? "Pending", cardX + 24, cy + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setColor(BASE_COLORS.body);
  const reason = doc.splitTextToSize(audit?.verdictReason ?? "Run an audit to view a verdict.", colW);
  doc.text(reason.slice(0, 3), cardX + 24, cy + 40, { lineHeightFactor: 1.4 });

  // Score
  const scoreColX = cardX + 24 + colW + 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(BASE_COLORS.muted);
  doc.text("OVERALL SCORE", scoreColX, cy, { charSpace: 1.1 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  setColor(verdictColor);
  doc.text(`${overallScore}`, scoreColX, cy + 36);
  const sw = doc.getTextWidth(`${overallScore}`);
  doc.setFontSize(14);
  setColor(BASE_COLORS.muted);
  doc.text("/100", scoreColX + sw + 6, cy + 36);
  // progress bar
  const pbY = cy + 52;
  setFill([229, 231, 235]);
  doc.roundedRect(scoreColX, pbY, colW, 6, 3, 3, "F");
  setFill(verdictColor);
  const fillW = Math.max(4, (colW * Math.min(100, Math.max(0, overallScore))) / 100);
  doc.roundedRect(scoreColX, pbY, fillW, 6, 3, 3, "F");
  // approval %
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(BASE_COLORS.muted);
  doc.text(`Approval probability: ${audit?.approvalProbability ?? "—"}%`, scoreColX, pbY + 20);

  // meta strip bottom of card
  setDraw(BASE_COLORS.rule);
  doc.setLineWidth(0.5);
  doc.line(cardX + 24, cardY + cardH - 44, cardX + cardW - 24, cardY + cardH - 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(BASE_COLORS.muted);
  doc.text("GENERATED", cardX + 24, cardY + cardH - 26, { charSpace: 1.1 });
  doc.text("ADSENSE STATUS", cardX + 24 + colW + 24, cardY + cardH - 26, { charSpace: 1.1 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(BASE_COLORS.ink);
  doc.text(new Date().toLocaleString(), cardX + 24, cardY + cardH - 12);
  const adsTxt = audit?.adsense.active ? "Detected on site" : "Not detected";
  setColor(audit?.adsense.active ? BASE_COLORS.success : BASE_COLORS.muted);
  doc.text(adsTxt, cardX + 24 + colW + 24, cardY + cardH - 12);

  // Cover footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(BASE_COLORS.muted);
  doc.text(theme.footerNote, M.left, H - 40);
  doc.text(theme.companyName, W - M.right, H - 40, { align: "right" });

  // ========================================================
  // CONTENT PAGES
  // ========================================================
  newPage();

  // Executive Summary
  sectionTitle("Executive Summary");
  text(
    audit?.verdictReason ??
      "This report summarizes the AdSense eligibility checks performed against your website, including content quality, policy pages, technical readiness and crawl accessibility.",
    M.left,
    10.5,
    "normal",
    BASE_COLORS.body
  );
  y += 4;

  // Blockers
  if (audit && audit.blockers.length > 0) {
    sectionTitle("Critical Blockers & Recommended Fixes");
    audit.blockers.forEach((b, i) => {
      const blockerLines = doc.splitTextToSize(b, CONTENT_W - 60);
      const fixLines = doc.splitTextToSize(fixFor(b), CONTENT_W - 60);
      const boxH = 24 + blockerLines.length * 13 + 18 + fixLines.length * 12 + 14;
      ensureSpace(boxH + 10);
      const boxY = y;
      setFill([254, 242, 242]);
      setDraw(BASE_COLORS.danger);
      doc.setLineWidth(0.5);
      doc.roundedRect(M.left, boxY, CONTENT_W, boxH, 8, 8, "FD");

      setFill(BASE_COLORS.danger);
      doc.circle(M.left + 22, boxY + 24, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(BASE_COLORS.white);
      doc.text(`${i + 1}`, M.left + 22, boxY + 28, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      setColor(BASE_COLORS.danger);
      let ty = boxY + 20;
      blockerLines.forEach((ln: string) => {
        doc.text(ln, M.left + 44, ty);
        ty += 13;
      });

      ty += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(BASE_COLORS.muted);
      doc.text("RECOMMENDED FIX", M.left + 44, ty, { charSpace: 1 });
      ty += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setColor(BASE_COLORS.body);
      fixLines.forEach((ln: string) => {
        doc.text(ln, M.left + 44, ty);
        ty += 12;
      });

      y = boxY + boxH + 12;
    });
  }

  // Pages crawled
  if (audit?.fetchedUrls && audit.fetchedUrls.length > 0) {
    sectionTitle("Pages Crawled During Audit");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    audit.fetchedUrls.forEach((u) => {
      const lines = doc.splitTextToSize(u, CONTENT_W - 20);
      ensureSpace(lines.length * 13 + 2);
      setColor(BASE_COLORS.muted);
      doc.text("•", M.left + 4, y);
      setColor(BASE_COLORS.info);
      lines.forEach((ln: string, idx: number) => {
        doc.text(ln, M.left + 16, y);
        y += 13;
        if (idx < lines.length - 1) ensureSpace(13);
      });
    });
    y += 6;
  }

  // Detailed results
  sectionTitle("Detailed Check Results");
  results.forEach((cat) => {
    const pass = cat.checks.filter((c) => c.status === "pass").length;
    const total = cat.checks.length;
    ensureSpace(46);

    setFill([243, 244, 246]);
    doc.roundedRect(M.left, y, CONTENT_W, 28, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(BASE_COLORS.ink);
    doc.text(cat.category, M.left + 14, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(BASE_COLORS.muted);
    doc.text(`${pass} / ${total} passed`, W - M.right - 14, y + 18, { align: "right" });
    y += 38;

    cat.checks.forEach((c) => {
      const color: RGB =
        c.status === "pass" ? BASE_COLORS.success : c.status === "fail" ? BASE_COLORS.danger : BASE_COLORS.warn;
      const label = c.status === "pass" ? "PASS" : c.status === "fail" ? "FAIL" : "WARN";
      const msgLines = doc.splitTextToSize(c.message, CONTENT_W - 80);
      const rowH = 18 + msgLines.length * 12 + 10;
      ensureSpace(rowH);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const badgeW = 40;
      setFill(color);
      doc.roundedRect(M.left + 4, y - 10, badgeW, 14, 4, 4, "F");
      setColor(BASE_COLORS.white);
      doc.text(label, M.left + 4 + badgeW / 2, y, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setColor(BASE_COLORS.ink);
      doc.text(c.name, M.left + 4 + badgeW + 12, y, { maxWidth: CONTENT_W - badgeW - 16 });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(BASE_COLORS.body);
      let my = y + 14;
      msgLines.forEach((ln: string) => {
        doc.text(ln, M.left + 4 + badgeW + 12, my);
        my += 12;
      });

      y = my + 8;
      setDraw([243, 244, 246]);
      doc.setLineWidth(0.4);
      doc.line(M.left + 4, y - 4, W - M.right - 4, y - 4);
    });
    y += 10;
  });

  // ========================================================
  // Stamp footers/page numbers on every page
  // ========================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i === 1) {
      // Cover already has its own footer; add discreet page indicator
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(BASE_COLORS.muted);
      doc.text(`Page ${i} of ${totalPages}`, W / 2, H - 24, { align: "center" });
    } else {
      drawPageFooter(i, totalPages);
    }
  }

  const safe = websiteUrl.replace(/^https?:\/\//, "").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
  doc.save(`adsense-report-${safe}-${Date.now()}.pdf`);
}
