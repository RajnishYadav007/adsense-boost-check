import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exitShown")) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem("exitShown", "1");
      }
    };
    const t = setTimeout(() => document.addEventListener("mouseout", handler), 4000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", handler);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="h-12 w-12 rounded-xl bg-gradient-primary mb-3 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">Wait — run a free audit before you go</DialogTitle>
          <DialogDescription className="text-base pt-1">
            Find out in 20 seconds whether your website will be approved for Google AdSense.
            No login, no email, no credit card.
          </DialogDescription>
        </DialogHeader>
        <Button
          size="lg"
          className="w-full rounded-xl bg-gradient-primary shadow-glow"
          onClick={() => {
            setOpen(false);
            document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Run my free AdSense audit
        </Button>
        <p className="text-center text-xs text-muted-foreground">Trusted by 50,000+ webmasters worldwide.</p>
      </DialogContent>
    </Dialog>
  );
}
