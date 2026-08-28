import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AI_DISCLAIMER } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="text-sm leading-tight font-semibold">
            AI Workplace
            <span className="block text-xs font-normal text-sidebar-foreground/70">
              Productivity Assistant
            </span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
              }}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <p className="border-t border-sidebar-border px-6 py-5 text-xs leading-relaxed text-sidebar-foreground/60">
          {AI_DISCLAIMER}
        </p>
      </aside>

      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open navigation"
            className="min-h-11 min-w-11"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="text-sm font-semibold">AI Workplace Assistant</span>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}
