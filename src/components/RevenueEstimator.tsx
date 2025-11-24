import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface RevenueEstimatorProps {
  overallScore: number;
}

export const RevenueEstimator = ({ overallScore }: RevenueEstimatorProps) => {
  const [monthlyVisitors, setMonthlyVisitors] = useState("10000");
  const [niche, setNiche] = useState("general");

  const nicheMultipliers: Record<string, number> = {
    general: 1,
    finance: 3.5,
    technology: 2.8,
    health: 2.5,
    education: 2.0,
    entertainment: 1.5,
    lifestyle: 1.8,
  };

  const calculateRevenue = () => {
    const visitors = parseInt(monthlyVisitors) || 0;
    const baseRPM = 2.5; // Base Revenue Per Mille (1000 visitors)
    const nicheMultiplier = nicheMultipliers[niche] || 1;
    const scoreMultiplier = overallScore / 100;
    
    const estimatedRevenue = (visitors / 1000) * baseRPM * nicheMultiplier * scoreMultiplier;
    const minRevenue = estimatedRevenue * 0.7;
    const maxRevenue = estimatedRevenue * 1.3;

    return {
      min: minRevenue.toFixed(0),
      avg: estimatedRevenue.toFixed(0),
      max: maxRevenue.toFixed(0),
    };
  };

  const revenue = calculateRevenue();

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gradient-primary">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Revenue Estimator</h3>
          <p className="text-sm text-muted-foreground">Calculate your potential AdSense earnings</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="visitors">Monthly Visitors</Label>
          <Input
            id="visitors"
            type="number"
            value={monthlyVisitors}
            onChange={(e) => setMonthlyVisitors(e.target.value)}
            placeholder="10000"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="niche">Website Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="finance">Finance (High CPM)</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="health">Health & Wellness</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Estimated Monthly Revenue</h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">${revenue.min}</p>
            <p className="text-xs text-muted-foreground mt-1">Minimum</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ${revenue.avg}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">${revenue.max}</p>
            <p className="text-xs text-muted-foreground mt-1">Maximum</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-sm font-medium">Based on your current score ({overallScore}%)</p>
              <p className="text-xs text-muted-foreground mt-1">
                {overallScore >= 80
                  ? "Your site is well-optimized for maximum revenue!"
                  : overallScore >= 60
                  ? "Improve your score to unlock higher earning potential"
                  : "Address critical issues to start earning with AdSense"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-accent/10 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <span className="font-medium">Note:</span> Estimates are based on industry averages. 
          Actual earnings vary based on traffic quality, ad placement, CTR, and seasonal factors.
        </p>
      </div>
    </Card>
  );
};
