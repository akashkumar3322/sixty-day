import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCompletion {
  [taskIndex: number]: {
    [day: number]: boolean;
  };
}

const TASKS = [
  { time: "8:00–8:30", task: "Fresh up + Breakfast" },
  { time: "8:30–10:30", task: "Study (Your choice)" },
  { time: "10:30–11:00", task: "Break" },
  { time: "11:00–12:30", task: "Study / Test Revision" },
  { time: "12:30–1:00", task: "Lunch" },
  { time: "1:00–2:00", task: "Video Editing Practice" },
  { time: "2:00–3:00", task: "Editing Projects" },
  { time: "3:00–4:00", task: "Daily Review + Next Day Plan" },
];

const TOTAL_DAYS = 60;
const STORAGE_KEY = "study-tracker-progress";

interface StudyTrackerProps {
  onComplete: () => void;
}

export function StudyTracker({ onComplete }: StudyTrackerProps) {
  const [completions, setCompletions] = useState<TaskCompletion>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
    
    // Check if all tasks are completed
    const totalPossible = TASKS.length * TOTAL_DAYS;
    let completed = 0;
    
    TASKS.forEach((_, taskIndex) => {
      for (let day = 1; day <= TOTAL_DAYS; day++) {
        if (completions[taskIndex]?.[day]) {
          completed++;
        }
      }
    });
    
    if (completed === totalPossible) {
      onComplete();
    }
  }, [completions, onComplete]);

  const toggleCompletion = (taskIndex: number, day: number) => {
    setCompletions((prev) => ({
      ...prev,
      [taskIndex]: {
        ...prev[taskIndex],
        [day]: !prev[taskIndex]?.[day],
      },
    }));
  };

  const isCompleted = (taskIndex: number, day: number) => {
    return completions[taskIndex]?.[day] || false;
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
      <div className="min-w-[1200px]">
        {/* Header */}
        <div className="sticky left-0 z-20 flex border-b border-border bg-muted">
          <div className="w-80 shrink-0 border-r border-border bg-card px-6 py-4">
            <h3 className="font-semibold text-card-foreground">Task Schedule</h3>
          </div>
          <div className="flex flex-1">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className="flex w-12 shrink-0 items-center justify-center border-r border-border py-4 text-xs font-medium text-muted-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        {TASKS.map((task, taskIndex) => (
          <div
            key={taskIndex}
            className="group flex border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors"
          >
            <div className="sticky left-0 z-10 w-80 shrink-0 border-r border-border bg-card px-6 py-4 group-hover:bg-accent/30 transition-colors">
              <div className="text-sm font-medium text-foreground">{task.time}</div>
              <div className="text-sm text-muted-foreground">{task.task}</div>
            </div>
            <div className="flex flex-1">
              {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className="flex w-12 shrink-0 items-center justify-center border-r border-border py-4 last:border-r-0"
                >
                  <button
                    onClick={() => toggleCompletion(taskIndex, day)}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      isCompleted(taskIndex, day)
                        ? "animate-check-bounce text-success"
                        : "text-muted-foreground hover:text-primary"
                    )}
                    aria-label={`Toggle day ${day} for ${task.task}`}
                  >
                    {isCompleted(taskIndex, day) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
