import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ChevronLeft } from "lucide-react";

const SITE = "https://adsense-boost-check.lovable.app";

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("slug,title,excerpt,body,category,read_time_minutes,published_at,cover_image_url")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["guides-related", guide?.category, slug],
    enabled: !!guide,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("slug,title,excerpt,category,read_time_minutes")
        .eq("published", true)
        .neq("slug", slug!)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading guide…</div>
      </SiteLayout>
    );
  }

  if (!guide) {
    return (
      <SiteLayout>
        <Helmet>
          <title>Guide not found — AdSense Approval Checker</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-3">Guide not found</h1>
          <p className="text-muted-foreground mb-6">The guide you're looking for doesn't exist or was unpublished.</p>
          <Link to="/guides" className="text-primary underline">Browse all guides</Link>
        </div>
      </SiteLayout>
    );
  }

  const canonical = `${SITE}/guides/${guide.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.published_at,
    dateModified: guide.published_at,
    author: { "@type": "Organization", name: "AdSense Approval Checker Editorial Team" },
    publisher: {
      "@type": "Organization",
      name: "AdSense Approval Checker",
      url: SITE,
    },
    mainEntityOfPage: canonical,
    articleSection: guide.category,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: canonical },
    ],
  };

  return (
    <SiteLayout>
      <Helmet>
        <title>{guide.title} — AdSense Approval Checker</title>
        <meta name="description" content={guide.excerpt} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.excerpt} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/guides" className="hover:text-foreground">Guides</Link>
          <span>/</span>
          <span className="text-foreground truncate">{guide.title}</span>
        </nav>

        <Link to="/guides" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4" /> All guides
        </Link>

        <header className="mb-8">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">{guide.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3 leading-tight">{guide.title}</h1>
          <p className="text-lg text-muted-foreground">{guide.excerpt}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            {guide.published_at && (
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(guide.published_at).toLocaleDateString()}</span>
            )}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{guide.read_time_minutes} min read</span>
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-headings:font-bold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.body}</ReactMarkdown>
        </div>

        {related && related.length > 0 && (
          <aside className="mt-16 pt-10 border-t">
            <h2 className="text-xl font-semibold mb-6">Continue reading</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/guides/${r.slug}`}
                  className="group glass-card rounded-xl p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{r.category}</span>
                  <h3 className="font-semibold mt-1 mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </aside>
        )}

        <div className="mt-16 glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Audit your site in 30 seconds</h2>
          <p className="text-muted-foreground mb-5">Run a free AdSense readiness audit and see exactly what to fix before you apply.</p>
          <Link
            to="/tools/adsense-approval-checker"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Run free audit →
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}
