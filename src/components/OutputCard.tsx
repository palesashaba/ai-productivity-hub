import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OutputCardProps {
  title: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

export function OutputCard({ title, value, onChange, rows = 6 }: OutputCardProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${title} copied to clipboard`);
    } catch {
      toast.error("Couldn't copy — please select the text and copy manually.");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" onClick={copy} aria-label={`Copy ${title}`}>
          <Copy className="size-4" />
          Copy
        </Button>
      </div>
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y bg-background text-sm leading-relaxed"
      />
    </div>
  );
}
