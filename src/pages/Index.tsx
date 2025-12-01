import { useState, useEffect } from "react";
import { StudyTracker } from "@/components/StudyTracker";
import { ProgressBar } from "@/components/ProgressBar";
import { CompletionModal } from "@/components/CompletionModal";
import { Analytics } from "@/components/Analytics";
import { ExportButton } from "@/components/ExportButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, RotateCcw, BarChart3, Menu, X } from "lucide-react"; // Added Menu & X
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";

const STORAGE_KEY = "study-tracker-progress";
const TOTAL_DAYS = 60;

const Index = () => {
  const { tasks, updateTask, resetToDefaults } = useTasks();
  const [completions, setCompletions] = useState<unknown>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Hamburger state

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

  const handleResetTasks = () => {
    if (window.confirm("Reset tasks to default schedule?")) {
      resetToDefaults();
      toast({
        title: "Tasks Reset",
        description: "Tasks have been reset to the default schedule.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary sticky top-0 z-30 border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-20px font-bold text-white sm:text-3xl">
                  60-Days Study Tracker
                </h1>
                <p className="text-3x1 text-white/90">Track your daily progress</p>
              </div>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <ExportButton completions={completions} tasks={tasks} totalDays={TOTAL_DAYS} />
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

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-white/20"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu items */}
          {mobileMenuOpen && (
            <div className="mt-4 flex flex-col gap-2 md:hidden">
              <ThemeToggle />
              <ExportButton completions={completions} tasks={tasks} totalDays={TOTAL_DAYS} />
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="tracker" className="gap-2">
              <Calendar className="h-4 w-4" />
              Tracker
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-8">
            {/* Progress Bar Section */}
            <section className="animate-fade-in">
              <div className="rounded-xl bg-card p-6 shadow-soft">
                <ProgressBar
                  completions={completions}
                  totalTasks={tasks.length}
                  totalDays={TOTAL_DAYS}
                />
              </div>
            </section>

            {/* Tracker Section */}
            <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Your Daily Tasks</h2>
                  <p className="text-sm text-muted-foreground">
                    Check off each task as you complete it. Hover to edit or start timer.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetTasks}>
                  Reset Tasks
                </Button>
              </div>
              <StudyTracker 
                onComplete={handleComplete} 
                tasks={tasks}
                onUpdateTask={updateTask}
              />
            </section>

            {/* Tips Section */}
            <section
              className="animate-fade-in rounded-xl bg-accent/50 p-6"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="mb-3 font-semibold text-accent-foreground">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-accent-foreground/80">
                <li>• Start your day by reviewing your schedule</li>
                <li>• Use the timer to track how long you spend on each task</li>
                <li>• Customize tasks to fit your personal study schedule</li>
                <li>• Check off tasks immediately after completion for accuracy</li>
                <li>• Review your analytics weekly to identify patterns</li>
              </ul>
            </section>
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics 
              completions={completions}
              totalTasks={tasks.length}
              totalDays={TOTAL_DAYS}
            />
          </TabsContent>
        </Tabs>
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
