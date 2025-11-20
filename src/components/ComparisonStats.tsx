import { TrendingUp, Users, Target } from "lucide-react";

interface ComparisonStatsProps {
  score: number;
}

export const ComparisonStats = ({ score }: ComparisonStatsProps) => {
  const averageScore = 65;
  const topPercentile = score >= 85 ? "Top 10%" : score >= 70 ? "Top 30%" : "Below Average";
  const passRate = Math.round((score / 100) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary-glow/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{score}/100</div>
            <div className="text-sm text-muted-foreground">Your Score</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {score >= averageScore ? `${score - averageScore} points above average` : `${averageScore - score} points below average`}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-success/20">
            <Users className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold">{topPercentile}</div>
            <div className="text-sm text-muted-foreground">Ranking</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Compared to other websites
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-warning/20">
            <Target className="h-5 w-5 text-warning" />
          </div>
          <div>
            <div className="text-2xl font-bold">{passRate}%</div>
            <div className="text-sm text-muted-foreground">Pass Rate</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {passRate >= 80 ? "Excellent eligibility" : "Needs improvement"}
        </div>
      </div>
    </div>
  );
};
