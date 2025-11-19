import { CheckCircle, HelpCircle, Lightbulb, TrendingUp, Shield, Zap, Target, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const InfoSection = () => {
  const tips = [
    {
      icon: CheckCircle,
      title: "Quality Content",
      description: "Create original, valuable content with at least 15-20 high-quality posts of 500+ words each.",
      color: "from-success/20 to-success/5",
    },
    {
      icon: TrendingUp,
      title: "Consistent Traffic",
      description: "Build steady organic traffic before applying. Google looks for established websites with regular visitors.",
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: Lightbulb,
      title: "User Experience",
      description: "Ensure easy navigation, fast loading times, and mobile responsiveness for better approval chances.",
      color: "from-accent/20 to-accent/5",
    },
    {
      icon: HelpCircle,
      title: "Policy Compliance",
      description: "Follow AdSense policies strictly - no prohibited content, clear privacy policy, and proper disclosures.",
      color: "from-warning/20 to-warning/5",
    },
  ];

  const features = [
    { icon: Shield, label: "Secure & Private", value: "100%" },
    { icon: Zap, label: "Instant Analysis", value: "< 3s" },
    { icon: Target, label: "Accuracy Rate", value: "99%" },
    { icon: Award, label: "Criteria Checked", value: "15+" },
  ];

  return (
    <section className="px-4 py-20">
      {/* Tips Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Pro Tips for AdSense Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Follow these proven strategies to maximize your chances of getting approved for Google AdSense
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <Card 
                key={idx} 
                className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 overflow-hidden group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-primary rounded-xl shadow-md group-hover:shadow-glow transition-shadow duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed">
                    {tip.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex p-4 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {feature.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {feature.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary-glow/10 rounded-3xl border-2 border-primary/30 overflow-hidden shadow-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">
              About Google AdSense
            </h3>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed mb-8">
              Google AdSense is a premier advertising program that enables website owners to monetize their content 
              by displaying targeted, contextual advertisements. With billions in annual payouts to publishers worldwide, 
              AdSense remains the gold standard for website monetization.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/20">
                <div className="text-4xl font-black text-primary mb-2">$</div>
                <div className="text-sm font-semibold text-muted-foreground">Earn Revenue</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-accent/20">
                <div className="text-4xl font-black text-accent mb-2">∞</div>
                <div className="text-sm font-semibold text-muted-foreground">Unlimited Potential</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary-glow/20">
                <div className="text-4xl font-black text-primary-glow mb-2">✓</div>
                <div className="text-sm font-semibold text-muted-foreground">Trusted by Millions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
