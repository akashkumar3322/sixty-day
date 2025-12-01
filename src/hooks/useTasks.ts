import { useState, useEffect } from "react";

export interface Task {
  time: string;
  task: string;
}

const DEFAULT_TASKS: Task[] = [
  { time: "8:00–8:30", task: "Fresh up + Breakfast" },
  { time: "8:30–10:30", task: "Study (Your choice)" },
  { time: "10:30–11:00", task: "Break" },
  { time: "11:00–12:30", task: "Study / Test Revision" },
  { time: "12:30–1:00", task: "Lunch" },
  { time: "1:00–2:00", task: "Video Editing Practice" },
  { time: "2:00–3:00", task: "Editing Projects" },
  { time: "3:00–4:00", task: "Daily Review + Next Day Plan" },
];

const TASKS_STORAGE_KEY = "study-tracker-custom-tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const updateTask = (index: number, updatedTask: Task) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[index] = updatedTask;
      return newTasks;
    });
  };

  const resetToDefaults = () => {
    setTasks(DEFAULT_TASKS);
  };

  return { tasks, updateTask, resetToDefaults };
}
