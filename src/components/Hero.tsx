import { Search, Sparkles, Shield, Zap, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface HeroProps {
  url: string;
  onUrlChange: (url: string) => void;
  onCheck: () => void;
  isChecking: boolean;
}

const Hero = ({ url, onUrlChange, onCheck, isChecking }: HeroProps) => {
  return (
    <section className="relative min-h-[700px] flex items-center justify-center px-4 py-20 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzYy0xLjY1NyAwLTMgMS4zNDMtMyAzczEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zLTEuMzQzLTMtMy0zeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/30 shadow-glow">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="text-sm text-white font-semibold tracking-wide">Free AdSense Eligibility Checker</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-2xl">
          Check Your Website's
          <span className="block mt-2 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-fade-in">
            Google AdSense Eligibility
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Get instant, comprehensive analysis of your website's readiness for Google AdSense. 
          Discover what's working and what needs improvement with actionable insights.
        </p>
        
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-3xl shadow-2xl backdrop-blur-sm">
            <Input
              type="url"
              placeholder="Enter your website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="flex-1 h-16 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary rounded-2xl px-6"
              onKeyDown={(e) => e.key === "Enter" && onCheck()}
            />
            <Button
              onClick={onCheck}
              disabled={isChecking}
              size="lg"
              className="h-16 px-10 text-lg font-bold bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-2xl"
            >
              {isChecking ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-3 h-6 w-6" />
                  Check Now
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-6 text-white/90">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Detailed Report</span>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">15+</div>
            <div className="text-sm text-white/80">Criteria Checked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-white/80">Accurate Analysis</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-white/80">Always Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
