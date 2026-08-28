import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Plus, RefreshCw, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateSchedule,
  type Priority,
  type ScheduleItem,
  type Task,
} from "@/lib/ai-engine";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn your task list into a realistic daily or weekly schedule ordered by priority and deadline.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "A balanced, priority-aware schedule built from your tasks.",
      },
    ],
  }),
  component: PlannerPage,
});

const newTask = (): Task => ({
  id: crypto.randomUUID(),
  name: "",
  priority: "medium",
  deadline: "",
  duration: "60",
});

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-sky-soft text-primary",
  low: "bg-muted text-muted-foreground",
};

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([newTask()]);
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);

  const patch = (id: string, changes: Partial<Task>) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...changes } : x)));

  const patchItem = (id: string, changes: Partial<ScheduleItem>) =>
    setSchedule((s) => s?.map((x) => (x.id === id ? { ...x, ...changes } : x)) ?? s);

  const run = async () => {
    setLoading(true);
    try {
      setSchedule(await generateSchedule(tasks, mode));
      toast.success("Schedule ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setTasks([newTask()]);
    setSchedule(null);
  };

  const copySchedule = async () => {
    if (!schedule) return;
    const text = schedule
      .map((s) => `${s.time} | ${s.task} | ${s.priority} | ${s.deadline || "—"} | ${s.duration}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Schedule copied");
    } catch {
      toast.error("Couldn't copy — please copy the schedule manually.");
    }
  };

  return (
    <>
      <PageHeader
        title="AI Task Planner"
        description="Add your tasks and get a balanced schedule that puts urgent work first."
      />

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="space-y-4">
          {tasks.map((t, i) => (
            <div key={t.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Task {i + 1}
                </span>
                {tasks.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove task ${i + 1}`}
                    onClick={() => setTasks((x) => x.filter((y) => y.id !== t.id))}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor={`name-${t.id}`}>Task name</Label>
                  <Input
                    id={`name-${t.id}`}
                    value={t.name}
                    onChange={(e) => patch(t.id, { name: e.target.value })}
                    placeholder="Prepare client proposal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`priority-${t.id}`}>Priority</Label>
                  <Select
                    value={t.priority}
                    onValueChange={(v) => patch(t.id, { priority: v as Priority })}
                  >
                    <SelectTrigger id={`priority-${t.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`deadline-${t.id}`}>Deadline</Label>
                  <Input
                    id={`deadline-${t.id}`}
                    type="date"
                    value={t.deadline}
                    onChange={(e) => patch(t.id, { deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`duration-${t.id}`}>Duration (min)</Label>
                  <Input
                    id={`duration-${t.id}`}
                    type="number"
                    min={15}
                    step={15}
                    value={t.duration}
                    onChange={(e) => patch(t.id, { duration: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setTasks((t) => [...t, newTask()])}
        >
          <Plus className="size-4" />
          Add task
        </Button>

        <div className="space-y-2">
          <Label>Schedule type</Label>
          <div className="flex flex-wrap gap-2">
            {(["daily", "weekly"] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setMode(m)}
              >
                {m === "daily" ? "Daily schedule" : "Weekly schedule"}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={run} disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Planning…" : "Generate schedule"}
          </Button>
          {schedule && (
            <>
              <Button variant="outline" className="rounded-xl" onClick={run} disabled={loading}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={copySchedule}>
                <Copy className="size-4" />
                Copy
              </Button>
            </>
          )}
          <Button variant="ghost" className="rounded-xl" onClick={clear} disabled={loading}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-muted-foreground">Building your schedule…</p>}

      {schedule && !loading && (
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === "daily" ? "Your day" : "Your week"}
          </h2>
          {schedule.map((s) => (
            <div
              key={s.id}
              className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center"
            >
              <div className="text-sm font-semibold text-primary">{s.time}</div>
              <div className="space-y-2">
                <Input
                  value={s.task}
                  onChange={(e) => patchItem(s.id, { task: e.target.value })}
                  aria-label="Scheduled task"
                  className="font-medium"
                />
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold capitalize ${PRIORITY_STYLE[s.priority]}`}
                  >
                    {s.priority} priority
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                    {s.duration}
                  </span>
                  {s.deadline && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      Due {s.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AiDisclaimer className="mt-8" />
    </>
  );
}
