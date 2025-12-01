import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TaskTimerProps {
  taskName: string;
  taskTime: string;
}

export function TaskTimer({ taskName, taskTime }: TaskTimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Task Timer</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">{taskTime}</p>
            <p className="text-lg font-semibold text-foreground">{taskName}</p>
          </div>

          <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
            <div className={cn(
              "absolute inset-0 rounded-full border-8 border-muted transition-all duration-300",
              isRunning && "animate-pulse border-primary/20"
            )} />
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight text-foreground">
                {formatTime(seconds)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {isRunning ? "Running..." : "Paused"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="w-28"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg" className="w-28">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
