
import { useState, useRef, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/hooks/useTasks";

interface EditTaskDialogProps {
  task: Task;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, onSave }: EditTaskDialogProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onSave(editedTask);
    setShowPopup(false);
  };

  // Reset form when popup opens
  useEffect(() => {
    if (showPopup) {
      setEditedTask(task);
    }
  }, [showPopup, task]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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

  // Close with Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPopup) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showPopup]);

  // Prevent background scrolling when popup is open
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

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 p-0 hover:bg-accent"
        onClick={() => setShowPopup(true)}
        aria-label="Edit task"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div 
            ref={popupRef}
            className="relative w-[90%] max-w-md rounded-lg bg-background p-6 shadow-lg animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Task</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time Slot</Label>
                <Input
                  id="time"
                  value={editedTask.time}
                  onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
                  placeholder="e.g., 8:00-8:30"
                  className="w-full"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task">Task Name</Label>
                <Input
                  id="task"
                  value={editedTask.task}
                  onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
                  placeholder="e.g., Fresh up + Breakfast"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
