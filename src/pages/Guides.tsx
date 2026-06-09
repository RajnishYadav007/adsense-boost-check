import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

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

  return (
    <SiteLayout>
      <Helmet>
        <title>AdSense Guides — Step-by-Step Approval Walkthroughs</title>
        <meta name="description" content="Comprehensive guides covering every step of the Google AdSense approval process for 2026." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/guides" />
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-12">
          <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">In-depth guides</h1>
          <p className="text-muted-foreground">Long-form walkthroughs of the full AdSense approval workflow.</p>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : !guides || guides.length === 0 ? (
          <p className="text-center text-muted-foreground">No guides yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                to={`/guides/${g.slug}`}
                className="group glass-card rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <span className="text-xs font-medium text-primary uppercase tracking-wider">{g.category}</span>
                <h2 className="text-xl font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{g.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{g.excerpt}</p>
                <span className="text-xs text-muted-foreground">{g.read_time_minutes} min read</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
