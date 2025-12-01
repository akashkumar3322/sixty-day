
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TaskTimer({ taskName, taskTime }) {
  const [showPopup, setShowPopup] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
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

  const format = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

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

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div 
            ref={popupRef}
            className="relative w-[90%] max-w-md rounded-lg bg-background p-6 shadow-lg"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold">Task Timer</h3>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{taskTime}</p>
                <p className="text-lg font-semibold">{taskName}</p>
              </div>

              <p className="text-4xl font-bold">{format(seconds)}</p>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => setIsRunning(!isRunning)}>
                  {isRunning ? <Pause /> : <Play />}
                  <span className="ml-2">{isRunning ? "Pause" : "Start"}</span>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => { setIsRunning(false); setSeconds(0); }}
                >
                  <RotateCcw className="mr-2" /> Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
