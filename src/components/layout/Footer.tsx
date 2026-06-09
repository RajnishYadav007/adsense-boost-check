import { Link } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, Twitter, Youtube, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: parsed.data, source: "footer" });
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        throw error;
      }
      toast.success("Subscribed! Check your inbox for AdSense tips.");
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border/60 bg-surface mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </span>
              AdSense<span className="text-gradient">✓</span>Checker
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The free 47-point audit that tells you whether your site is Google AdSense
              ready — instantly, with no signup.
            </p>
            <form onSubmit={subscribe} className="flex gap-2 max-w-sm pt-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter"
                className="bg-background"
              />
              <Button type="submit" disabled={loading} className="bg-gradient-primary hover:opacity-90">
                <Mail className="h-4 w-4 mr-1.5" />
                {loading ? "..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">Get AdSense tips in your inbox. No spam.</p>
          </div>

          <FooterColumn title="Tools">
            <FooterLink to="/tools">All Tools</FooterLink>
            <FooterLink to="/tools/adsense-revenue-calculator">Revenue Calculator</FooterLink>
            <FooterLink to="/tools/policy-page-generator">Policy Generator</FooterLink>
            <FooterLink to="/tools/seo-checklist">SEO Checklist</FooterLink>
          </FooterColumn>

          <FooterColumn title="Guides">
            <FooterLink to="/guides">All Guides</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/resources">Resources</FooterLink>
            <FooterLink to="/sitemap">HTML Sitemap</FooterLink>
          </FooterColumn>

          <FooterColumn title="Legal">
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
            <FooterLink to="/disclaimer">Disclaimer</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AdSenseApprovalChecker.net — All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {children}
      </Link>
    </li>
  );
}
