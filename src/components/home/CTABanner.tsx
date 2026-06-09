import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 text-center shadow-elegant">
        <div aria-hidden className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Ready to Check Your Website?
          </h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-7">
            Join 50,000+ webmasters who used our free tool to get AdSense approved.
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full bg-background text-foreground hover:bg-background/90"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Analyze your site — free
          </Button>
        </div>
      </div>
    </section>
  );
}
