import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Zap } from "lucide-react";

/** URL input that hands off to the homepage audit with ?url= autorun. */
export function UrlAuditCTA({ buttonLabel = "Run free audit" }: { buttonLabel?: string }) {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    navigate(`/?url=${encodeURIComponent(url.trim())}&autorun=1#analyzer`);
  };
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 pl-3 bg-background border border-border rounded-xl">
        <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
        <Input
          type="url"
          placeholder="https://yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          aria-label="Website URL to audit"
        />
      </div>
      <Button type="submit" size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow px-6 font-semibold">
        <Zap className="h-4 w-4 mr-1.5" />
        {buttonLabel}
      </Button>
    </form>
  );
}
