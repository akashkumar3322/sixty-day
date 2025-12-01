import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  completions: unknown;
  tasks: Array<{ time: string; task: string }>;
  totalDays: number;
}

export function ExportButton({ completions, tasks, totalDays }: ExportButtonProps) {
  const { toast } = useToast();

  const exportToCSV = () => {
    // Create CSV header
    let csv = "Task,Time," + Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`).join(",") + "\n";

    // Add data rows
    tasks.forEach((task, taskIndex) => {
      const row = [
        `"${task.task}"`,
        `"${task.time}"`,
        ...Array.from({ length: totalDays }, (_, day) => 
          completions[taskIndex]?.[day + 1] ? "✓" : ""
        ),
      ];
      csv += row.join(",") + "\n";
    });

    // Create download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `study-tracker-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Your progress has been exported to CSV.",
    });
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      tasks: tasks.map((task, taskIndex) => ({
        ...task,
        completions: Array.from({ length: totalDays }, (_, day) => ({
          day: day + 1,
          completed: completions[taskIndex]?.[day + 1] || false,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `study-tracker-${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Your progress has been exported to JSON.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
