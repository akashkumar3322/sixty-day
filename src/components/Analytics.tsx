import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Award, Calendar } from "lucide-react";

interface AnalyticsProps {
  completions: any;
  totalTasks: number;
  totalDays: number;
}

export function Analytics({ completions, totalTasks, totalDays }: AnalyticsProps) {
  const stats = useMemo(() => {
    const weeklyData = [];
    const weeks = Math.ceil(totalDays / 7);
    
    for (let week = 0; week < weeks; week++) {
      const startDay = week * 7 + 1;
      const endDay = Math.min((week + 1) * 7, totalDays);
      let completed = 0;
      const possibleInWeek = totalTasks * (endDay - startDay + 1);
      
      for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
        for (let day = startDay; day <= endDay; day++) {
          if (completions[taskIndex]?.[day]) {
            completed++;
          }
        }
      }
      
      weeklyData.push({
        week: `Week ${week + 1}`,
        completion: possibleInWeek > 0 ? Math.round((completed / possibleInWeek) * 100) : 0,
      });
    }

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let day = 1; day <= totalDays; day++) {
      let dayComplete = true;
      for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
        if (!completions[taskIndex]?.[day]) {
          dayComplete = false;
          break;
        }
      }
      
      if (dayComplete) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Check current streak from today backwards
    for (let day = totalDays; day >= 1; day--) {
      let dayComplete = true;
      for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
        if (!completions[taskIndex]?.[day]) {
          dayComplete = false;
          break;
        }
      }
      if (dayComplete) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Total completed tasks
    let totalCompleted = 0;
    for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
      for (let day = 1; day <= totalDays; day++) {
        if (completions[taskIndex]?.[day]) {
          totalCompleted++;
        }
      }
    }

    // Days with at least one task done
    let activeDays = 0;
    for (let day = 1; day <= totalDays; day++) {
      for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
        if (completions[taskIndex]?.[day]) {
          activeDays++;
          break;
        }
      }
    }

    return {
      weeklyData,
      currentStreak,
      longestStreak,
      totalCompleted,
      activeDays,
      avgCompletion: totalCompleted / (totalTasks * totalDays) * 100,
    };
  }, [completions, totalTasks, totalDays]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-foreground">{stats.currentStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Award className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold text-foreground">{stats.longestStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2">
              <Target className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Completion</p>
              <p className="text-2xl font-bold text-foreground">{Math.round(stats.avgCompletion)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent p-2">
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Days</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeDays}/{totalDays}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value}%`, "Completion"]}
            />
            <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
              {stats.weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.completion >= 80 ? "hsl(var(--success))" : 
                        entry.completion >= 50 ? "hsl(var(--primary))" : 
                        "hsl(var(--secondary))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
