import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Sparkles, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  url: string;
  onUrlChange: (v: string) => void;
  onCheck: () => void;
  isChecking: boolean;
}

const stats = [
  { value: "50,000+", label: "Sites analyzed" },
  { value: "47", label: "Check points" },
  { value: "98%", label: "Accuracy rate" },
  { value: "4.9★", label: "User rating" },
];

export default function NewHero({ url, onUrlChange, onCheck, isChecking }: HeroProps) {
  return (
    <section id="analyzer" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-mesh pointer-events-none" />
      <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-5 gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Trusted by 50,000+ webmasters in 2026
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5">
            Check If Your Website Is{" "}
            <span className="text-gradient-hero">Ready For Google AdSense</span> Approval
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Run a complete AdSense eligibility audit and discover issues that may prevent approval.
            Analyze content quality, SEO structure, trust signals, compliance pages, and technical performance — free, in under 20 seconds.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCheck();
            }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-card border border-border shadow-elegant">
              <div className="flex-1 flex items-center gap-2 pl-3">
                <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  disabled={isChecking}
                  aria-label="Website URL to analyze"
                />
              </div>
              <Button
                type="submit"
                disabled={isChecking}
                size="lg"
                className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow px-6 font-semibold"
              >
                {isChecking ? "Analyzing..." : (
                  <>
                    <Zap className="h-4 w-4 mr-1.5" />
                    Analyze Now — Free
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No login required</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Instant results</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Anonymous</span>
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center glass-card rounded-2xl p-4">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl md:text-3xl font-bold text-gradient">{s.value}</dd>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
