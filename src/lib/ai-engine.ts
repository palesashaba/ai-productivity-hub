/**
 * Local, offline "AI" generation engine.
 *
 * The app is frontend-only: no backend, no API keys, no accounts.
 * These functions apply structured prompt-style rules to the user's input
 * and compose professional, clearly organised drafts entirely in the browser.
 */

export const AI_DISCLAIMER =
  "AI-generated content may contain mistakes or omissions. Always review and verify AI outputs before sending emails, making decisions, or acting on recommendations.";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 2);
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------- Email ---------------------------------- */

export type Tone = "formal" | "friendly" | "persuasive";

export interface EmailInput {
  topic: string;
  recipient: string;
  points: string;
  subject?: string;
  tone: Tone;
}

export interface EmailOutput {
  subject: string;
  body: string;
}

export async function generateEmail(input: EmailInput): Promise<EmailOutput> {
  await delay(900);
  if (!input.topic.trim()) throw new Error("Please describe the purpose of the email.");

  const name = input.recipient.trim() || "there";
  const first = name.split(/\s+/)[0];
  const points = sentences(input.points);
  const topic = input.topic.trim().replace(/\.$/, "");

  const subject = input.subject?.trim() || titleCase(topic).slice(0, 78);

  const openings: Record<Tone, string> = {
    formal: `Dear ${name},\n\nI hope this message finds you well. I am writing regarding ${topic}.`,
    friendly: `Hi ${first},\n\nHope you're doing well! I wanted to reach out about ${topic}.`,
    persuasive: `Hi ${first},\n\nI'll keep this brief: ${titleCase(topic)} is worth a few minutes of your time, and here's why.`,
  };

  const closings: Record<Tone, string> = {
    formal: `Please let me know if you require any further detail. I would be grateful for your response at your earliest convenience.\n\nKind regards,\n[Your name]`,
    friendly: `Let me know what you think — happy to jump on a quick call if that's easier.\n\nThanks so much,\n[Your name]`,
    persuasive: `If this sounds worthwhile, I'd love to lock in the next step this week. Just reply with a time that suits you.\n\nBest regards,\n[Your name]`,
  };

  const bridge: Record<Tone, string> = {
    formal: "Please find the key points below:",
    friendly: "Here's a quick summary of the main points:",
    persuasive: "Here's what matters most:",
  };

  const bulletBlock = points.length
    ? `${bridge[input.tone]}\n\n${points.map((p) => `• ${titleCase(p.replace(/\.$/, ""))}.`).join("\n")}`
    : "";

  const body = [openings[input.tone], bulletBlock, closings[input.tone]]
    .filter(Boolean)
    .join("\n\n");

  return { subject, body };
}

/* --------------------------- Meeting notes ------------------------------ */

export interface MeetingOutput {
  summary: string;
  actionItems: string;
  decisions: string;
  deadlines: string;
}

const ACTION_HINTS =
  /\b(will|to do|todo|action|follow[- ]?up|assign|owner|responsible|prepare|send|draft|review|schedule|create|update|contact|share)\b/i;
const DECISION_HINTS =
  /\b(decid|agree|approv|confirm|conclu|sign[- ]?off|resolved|chose|selected|rejected)\b/i;
const DEADLINE_HINTS =
  /\b(by |due|deadline|before |eta|end of (day|week|month)|eod|eow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i;

export async function summarizeMeeting(notes: string): Promise<MeetingOutput> {
  await delay(1000);
  const lines = sentences(notes);
  if (lines.length < 2) throw new Error("Please paste a few more lines of meeting notes to summarize.");

  const actions = lines.filter((l) => ACTION_HINTS.test(l));
  const decisions = lines.filter((l) => DECISION_HINTS.test(l));
  const deadlines = lines.filter((l) => DEADLINE_HINTS.test(l));

  const key = lines
    .filter((l) => l.length > 25)
    .slice(0, 5)
    .map((l) => `• ${titleCase(l.replace(/\.$/, ""))}.`);

  const summary =
    `This meeting covered ${lines.length} discussion points.\n\n` +
    `• ${titleCase(lines[0] ?? "")}.`);

  const fmt = (items: string[], empty: string) =>
    items.length
      ? items.map((i) => `• ${titleCase(i.replace(/\.$/, ""))}.`).join("\n")
      : empty;

  return {
    summary,
    actionItems: fmt(actions, "• No explicit action items were mentioned in these notes."),
    decisions: fmt(decisions, "• No explicit decisions were recorded in these notes."),
    deadlines: fmt(deadlines, "• No explicit deadlines were mentioned in these notes."),
  };
}

/* ------------------------------ Planner --------------------------------- */

export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  deadline: string;
  duration: string; // minutes as string
}

export interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  priority: Priority;
  deadline: string;
  duration: string;
}

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function fmtTime(minutesFromMidnight: number) {
  const h = Math.floor(minutesFromMidnight / 60);
  const m = minutesFromMidnight % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export async function generateSchedule(
  tasks: Task[],
  mode: "daily" | "weekly",
): Promise<ScheduleItem[]> {
  await delay(900);
  const valid = tasks.filter((t) => t.name.trim());
  if (!valid.length) throw new Error("Add at least one task with a name to build a schedule.");

  const sorted = [...valid].sort((a, b) => {
    const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (p !== 0) return p;
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    return a.deadline ? -1 : b.deadline ? 1 : 0;
  });

  const items: ScheduleItem[] = [];

  if (mode === "daily") {
    let cursor = 9 * 60; // 09:00
    sorted.forEach((t, i) => {
      const dur = Math.min(Math.max(parseInt(t.duration || "45", 10) || 45, 15), 180);
      if (cursor < 13 * 60 && cursor + dur > 13 * 60) cursor = 14 * 60; // lunch 13:00-14:00
      items.push({
        id: `${t.id}-s`,
        time: `${fmtTime(cursor)} – ${fmtTime(cursor + dur)}`,
        task: t.name.trim(),
        priority: t.priority,
        deadline: t.deadline,
        duration: `${dur} min`,
      });
      cursor += dur + (i % 2 === 1 ? 15 : 10); // short breaks
    });
  } else {
    const perDay = Math.ceil(sorted.length / DAYS.length);
    sorted.forEach((t, i) => {
      const day = DAYS[Math.min(Math.floor(i / perDay), DAYS.length - 1)];
      const slot = 9 * 60 + (i % perDay) * 120;
      const dur = Math.min(Math.max(parseInt(t.duration || "60", 10) || 60, 15), 240);
      items.push({
        id: `${t.id}-s`,
        time: `${day} · ${fmtTime(slot)} – ${fmtTime(slot + dur)}`,
        task: t.name.trim(),
        priority: t.priority,
        deadline: t.deadline,
        duration: `${dur} min`,
      });
    });
  }

  return items;
}
