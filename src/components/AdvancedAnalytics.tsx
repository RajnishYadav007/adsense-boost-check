import { CheckResult } from "@/components/CheckResults";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap,
  Shield,
  Globe,
  FileText,
  Gauge
} from "lucide-react";

interface AdvancedAnalyticsProps {
  results: CheckResult[];
  overallScore: number;
}

export const AdvancedAnalytics = ({ results, overallScore }: AdvancedAnalyticsProps) => {
  const getCategoryScore = (categoryName: string) => {
    const category = results.find(r => r.category === categoryName);
    if (!category) return 0;
    
    const passed = category.checks.filter(c => c.status === "pass").length;
    const total = category.checks.length;
    return Math.round((passed / total) * 100);
  };

  const categoryScores = {
    domain: getCategoryScore("Domain Criteria"),
    availability: getCategoryScore("Site Availability"),
    content: getCategoryScore("Site Content"),
    performance: getCategoryScore("Site Performance"),
  };

  const getStrengthLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-green-500", bgColor: "bg-green-500/10" };
    if (score >= 75) return { label: "Good", color: "text-blue-500", bgColor: "bg-blue-500/10" };
    if (score >= 60) return { label: "Fair", color: "text-yellow-500", bgColor: "bg-yellow-500/10" };
    return { label: "Needs Work", color: "text-red-500", bgColor: "bg-red-500/10" };
  };

  const calculateApprovalProbability = () => {
    if (overallScore >= 90) return 95;
    if (overallScore >= 80) return 85;
    if (overallScore >= 70) return 65;
    if (overallScore >= 60) return 45;
    return 25;
  };

  const approvalProbability = calculateApprovalProbability();

  const categories = [
    { name: "Domain Criteria", score: categoryScores.domain, icon: Globe, key: "domain" },
    { name: "Site Availability", score: categoryScores.availability, icon: Shield, key: "availability" },
    { name: "Site Content", score: categoryScores.content, icon: FileText, key: "content" },
    { name: "Site Performance", score: categoryScores.performance, icon: Gauge, key: "performance" },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gradient-primary">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">Deep insights into your website's eligibility</p>
        </div>
      </div>

      {/* Approval Probability */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <div>
            <h4 className="font-semibold">Approval Probability</h4>
            <p className="text-sm text-muted-foreground">Based on current metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={approvalProbability} className="h-3" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {approvalProbability}%
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3">
          {approvalProbability >= 80 
            ? "High chance of approval - your site meets most requirements!"
            : approvalProbability >= 60
            ? "Moderate chance - address warning items to improve odds"
            : "Lower probability - focus on failed checks for better results"}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Category Performance
        </h4>
        
        <div className="grid gap-4">
          {categories.map((category) => {
            const strength = getStrengthLevel(category.score);
            const Icon = category.icon;
            
            return (
              <div key={category.key} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${strength.bgColor}`}>
                      <Icon className={`h-5 w-5 ${strength.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{category.score}%</p>
                  </div>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Strengths */}
      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm mb-2">Key Strengths</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {categoryScores.domain >= 75 && (
                <li>✓ Strong domain foundation and policies</li>
              )}
              {categoryScores.availability >= 75 && (
                <li>✓ Excellent site availability and security</li>
              )}
              {categoryScores.content >= 75 && (
                <li>✓ High-quality, original content</li>
              )}
              {categoryScores.performance >= 75 && (
                <li>✓ Optimized performance and user experience</li>
              )}
              {overallScore < 75 && (
                <li className="text-yellow-600">⚠ Focus on addressing failed checks to unlock strengths</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
