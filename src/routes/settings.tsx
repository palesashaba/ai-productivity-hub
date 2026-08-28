import { createFileRoute } from "@tanstack/react-router";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/AppShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Set your default email tone, schedule type and content preferences.",
      },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      { property: "og:description", content: "Personalise your AI writing and planning defaults." },
    ],
  }),
  component: SettingsPage,
});

function useLocal(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(stored);
  }, [key]);
  const update = (v: string) => {
    setValue(v);
    localStorage.setItem(key, v);
  };
  return [value, update] as const;
}

function SettingsPage() {
  const [tone, setTone] = useLocal("pref:tone", "formal");
  const [schedule, setSchedule] = useLocal("pref:schedule", "daily");
  const [concise, setConcise] = useLocal("pref:concise", "true");

  return (
    <>
      <PageHeader
        title="Settings"
        description="Preferences are stored on this device only — no account required."
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label className="text-sm font-semibold">Default email tone</Label>
            <p className="text-sm text-muted-foreground">Used as the starting tone for new emails.</p>
          </div>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label className="text-sm font-semibold">Default schedule type</Label>
            <p className="text-sm text-muted-foreground">Daily or weekly planning view.</p>
          </div>
          <Select value={schedule} onValueChange={setSchedule}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily schedule</SelectItem>
              <SelectItem value="weekly">Weekly schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div>
            <Label htmlFor="concise" className="text-sm font-semibold">
              Prefer concise output
            </Label>
            <p className="text-sm text-muted-foreground">
              Keep generated content short and to the point.
            </p>
          </div>
          <Switch
            id="concise"
            checked={concise === "true"}
            onCheckedChange={(v) => setConcise(String(v))}
          />
        </div>
      </div>

      <AiDisclaimer className="mt-8" />
    </>
  );
}
