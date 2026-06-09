import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,category,cover_image_url,published_at,read_time_minutes")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <Helmet>
        <title>Blog — AdSense Approval Tips & Strategy</title>
        <meta name="description" content="Tactical articles on getting Google AdSense approved, growing AdSense revenue, and avoiding common rejection reasons." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/blog" />
      </Helmet>
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">The Blog</h1>
          <p className="text-muted-foreground">Tactics, case studies, and walkthroughs for AdSense success.</p>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : !posts || posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group glass-card rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <div className="h-40 bg-gradient-hero relative">
                  {p.cover_image_url && (
                    <img src={p.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                  )}
                  <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-background/90">{p.category}</span>
                </div>
                <div className="p-5">
                  <h2 className="font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">{p.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Recently"}
                    <span>·</span>
                    <span>{p.read_time_minutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
