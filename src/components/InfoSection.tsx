import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, Target, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Monetization Ready",
    description: "Ensure your website meets all requirements for Google AdSense approval and start earning.",
  },
  {
    icon: Target,
    title: "Instant Analysis",
    description: "Get comprehensive results in seconds with detailed feedback on what needs improvement.",
  },
  {
    icon: TrendingUp,
    title: "Optimization Tips",
    description: "Receive actionable recommendations to improve your website's eligibility score.",
  },
  {
    icon: Shield,
    title: "Policy Compliance",
    description: "Verify your site follows Google's content policies and technical requirements.",
  },
];

const InfoSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Check Your AdSense Eligibility?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Google AdSense approval can be complex. Our tool simplifies the process by checking all critical requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, idx) => (
          <Card key={idx} className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto p-3 bg-primary/10 rounded-xl w-fit mb-3">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">What is Google AdSense?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Google AdSense is a free advertising program that allows website owners to earn money by displaying
            targeted ads on their websites. When visitors view or click these ads, you earn revenue.
          </p>
          <p>
            To get approved for AdSense, your website must meet specific requirements including quality content,
            sufficient traffic, proper domain setup, and compliance with Google's policies.
          </p>
          <p className="font-semibold text-foreground">
            Our tool checks all these requirements and provides detailed feedback to help you get approved faster.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default InfoSection;
