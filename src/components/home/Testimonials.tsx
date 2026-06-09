import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya R.", country: "India", initials: "PR",
    quote: "Approved on my first AdSense application after fixing the 4 issues this tool found. Saved me weeks of guesswork.",
  },
  {
    name: "Marcus J.", country: "USA", initials: "MJ",
    quote: "I'd been rejected twice. The audit flagged missing legal pages and weak content depth. Approved 8 days later.",
  },
  {
    name: "Sara L.", country: "UK", initials: "SL",
    quote: "The action plan is the killer feature — it tells you exactly what to fix in priority order. Five stars.",
  },
];

const gradients = ["from-primary to-accent", "from-accent to-primary", "from-primary-glow to-accent"];

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Users Say</h2>
        <p className="text-muted-foreground">Real stories from real webmasters.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure key={t.name} className="glass-card rounded-2xl p-6">
            <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed mb-5">"{t.quote}"</blockquote>
            <figcaption className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradients[i]} text-primary-foreground inline-flex items-center justify-center text-sm font-semibold`}>
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">Blogger from {t.country}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
