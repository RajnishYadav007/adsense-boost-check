import { Clock, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";

interface RecentChecksProps {
  checks: Array<{ url: string; score: number; date: string }>;
  onSelect: (url: string) => void;
}

const RecentChecks = ({ checks, onSelect }: RecentChecksProps) => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Recent Checks</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checks.map((check, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-card"
              onClick={() => onSelect(check.url)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{check.url}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(check.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-4 h-4 ${check.score >= 80 ? 'text-success' : check.score >= 60 ? 'text-warning' : 'text-destructive'}`} />
                  <span className={`text-lg font-bold ${check.score >= 80 ? 'text-success' : check.score >= 60 ? 'text-warning' : 'text-destructive'}`}>
                    {check.score}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentChecks;
