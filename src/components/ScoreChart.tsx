import { CheckResult } from "@/components/CheckResults";

interface ScoreChartProps {
  results: CheckResult[];
}

export const ScoreChart = ({ results }: ScoreChartProps) => {
  const categories = results.map(r => {
    const passed = r.checks.filter(c => c.status === 'pass').length;
    const total = r.checks.length;
    return {
      name: r.category,
      percentage: (passed / total) * 100,
      passed,
      total
    };
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Score Breakdown</h3>
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{cat.name}</span>
              <span className="text-muted-foreground">{cat.passed}/{cat.total}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
