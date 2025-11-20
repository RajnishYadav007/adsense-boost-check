import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Globe, Lock, FileText, Gauge, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ShareButtons } from "./ShareButtons";
import { ScoreChart } from "./ScoreChart";
import { DetailedRecommendations } from "./DetailedRecommendations";
import { ComparisonStats } from "./ComparisonStats";
import { Separator } from "./ui/separator";

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
    <section id="results" className="max-w-7xl mx-auto px-4 py-20 scroll-mt-20">
      {/* Share Section */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent mb-8">
        <h3 className="text-lg font-semibold mb-4">Share Your Results</h3>
        <ShareButtons websiteUrl={websiteUrl} score={overallScore} />
      </Card>

      {/* Comparison Stats */}
      <div className="mb-8">
        <ComparisonStats score={overallScore} />
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Your Eligibility Results
        </h2>
        <div className="max-w-xl mx-auto">
          <div className="relative inline-flex flex-col items-center gap-6 p-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary-glow/5 rounded-3xl border-2 border-primary/30 animate-fade-in shadow-glow">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className={`text-8xl font-black ${getScoreColor(animatedScore)} drop-shadow-lg`}>
                {animatedScore}%
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground mb-2">Overall Score</p>
                <Progress value={animatedScore} className="w-80 h-4 mb-3" />
                <p className={`text-base font-bold ${getScoreColor(overallScore)}`}>
                  {getScoreLabel(overallScore)}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                <Button onClick={exportResults} variant="outline" size="lg" className="font-semibold">
                  <Download className="w-5 h-5 mr-2" />
                  Export Report
                </Button>
                <Button 
                  onClick={() => window.open('https://www.google.com/adsense', '_blank')} 
                  className="bg-gradient-primary font-semibold"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Apply to AdSense
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {getRecommendations()}

      {/* Score Breakdown and Check Results */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Score Chart */}
        <Card className="p-6">
          <ScoreChart results={results} />
        </Card>

        {/* Check Categories */}
        <div className="space-y-6">
        {results.map((result, idx) => {
          const CategoryIcon = iconMap[result.icon];
          const passCount = result.checks.filter((c) => c.status === "pass").length;
          const totalCount = result.checks.length;

          return (
            <Card
              key={idx}
              className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-md group-hover:shadow-glow transition-shadow duration-300">
                    <CategoryIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{result.category}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {passCount} of {totalCount} checks passed
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                {result.checks.map((check, checkIdx) => {
                  const config = statusConfig[check.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={checkIdx}
                      className={`flex gap-4 p-4 rounded-xl ${config.bgColor} border border-transparent hover:border-${check.status === 'pass' ? 'success' : check.status === 'fail' ? 'destructive' : 'warning'}/30 transition-all duration-200`}
                    >
                      <StatusIcon className={`w-6 h-6 flex-shrink-0 ${config.color}`} />
                      <div className="flex-1">
                        <p className="font-bold text-base mb-1.5">{check.name}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{check.message}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Detailed Recommendations */}
      <DetailedRecommendations results={results} />
    </section>
  );
};

export default CheckResults;
