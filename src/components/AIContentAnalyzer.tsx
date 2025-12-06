import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Loader2, CheckCircle, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIContentAnalyzerProps {
  websiteUrl: string;
}

interface AnalysisResult {
  overallQuality: "excellent" | "good" | "needs_improvement" | "poor";
  score: number;
  recommendations: {
    category: string;
    issue: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }[];
  strengths: string[];
  summary: string;
}

const AIContentAnalyzer = ({ websiteUrl }: AIContentAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { websiteUrl }
      });

      if (error) {
        if (error.message?.includes("429") || error.message?.includes("rate")) {
          toast.error("Rate limit reached. Please try again in a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please try again later.");
        } else {
          throw error;
        }
        return;
      }

      setResult(data);
      toast.success("AI analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityConfig = (quality: string) => {
    switch (quality) {
      case "excellent":
        return { color: "text-success", bg: "bg-success/10", icon: CheckCircle, label: "Excellent" };
      case "good":
        return { color: "text-primary", bg: "bg-primary/10", icon: CheckCircle, label: "Good" };
      case "needs_improvement":
        return { color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle, label: "Needs Improvement" };
      default:
        return { color: "text-destructive", bg: "bg-destructive/10", icon: XCircle, label: "Poor" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      default: return "secondary";
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          AI Content Quality Analysis
          <Badge variant="outline" className="ml-2 bg-gradient-primary text-primary-foreground border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!result ? (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              AI-Powered Content Analysis
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get personalized recommendations to improve your content quality and increase your AdSense approval chances.
            </p>
            <Button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className="gap-2 bg-gradient-primary hover:shadow-glow"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quality Score */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                {(() => {
                  const config = getQualityConfig(result.overallQuality);
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Content Quality</p>
                        <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-foreground">{result.score}</p>
                <p className="text-sm text-muted-foreground">/100</p>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-foreground">{result.summary}</p>
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Content Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((strength, index) => (
                    <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/30">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Recommendations
                </h4>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{rec.category}</span>
                        <Badge variant={getPriorityColor(rec.priority) as "default" | "secondary" | "destructive"}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-destructive mb-1">{rec.issue}</p>
                      <p className="text-sm text-muted-foreground">{rec.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={analyzeContent}
              variant="outline"
              disabled={isAnalyzing}
              className="w-full gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Re-analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Re-analyze Content
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIContentAnalyzer;
