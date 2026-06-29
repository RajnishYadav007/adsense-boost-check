import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { eeat } from "@/config/eeat";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AuthorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const author = eeat.authors.find((a) => a.slug === slug);

  if (!author) {
    return (
      <SiteLayout>
        <Helmet>
          <title>Author not found — {eeat.company.brandName}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Author not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find an author with that profile.
          </p>
          <Link to="/team" className="text-primary underline">
            ← Back to the team
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const url = `https://adsense-boost-check.lovable.app/authors/${author.slug}`;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url,
    knowsAbout: author.expertise,
    sameAs: author.socials.map((s) => s.url),
    worksFor: { "@type": "Organization", name: eeat.company.brandName },
  };

  return (
    <SiteLayout>
      <Helmet>
        <title>
          {author.name} — {author.role} | {eeat.company.brandName}
        </title>
        <meta name="description" content={author.bio.slice(0, 158)} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link
          to="/team"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to team
        </Link>

        <header className="flex items-center gap-6 mt-6 mb-10">
          {author.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={author.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-primary/20 text-primary text-2xl flex items-center justify-center font-semibold">
              {initials(author.name)}
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{author.name}</h1>
            <div className="text-muted-foreground mt-1">{author.role}</div>
            {author.yearsExperience > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {author.yearsExperience}+ years of experience
              </div>
            )}
          </div>
        </header>

        <section className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Bio</h2>
          <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-3">Expertise</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
              {author.expertise.length === 0 ? (
                <li className="list-none text-amber-500">
                  No expertise areas listed yet.
                </li>
              ) : (
                author.expertise.map((e) => <li key={e}>{e}</li>)
              )}
            </ul>
          </Card>
          <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-3">Credentials</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
              {author.credentials.length === 0 ? (
                <li className="list-none text-amber-500">
                  No credentials listed yet.
                </li>
              ) : (
                author.credentials.map((c) => <li key={c}>{c}</li>)
              )}
            </ul>
          </Card>
        </div>

        {(author.socials.length > 0 || author.email) && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-3">Contact & profiles</h2>
            <ul className="space-y-2 text-muted-foreground">
              {author.email && (
                <li>
                  Email:{" "}
                  <a
                    className="text-primary underline"
                    href={`mailto:${author.email}`}
                  >
                    {author.email}
                  </a>
                </li>
              )}
              {author.socials.map((s) => (
                <li key={s.url}>
                  {s.label}:{" "}
                  <a
                    className="text-primary underline"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    {s.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold mb-2">Editorial disclosure</h2>
          <p className="text-sm text-muted-foreground">
            {author.name} writes and/or reviews content for{" "}
            {eeat.company.brandName} under our{" "}
            <Link to="/editorial-policy" className="text-primary underline">
              Editorial Policy
            </Link>
            ,{" "}
            <Link to="/fact-checking-policy" className="text-primary underline">
              Fact-Checking Policy
            </Link>
            , and{" "}
            <Link to="/corrections-policy" className="text-primary underline">
              Corrections Policy
            </Link>
            . They do not accept payment for favorable reviews.
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
