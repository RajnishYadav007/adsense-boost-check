import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, CheckSquare, AlertTriangle, ShieldCheck, FileText, GraduationCap, Sparkles, Globe } from "lucide-react";

const CATEGORY_META: Record<string, { icon: typeof BookOpen; description: string; order: number }> = {
  "Eligibility":      { icon: GraduationCap, description: "What Google requires before approving your site.", order: 1 },
  "Checklist":        { icon: CheckSquare,   description: "Printable pre-application checklists.",            order: 2 },
  "Getting Started":  { icon: Sparkles,      description: "Brand-new blogs — fastest path to approval.",      order: 3 },
  "Audit":            { icon: ShieldCheck,   description: "Step-by-step site audit walkthroughs.",            order: 4 },
  "Policy":           { icon: ShieldCheck,   description: "Stay compliant with AdSense program policies.",    order: 5 },
  "Rejection":        { icon: AlertTriangle, description: "Decode rejections and reapply successfully.",      order: 6 },
  "Errors":           { icon: AlertTriangle, description: "Fix specific AdSense errors and warnings.",        order: 7 },
  "Quality":          { icon: FileText,      description: "Content quality standards reviewers look for.",    order: 8 },
  "Compliance":       { icon: FileText,      description: "Required pages and legal compliance.",             order: 9 },
  "Niche":            { icon: Globe,         description: "Playbooks for WordPress, Blogger, and more.",      order: 10 },
  "FAQ":              { icon: BookOpen,      description: "Answers to common AdSense approval questions.",    order: 11 },
};

export default function Guides() {
  const { data: guides, isLoading } = useQuery({
    queryKey: ["guides-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("slug,title,excerpt,category,read_time_minutes,published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const grouped = (guides ?? []).reduce<Record<string, typeof guides extends (infer T)[] | null | undefined ? T[] : never>>((acc, g) => {
    (acc[g.category] = acc[g.category] || []).push(g);
    return acc;
  }, {} as any);

  const categories = Object.keys(grouped).sort(
    (a, b) => (CATEGORY_META[a]?.order ?? 99) - (CATEGORY_META[b]?.order ?? 99)
  );

  return (
    <SiteLayout>
      <Helmet>
        <title>AdSense Guides — Eligibility, Approval & Policy Walkthroughs</title>
        <meta
          name="description"
          content="In-depth guides covering AdSense eligibility, approval requirements, policy compliance, rejection fixes, and niche-specific playbooks for 2026."
        />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/guides" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AdSense Approval Guides",
          url: "https://adsense-boost-check.lovable.app/guides",
          description: "Editorial guides on AdSense eligibility, approval, policy, and rejection recovery.",
          hasPart: (guides ?? []).map((g) => ({
            "@type": "Article",
            headline: g.title,
            url: `https://adsense-boost-check.lovable.app/guides/${g.slug}`,
            articleSection: g.category,
          })),
        })}</script>
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-12">
          <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">The AdSense Approval Knowledge Base</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Long-form, editor-reviewed walkthroughs covering every phase of getting your site approved for Google AdSense — and staying compliant after.
          </p>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : !guides || guides.length === 0 ? (
          <p className="text-center text-muted-foreground">No guides yet. Check back soon.</p>
        ) : (
          <div className="space-y-14">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta?.icon ?? BookOpen;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold">{cat}</h2>
                      {meta?.description && (
                        <p className="text-sm text-muted-foreground">{meta.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {grouped[cat].map((g: any) => (
                      <Link
                        key={g.slug}
                        to={`/guides/${g.slug}`}
                        className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                      >
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {g.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{g.excerpt}</p>
                        <span className="text-xs text-muted-foreground">{g.read_time_minutes} min read</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
