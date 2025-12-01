import { useState, useEffect } from "react";
import { StudyTracker } from "@/components/StudyTracker";
import { ProgressBar } from "@/components/ProgressBar";
import { CompletionModal } from "@/components/CompletionModal";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "study-tracker-progress";
const TASKS_COUNT = 8;
const TOTAL_DAYS = 60;

const Index = () => {
  const [completions, setCompletions] = useState<any>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      setCompletions(saved ? JSON.parse(saved) : {});
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleComplete = () => {
    setShowCompletionModal(true);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setCompletions({});
      toast({
        title: "Progress Reset",
        description: "All your progress has been cleared. Ready for a fresh start!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary sticky top-0 z-30 border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  60-Days Study Tracker
                </h1>
                <p className="text-sm text-white/90">Track your daily progress and stay consistent</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Bar Section */}
        <section className="mb-8 animate-fade-in">
          <div className="rounded-xl bg-card p-6 shadow-soft">
            <ProgressBar
              completions={completions}
              totalTasks={TASKS_COUNT}
              totalDays={TOTAL_DAYS}
            />
          </div>
        </section>

        {/* Tracker Section */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Your Daily Tasks</h2>
            <p className="text-sm text-muted-foreground">
              Check off each task as you complete it. Your progress is saved automatically.
            </p>
          </div>
          <StudyTracker onComplete={handleComplete} />
        </section>

        {/* Tips Section */}
        <section
          className="mt-8 animate-fade-in rounded-xl bg-accent/50 p-6"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="mb-3 font-semibold text-accent-foreground">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-accent-foreground/80">
            <li>• Start your day by reviewing your schedule</li>
            <li>• Check off tasks immediately after completion for accuracy</li>
            <li>• Take breaks seriously - they're part of your success</li>
            <li>• Review your weekly progress every Sunday</li>
          </ul>
        </section>
      </main>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  );
};

export default Index;
