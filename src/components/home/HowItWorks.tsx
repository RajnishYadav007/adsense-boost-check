import { Search, BarChart3, ListChecks, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Search, title: "Enter Domain", desc: "Paste any URL to start the audit." },
  { icon: BarChart3, title: "We Audit 47 Points", desc: "Real fetches plus AI analysis." },
  { icon: ListChecks, title: "Get Your Score", desc: "Detailed report in under 20 seconds." },
  { icon: Rocket, title: "Fix & Apply", desc: "Follow the personalized action plan." },
];

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-20" aria-labelledby="how-it-works">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 id="how-it-works" className="text-3xl md:text-4xl font-bold mb-3">
          How Our Checker Works
        </h2>
        <p className="text-muted-foreground">Four steps from URL to AdSense readiness.</p>
      </div>
      <div className="relative grid gap-8 md:grid-cols-4">
        <div aria-hidden className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative text-center"
          >
            <div className="relative z-10 inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-card border border-border shadow-card">
              <s.icon className="h-10 w-10 text-primary" />
              <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold inline-flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
