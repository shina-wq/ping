import { useState } from "react";

import type { AssignmentStatus } from "@/api/assignments";
import { useAssignments } from "@/hooks/use-assignments";
import { usePageHeader } from "@/components/page-header-context";
import { AssignmentList } from "@/components/assignments/assignment-list";
import {
  AssignmentRow,
  AssignmentRowSkeleton,
  mapAssignment,
} from "@/components/assignments/assignment-row";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

const PENDING_STATUSES: AssignmentStatus[] = ["upcoming"];

const TABS = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "submitted", label: "Submitted" },
  { id: "graded",    label: "Graded" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Assignments() {
  usePageHeader({
    title: "Assignments",
    description: "All courses · Fall Semester 2024",
  });

  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [view, setView] = useState<ViewMode>("card");
  const { data, isLoading, error } = useAssignments();

  const filtered = [...(data ?? [])]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .filter((a) => {
      if (activeTab === "all")       return true;
      if (activeTab === "pending")   return PENDING_STATUSES.includes(a.status);
      if (activeTab === "submitted") return a.status === "submitted";
      if (activeTab === "graded")    return a.status === "graded";
      return true;
    });

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
          className={isLoading ? "pointer-events-none opacity-50" : undefined}
        />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Content */}
      {isLoading ? (
        <Card className="shadow-xs p-0">
          <CardContent className="divide-y p-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 sm:px-6">
                <AssignmentRowSkeleton count={1} />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{error.message}</p>
      ) : view === "card" ? (
        <AssignmentList
          assignments={filtered}
          emptyMessage="No assignments found for this filter."
        />
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No assignments found for this filter.
        </p>
      ) : (
        // List view
        <Card className="p-0 shadow-xs">
          <CardContent className="divide-y divide-border/60 p-0">
            {filtered.map((a) => (
              <div key={a.id} className="px-4 py-3 sm:px-6">
                <AssignmentRow {...mapAssignment(a)} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}