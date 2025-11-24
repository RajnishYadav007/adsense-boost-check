import { CheckResult } from "@/components/CheckResults";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ImprovementTimelineProps {
  results: CheckResult[];
  overallScore: number;
}

export const ImprovementTimeline = ({ results, overallScore }: ImprovementTimelineProps) => {
  const getFailedChecks = () => {
    const failed: Array<{ category: string; name: string; priority: "high" | "medium" | "low"; days: number }> = [];
    
    results.forEach((result) => {
      result.checks.forEach((check) => {
        if (check.status === "fail") {
          let priority: "high" | "medium" | "low" = "medium";
          let days = 7;

          if (check.name.includes("SSL") || check.name.includes("Privacy Policy")) {
            priority = "high";
            days = 1;
          } else if (check.name.includes("Content") || check.name.includes("Original")) {
            priority = "high";
            days = 14;
          } else if (check.name.includes("Domain Age")) {
            priority = "low";
            days = 180;
          } else {
            days = 7;
          }

          failed.push({
            category: result.category,
            name: check.name,
            priority,
            days,
          });
        }
      });
    });

    return failed.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const failedChecks = getFailedChecks();
  const totalDaysNeeded = Math.max(...failedChecks.map(c => c.days), 0);
  const estimatedWeeks = Math.ceil(totalDaysNeeded / 7);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      case "low": return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  if (overallScore >= 80) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-green-500">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Ready for AdSense!</h3>
            <p className="text-sm text-muted-foreground">Your website meets all requirements</p>
          </div>
        </div>
        <p className="text-sm">
          Your website is well-prepared for Google AdSense approval. You can apply now with confidence!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gradient-primary">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Improvement Roadmap</h3>
          <p className="text-sm text-muted-foreground">
            Estimated time to approval: <span className="font-semibold text-primary">{estimatedWeeks} weeks</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {failedChecks.map((check, index) => (
          <div key={index} className="relative pl-8 pb-6 last:pb-0">
            {/* Timeline line */}
            {index < failedChecks.length - 1 && (
              <div className="absolute left-[11px] top-8 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getPriorityColor(check.priority)}>
                      {getPriorityIcon(check.priority)}
                      <span className="ml-1 capitalize">{check.priority} Priority</span>
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {check.days} days
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">{check.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{check.category}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Complete tasks in order of priority for fastest approval</span>
        </div>
      </div>
    </Card>
  );
};
