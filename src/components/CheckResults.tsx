import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Globe, Lock, FileText, Gauge, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

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
  websiteUrl: string;
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

const CheckResults = ({ results, overallScore, websiteUrl }: CheckResultsProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = overallScore;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [overallScore]);

  const exportResults = () => {
    const reportContent = `
AdSense Eligibility Report
Website: ${websiteUrl}
Date: ${new Date().toLocaleDateString()}
Overall Score: ${overallScore}%

${results.map(category => `
${category.category}
${category.checks.map(check => `
  ✓ ${check.name}: ${check.status.toUpperCase()}
  ${check.message}
`).join('\n')}
`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adsense-report-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRecommendations = () => {
    const failed = results.flatMap(r => r.checks.filter(c => c.status === 'fail'));
    if (failed.length === 0) return null;
    
    return (
      <Card className="mb-8 border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Priority Actions Required</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {failed.map((check, index) => (
              <li key={index} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{check.name}</p>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
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
    <section id="results" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Eligibility Results</h2>
        <div className="max-w-md mx-auto">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-2xl border-2 border-primary/20 animate-fade-in">
            <div className={`text-6xl font-bold ${getScoreColor(animatedScore)}`}>
              {animatedScore}%
            </div>
            <p className="text-lg text-muted-foreground">Overall Score</p>
            <Progress value={animatedScore} className="w-64 h-3" />
            <p className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
              {getScoreLabel(overallScore)}
            </p>
            <div className="flex gap-3 mt-4">
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={() => window.open('https://www.google.com/adsense', '_blank')} variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply to AdSense
              </Button>
            </div>
          </div>
        </div>
      </div>

      {getRecommendations()}

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
