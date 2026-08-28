import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Mail, NotebookPen } from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter with AI email drafting, meeting note summaries and smart daily or weekly task planning.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter, communicate better, and organise your day with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    title: "Smart Email Generator",
    icon: Mail,
    text: "Turn a few bullet points into a polished, on-tone email in seconds.",
    action: "Write an email",
  },
  {
    to: "/meetings",
    title: "Meeting Notes Summarizer",
    icon: NotebookPen,
    text: "Condense long notes into a summary, action items, decisions and deadlines.",
    action: "Summarize notes",
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    icon: CalendarClock,
    text: "Build a realistic daily or weekly schedule ordered by priority and deadline.",
    action: "Plan my day",
  },
] as const;

function Dashboard() {
  return (
    <>
      <div className="mb-8 rounded-3xl bg-navy p-6 text-navy-foreground shadow-card sm:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-sky uppercase">
          Workplace AI
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 max-w-xl text-sm text-navy-foreground/75 sm:text-base">
          Work smarter, communicate better, and organise your day with AI.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {FEATURES.map((f) => (
            <Button key={f.to} asChild variant="secondary" className="rounded-xl">
              <Link to={f.to}>
                {f.action}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <PageHeader title="Your tools" description="Three focused assistants for everyday work." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, title, text, icon: Icon, action }) => (
          <div
            key={to}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-sky-soft text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{text}</p>
            <Button asChild className="mt-5 rounded-xl">
              <Link to={to}>
                {action}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <AiDisclaimer className="mt-8" />
    </>
  );
}
