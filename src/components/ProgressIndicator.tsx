import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentCheck: string;
  progress: number;
}

export const ProgressIndicator = ({ currentCheck, progress }: ProgressIndicatorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Website</h3>
          <p className="text-muted-foreground text-sm">
            Current Check: <span className="text-primary font-medium">{currentCheck}</span>
          </p>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="text-center text-sm text-muted-foreground">
          {progress}% Complete
        </div>
      </div>
    </div>
  );
};
