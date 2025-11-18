import { CheckCircle2, XCircle, AlertCircle, Globe, Lock, FileText, Gauge } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export interface CheckResult {
  category: string;
  icon: "globe" | "lock" | "file" | "gauge";
  checks: {
    name: string;
    status: "pass" | "fail" | "warning";
    message: string;
  }[];
}

interface CheckResultsProps {
  results: CheckResult[];
  overallScore: number;
}

const iconMap = {
  globe: Globe,
  lock: Lock,
  file: FileText,
  gauge: Gauge,
};

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  fail: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  warning: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
};

const CheckResults = ({ results, overallScore }: CheckResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent - Ready for AdSense";
    if (score >= 60) return "Good - Minor improvements needed";
    return "Needs Work - Address critical issues";
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Eligibility Results</h2>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Overall Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-3 mb-2" />
          <p className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
            {getScoreLabel(overallScore)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {results.map((result, idx) => {
          const CategoryIcon = iconMap[result.icon];
          const passCount = result.checks.filter((c) => c.status === "pass").length;
          const totalCount = result.checks.length;

          return (
            <Card
              key={idx}
              className="hover:shadow-lg transition-shadow duration-300 border-2"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CategoryIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{result.category}</CardTitle>
                </div>
                <CardDescription>
                  {passCount} of {totalCount} checks passed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.checks.map((check, checkIdx) => {
                  const config = statusConfig[check.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={checkIdx}
                      className={`flex gap-3 p-3 rounded-lg ${config.bgColor}`}
                    >
                      <StatusIcon className={`w-5 h-5 flex-shrink-0 ${config.color}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">{check.name}</p>
                        <p className="text-xs text-muted-foreground">{check.message}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default CheckResults;
