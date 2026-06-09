import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const niches = [
  { value: "tech", label: "Technology", cpc: 2.5 },
  { value: "finance", label: "Finance", cpc: 4.8 },
  { value: "health", label: "Health", cpc: 3.2 },
  { value: "education", label: "Education", cpc: 1.8 },
  { value: "entertainment", label: "Entertainment", cpc: 0.9 },
  { value: "travel", label: "Travel", cpc: 1.6 },
  { value: "food", label: "Food", cpc: 1.1 },
  { value: "fashion", label: "Fashion", cpc: 0.8 },
];

const countries = [
  { value: "us", label: "United States", mult: 1.0 },
  { value: "uk", label: "United Kingdom", mult: 0.85 },
  { value: "ca", label: "Canada", mult: 0.8 },
  { value: "au", label: "Australia", mult: 0.78 },
  { value: "de", label: "Germany", mult: 0.7 },
  { value: "in", label: "India", mult: 0.18 },
  { value: "br", label: "Brazil", mult: 0.22 },
  { value: "other", label: "Other", mult: 0.4 },
];

const placements = [
  { id: "header", label: "Header banner", weight: 1.0 },
  { id: "in_content", label: "In-content", weight: 1.3 },
  { id: "sidebar", label: "Sidebar", weight: 0.8 },
  { id: "footer", label: "Footer", weight: 0.5 },
];

export default function RevenueCalculator() {
  const [pageviews, setPageviews] = useState(50000);
  const [niche, setNiche] = useState("tech");
  const [country, setCountry] = useState("us");
  const [ctr, setCtr] = useState(1.5);
  const [active, setActive] = useState<string[]>(["header", "in_content"]);

  const calc = useMemo(() => {
    const cpc = niches.find((n) => n.value === niche)?.cpc ?? 1;
    const mult = countries.find((c) => c.value === country)?.mult ?? 1;
    const weight = active.reduce(
      (acc, id) => acc + (placements.find((p) => p.id === id)?.weight ?? 0),
      0
    );
    const factor = Math.min(weight || 0.3, 3);
    const monthly = (pageviews * (ctr / 100) * cpc * mult * factor) / 1;
    return {
      monthly,
      daily: monthly / 30,
      annual: monthly * 12,
      rpm: (monthly / pageviews) * 1000,
    };
  }, [pageviews, niche, country, ctr, active]);

  const chartData = Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2026, i, 1).toLocaleDateString("en", { month: "short" }),
    earnings: Math.round(calc.monthly * (0.85 + Math.random() * 0.3)),
  }));

  const toggle = (id: string) =>
    setActive((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <SiteLayout>
      <Helmet>
        <title>AdSense Revenue Calculator 2026 — Estimate Monthly Earnings</title>
        <meta name="description" content="Free AdSense revenue calculator. Estimate your monthly Google AdSense earnings by niche, traffic country, CTR and ad placement." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/tools/adsense-revenue-calculator" />
      </Helmet>

      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-10">
          <DollarSign className="h-10 w-10 mx-auto text-primary mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">AdSense Revenue Calculator 2026</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate your estimated Google AdSense monthly earnings by niche, traffic, country, and ad placement.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,420px]">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <Field label={`Monthly pageviews: ${pageviews.toLocaleString()}`}>
              <Slider value={[pageviews]} min={1000} max={10_000_000} step={1000} onValueChange={([v]) => setPageviews(v)} />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Niche / Category">
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {niches.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label} (${n.cpc.toFixed(2)} CPC)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Primary traffic country">
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label={`Estimated CTR: ${ctr.toFixed(1)}%`}>
              <Slider value={[ctr]} min={0.5} max={5} step={0.1} onValueChange={([v]) => setCtr(v)} />
            </Field>

            <div>
              <Label className="mb-3 block">Ad placements</Label>
              <div className="grid grid-cols-2 gap-3">
                {placements.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50">
                    <Checkbox checked={active.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="glass-card rounded-2xl p-6 space-y-4 h-fit lg:sticky lg:top-20">
            <div className="text-center pb-4 border-b border-border/60">
              <p className="text-sm text-muted-foreground mb-1">Estimated monthly earnings</p>
              <p className="text-4xl font-bold text-gradient">
                ${calc.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <Stat label="Daily" value={`$${calc.daily.toFixed(2)}`} />
            <Stat label="Annual" value={`$${calc.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <Stat label="RPM (per 1,000 views)" value={`$${calc.rpm.toFixed(2)}`} />
          </aside>
        </div>

        <div className="glass-card rounded-2xl p-6 mt-6">
          <h2 className="font-semibold mb-4 inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" /> 12-month projection</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AdSense Ad Slot */}
        <div className="my-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl p-6">
          AdSense ad slot
        </div>

        <article className="prose-invert max-w-none text-muted-foreground space-y-4">
          <h2 className="text-2xl font-bold text-foreground">How to maximize your AdSense revenue</h2>
          <p>RPM (revenue per mille) is the single most-important AdSense metric. To improve it, prioritize high-CPC niches (Finance, Tech, Health), target US/UK/CA traffic, and place ads in high-engagement positions (in-content beats sidebar by a wide margin). Layout matters too: a single well-placed in-article unit usually outperforms three poorly-placed ones.</p>
        </article>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
