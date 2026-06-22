import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, X } from "lucide-react";

export function StickyCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:bottom-6 md:right-6 md:inset-x-auto z-40 animate-in slide-in-from-bottom-4">
      <div className="glass-card rounded-2xl shadow-elegant border border-border/60 p-3 md:p-4 flex items-center gap-3 max-w-md mx-auto">
        <div className="hidden sm:flex h-9 w-9 rounded-xl bg-gradient-primary items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Free AdSense audit</div>
          <div className="text-xs text-muted-foreground truncate">47-point report in 20 seconds</div>
        </div>
        <Button
          size="sm"
          onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full bg-gradient-primary shadow-glow"
        >
          Analyze
        </Button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
