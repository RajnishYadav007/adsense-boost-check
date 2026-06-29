import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { eeat } from "@/config/eeat";
import { MissingSectionNotice } from "@/components/eeat/Placeholder";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Team() {
  const authors = eeat.authors;
  return (
    <SiteLayout>
      <Helmet>
        <title>Meet the Team — {eeat.company.brandName}</title>
        <meta
          name="description"
          content={`The editors, researchers, and reviewers behind ${eeat.company.brandName}.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/team"
        />
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Every article and tool is produced by named people with real
          experience in SEO, ad operations, or web publishing. Click any
          profile for full credentials and disclosures.
        </p>

        {authors.length === 0 ? (
          <MissingSectionNotice what="at least one author profile (name, role, bio, credentials, expertise)" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {authors.map((a) => (
              <Link key={a.slug} to={`/authors/${a.slug}`} className="block">
                <Card className="p-6 glass-card h-full hover:border-primary/40 transition">
                  <div className="flex items-center gap-4 mb-4">
                    {a.photoUrl ? (
                      <img
                        src={a.photoUrl}
                        alt={a.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                        {initials(a.name) || "?"}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground">
                        {a.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {a.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {a.bio}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
