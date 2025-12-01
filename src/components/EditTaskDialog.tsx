import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/hooks/useTasks";

interface EditTaskDialogProps {
  task: Task;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, onSave }: EditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onSave(editedTask);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time Slot</Label>
            <Input
              id="time"
              value={editedTask.time}
              onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
              placeholder="e.g., 8:00-8:30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task">Task Name</Label>
            <Input
              id="task"
              value={editedTask.task}
              onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
              placeholder="e.g., Fresh up + Breakfast"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
