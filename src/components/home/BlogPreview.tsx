import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function BlogPreview() {
  const { data: posts } = useQuery({
    queryKey: ["home-blog-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,category,published_at,cover_image_url")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!posts || posts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest AdSense Tips & Guides</h2>
          <p className="text-muted-foreground">Fresh strategies from the AdSense Approval Checker team.</p>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/blog">View all articles <ArrowRight className="h-4 w-4 ml-1.5" /></Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="group glass-card rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <div className="h-40 bg-gradient-hero relative overflow-hidden">
              {p.cover_image_url ? (
                <img src={p.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              ) : null}
              <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-background/90 text-foreground">
                {p.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Recently"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
