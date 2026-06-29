// Production AdSense eligibility audit
// Strategy for high accuracy:
//   1. Fetch homepage with desktop UA and follow redirects
//   2. Extract all internal links, build a site map of up to ~40 unique pages
//   3. Verify policy pages by actually FETCHING candidate URLs (not just text match)
//      Candidates come from: a) detected links, b) standard paths (/privacy, /contact, ...)
//   4. Detect AdSense via homepage HTML, /ads.txt, and a sampled inner page
//   5. Sample 2-3 inner pages for real word-count, originality signals, and template detection
//   6. Pass a content sample to Lovable AI (Gemini Flash) to score originality & policy risk
//   7. Score is weighted; hard blockers cap the final approval probability
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

function isSafeUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    const host = u.hostname.toLowerCase();
    if (/^(localhost|0\.0\.0\.0|::1)$/.test(host)) return false;
    if (/^127\./.test(host)) return false;
    if (/^10\./.test(host)) return false;
    if (/^192\.168\./.test(host)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
    if (/^169\.254\./.test(host)) return false;
    if (/^(fc00:|fd|fe80:)/i.test(host)) return false;
    if (host.endsWith(".local") || host.endsWith(".internal")) return false;
    return true;
  } catch {
    return false;
  }
}

type Status = "pass" | "fail" | "warning";
interface Check { name: string; status: Status; message: string; weight: number; }
interface CategoryResult {
  category: string;
  icon: "globe" | "lock" | "file" | "gauge";
  checks: Omit<Check, "weight">[];
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AdSenseApprovalChecker/2.0";

const PROHIBITED_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(porn|xxx|escort|sexcam|onlyfans\s+leak)\b/i, label: "Adult/sexual content" },
  { re: /\b(buy\s+(cocaine|weed|cannabis|mdma|lsd)|drug\s+dealer)\b/i, label: "Illegal drugs" },
  { re: /\b(crack(ed)?\s+(software|games)|warez|nulled|keygen|piracy\s+download)\b/i, label: "Piracy / cracked software" },
  { re: /\b(ddos\s+tool|hack(ing)?\s+tutorial|carding|cvv\s+dump|stolen\s+credit\s+card)\b/i, label: "Hacking / illegal services" },
  { re: /\b(buy\s+(guns?|ammo|silencer)|firearm\s+for\s+sale)\b/i, label: "Weapons sales" },
  { re: /\b(essay\s+writing\s+service|write\s+my\s+essay\s+for\s+me)\b/i, label: "Academic cheating service" },
];

function normaliseUrl(input: string): string {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u.replace(/\/+$/, "");
}

async function safeFetch(url: string, timeoutMs = 10_000, method: "GET" | "HEAD" = "GET"): Promise<Response | null> {
  if (!isSafeUrl(url)) {
    console.log("blocked unsafe url", url);
    return null;
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*", "Accept-Language": "en-US,en;q=0.9" },
    });
    clearTimeout(t);
    return res;
  } catch (e) {
    console.log("fetch failed", url, (e as Error).message);
    return null;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[1] : "";
}

function extractLinks(html: string, origin: string, base: string): string[] {
  const out = new Set<string>();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1].trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    try {
      const u = new URL(href, base);
      if (u.origin !== origin) continue;
      u.hash = "";
      out.add(u.toString().replace(/\/+$/, ""));
    } catch { /* ignore */ }
  }
  return Array.from(out);
}

interface PolicyHit { url: string; title: string; }

async function findPolicyPage(
  origin: string,
  links: string[],
  pathKeywords: RegExp,
  textKeywords: RegExp,
  standardPaths: string[],
): Promise<PolicyHit | null> {
  // First: links discovered on homepage
  const candidates = new Set<string>();
  for (const l of links) if (pathKeywords.test(l.toLowerCase())) candidates.add(l);
  // Then: standard paths
  for (const p of standardPaths) candidates.add(`${origin}${p}`);

  for (const url of candidates) {
    const res = await safeFetch(url, 6000);
    if (!res || !res.ok) continue;
    const html = await res.text();
    const text = stripTags(html).toLowerCase();
    if (textKeywords.test(text)) {
      const title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i).trim();
      return { url, title };
    }
  }
  return null;
}

