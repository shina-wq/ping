import { useState } from "react";

import { usePageHeader } from "@/components/page-header-context";
import { useAssignments } from "@/hooks/use-assignments";
import type { AssignmentStatus } from "@/api/assignments";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { AssignmentRowSkeleton } from "@/components/assignments/assignment-row";
import { Card, CardContent } from "@/components/ui/card";

const PENDING_STATUSES: AssignmentStatus[] = [
  "upcoming",
];

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "submitted", label: "Submitted" },
  { id: "graded", label: "Graded" },
] as const;

function AssignmentsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="h-5 w-24 rounded bg-muted animate-pulse" />
        <Card className="shadow-xs border border-border/50 p-0">
          <CardContent className="p-0 divide-y divide-border/50">
            <div className="p-4 sm:px-6">
              <AssignmentRowSkeleton count={4} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Assignments() {
  usePageHeader({
    title: "Assignments",
    description: "All courses · Fall Semester 2024",
  });

  const [activeTab, setActiveTab] = useState<string>("all");
  const { data, isLoading, error } = useAssignments();

  // Sort by due date ascending (most urgent first).
  const sorted = [...(data ?? [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const filtered = sorted.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return PENDING_STATUSES.includes(a.status);
    if (activeTab === "submitted") return a.status === "submitted";
    if (activeTab === "graded") return a.status === "graded";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Pill Tabs */}
      <FilterTabs
        tabs={TABS}
        activeTab={activeTab as any}
        onTabChange={setActiveTab}
      />

      {/* List / Loading / Error */}
      {isLoading ? (
        <AssignmentsSkeleton />
      ) : error ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
        {error.message}
        </p>
      ) : (
        <AssignmentList assignments={filtered} emptyMessage="No assignments found for this filter." />
      )}
    </div>
  );
}