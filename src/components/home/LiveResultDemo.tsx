import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const bars = [
  { name: "Content Quality", v: 8, max: 10 },
  { name: "SEO Architecture", v: 7, max: 8 },
  { name: "Security", v: 6, max: 7 },
  { name: "Legal Pages", v: 6, max: 8 },
  { name: "Performance", v: 7, max: 7 },
  { name: "AdSense Policy", v: 5, max: 7 },
];

export function LiveResultDemo() {
  const score = 84;
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="container mx-auto px-4 py-20" aria-labelledby="result-demo">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 id="result-demo" className="text-3xl md:text-4xl font-bold mb-3">
          See What Your Report Looks Like
        </h2>
        <p className="text-muted-foreground">A real preview of the audit you'll get.</p>
      </div>
      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
          <div className="relative inline-flex flex-col items-center">
            <svg width="160" height="160" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r="56" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
              <motion.circle
                cx="70" cy="70" r="56" stroke="hsl(var(--success))" strokeWidth="10" fill="none"
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/15 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Likely approved
            </span>
          </div>

          <div className="space-y-3">
            {bars.map((b, i) => {
              const pct = (b.v / b.max) * 100;
              return (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{b.name}</span>
                    <span className="font-mono text-xs">{b.v}/{b.max}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <XCircle className="h-4 w-4" /> 1 critical issue
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
            <AlertTriangle className="h-4 w-4" /> 3 warnings
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" /> 43 passed
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            Run your own analysis →
          </Button>
        </div>
      </div>
    </section>
  );
}