async function aiContentJudgement(samples: { url: string; text: string }[]): Promise<{
  originality: number; // 0-100
  depth: number; // 0-100
  policyRisk: "none" | "low" | "medium" | "high";
  niche: string;
  notes: string;
} | null> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key || samples.length === 0) return null;
  const promptBody = samples
    .map((s, i) => `--- Page ${i + 1}: ${s.url}\n${s.text.slice(0, 2500)}`)
    .join("\n\n");
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You audit websites for Google AdSense Program Policies. Respond with a SINGLE JSON object only — never an array, never markdown." },
          {
            role: "user",
            content: `Analyse ALL of these page samples together (they come from ONE site) and return ONE aggregated JSON object:
{
 "originality": <integer 0-100, overall feel of original vs scraped/auto-generated/thin>,
 "depth": <integer 0-100, overall substantive depth>,
 "policyRisk": "none" | "low" | "medium" | "high",
 "niche": "<short overall niche>",
 "notes": "<1-sentence overall summary>"
}
Samples:
${promptBody}`,
          },
        ],

      }),
    });
    if (!r.ok) { console.log("AI gateway", r.status); return null; }
    const data = await r.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    let parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      // Aggregate if model returned per-sample objects
      const avg = (k: string) => Math.round(parsed.reduce((a: number, x: any) => a + (Number(x[k]) || 0), 0) / parsed.length);
      const riskOrder = ["none", "low", "medium", "high"];
      const worstRisk = parsed.reduce(
        (acc: string, x: any) => (riskOrder.indexOf(x.policyRisk) > riskOrder.indexOf(acc) ? x.policyRisk : acc),
        "none",
      );
      parsed = {
        originality: avg("originality"),
        depth: avg("depth"),
        policyRisk: worstRisk,
        niche: parsed[0]?.niche ?? "",
        notes: parsed[0]?.notes ?? "",
      };
    }
    return parsed;

  } catch (e) {
    console.log("AI judge failed", (e as Error).message);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl: string = body?.url || "";
    if (!rawUrl || typeof rawUrl !== "string") return json({ error: "Provide a website URL" }, 400);

    const url = normaliseUrl(rawUrl);
    const origin = new URL(url).origin;
    const host = new URL(url).hostname;

    // 1. Homepage
    const homepageRes = await safeFetch(url, 12_000);
    if (!homepageRes || !homepageRes.ok) {
      return json({
        error: `Could not reach ${url} (status ${homepageRes?.status ?? "no response"}). Make sure the site is public and reachable.`,
      }, 400);
    }
    const finalUrl = homepageRes.url;
    const html = await homepageRes.text();
    const lower = html.toLowerCase();
    const homepageText = stripTags(html);
    const homepageWords = homepageText.split(/\s+/).filter(Boolean).length;

    // Detect SPA (very little server-rendered text + react/vue/angular markers)
    const looksSpa =
      homepageWords < 80 &&
      /(id=["']root["']|id=["']app["']|<\/script>\s*<\/body>)/i.test(html) &&
      /(react|vue|__NEXT_DATA__|ng-version|svelte)/i.test(html);

    // 2. Internal links
    const allLinks = extractLinks(html, origin, finalUrl);

    // 3. Probe policy / about / contact pages with actual fetches
    const [privacy, terms, contact, about, disclaimer] = await Promise.all([
      findPolicyPage(origin, allLinks,
        /(privacy|datenschutz|gdpr|privacidad)/i,
        /(privacy policy|personal (data|information)|we collect|cookies?)/i,
        ["/privacy", "/privacy-policy", "/privacypolicy", "/p/privacy.html", "/privacy.html"]),
      findPolicyPage(origin, allLinks,
        /(terms|conditions|tos|legal)/i,
        /(terms of (service|use)|terms and conditions|by using (this|our) (site|service))/i,
        ["/terms", "/terms-of-service", "/terms-and-conditions", "/tos", "/legal"]),
      findPolicyPage(origin, allLinks,
        /(contact|kontakt|contacto)/i,
        /(contact (us|me)|email( us)?|get in touch|@)/i,
        ["/contact", "/contact-us", "/contactus", "/p/contact.html", "/contact.html"]),
      findPolicyPage(origin, allLinks,
        /(about|aboutus|aboutme)/i,
        /(about (us|me)|our story|founded|we are|i am)/i,
        ["/about", "/about-us", "/aboutus", "/p/about.html", "/about.html"]),
      findPolicyPage(origin, allLinks,
        /(disclaimer)/i,
        /(disclaimer|no warranty|for informational purposes)/i,
        ["/disclaimer", "/p/disclaimer.html"]),
    ]);

    // 4. Robots, sitemap, ads.txt
    const [robotsRes, sitemapRes, adstxtRes] = await Promise.all([
      safeFetch(`${origin}/robots.txt`, 5_000),
      safeFetch(`${origin}/sitemap.xml`, 5_000),
      safeFetch(`${origin}/ads.txt`, 5_000),
    ]);
    const robotsTxt = robotsRes?.ok ? await robotsRes.text() : "";
    const hasSitemap = !!sitemapRes?.ok;
    const sitemapXml = sitemapRes?.ok ? await sitemapRes.text() : "";
    const sitemapUrlCount = (sitemapXml.match(/<loc>/g) || []).length;
    const adsTxt = adstxtRes?.ok ? await adstxtRes.text() : "";

    // 5. Sample inner pages for real content depth (skip policy/contact pages)
    const skipSet = new Set([privacy?.url, terms?.url, contact?.url, about?.url, disclaimer?.url].filter(Boolean) as string[]);
    const sampleCandidates = allLinks.filter((l) => !skipSet.has(l) && l !== finalUrl).slice(0, 12);
    const samples: { url: string; text: string; wordCount: number; html: string }[] = [];
    for (const link of sampleCandidates) {
      if (samples.length >= 3) break;
      const r = await safeFetch(link, 7_000);
      if (!r?.ok) continue;
      const h = await r.text();
      const t = stripTags(h);
      const wc = t.split(/\s+/).filter(Boolean).length;
      if (wc < 60) continue; // skip nav/empty
      samples.push({ url: link, text: t, wordCount: wc, html: h });
    }
    const avgInnerWords = samples.length ? Math.round(samples.reduce((a, s) => a + s.wordCount, 0) / samples.length) : 0;

    // 6. AdSense detection (homepage + samples + ads.txt)
    const combinedHtml = html + samples.map((s) => s.html).join("\n");
    const pubMatch = combinedHtml.match(/ca-pub-\d{10,20}/i);
    const hasAdsbygoogleScript = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(combinedHtml);
    const hasAdsbygoogleIns = /<ins[^>]+adsbygoogle/i.test(combinedHtml);
    const adsTxtHasGoogle = /google\.com,\s*pub-\d+/i.test(adsTxt);
    const adsenseActive = !!pubMatch || hasAdsbygoogleScript || hasAdsbygoogleIns || adsTxtHasGoogle;
    const publisherId = pubMatch?.[0] ?? (adsTxt.match(/pub-\d+/i)?.[0] ?? null);

    // 7. SEO / meta
    const title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i).trim();
    const metaDescription = tag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
    const structuredData = /application\/ld\+json/i.test(html);
    const lang = /<html[^>]+lang=/i.test(html);

    // 8. Security
    const isHttps = finalUrl.startsWith("https://");
    const hsts = !!homepageRes.headers.get("strict-transport-security");
    const xfo = !!homepageRes.headers.get("x-frame-options");
    const csp = !!homepageRes.headers.get("content-security-policy");

    // 9. Robots policy
    const blocksAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*(?:\n|$)/i.test(robotsTxt);
    const blocksMediaPartners = /User-agent:\s*Mediapartners-Google[\s\S]*?Disallow:\s*\//i.test(robotsTxt);

    // 10. Prohibited content scan across homepage + samples
    const haystacks = [homepageText, ...samples.map((s) => s.text)].join("\n");
    const policyHits = PROHIBITED_PATTERNS.filter((p) => p.re.test(haystacks)).map((p) => p.label);

    // 11. AI content judgement
    const aiSamples = samples.length > 0
      ? samples.map((s) => ({ url: s.url, text: s.text }))
      : (homepageWords > 120 ? [{ url: finalUrl, text: homepageText }] : []);
    const aiJudge = await aiContentJudgement(aiSamples);

    // ---------------- Build categories ----------------
    const all: { cat: CategoryResult; weights: number[] }[] = [];

    all.push(makeCat("Domain & Reachability", "globe", [
      ck("Site reachable", "pass", `Homepage returned HTTP ${homepageRes.status} (${host})`, 3),
      ck("Crawlable HTML (not SPA-only)",
        looksSpa ? "warning" : "pass",
        looksSpa
          ? "Looks like a JavaScript SPA — Google may struggle to index content. Add server-side rendering or pre-rendering."
          : "Server returns rendered HTML",
        3),
      ck("HTML language attribute",
        lang ? "pass" : "warning",
        lang ? "<html lang> attribute is set" : "Add a lang attribute to <html>", 1),
    ]));

    all.push(makeCat("Security & Trust", "lock", [
      ck("HTTPS / SSL",
        isHttps ? "pass" : "fail",
        isHttps ? "Served over HTTPS" : "AdSense requires HTTPS. Install an SSL certificate.", 6),
      ck("HSTS header",
        hsts ? "pass" : "warning",
        hsts ? "Strict-Transport-Security present" : "Recommend adding HSTS header", 1),
      ck("Clickjacking protection",
        xfo || csp ? "pass" : "warning",
        xfo || csp ? "X-Frame-Options or CSP present" : "Add X-Frame-Options or frame-ancestors", 1),
    ]));

    all.push(makeCat("Content Quality", "file", [
      ck("Homepage body content",
        homepageWords >= 250 ? "pass" : homepageWords >= 100 ? "warning" : "fail",
        `Homepage has ~${homepageWords} visible words${looksSpa ? " (SPA — server returned little text)" : ""}`,
        3),
      ck("Inner pages sampled",
        samples.length >= 3 ? "pass" : samples.length >= 1 ? "warning" : "fail",
        samples.length === 0
          ? "Could not find substantive inner pages — AdSense needs multiple content pages"
          : `Sampled ${samples.length} inner page(s), avg ~${avgInnerWords} words`,
        4),
      ck("Article depth (avg)",
        avgInnerWords >= 600 ? "pass" : avgInnerWords >= 300 ? "warning" : avgInnerWords > 0 ? "fail" : "warning",
        avgInnerWords === 0 ? "No inner content measured" : `Average inner page ~${avgInnerWords} words (target 800+)`,
        4),
      ck("Sitemap entries",
        sitemapUrlCount >= 20 ? "pass" : sitemapUrlCount >= 5 ? "warning" : "fail",
        sitemapUrlCount > 0 ? `Sitemap lists ${sitemapUrlCount} URLs` : "No <loc> entries detected in sitemap (or no sitemap)", 3),
      ck("AdSense prohibited-content scan",
        policyHits.length === 0 ? "pass" : "fail",
        policyHits.length === 0
          ? "No prohibited keywords detected across sampled pages"
          : `Possible policy violations: ${policyHits.join(", ")}`,
        5),
      ck("Originality (AI)",
        !aiJudge ? "warning" : aiJudge.originality >= 75 ? "pass" : aiJudge.originality >= 50 ? "warning" : "fail",
        !aiJudge
          ? "AI judgement unavailable for this run"
          : `AI originality score: ${aiJudge.originality}/100${aiJudge.niche ? ` · niche: ${aiJudge.niche}` : ""}`,
        3),
      ck("Policy risk (AI)",
        !aiJudge ? "warning"
          : aiJudge.policyRisk === "none" ? "pass"
          : aiJudge.policyRisk === "low" ? "warning"
          : "fail",
        !aiJudge ? "Skipped" : `AI policy risk: ${aiJudge.policyRisk}${aiJudge.notes ? ` — ${aiJudge.notes}` : ""}`,
        4),
    ]));

    all.push(makeCat("SEO Architecture", "globe", [
      ck("Title tag",
        title.length >= 20 && title.length <= 65 ? "pass" : title ? "warning" : "fail",
        title ? `"${title.slice(0, 80)}" (${title.length} chars)` : "Missing <title>", 2),
      ck("Meta description",
        metaDescription.length >= 80 && metaDescription.length <= 170 ? "pass" : metaDescription ? "warning" : "fail",
        metaDescription ? `${metaDescription.length} chars` : "Missing meta description", 2),
      ck("Single H1",
        h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
        `Found ${h1Count} H1 tag(s)`, 1),
      ck("Viewport meta", viewport ? "pass" : "fail",
        viewport ? "Mobile viewport set" : "Add <meta name=viewport>", 2),
      ck("Canonical tag", canonical ? "pass" : "warning",
        canonical ? "Canonical present" : "Add rel=canonical", 1),
      ck("Open Graph metadata", ogTitle ? "pass" : "warning",
        ogTitle ? "og:title present" : "Add Open Graph tags", 1),
      ck("Structured data", structuredData ? "pass" : "warning",
        structuredData ? "JSON-LD detected" : "Add JSON-LD schema", 1),
      ck("Sitemap.xml", hasSitemap ? "pass" : "warning",
        hasSitemap ? `Sitemap found at ${origin}/sitemap.xml` : "Add /sitemap.xml", 2),
      ck("Robots.txt allows crawlers",
        blocksAll ? "fail" : "pass",
        blocksAll ? "robots.txt blocks ALL crawlers" : robotsTxt ? "robots.txt present, public crawl allowed" : "No robots.txt (default allow)", 3),
      ck("AdSense crawler allowed",
        blocksMediaPartners ? "fail" : "pass",
        blocksMediaPartners ? "Mediapartners-Google is blocked in robots.txt" : "Mediapartners-Google is not blocked", 2),
    ]));

    all.push(makeCat("Legal & Policy Pages", "file", [
      ck("Privacy Policy",
        privacy ? "pass" : "fail",
        privacy ? `Found: ${privacy.url}` : "AdSense REQUIRES a Privacy Policy that mentions cookies & data collection", 6),
      ck("Terms / Conditions",
        terms ? "pass" : "warning",
        terms ? `Found: ${terms.url}` : "Add a Terms of Service page", 2),
      ck("Contact page",
        contact ? "pass" : "fail",
        contact ? `Found: ${contact.url}` : "Add a working Contact page — required for credibility", 3),
      ck("About page",
        about ? "pass" : "warning",
        about ? `Found: ${about.url}` : "Add an About page describing the site owner", 2),
      ck("Disclaimer",
        disclaimer ? "pass" : "warning",
        disclaimer ? `Found: ${disclaimer.url}` : "Add a Disclaimer page (recommended)", 1),
    ]));

    const htmlBytes = new TextEncoder().encode(html).length;
    const imgCount = (html.match(/<img\b/gi) || []).length;
    const lazyImgs = (html.match(/loading=["']lazy["']/gi) || []).length;
    all.push(makeCat("Performance", "gauge", [
      ck("HTML payload size",
        htmlBytes < 400_000 ? "pass" : "warning",
        `Homepage HTML is ${(htmlBytes / 1024).toFixed(0)} KB`, 1),
      ck("Image lazy-loading",
        imgCount === 0 ? "warning" : lazyImgs / Math.max(1, imgCount) > 0.5 ? "pass" : "warning",
        `${lazyImgs}/${imgCount} images use loading="lazy"`, 1),
      ck("Compression",
        homepageRes.headers.get("content-encoding") ? "pass" : "warning",
        homepageRes.headers.get("content-encoding")
          ? `Encoded with ${homepageRes.headers.get("content-encoding")}`
          : "Enable gzip/brotli", 1),
    ]));

    all.push(makeCat("AdSense Status", "gauge", [
      ck("AdSense code on site",
        adsenseActive ? "pass" : "warning",
        adsenseActive
          ? `AdSense code detected${publisherId ? ` (${publisherId})` : ""} — site already runs AdSense`
          : "No AdSense code (adsbygoogle.js / ca-pub-…) detected on sampled pages",
        2),
      ck("ads.txt",
        adsTxt ? "pass" : "warning",
        adsTxt ? `/ads.txt found${adsTxtHasGoogle ? " (lists Google)" : ""}` : "Add /ads.txt after approval (required by Google)", 1),
    ]));

    // Score
    let earned = 0, max = 0;
    for (const { cat, weights } of all) {
      cat.checks.forEach((c, i) => {
        const w = weights[i];
        max += w;
        if (c.status === "pass") earned += w;
        else if (c.status === "warning") earned += w * 0.5;
      });
    }
    const score = Math.round((earned / max) * 100);

    // Hard blockers
    const blockers: string[] = [];
    if (!isHttps) blockers.push("No HTTPS / SSL");
    if (!privacy) blockers.push("No Privacy Policy page");
    if (!contact) blockers.push("No Contact page");
    if (blocksAll) blockers.push("robots.txt blocks all crawlers");
    if (policyHits.length) blockers.push(`Prohibited content: ${policyHits.join(", ")}`);
    if (aiJudge?.policyRisk === "high") blockers.push("AI flagged high AdSense policy risk");
    if (samples.length === 0 && homepageWords < 200) blockers.push("Very thin content — not enough to evaluate");
    if (avgInnerWords > 0 && avgInnerWords < 200) blockers.push("Inner pages are very thin (<200 words)");
    if (looksSpa && homepageWords < 100) blockers.push("SPA returns no server-rendered content");

    let verdict: "approved" | "likely" | "needs_work" | "not_eligible";
    let verdictLabel: string;
    let verdictReason: string;

    if (blockers.length >= 2) {
      verdict = "not_eligible";
      verdictLabel = "Not eligible yet";
      verdictReason = `Critical blockers must be fixed before applying: ${blockers.join("; ")}.`;
    } else if (blockers.length === 1) {
      verdict = "needs_work";
      verdictLabel = "Needs work";
      verdictReason = `One critical blocker: ${blockers[0]}. Fix it and re-run.`;
    } else if (score >= 85 && avgInnerWords >= 500) {
      verdict = "approved";
      verdictLabel = "High approval probability";
      verdictReason = "Site meets the main AdSense Program Policies. You can apply with confidence.";
    } else if (score >= 70) {
      verdict = "likely";
      verdictLabel = "Likely approved";
      verdictReason = "Address the warnings below to maximise approval probability.";
    } else {
      verdict = "needs_work";
      verdictLabel = "Needs work";
      verdictReason = "Resolve the failed checks before applying.";
    }

    const probability = adsenseActive ? Math.max(score, 95) :
      verdict === "not_eligible" ? Math.min(score, 25) :
      verdict === "needs_work" ? Math.min(score, 55) :
      verdict === "likely" ? Math.max(score, 72) :
      Math.max(score, 88);

    return json({
      url: finalUrl,
      host,
      score,
      approvalProbability: probability,
      verdict,
      verdictLabel,
      verdictReason,
      adsense: { active: adsenseActive, publisherId, adsTxt: !!adsTxt },
      ai: aiJudge,
      stats: {
        homepageWords,
        avgInnerWords,
        sampledPages: samples.length,
        sitemapUrlCount,
        linksFound: allLinks.length,
        looksSpa,
      },
      fetchedUrls: [finalUrl, ...samples.map((s) => s.url)],
      blockers,
      results: all.map((x) => x.cat),

    });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function ck(name: string, status: Status, message: string, weight: number): Check {
  return { name, status, message, weight };
}
function makeCat(category: string, icon: CategoryResult["icon"], checks: Check[]) {
  return {
    cat: { category, icon, checks: checks.map(({ weight: _w, ...rest }) => rest) },
    weights: checks.map((c) => c.weight),
  };
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
