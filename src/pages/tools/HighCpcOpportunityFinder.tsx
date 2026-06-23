import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import {
  Loader2, Search, Download, FileSpreadsheet, FileText, History,
  TrendingUp, Sparkles, AlertCircle, ExternalLink, LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

type AnalyzedPage = {
  url: string; path: string; type: string;
  title: string; description: string; words: number;
  niche: string; nicheLabel: string;
  cpcLow: number; cpcHigh: number; rpmLow: number; rpmHigh: number;
  competition: string; demand: string;
  opportunityScore: number; approvalProbability: number;
  issues: string[];
  revenue: { p100: number; p500: number; p1000: number; monthlyAt10kPv: number };
};

type Report = {
  generatedAt: string;
  input: string;
  origin: string;
  totals: { total: number; blog: number; category: number; tag: number; landing: number };
  sampleSize: number;
  avgOpportunityScore: number;
  estMonthlyRevenueCeiling: number;
  primaryNiche: string | null;
  pages: AnalyzedPage[];
  topOpportunities: AnalyzedPage[];
  buckets: { high: string[]; medium: string[]; low: string[] };
  coverage: { niche: string; label: string; count: number; cpcAvg: number }[];
  missingNiches: { niche: string; label: string; cpcLow: number; cpcHigh: number; rpmLow: number; rpmHigh: number; suggestions: string[] }[];
  contentIdeas: { topic: string; title: string; niche: string; cpcAvg: number }[];
  keywordOpportunities: { keyword: string; niche: string; cpcLow: number; cpcHigh: number; difficulty: string }[];
  adsenseAudit: { weakPages: { url: string; issues: string[]; score: number }[] };
};

type ScanRow = {
  id: string; domain: string; url: string; created_at: string;
  total_pages: number; opportunity_score: number;
  est_monthly_revenue_ceiling: number; primary_niche: string | null;
  report: Report;
};

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function HighCpcOpportunityFinder() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<ScanRow[]>([]);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("cpc_scans")
      .select("id,domain,url,created_at,total_pages,opportunity_score,est_monthly_revenue_ceiling,primary_niche,report")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setHistory((data || []) as unknown as ScanRow[]));
  }, [user, activeScanId]);

  async function runScan() {
    if (!user) { navigate("/auth"); return; }
    const target = url.trim();
    if (!target) { toast.error("Enter a website URL"); return; }
    setScanning(true);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke("cpc-opportunity-scan", {
        body: { url: target },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as Report);
      setActiveScanId(data.id);
      toast.success("Scan complete");
    } catch (e) {
      toast.error((e as Error).message || "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  function loadFromHistory(row: ScanRow) {
    setReport(row.report);
    setActiveScanId(row.id);
    setUrl(row.url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --------- Exports ----------
  function exportCSV() {
    if (!report) return;
    const rows = [["URL", "Type", "Title", "Niche", "Words", "CPC Low", "CPC High", "RPM Low", "RPM High", "Opportunity Score", "Approval %", "PV for $100", "PV for $500", "PV for $1000", "Issues"]];
    for (const p of report.pages) {
      rows.push([
        p.url, p.type, p.title, p.nicheLabel, String(p.words),
        String(p.cpcLow), String(p.cpcHigh), String(p.rpmLow), String(p.rpmHigh),
        String(p.opportunityScore), String(p.approvalProbability),
        String(p.revenue.p100), String(p.revenue.p500), String(p.revenue.p1000),
        p.issues.join(" | "),
      ]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `cpc-scan-${report.origin.replace(/[^a-z0-9]/gi, "_")}.csv`);
  }

  function exportXLSX() {
    if (!report) return;
    const wb = XLSX.utils.book_new();
    const overview = [
      ["Domain", report.origin],
      ["Scanned", new Date(report.generatedAt).toLocaleString()],
      ["Total Pages", report.totals.total],
      ["Blog Posts", report.totals.blog],
      ["Categories", report.totals.category],
      ["Tags", report.totals.tag],
      ["Landing Pages", report.totals.landing],
      ["Pages Analyzed", report.sampleSize],
      ["Avg Opportunity Score", report.avgOpportunityScore],
      ["Est. Monthly Revenue Ceiling (USD)", report.estMonthlyRevenueCeiling],
      ["Primary Niche", report.primaryNiche || "—"],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overview), "Overview");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.pages.map((p) => ({
      URL: p.url, Type: p.type, Title: p.title, Niche: p.nicheLabel, Words: p.words,
      CPC_Low: p.cpcLow, CPC_High: p.cpcHigh, RPM_Low: p.rpmLow, RPM_High: p.rpmHigh,
      Opportunity: p.opportunityScore, Approval_Pct: p.approvalProbability,
      PV_100: p.revenue.p100, PV_500: p.revenue.p500, PV_1000: p.revenue.p1000,
      Issues: p.issues.join(" | "),
    }))), "Pages");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.missingNiches.map((m) => ({
      Niche: m.label, CPC_Range: `$${m.cpcLow}-$${m.cpcHigh}`, RPM_Range: `$${m.rpmLow}-$${m.rpmHigh}`,
      Suggested_Articles: m.suggestions.join(" | "),
    }))), "Missing Niches");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.contentIdeas), "Content Ideas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.keywordOpportunities), "Keyword Opportunities");
    XLSX.writeFile(wb, `cpc-scan-${report.origin.replace(/[^a-z0-9]/gi, "_")}.xlsx`);
  }

  function exportPDF() {
    if (!report) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 50;
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, W, 80, "F");
    doc.setTextColor(255);
    doc.setFontSize(20);
    doc.text("High CPC Opportunity Report", 40, 40);
    doc.setFontSize(11);
    doc.text(report.origin, 40, 60);
    doc.setTextColor(20);
    y = 110;
    doc.setFontSize(14);
    doc.text("Overview", 40, y); y += 18;
    doc.setFontSize(10);
    const lines = [
      `Total Pages: ${report.totals.total}    Blog: ${report.totals.blog}    Categories: ${report.totals.category}    Tags: ${report.totals.tag}`,
      `Avg Opportunity Score: ${report.avgOpportunityScore}/100`,
      `Est. Monthly Revenue Ceiling: $${report.estMonthlyRevenueCeiling.toLocaleString()}`,
      `Primary Niche: ${report.primaryNiche || "—"}`,
      `Pages Analyzed: ${report.sampleSize}`,
    ];
    for (const ln of lines) { doc.text(ln, 40, y); y += 14; }
    y += 10;
    doc.setFontSize(14);
    doc.text("Top 20 Pages by Opportunity", 40, y); y += 16;
    doc.setFontSize(9);
    report.topOpportunities.forEach((p, i) => {
      if (y > 760) { doc.addPage(); y = 50; }
      doc.text(`${i + 1}. [${p.opportunityScore}] ${p.nicheLabel} — ${p.title.slice(0, 70)}`, 40, y); y += 12;
      doc.setTextColor(120);
      doc.text(`   ${p.url.slice(0, 95)}`, 40, y); y += 12;
      doc.text(`   CPC $${p.cpcLow}-$${p.cpcHigh} · RPM $${p.rpmLow}-$${p.rpmHigh} · ${p.words} words · Approval ${p.approvalProbability}%`, 40, y); y += 14;
      doc.setTextColor(20);
    });
    if (report.missingNiches.length) {
      doc.addPage(); y = 50;
      doc.setFontSize(14); doc.text("Missing High-CPC Niches", 40, y); y += 18;
      doc.setFontSize(10);
      for (const m of report.missingNiches) {
        if (y > 760) { doc.addPage(); y = 50; }
        doc.text(`• ${m.label} — CPC $${m.cpcLow}-$${m.cpcHigh}`, 40, y); y += 14;
        for (const s of m.suggestions) { doc.setTextColor(120); doc.text(`    - ${s}`, 40, y); y += 12; doc.setTextColor(20); }
      }
    }
    doc.save(`cpc-scan-${report.origin.replace(/[^a-z0-9]/gi, "_")}.pdf`);
  }

  function download(blob: Blob, name: string) {
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }

  // --------- Charts data ----------
  const coverageChart = useMemo(() => report?.coverage.slice(0, 8).map((c) => ({ name: c.label, value: c.count })) || [], [report]);
  const bucketChart = useMemo(() => report ? [
    { name: "High", value: report.buckets.high.length },
    { name: "Medium", value: report.buckets.medium.length },
    { name: "Low", value: report.buckets.low.length },
  ] : [], [report]);
  const topRevenueChart = useMemo(() => report?.topOpportunities.slice(0, 10).map((p) => ({
    name: (p.title || p.path).slice(0, 28),
    revenue: p.revenue.monthlyAt10kPv,
    score: p.opportunityScore,
  })) || [], [report]);

  return (
    <SiteLayout>
      <Helmet>
        <title>High CPC Page Opportunity Finder — AdSense Revenue Scanner</title>
        <meta name="description" content="Crawl any website and find the pages with the highest AdSense CPC potential. Discover missing high-revenue niches, content gaps, and the traffic you need to earn $100, $500, or $1,000/month." />
        <link rel="canonical" href="/tools/high-cpc-opportunity-finder" />
      </Helmet>

      <section className="container mx-auto px-4 pt-12 md:pt-16 pb-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> · <Link to="/tools" className="hover:text-foreground">Tools</Link> · <span>High CPC Opportunity Finder</span>
        </nav>
        <Badge variant="secondary" className="mb-4 gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" /> AI Revenue Predictor · Login required
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
          High CPC Page Opportunity Finder
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
          Find which pages on your website have the highest AdSense earning potential, uncover missing high-CPC content opportunities, and get the exact monthly traffic needed to hit $100, $500, or $1,000.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <Card className="glass-card p-5 md:p-7 max-w-3xl">
          {!authLoading && !user ? (
            <div className="text-center py-6">
              <LogIn className="h-8 w-8 mx-auto text-primary mb-3" />
              <h2 className="text-xl font-semibold mb-2">Sign in to scan</h2>
              <p className="text-sm text-muted-foreground mb-4">Your scans are private and saved to your history.</p>
              <Button onClick={() => navigate("/auth")}>Sign in / Sign up</Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); runScan(); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={scanning}
                className="flex-1"
              />
              <Button type="submit" disabled={scanning} className="gap-2">
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {scanning ? "Scanning…" : "Scan website"}
              </Button>
            </form>
          )}
          {scanning && (
            <p className="text-xs text-muted-foreground mt-3">
              Crawling sitemap, classifying pages, mapping niches to CPC database, and computing revenue projections… this can take 30–60s for large sites.
            </p>
          )}
        </Card>
      </section>

      {report && (
        <section className="container mx-auto px-4 pb-16">
          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Kpi label="Total pages" value={report.totals.total} />
            <Kpi label="Blog posts" value={report.totals.blog} />
            <Kpi label="Avg score" value={`${report.avgOpportunityScore}/100`} />
            <Kpi label="Revenue ceiling" value={`$${report.estMonthlyRevenueCeiling.toLocaleString()}/mo`} accent />
            <Kpi label="Primary niche" value={report.primaryNiche || "—"} />
          </div>

          {/* Export bar */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1.5"><FileText className="h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5"><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={exportXLSX} className="gap-1.5"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pages">Pages Found</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Opportunities</TabsTrigger>
              <TabsTrigger value="cpc">High CPC Pages</TabsTrigger>
              <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Opportunities</TabsTrigger>
              <TabsTrigger value="adsense">AdSense Audit</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h3 className="font-semibold mb-3">Niche coverage</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={coverageChart} dataKey="value" nameKey="name" outerRadius={90} label>
                          {coverageChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold mb-3">Revenue tiers</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <BarChart data={bucketChart}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Top 10 pages — monthly revenue at 10k pageviews</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={topRevenueChart} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={180} fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" name="USD/mo at 10k PV" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            {/* PAGES */}
            <TabsContent value="pages" className="pt-6">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Niche</TableHead>
                      <TableHead className="text-right">Words</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.pages.map((p) => (
                      <TableRow key={p.url}>
                        <TableCell className="max-w-[420px]">
                          <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 truncate">
                            {p.title || p.path} <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                          <div className="text-xs text-muted-foreground truncate">{p.url}</div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{p.type}</Badge></TableCell>
                        <TableCell>{p.nicheLabel}</TableCell>
                        <TableCell className="text-right">{p.words}</TableCell>
                        <TableCell className="text-right font-semibold">{p.opportunityScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* REVENUE OPPORTUNITIES */}
            <TabsContent value="revenue" className="pt-6 space-y-6">
              {(["high", "medium", "low"] as const).map((tier) => {
                const items = report.pages.filter((p) =>
                  tier === "high" ? p.opportunityScore >= 70 :
                  tier === "medium" ? p.opportunityScore >= 45 && p.opportunityScore < 70 :
                  p.opportunityScore < 45
                );
                if (!items.length) return null;
                return (
                  <Card key={tier} className="p-5">
                    <h3 className="font-semibold mb-3 capitalize">{tier} revenue pages — {items.length}</h3>
                    <div className="space-y-3">
                      {items.slice(0, 12).map((p) => (
                        <div key={p.url} className="flex items-start justify-between gap-3 border-b border-border/40 pb-3 last:border-0">
                          <div className="min-w-0">
                            <a href={p.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline truncate block">{p.title || p.url}</a>
                            <div className="text-xs text-muted-foreground">{p.nicheLabel} · CPC ${p.cpcLow}-${p.cpcHigh} · RPM ${p.rpmLow}-${p.rpmHigh}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-semibold">${p.revenue.monthlyAt10kPv}/mo</div>
                            <div className="text-xs text-muted-foreground">at 10k PV</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            {/* HIGH CPC TOP 20 */}
            <TabsContent value="cpc" className="pt-6">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Niche</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead>PV for $100</TableHead>
                      <TableHead>PV for $500</TableHead>
                      <TableHead>PV for $1k</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.topOpportunities.map((p, i) => (
                      <TableRow key={p.url}>
                        <TableCell className="font-semibold">{i + 1}</TableCell>
                        <TableCell className="max-w-[280px]">
                          <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">{p.title || p.path}</a>
                        </TableCell>
                        <TableCell>{p.nicheLabel}</TableCell>
                        <TableCell>${p.cpcLow}-${p.cpcHigh}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2"><Progress value={p.approvalProbability} className="w-16 h-1.5" /><span className="text-xs">{p.approvalProbability}%</span></div>
                        </TableCell>
                        <TableCell>{p.revenue.p100.toLocaleString()}</TableCell>
                        <TableCell>{p.revenue.p500.toLocaleString()}</TableCell>
                        <TableCell>{p.revenue.p1000.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">{p.opportunityScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* CONTENT GAPS */}
            <TabsContent value="gaps" className="pt-6 space-y-6">
              {report.missingNiches.length > 0 && (
                <Card className="p-5">
                  <h3 className="font-semibold mb-1">Missing high-CPC niches</h3>
                  <p className="text-sm text-muted-foreground mb-4">Your site doesn't yet cover these high-paying topics — every article in these niches has 5-20× the revenue ceiling of generic content.</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {report.missingNiches.map((m) => (
                      <Card key={m.niche} className="p-4 bg-secondary/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{m.label}</h4>
                          <Badge>${m.cpcLow}-${m.cpcHigh} CPC</Badge>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {m.suggestions.map((s) => <li key={s}>• {s}</li>)}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
              <Card className="p-5">
                <h3 className="font-semibold mb-3">All content ideas ({report.contentIdeas.length})</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {report.contentIdeas.map((c, i) => (
                    <div key={i} className="text-sm border border-border/40 rounded-lg px-3 py-2 flex items-start justify-between gap-2">
                      <span><span className="text-xs text-muted-foreground">{c.topic}:</span> {c.title}</span>
                      <Badge variant="outline" className="shrink-0">${c.cpcAvg.toFixed(1)}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* KEYWORDS */}
            <TabsContent value="keywords" className="pt-6">
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Niche</TableHead>
                      <TableHead>CPC Range</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.keywordOpportunities.map((k, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{k.keyword}</TableCell>
                        <TableCell>{k.niche}</TableCell>
                        <TableCell>${k.cpcLow}-${k.cpcHigh}</TableCell>
                        <TableCell><Badge variant="secondary">{k.difficulty}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* ADSENSE AUDIT */}
            <TabsContent value="adsense" className="pt-6">
              <Card className="p-5">
                <h3 className="font-semibold mb-1 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Pages weak for AdSense ({report.adsenseAudit.weakPages.length})</h3>
                <p className="text-sm text-muted-foreground mb-4">Pages with 3+ issues blocking AdSense approval or limiting earnings.</p>
                <div className="space-y-3">
                  {report.adsenseAudit.weakPages.map((p) => (
                    <div key={p.url} className="border border-border/40 rounded-lg p-3">
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">{p.url}</a>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.issues.map((i) => <Badge key={i} variant="outline" className="text-xs">{i}</Badge>)}
                      </div>
                    </div>
                  ))}
                  {!report.adsenseAudit.weakPages.length && (
                    <p className="text-sm text-muted-foreground">No major AdSense issues detected in analyzed pages — nice work.</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      )}

      {user && history.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Your scan history</h2>
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead className="text-right">Pages</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Revenue ceiling</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id} className={activeScanId === h.id ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">{h.domain}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{h.total_pages}</TableCell>
                    <TableCell className="text-right">{h.opportunity_score}</TableCell>
                    <TableCell className="text-right">${Number(h.est_monthly_revenue_ceiling).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => loadFromHistory(h)}>Open</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      )}

      {/* SEO content block */}
      <section className="container mx-auto px-4 py-14 max-w-3xl prose prose-invert dark:prose-invert">
        <h2>About the High CPC Page Opportunity Finder</h2>
        <p>
          Most AdSense publishers leave 60-80% of their potential revenue on the table because they don't know which of their pages
          have the highest CPC. The High CPC Page Opportunity Finder crawls your entire website, classifies every page by niche,
          maps each niche to a curated CPC and RPM database, and surfaces the top 20 pages with the strongest AdSense earning potential —
          along with the exact monthly traffic needed to earn $100, $500, or $1,000.
        </p>
        <p>
          It also pinpoints the high-paying niches your site doesn't cover yet (insurance, loans, credit cards, legal, hosting, SaaS, cybersecurity)
          and gives you a ranked list of article ideas to fill those gaps.
        </p>
      </section>
    </SiteLayout>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className={`p-4 ${accent ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30" : ""}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-1 truncate">{value}</div>
    </Card>
  );
}
