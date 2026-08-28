import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/AppShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting, type MeetingOutput } from "@/lib/ai-engine";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn long meeting notes into a clear summary with action items, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Summary, action items, decisions and deadlines from your raw notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingOutput | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await summarizeMeeting(notes));
      toast.success("Meeting summarized");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setNotes("");
    setResult(null);
  };

  const copyAll = async () => {
    if (!result) return;
    const text = `MEETING SUMMARY\n${result.summary}\n\nACTION ITEMS\n${result.actionItems}\n\nDECISIONS\n${result.decisions}\n\nDEADLINES\n${result.deadlines}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Full summary copied");
    } catch {
      toast.error("Couldn't copy — please copy the sections manually.");
    }
  };

  return (
    <>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste your raw notes — nothing is invented that isn't in them."
      />

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            rows={12}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your meeting notes here…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
          {result && (
            <>
              <Button variant="outline" className="rounded-xl" onClick={run} disabled={loading}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={copyAll}>
                <Copy className="size-4" />
                Copy all
              </Button>
            </>
          )}
          <Button variant="ghost" className="rounded-xl" onClick={clear} disabled={loading}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-muted-foreground">Reading your notes…</p>}

      {result && !loading && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <OutputCard
            title="Meeting summary"
            value={result.summary}
            rows={8}
            onChange={(v) => setResult({ ...result, summary: v })}
          />
          <OutputCard
            title="Action items"
            value={result.actionItems}
            rows={8}
            onChange={(v) => setResult({ ...result, actionItems: v })}
          />
          <OutputCard
            title="Decisions"
            value={result.decisions}
            rows={6}
            onChange={(v) => setResult({ ...result, decisions: v })}
          />
          <OutputCard
            title="Deadlines"
            value={result.deadlines}
            rows={6}
            onChange={(v) => setResult({ ...result, deadlines: v })}
          />
        </div>
      )}

      <AiDisclaimer className="mt-8" />
    </>
  );
}
