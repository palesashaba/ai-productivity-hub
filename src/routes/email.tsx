import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/AppShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type EmailOutput, type Tone } from "@/lib/ai-engine";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional emails in a formal, friendly or persuasive tone from a few key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn bullet points into a polished, ready-to-send email.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
];

function EmailPage() {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [points, setPoints] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailOutput | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await generateEmail({ topic, recipient, points, subject, tone }));
      toast.success("Email draft ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setTopic("");
    setRecipient("");
    setPoints("");
    setSubject("");
    setResult(null);
  };

  return (
    <>
      <PageHeader
        title="Smart Email Generator"
        description="Describe the purpose and key points — get a clear, professional email draft."
      />

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="topic">Email purpose / topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Requesting a project deadline extension"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Thandi Mokoena"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="points">Important points</Label>
          <Textarea
            id="points"
            rows={5}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder={"One point per line, e.g.\nDesign review took longer than planned\nRequesting a two-week extension"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Leave blank to let AI suggest one"
          />
        </div>

        <div className="space-y-2">
          <Label>Tone</Label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Button
                key={t.value}
                type="button"
                variant={tone === t.value ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setTone(t.value)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={run} disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : "Generate email"}
          </Button>
          {result && (
            <Button variant="outline" className="rounded-xl" onClick={run} disabled={loading}>
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
          )}
          <Button variant="ghost" className="rounded-xl" onClick={clear} disabled={loading}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-muted-foreground">Drafting your email…</p>
      )}

      {result && !loading && (
        <div className="mt-6 space-y-4">
          <OutputCard
            title="Subject"
            rows={1}
            value={result.subject}
            onChange={(v) => setResult({ ...result, subject: v })}
          />
          <OutputCard
            title="Email body"
            rows={14}
            value={result.body}
            onChange={(v) => setResult({ ...result, body: v })}
          />
        </div>
      )}

      <AiDisclaimer className="mt-8" />
    </>
  );
}
