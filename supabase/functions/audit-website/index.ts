// Real AdSense eligibility audit – fetches the live site and runs deterministic checks
// against Google AdSense Program Policies (https://support.google.com/adsense/answer/48182)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Check {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  weight: number; // contribution to total score
}

interface CategoryResult {
  category: string;
  icon: "globe" | "lock" | "file" | "gauge";
  checks: Omit<Check, "weight">[];
}

function normaliseUrl(input: string): string {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u.replace(/\/+$/, "");
}

async function safeFetch(url: string, timeoutMs = 12000): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AdSenseApprovalChecker/1.0; +https://adsenseapprovalchecker.net/bot)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
    });
    clearTimeout(t);
    return res;
  } catch (e) {
    console.log("fetch failed", url, (e as Error).message);
    return null;
  }
}

function textBetween(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[1] : "";
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const POLICY_KEYWORDS = [
  "privacy policy", "privacy-policy", "privacypolicy",
];
const TERMS_KEYWORDS = ["terms of service", "terms and conditions", "terms-of-service", "/terms"];
const CONTACT_KEYWORDS = ["contact us", "contact-us", "/contact", "get in touch"];
const ABOUT_KEYWORDS = ["about us", "about-us", "/about"];
const DISCLAIMER_KEYWORDS = ["disclaimer", "/disclaimer"];

const PROHIBITED_PATTERNS = [
  /\b(porn|xxx|escort|sexcam)\b/i,
  /\b(buy\s+(cocaine|weed|cannabis|mdma))\b/i,
  /\b(crack(ed)?\s+(software|games)|warez|nulled|keygen|torrents?)\b/i,
  /\b(hack(ing)?\s+tutorial|ddos\s+tool)\b/i,
];

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    try {
      const body = await req.json().catch(() => ({}));
      const rawUrl: string = body?.url || "";
      if (!rawUrl || typeof rawUrl !== "string") {
        return json({ error: "Provide a website URL" }, 400);
      }
      const url = normaliseUrl(rawUrl);
      const origin = new URL(url).origin;

      // Fetch homepage
      const homepageRes = await safeFetch(url);
      if (!homepageRes || !homepageRes.ok) {
        return json({
          error: `Could not reach ${url} (status ${homepageRes?.status ?? "n/a"}). Make sure the site is public.`,
        }, 400);
      }
      const html = await homepageRes.text();
      const lower = html.toLowerCase();
      const visibleText = stripTags(html);
      const wordCount = visibleText.split(/\s+/).filter(Boolean).length;

      // Parallel auxiliary fetches
      const [robotsRes, sitemapRes, adstxtRes] = await Promise.all([
        safeFetch(`${origin}/robots.txt`, 6000),
        safeFetch(`${origin}/sitemap.xml`, 6000),
        safeFetch(`${origin}/ads.txt`, 6000),
      ]);
      const robotsTxt = robotsRes && robotsRes.ok ? await robotsRes.text() : "";
      const hasSitemap = !!(sitemapRes && sitemapRes.ok);
      const adsTxt = adstxtRes && adstxtRes.ok ? await adstxtRes.text() : "";

      // ===== AdSense detection =====
      const pubMatch = html.match(/ca-pub-\d{10,20}/i);
      const hasAdsbygoogleScript = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html);
      const hasAdsbygoogleIns = /<ins[^>]+adsbygoogle/i.test(html);
      const adsTxtHasGoogle = /google\.com,\s*pub-\d+/i.test(adsTxt);
      const adsenseActive = !!pubMatch || hasAdsbygoogleScript || hasAdsbygoogleIns || adsTxtHasGoogle;
      const publisherId = pubMatch?.[0] ?? (adsTxt.match(/pub-\d+/i)?.[0] ?? null);

      // ===== Meta / SEO =====
      const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i).trim();
      const metaDescription = textBetween(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
      const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
      const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
      const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
      const structuredData = /application\/ld\+json/i.test(html);
      const lang = /<html[^>]+lang=/i.test(html);

      // ===== Security =====
      const isHttps = url.startsWith("https://");
      const hsts = !!homepageRes.headers.get("strict-transport-security");
      const xfo = !!homepageRes.headers.get("x-frame-options");
      const csp = !!homepageRes.headers.get("content-security-policy");
      const finalUrl = homepageRes.url;
      const httpsRedirect = isHttps && finalUrl.startsWith("https://");

      // ===== Legal pages =====
      const hasPrivacy = POLICY_KEYWORDS.some((k) => lower.includes(k));
      const hasTerms = TERMS_KEYWORDS.some((k) => lower.includes(k));
      const hasContact = CONTACT_KEYWORDS.some((k) => lower.includes(k));
      const hasAbout = ABOUT_KEYWORDS.some((k) => lower.includes(k));
      const hasDisclaimer = DISCLAIMER_KEYWORDS.some((k) => lower.includes(k));
      const hasCookieNotice = /cookie|consent/i.test(lower);

      // ===== Content policy =====
      const prohibited = PROHIBITED_PATTERNS.find((re) => re.test(visibleText));

      // ===== Performance =====
      const htmlBytes = new TextEncoder().encode(html).length;
      const imgCount = (html.match(/<img\b/gi) || []).length;
      const lazyImgs = (html.match(/loading=["']lazy["']/gi) || []).length;
      const fastHtml = htmlBytes < 400_000;

      // ===== Robots =====
      const robotsAllows = !robotsTxt || !/User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robotsTxt);
      const adsbotAllowed = !/User-agent:\s*Mediapartners-Google[\s\S]*?Disallow:\s*\//i.test(robotsTxt);

      // ---------- Build categories with weights ----------
      const all: { cat: CategoryResult; weights: number[] }[] = [];

      // Domain & basics
      all.push(makeCategory("Domain & Reachability", "globe", [
        ck("Site reachable", "pass", `Homepage returned HTTP ${homepageRes.status}`, 3),
        ck("Valid TLD", "pass", `Domain ${new URL(url).hostname} is publicly resolvable`, 2),
        ck("HTML language attribute", lang ? "pass" : "warning",
           lang ? "<html lang> attribute is set" : "Add a lang attribute to <html> for accessibility", 1),
      ]));

      // Security
      all.push(makeCategory("Security & Trust", "lock", [
        ck("HTTPS / SSL", isHttps ? "pass" : "fail",
           isHttps ? "Site is served over HTTPS" : "AdSense requires HTTPS. Install an SSL certificate.", 5),
        ck("HTTPS redirect", httpsRedirect ? "pass" : "warning",
           httpsRedirect ? "HTTP requests resolve to HTTPS" : "Ensure http:// requests redirect to https://", 2),
        ck("HSTS header", hsts ? "pass" : "warning",
           hsts ? "Strict-Transport-Security header present" : "Add HSTS header for stronger transport security", 1),
        ck("Clickjacking protection", xfo || csp ? "pass" : "warning",
           xfo || csp ? "X-Frame-Options or CSP detected" : "Add X-Frame-Options or frame-ancestors directive", 1),
      ]));

      // Content
      all.push(makeCategory("Content Quality", "file", [
        ck("Homepage word count",
           wordCount >= 300 ? "pass" : wordCount >= 120 ? "warning" : "fail",
           `Homepage has ~${wordCount} visible words ${wordCount < 300 ? "(aim for 300+ on key pages)" : ""}`.trim(),
           4),
        ck("Title tag",
           title.length >= 20 && title.length <= 65 ? "pass" : title ? "warning" : "fail",
           title ? `Title: "${title.slice(0, 80)}" (${title.length} chars)` : "Missing <title> tag", 3),
        ck("Meta description",
           metaDescription.length >= 80 && metaDescription.length <= 170 ? "pass" : metaDescription ? "warning" : "fail",
           metaDescription ? `${metaDescription.length} chars` : "Missing meta description", 2),
        ck("Single H1", h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
           `Found ${h1Count} H1 tags (recommended: exactly 1)`, 2),
        ck("Original-content policy",
           prohibited ? "fail" : "pass",
           prohibited ? `Possibly prohibited content detected: "${prohibited.source}"` : "No prohibited keywords detected on homepage", 4),
      ]));

      // SEO
      all.push(makeCategory("SEO Architecture", "globe", [
        ck("Viewport meta", viewport ? "pass" : "fail",
           viewport ? "Mobile viewport meta is set" : "Add <meta name='viewport'> for mobile responsiveness", 2),
        ck("Canonical tag", canonical ? "pass" : "warning",
           canonical ? "Canonical tag present" : "Add a rel='canonical' link", 1),
        ck("Open Graph metadata", ogTitle ? "pass" : "warning",
           ogTitle ? "og:title detected" : "Add Open Graph tags for social previews", 1),
        ck("Structured data", structuredData ? "pass" : "warning",
           structuredData ? "JSON-LD structured data present" : "Consider adding JSON-LD schema", 1),
        ck("Sitemap.xml", hasSitemap ? "pass" : "warning",
           hasSitemap ? `Sitemap found at ${origin}/sitemap.xml` : "Add /sitemap.xml for better indexing", 2),
        ck("Robots.txt allows crawlers", robotsAllows ? "pass" : "fail",
           robotsAllows ? "robots.txt allows public crawling" : "robots.txt blocks all crawlers — Google can't index your site", 3),
        ck("Mediapartners-Google allowed", adsbotAllowed ? "pass" : "fail",
           adsbotAllowed ? "AdSense crawler is not blocked" : "robots.txt blocks the AdSense crawler", 2),
      ]));

      // Legal
      all.push(makeCategory("Legal & Policy Pages", "file", [
        ck("Privacy Policy", hasPrivacy ? "pass" : "fail",
           hasPrivacy ? "Privacy Policy link detected" : "AdSense REQUIRES a Privacy Policy page", 5),
        ck("Terms / Conditions", hasTerms ? "pass" : "warning",
           hasTerms ? "Terms page detected" : "Add a Terms of Service / Conditions page", 2),
        ck("Contact page", hasContact ? "pass" : "fail",
           hasContact ? "Contact link detected" : "Add a Contact page — required for credibility", 3),
        ck("About page", hasAbout ? "pass" : "warning",
           hasAbout ? "About page detected" : "Add an About page describing the site owner", 2),
        ck("Disclaimer", hasDisclaimer ? "pass" : "warning",
           hasDisclaimer ? "Disclaimer detected" : "Add a Disclaimer page (recommended)", 1),
        ck("Cookie / consent notice", hasCookieNotice ? "pass" : "warning",
           hasCookieNotice ? "Cookie or consent text found" : "Add a cookie consent banner (GDPR/AdSense)", 2),
      ]));

      // Performance
      all.push(makeCategory("Performance", "gauge", [
        ck("HTML payload size", fastHtml ? "pass" : "warning",
           `Homepage HTML is ${(htmlBytes / 1024).toFixed(0)} KB ${fastHtml ? "" : "(consider trimming)"}`.trim(), 2),
        ck("Image lazy-loading",
           imgCount === 0 ? "warning" : lazyImgs / imgCount > 0.5 ? "pass" : "warning",
           `${lazyImgs}/${imgCount} images use loading="lazy"`, 1),
        ck("Compression",
           homepageRes.headers.get("content-encoding") ? "pass" : "warning",
           homepageRes.headers.get("content-encoding")
             ? `Encoded with ${homepageRes.headers.get("content-encoding")}`
             : "Enable gzip/brotli compression", 1),
      ]));

      // AdSense status
      all.push(makeCategory("AdSense Status", "gauge", [
        ck("AdSense code on site",
           adsenseActive ? "pass" : "warning",
           adsenseActive
             ? `AdSense code detected${publisherId ? ` (${publisherId})` : ""} — site appears to already run AdSense`
             : "No AdSense code (adsbygoogle.js / ca-pub-…) detected on homepage",
           2),
        ck("ads.txt present", adsTxt ? "pass" : "warning",
           adsTxt ? `/ads.txt found${adsTxtHasGoogle ? " (lists Google)" : ""}` : "Add /ads.txt once approved (Google requires it)", 1),
      ]));

      // ---- Score ----
      let earned = 0, max = 0;
      for (const { weights } of all) {
        const checks = all.find((x) => x.weights === weights)!.cat.checks;
        checks.forEach((c, i) => {
          const w = weights[i];
          max += w;
          if (c.status === "pass") earned += w;
          else if (c.status === "warning") earned += w * 0.5;
        });
      }
      const score = Math.round((earned / max) * 100);

      // Hard blockers determine verdict regardless of score
      const blockers: string[] = [];
      if (!isHttps) blockers.push("No HTTPS");
      if (!hasPrivacy) blockers.push("No Privacy Policy");
      if (!hasContact) blockers.push("No Contact page");
      if (!robotsAllows) blockers.push("robots.txt blocks crawlers");
      if (prohibited) blockers.push("Possible prohibited content");
      if (wordCount < 120) blockers.push("Very thin content on homepage");

      let verdict: "approved" | "likely" | "needs_work" | "not_eligible";
      let verdictLabel: string;
      let verdictReason: string;

      if (blockers.length >= 2) {
        verdict = "not_eligible";
        verdictLabel = "Not eligible yet";
        verdictReason = `Fix these blockers first: ${blockers.join(", ")}.`;
      } else if (blockers.length === 1) {
        verdict = "needs_work";
        verdictLabel = "Needs work";
        verdictReason = `One critical blocker: ${blockers[0]}. Resolve it before applying.`;
      } else if (score >= 85) {
        verdict = "approved";
        verdictLabel = "High approval probability";
        verdictReason = "Your site meets the main AdSense Program Policies. You can apply with confidence.";
      } else if (score >= 70) {
        verdict = "likely";
        verdictLabel = "Likely approved";
        verdictReason = "Address the warnings below to maximise approval probability.";
      } else {
        verdict = "needs_work";
        verdictLabel = "Needs work";
        verdictReason = "Resolve the failed checks and re-run before applying.";
      }

      const probability =
        verdict === "not_eligible" ? Math.min(score, 25) :
        verdict === "needs_work" ? Math.min(score, 55) :
        verdict === "likely" ? Math.max(score, 72) :
        Math.max(score, 88);

      return json({
        url,
        score,
        approvalProbability: probability,
        verdict,
        verdictLabel,
        verdictReason,
        adsense: {
          active: adsenseActive,
          publisherId,
          adsTxt: !!adsTxt,
        },
        blockers,
        wordCount,
        results: all.map((x) => x.cat),
      });
    } catch (e) {
      console.error(e);
      return json({ error: (e as Error).message }, 500);
    }
  });
}

function ck(name: string, status: Check["status"], message: string, weight: number): Check {
  return { name, status, message, weight };
}
function makeCategory(
  category: string,
  icon: CategoryResult["icon"],
  checks: Check[],
): { cat: CategoryResult; weights: number[] } {
  return {
    cat: {
      category,
      icon,
      checks: checks.map(({ weight: _w, ...rest }) => rest),
    },
    weights: checks.map((c) => c.weight),
  };
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
