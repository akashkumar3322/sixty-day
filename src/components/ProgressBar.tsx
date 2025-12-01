import { useEffect, useState } from "react";

interface ProgressBarProps {
  completions: unknown;
  totalTasks: number;
  totalDays: number;
}

export function ProgressBar({ completions, totalTasks, totalDays }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalPossible = totalTasks * totalDays;
    let completed = 0;

    for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
      for (let day = 1; day <= totalDays; day++) {
        if (completions[taskIndex]?.[day]) {
          completed++;
        }
      }
    }

    setProgress((completed / totalPossible) * 100);
  }, [completions, totalTasks, totalDays]);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Overall Progress</span>
        <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Keep going! You're doing great 🎯
      </p>
    </div>
  );
}
