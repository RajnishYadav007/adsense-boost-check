// High CPC Page Opportunity Finder — crawler + analyzer edge function
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------- Curated CPC niche database (USD, US market estimates) ----------
type Niche = {
  key: string;
  label: string;
  keywords: string[];
  cpcLow: number;
  cpcHigh: number;
  rpmLow: number;
  rpmHigh: number;
  competition: "Low" | "Medium" | "High" | "Very High";
  demand: "Low" | "Medium" | "High" | "Very High";
};

const NICHES: Niche[] = [
  { key: "insurance", label: "Insurance", keywords: ["insurance","insure","policy","life cover","health cover","car insurance","auto insurance"], cpcLow: 18, cpcHigh: 55, rpmLow: 40, rpmHigh: 120, competition: "Very High", demand: "Very High" },
  { key: "loans", label: "Loans & Mortgage", keywords: ["loan","mortgage","refinance","heloc","lend","credit line"], cpcLow: 15, cpcHigh: 50, rpmLow: 35, rpmHigh: 110, competition: "Very High", demand: "Very High" },
  { key: "credit", label: "Credit Cards", keywords: ["credit card","cashback","rewards card","amex","visa","chase"], cpcLow: 12, cpcHigh: 35, rpmLow: 30, rpmHigh: 90, competition: "Very High", demand: "Very High" },
  { key: "legal", label: "Legal & Attorney", keywords: ["lawyer","attorney","lawsuit","legal","injury claim","mesothelioma","dui"], cpcLow: 20, cpcHigh: 80, rpmLow: 45, rpmHigh: 150, competition: "Very High", demand: "Very High" },
  { key: "investing", label: "Investing & Finance", keywords: ["invest","stocks","etf","trading","forex","crypto","bitcoin","portfolio","retirement","roth ira","401k"], cpcLow: 8, cpcHigh: 25, rpmLow: 20, rpmHigh: 60, competition: "High", demand: "High" },
  { key: "hosting", label: "Web Hosting & Domains", keywords: ["hosting","vps","wordpress hosting","domain","cpanel","cloud server"], cpcLow: 10, cpcHigh: 30, rpmLow: 25, rpmHigh: 70, competition: "High", demand: "High" },
  { key: "saas", label: "SaaS & B2B Software", keywords: ["crm","saas","b2b","software","platform","automation","workflow","erp"], cpcLow: 6, cpcHigh: 22, rpmLow: 18, rpmHigh: 55, competition: "High", demand: "High" },
  { key: "ai_tools", label: "AI Tools", keywords: ["ai","chatgpt","gpt","midjourney","claude","gemini","ai tool","llm","prompt"], cpcLow: 4, cpcHigh: 18, rpmLow: 12, rpmHigh: 45, competition: "High", demand: "Very High" },
  { key: "cybersecurity", label: "Cybersecurity & VPN", keywords: ["vpn","cybersecurity","antivirus","password manager","privacy","firewall"], cpcLow: 8, cpcHigh: 28, rpmLow: 22, rpmHigh: 65, competition: "High", demand: "High" },
  { key: "marketing", label: "Digital Marketing & SEO", keywords: ["seo","marketing","backlink","adsense","ppc","sem","email marketing","keyword"], cpcLow: 6, cpcHigh: 20, rpmLow: 18, rpmHigh: 50, competition: "High", demand: "High" },
  { key: "ecommerce", label: "Ecommerce & Shopify", keywords: ["shopify","ecommerce","dropship","amazon fba","woocommerce","store"], cpcLow: 5, cpcHigh: 18, rpmLow: 14, rpmHigh: 40, competition: "Medium", demand: "High" },
  { key: "health", label: "Health & Wellness", keywords: ["health","weight loss","diet","supplement","keto","fitness","yoga","mental health"], cpcLow: 3, cpcHigh: 12, rpmLow: 10, rpmHigh: 30, competition: "High", demand: "High" },
  { key: "education", label: "Online Education", keywords: ["course","online degree","mba","university","scholarship","bootcamp","certification"], cpcLow: 8, cpcHigh: 28, rpmLow: 22, rpmHigh: 65, competition: "High", demand: "High" },
  { key: "realestate", label: "Real Estate", keywords: ["real estate","property","mortgage rate","home buy","rent","airbnb"], cpcLow: 7, cpcHigh: 22, rpmLow: 20, rpmHigh: 55, competition: "High", demand: "High" },
  { key: "auto", label: "Automotive", keywords: ["car","auto","vehicle","truck","tesla","ev","car review"], cpcLow: 3, cpcHigh: 10, rpmLow: 9, rpmHigh: 25, competition: "Medium", demand: "Medium" },
  { key: "travel", label: "Travel", keywords: ["travel","flight","hotel","vacation","tour","cruise","visa"], cpcLow: 2, cpcHigh: 8, rpmLow: 8, rpmHigh: 22, competition: "Medium", demand: "Medium" },
  { key: "tech", label: "Technology & Gadgets", keywords: ["tech","gadget","smartphone","laptop","review","iphone","android","windows"], cpcLow: 1.5, cpcHigh: 6, rpmLow: 5, rpmHigh: 18, competition: "Medium", demand: "Medium" },
  { key: "gaming", label: "Gaming", keywords: ["game","gaming","ps5","xbox","minecraft","fortnite","steam"], cpcLow: 0.5, cpcHigh: 3, rpmLow: 3, rpmHigh: 10, competition: "Medium", demand: "Low" },
  { key: "entertainment", label: "Entertainment & News", keywords: ["news","movie","celebrity","music","tv show","netflix"], cpcLow: 0.3, cpcHigh: 1.5, rpmLow: 2, rpmHigh: 7, competition: "Low", demand: "Low" },
  { key: "lifestyle", label: "Lifestyle & Blog", keywords: ["lifestyle","blog","story","personal","tips","how to"], cpcLow: 0.4, cpcHigh: 2, rpmLow: 2, rpmHigh: 8, competition: "Low", demand: "Low" },
];

