import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "card" | "list";

type Props = {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  className?: string;
};

const OPTIONS = [
  { value: "card" as const, Icon: LayoutGrid, label: "Card view" },
  { value: "list" as const, Icon: List,       label: "List view" },
] as const;

export function ViewToggle({ view, onChange, className }: Props) {
  return (
    <div className={cn("inline-flex gap-1 rounded-full border border-border bg-muted/50 p-1", className)}>
      {OPTIONS.map(({ value, Icon, label }) => (
        <Button
          key={value}
          variant={view === value ? "active" : "ghost"}
          size="icon-sm"
          aria-label={label}
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className="size-7 rounded-full"
        >
          <Icon className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}