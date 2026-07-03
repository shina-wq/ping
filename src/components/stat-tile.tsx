import type { LucideIcon } from "lucide-react";

import { SectionError } from "@/components/section-error";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

export function StatTile({ label, value, icon: Icon, accent }: StatCard) {
  return (
    <Card className="min-w-0 p-0 py-0 shadow-xs">
      <div className="flex h-full min-w-0 flex-col gap-2 p-4">
        <div className={cn("flex size-8 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="min-w-0 p-0 py-0 shadow-xs">
          <div className="flex h-full flex-col gap-2 p-4">
            <Skeleton className="size-8 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

type StatsGridProps = {
  stats: StatCard[];
  isLoading: boolean;
  error: unknown;
};

export function StatsGrid({ stats, isLoading, error }: StatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {isLoading ? (
        <StatsSkeleton />
      ) : error ? (
        <div className="col-span-2 md:col-span-4">
          <SectionError />
        </div>
      ) : (
        stats.map((card) => <StatTile key={card.label} {...card} />)
      )}
    </section>
  );
}