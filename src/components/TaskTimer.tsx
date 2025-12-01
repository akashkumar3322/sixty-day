import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, RotateCcw, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskTimerProps {
  taskName: string;
  taskTime: string;
}

export function TaskTimer({ taskName, taskTime }: TaskTimerProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        event.target instanceof Node && 
        !popupRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPopup]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  const format = (s: number): string => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  // Popup content as separate component for portal
  const PopupContent = () => (
    <div className="fixed inset-0 z-[9999]">
      {/* Background Overlay - Full screen with opacity */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      />
      
      {/* Popup Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div 
          ref={popupRef}
          className="relative w-full max-w-md rounded-xl bg-background p-6 shadow-2xl border border-border"
        >
          <button
            onClick={() => setShowPopup(false)}
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Close timer"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold">Task Timer</h3>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{taskTime}</p>
              <p className="text-lg font-semibold">{taskName}</p>
            </div>

            <p className="text-4xl font-bold tracking-tight">{format(seconds)}</p>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setIsRunning(!isRunning)}
                className="px-6"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="ml-2">{isRunning ? "Pause" : "Start"}</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={() => { 
                  setIsRunning(false); 
                  setSeconds(0); 
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 p-0"
        onClick={() => setShowPopup(!showPopup)}
      >
        <Clock className="w-4 h-4" />
      </Button>

      {/* Render popup as portal to document.body */}
      {showPopup && createPortal(<PopupContent />, document.body)}
    </div>
  );
}
