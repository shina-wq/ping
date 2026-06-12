import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterTabItem<T extends string> = { id: T; label: string };

export type FilterTabsProps<T extends string> = {
  tabs: readonly FilterTabItem<T>[] | readonly T[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
};

export function FilterTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tabs.map((tab) => {
        const id = typeof tab === "string" ? tab : tab.id;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = activeTab === id;

        return (
          <Button
            key={id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full px-4",
              !isActive && "text-muted-foreground"
            )}
            onClick={() => onTabChange(id as T)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
