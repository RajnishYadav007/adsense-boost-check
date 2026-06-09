import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard, TrendingUp, History, Target, Trash2, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

interface CheckHistory {
  url: string;
  score: number;
  date: string;
}

const Dashboard = () => {
  const [history, setHistory] = useState<CheckHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentChecks");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentChecks");
    setHistory([]);
  };

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length)
    : 0;

  const bestScore = history.length > 0 
    ? Math.max(...history.map(h => h.score))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - Your AdSense Check History</title>
        <meta name="description" content="View your AdSense eligibility check history, track score trends across sites, and revisit past website analyses." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/dashboard" />
        <meta property="og:title" content="Dashboard - Your AdSense Check History" />
        <meta property="og:description" content="Track your AdSense eligibility checks and score trends over time." />
        <meta property="og:url" content="https://adsense-boost-check.lovable.app/dashboard" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Your Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Check History & Analytics
            </h1>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={clearHistory} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <History className="w-4 h-4" />
                Total Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{history.length}</div>
              <p className="text-sm text-muted-foreground mt-1">websites analyzed</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}%
              </div>
              <Progress value={averageScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Best Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(bestScore)}`}>
                {bestScore}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">highest achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No checks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by checking your first website
                </p>
                <Link to="/">
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Check a Website
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{check.url}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(check.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(check.score)}`}>
                          {check.score}%
                        </div>
                      </div>
                      <Badge variant={getScoreBadge(check.score)}>
                        {check.score >= 80 ? "Ready" : check.score >= 60 ? "Almost" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
