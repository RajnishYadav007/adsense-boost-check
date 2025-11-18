import { Search } from "lucide-react";

interface HeroProps {
  url: string;
  onUrlChange: (url: string) => void;
  onCheck: () => void;
  isChecking: boolean;
}

const Hero = ({ url, onUrlChange, onCheck, isChecking }: HeroProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheck();
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center px-4 py-20 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-100"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          Check Website's Eligibility For
          <span className="block mt-2 bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
            Google AdSense Approval
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Instantly analyze your website and discover if it meets Google's standards for AdSense monetization
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20">
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="Enter your website URL (e.g., https://example.com)"
              className="flex-1 px-6 py-4 bg-white rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={isChecking}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-glow text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              {isChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Eligibility
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