const HIGH_VALUE_KEYS = ["insurance","loans","credit","legal","investing","hosting","saas","cybersecurity","education","realestate"];

// Suggested article ideas per niche
const CONTENT_IDEAS: Record<string, string[]> = {
  insurance: ["Best Term Life Insurance for Families 2026","Cheapest Car Insurance Companies Compared","Pet Insurance: Is It Worth It?","Health Insurance vs Health Sharing Plans"],
  loans: ["Best Refinance Rates This Month","HELOC vs Cash-Out Refinance","Personal Loans for Bad Credit","Student Loan Forgiveness Eligibility"],
  credit: ["Best Cashback Credit Cards","Travel Credit Card Sign-Up Bonuses","Business Credit Cards for Startups","How to Rebuild Credit Fast"],
  legal: ["Do I Need an Attorney After a Car Accident?","Workers Compensation Claim Guide","Mesothelioma Lawsuit Settlements","Estate Planning Checklist"],
  investing: ["Best Brokerage Accounts 2026","Index Funds vs ETFs","Roth IRA vs Traditional IRA","Dividend Stocks for Passive Income"],
  hosting: ["Best Managed WordPress Hosting","Cloud Hosting vs VPS","Best Hosting for AdSense Approval","Hosting for High Traffic Blogs"],
  saas: ["Best CRM for Small Business","Project Management Software Compared","Email Marketing Platforms Ranked","No-Code App Builders"],
  ai_tools: ["Best AI Writing Tools","ChatGPT vs Claude vs Gemini","AI Image Generators Compared","AI SEO Tools That Work"],
  cybersecurity: ["Best VPN for Privacy","Password Managers Compared","Antivirus Software 2026","Best Two-Factor Authentication Apps"],
  marketing: ["Best SEO Tools","Backlink Building Strategies","Email Marketing Platforms","Google Ads vs Facebook Ads"],
  ecommerce: ["Shopify vs WooCommerce","Best Dropshipping Suppliers","Amazon FBA Profit Calculator","Print on Demand Compared"],
  health: ["Best Weight Loss Programs","Keto Diet Meal Plans","Top Vitamin D Supplements","Best Mental Health Apps"],
  education: ["Best Online MBA Programs","Coding Bootcamps Compared","Cheap Online Degrees","IT Certifications That Pay"],
  realestate: ["Best Mortgage Rates Today","Airbnb Investment Guide","Real Estate Crowdfunding","First-Time Home Buyer Programs"],
  auto: ["Best EVs Under $40k","Cheapest Cars to Insure","Tesla Model Y Review","Best Used Cars 2026"],
  travel: ["Best Travel Credit Cards","Cheap Flight Search Hacks","Best Travel Insurance","All-Inclusive Resort Deals"],
  tech: ["Best Laptops for Students","iPhone vs Android 2026","Best Smart Home Devices","Wireless Earbuds Compared"],
  gaming: ["Best Gaming Laptops","PS5 vs Xbox Series X","Steam Deck Review","Best Free PC Games"],
  entertainment: ["Best Netflix Shows This Month","Top Streaming Services","New Movie Releases","Music Festival Guide"],
  lifestyle: ["Morning Routine Ideas","Productivity Hacks","Home Office Setup","Minimalist Living Tips"],
};

