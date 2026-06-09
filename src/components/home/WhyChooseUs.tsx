import { Zap, Lock, Bot, Smartphone, RotateCcw, ListChecks } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Results", desc: "Complete 47-point audit in under 20 seconds." },
  { icon: Lock, title: "No Login Needed", desc: "100% anonymous — we don't store your data." },
  { icon: Bot, title: "AI-Powered Analysis", desc: "Smart content quality and policy detection." },
  { icon: Smartphone, title: "Mobile Optimized", desc: "Run audits from any device, anywhere." },
  { icon: RotateCcw, title: "Unlimited Checks", desc: "Re-analyze as many sites as you want, free." },
  { icon: ListChecks, title: "Action Plan", desc: "Specific fixes prioritized by impact." },
];

export function WhyChooseUs() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Why 50,000+ Webmasters Trust Us</h2>
        <p className="text-muted-foreground">Built by SEO veterans for creators, bloggers, and small businesses.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="glass-card rounded-2xl p-6 hover:shadow-elegant transition-shadow">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
