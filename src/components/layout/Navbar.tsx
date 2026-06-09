import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const toolLinks = [
  { to: "/tools", label: "All Tools" },
  { to: "/tools/adsense-revenue-calculator", label: "Revenue Calculator" },
  { to: "/tools/policy-page-generator", label: "Policy Page Generator" },
  { to: "/tools/seo-checklist", label: "SEO Checklist" },
];

const guideLinks = [
  { to: "/guides", label: "All Guides" },
  { to: "/resources", label: "Resources Library" },
];

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg shrink-0">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </span>
          <span>
            AdSense<span className="text-gradient">✓</span>Checker
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavItem to="/">Home</NavItem>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tools <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {toolLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Guides <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {guideLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavItem to="/blog">Blog</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/contact">Contact</NavItem>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={() => navigate("/#analyzer")}
            className="hidden sm:inline-flex rounded-full bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Analyze Site
          </Button>
          <button
            type="button"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-heading font-bold">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-secondary"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="container mx-auto px-4 pt-4 flex flex-col gap-1">
            {mainLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 px-4 text-xs uppercase tracking-wider text-muted-foreground">Tools</div>
            {toolLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 px-4 text-xs uppercase tracking-wider text-muted-foreground">Guides</div>
            {guideLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