// ---------- Helpers ----------
function classifyPathType(path: string): "blog" | "category" | "tag" | "landing" {
  const p = path.toLowerCase();
  if (/\/(tag|tags)\//.test(p)) return "tag";
  if (/\/(category|categories|cat|topic|topics)\//.test(p)) return "category";
  if (/\/(blog|post|posts|article|articles|news)\//.test(p) || /\/\d{4}\/\d{2}\//.test(p)) return "blog";
  // many slug-style URLs are blog posts
  const segs = p.replace(/\/$/, "").split("/").filter(Boolean);
  if (segs.length >= 1 && segs[segs.length - 1].includes("-")) return "blog";
  return "landing";
}

function pickNiche(text: string): Niche {
  const t = text.toLowerCase();
  let best: { n: Niche; score: number } = { n: NICHES[NICHES.length - 1], score: 0 };
  for (const n of NICHES) {
    let s = 0;
    for (const k of n.keywords) if (t.includes(k)) s += k.length;
    if (s > best.score) best = { n, score: s };
  }
  return best.n;
}

function stripTags(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim().slice(0, 200);
  const desc = (html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || "").trim().slice(0, 320);
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, "").trim().slice(0, 200);
  const text = stripTags(html);
  const words = text ? text.split(/\s+/).length : 0;
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  const h3Count = (html.match(/<h3\b/gi) || []).length;
  const internalLinks = (html.match(/<a\b/gi) || []).length;
  const hasFaq = /faq|frequently asked/i.test(text);
  const hasSchema = /application\/ld\+json/i.test(html);
  const hasAuthor = /author|by\s+[A-Z]/i.test(html);
  return { title, desc, h1, words, h2Count, h3Count, internalLinks, hasFaq, hasSchema, hasAuthor };
}

async function fetchText(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "AdsenseApprovalChecker-CPCScanner/1.0 (+https://adsenseapprovalchecker.net)" },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "";
    if (!/text|xml|html/i.test(ct)) return null;
    return await r.text();
  } catch {
    return null;
  }
}

