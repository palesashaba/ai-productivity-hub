import { ShieldAlert } from "lucide-react";
import { AI_DISCLAIMER } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-accent/60 p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI: </span>
        {AI_DISCLAIMER}
      </p>
    </div>
  );
}