async function discoverUrls(origin: string): Promise<string[]> {
  const seeds = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap-index.xml`, `${origin}/wp-sitemap.xml`];
  const found = new Set<string>();
  const sitemapQueue: string[] = [];
  for (const s of seeds) {
    const txt = await fetchText(s);
    if (txt) sitemapQueue.push(...extractSitemapEntries(txt));
  }
  // resolve nested sitemaps (max 6)
  let i = 0;
  while (i < sitemapQueue.length && i < 6) {
    const u = sitemapQueue[i++];
    if (u.endsWith(".xml")) {
      const txt = await fetchText(u);
      if (txt) {
        for (const x of extractSitemapEntries(txt)) {
          if (x.endsWith(".xml") && !sitemapQueue.includes(x)) sitemapQueue.push(x);
          else found.add(x);
        }
      }
    } else {
      found.add(u);
    }
  }
  for (const u of sitemapQueue) if (!u.endsWith(".xml")) found.add(u);

  // Fallback: parse homepage anchors
  if (found.size === 0) {
    const html = await fetchText(origin);
    if (html) {
      const re = /href=["']([^"'#]+)["']/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html))) {
        try {
          const abs = new URL(m[1], origin).toString();
          if (new URL(abs).origin === origin) found.add(abs.split("#")[0]);
        } catch { /* ignore */ }
      }
    }
  }
  return Array.from(found).filter((u) => {
    try { return new URL(u).origin === origin; } catch { return false; }
  });
}

function extractSitemapEntries(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function scorePage(meta: ReturnType<typeof extractMeta>, niche: Niche): number {
  let score = 0;
  // CPC weight
  score += Math.min(40, (niche.cpcLow + niche.cpcHigh) * 0.8);
  // Content depth
  if (meta.words > 2000) score += 20;
  else if (meta.words > 1200) score += 14;
  else if (meta.words > 600) score += 8;
  else if (meta.words > 300) score += 3;
  // Structure
  if (meta.h2Count >= 3) score += 6;
  if (meta.h3Count >= 2) score += 3;
  if (meta.hasFaq) score += 4;
  if (meta.hasSchema) score += 4;
  if (meta.hasAuthor) score += 3;
  if (meta.internalLinks >= 20) score += 5;
  return Math.min(100, Math.round(score));
}

function approvalProbability(meta: ReturnType<typeof extractMeta>): number {
  let p = 30;
  if (meta.words > 800) p += 20;
  if (meta.words > 1500) p += 10;
  if (meta.h2Count >= 2) p += 8;
  if (meta.hasAuthor) p += 10;
  if (meta.hasSchema) p += 8;
  if (meta.hasFaq) p += 6;
  if (meta.internalLinks >= 15) p += 8;
  return Math.min(98, p);
}

function trafficNeeded(rpm: number, targetUsd: number): number {
  if (rpm <= 0) return 0;
  // pageviews per month needed = target / rpm * 1000
  return Math.ceil((targetUsd / rpm) * 1000);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const inputUrl = String(body?.url || "").trim();
    if (!inputUrl) {
      return new Response(JSON.stringify({ error: "url required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let target: URL;
    try { target = new URL(inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`); }
    catch {
      return new Response(JSON.stringify({ error: "invalid url" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const origin = `${target.protocol}//${target.host}`;
    const domain = target.host;

    // 1) Discover URLs
    const allUrls = (await discoverUrls(origin)).slice(0, 500);
    const classified = allUrls.map((u) => {
      const p = new URL(u).pathname;
      return { url: u, path: p, type: classifyPathType(p) };
    });
    const totals = {
      total: classified.length,
      blog: classified.filter((c) => c.type === "blog").length,
      category: classified.filter((c) => c.type === "category").length,
      tag: classified.filter((c) => c.type === "tag").length,
      landing: classified.filter((c) => c.type === "landing").length,
    };

    // 2) Sample pages to analyze (focus blog/landing)
    const sample = [
      ...classified.filter((c) => c.type === "blog").slice(0, 25),
      ...classified.filter((c) => c.type === "landing").slice(0, 8),
    ].slice(0, 30);

    const analyzed: Array<{
      url: string; path: string; type: string;
      title: string; description: string; words: number;
      niche: string; nicheLabel: string;
      cpcLow: number; cpcHigh: number; rpmLow: number; rpmHigh: number;
      competition: string; demand: string;
      opportunityScore: number; approvalProbability: number;
      issues: string[];
      revenue: { p100: number; p500: number; p1000: number; monthlyAt10kPv: number };
    }> = [];

    const concurrency = 5;
    let cursor = 0;
    async function worker() {
      while (cursor < sample.length) {
        const idx = cursor++;
        const item = sample[idx];
        const html = await fetchText(item.url);
        if (!html) continue;
        const meta = extractMeta(html);
        const niche = pickNiche(`${meta.title} ${meta.h1} ${meta.desc} ${item.path}`);
        const rpmMid = (niche.rpmLow + niche.rpmHigh) / 2;
        const issues: string[] = [];
        if (meta.words < 600) issues.push("Thin content (<600 words)");
        if (!meta.hasAuthor) issues.push("Missing author / E-E-A-T signals");
        if (!meta.hasSchema) issues.push("Missing structured data (JSON-LD)");
        if (!meta.hasFaq) issues.push("No FAQ section");
        if (meta.h2Count < 2) issues.push("Weak heading structure");
        if (meta.internalLinks < 10) issues.push("Few internal links");
        analyzed.push({
          url: item.url,
          path: item.path,
          type: item.type,
          title: meta.title || item.path,
          description: meta.desc,
          words: meta.words,
          niche: niche.key,
          nicheLabel: niche.label,
          cpcLow: niche.cpcLow,
          cpcHigh: niche.cpcHigh,
          rpmLow: niche.rpmLow,
          rpmHigh: niche.rpmHigh,
          competition: niche.competition,
          demand: niche.demand,
          opportunityScore: scorePage(meta, niche),
          approvalProbability: approvalProbability(meta),
          issues,
          revenue: {
            p100: trafficNeeded(rpmMid, 100),
            p500: trafficNeeded(rpmMid, 500),
            p1000: trafficNeeded(rpmMid, 1000),
            monthlyAt10kPv: Math.round((rpmMid * 10000) / 1000),
          },
        });
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));

    analyzed.sort((a, b) => b.opportunityScore - a.opportunityScore);

    // 3) Bucket revenue tiers
    const highRev = analyzed.filter((a) => a.opportunityScore >= 70);
    const medRev = analyzed.filter((a) => a.opportunityScore >= 45 && a.opportunityScore < 70);
    const lowRev = analyzed.filter((a) => a.opportunityScore < 45);

    // 4) Niche coverage / missing high-value niches
    const coverageMap = new Map<string, number>();
    for (const a of analyzed) coverageMap.set(a.niche, (coverageMap.get(a.niche) || 0) + 1);
    const coverage = Array.from(coverageMap.entries())
      .map(([k, count]) => {
        const n = NICHES.find((x) => x.key === k)!;
        return { niche: k, label: n.label, count, cpcAvg: (n.cpcLow + n.cpcHigh) / 2 };
      })
      .sort((a, b) => b.count - a.count);
    const covered = new Set(coverage.map((c) => c.niche));
    const missing = HIGH_VALUE_KEYS.filter((k) => !covered.has(k)).map((k) => {
      const n = NICHES.find((x) => x.key === k)!;
      return {
        niche: k,
        label: n.label,
        cpcLow: n.cpcLow,
        cpcHigh: n.cpcHigh,
        rpmLow: n.rpmLow,
        rpmHigh: n.rpmHigh,
        suggestions: CONTENT_IDEAS[k] || [],
      };
    });

    // 5) Content gap ideas (50+)
    const ideas: { topic: string; title: string; niche: string; cpcAvg: number }[] = [];
    const seedNiches = [
      ...missing.map((m) => m.niche),
      ...coverage.slice(0, 5).map((c) => c.niche),
    ];
    for (const k of seedNiches) {
      const n = NICHES.find((x) => x.key === k)!;
      for (const title of CONTENT_IDEAS[k] || []) {
        ideas.push({ topic: n.label, title, niche: k, cpcAvg: (n.cpcLow + n.cpcHigh) / 2 });
      }
    }

    // 6) Keyword opportunities — pull niche keywords for missing high-value
    const keywordOpps = missing.flatMap((m) => {
      const n = NICHES.find((x) => x.key === m.niche)!;
      return n.keywords.slice(0, 4).map((kw) => ({
        keyword: kw,
        niche: m.label,
        cpcLow: n.cpcLow,
        cpcHigh: n.cpcHigh,
        difficulty: n.competition,
      }));
    });

    // 7) Aggregate scores
    const avgScore = analyzed.length
      ? Math.round(analyzed.reduce((s, a) => s + a.opportunityScore, 0) / analyzed.length)
      : 0;
    const ceiling = analyzed.reduce((s, a) => s + a.revenue.monthlyAt10kPv, 0);
    const primaryNiche = coverage[0]?.label || null;

    const report = {
      generatedAt: new Date().toISOString(),
      input: inputUrl,
      origin,
      totals,
      sampleSize: analyzed.length,
      avgOpportunityScore: avgScore,
      estMonthlyRevenueCeiling: ceiling,
      primaryNiche,
      pages: analyzed,
      topOpportunities: analyzed.slice(0, 20),
      buckets: {
        high: highRev.map((p) => p.url),
        medium: medRev.map((p) => p.url),
        low: lowRev.map((p) => p.url),
      },
      coverage,
      missingNiches: missing,
      contentIdeas: ideas,
      keywordOpportunities: keywordOpps,
      adsenseAudit: {
        weakPages: analyzed
          .filter((a) => a.issues.length >= 3)
          .map((a) => ({ url: a.url, issues: a.issues, score: a.opportunityScore })),
      },
    };

    const { data: row, error: insErr } = await supabase
      .from("cpc_scans")
      .insert({
        user_id: user.id,
        domain,
        url: inputUrl,
        status: "completed",
        total_pages: totals.total,
        blog_posts: totals.blog,
        categories: totals.category,
        tags: totals.tag,
        landing_pages: totals.landing,
        opportunity_score: avgScore,
        est_monthly_revenue_ceiling: ceiling,
        primary_niche: primaryNiche,
        report,
      })
      .select("id")
      .single();

    if (insErr) {
      console.error("insert error", insErr);
      return new Response(JSON.stringify({ error: insErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id: row.id, report }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
