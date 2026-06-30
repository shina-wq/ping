import { useState } from "react";

import type { AssignmentStatus } from "@/api/assignments";
import { useAssignments } from "@/hooks/use-assignments";
import { usePageHeader } from "@/components/page-header-context";
import { AssignmentList } from "@/components/assignments/assignment-list";
import {
  AssignmentCardSkeleton,
  AssignmentRowSkeleton,
} from "@/components/assignments/assignment-row";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SearchInput } from "@/components/ui/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

const PENDING_STATUSES: AssignmentStatus[] = ["upcoming", "due_soon", "due_tomorrow", "overdue"];

const TABS = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "submitted", label: "Submitted" },
  { id: "graded",    label: "Graded" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// "Pending" spans several API statuses, so it isn't passed as a single
// `status` query param — it's filtered client-side from the unfiltered set.
// "submitted" and "graded" map 1:1 to real API statuses and go server-side.
const TAB_TO_STATUS: Partial<Record<TabId, AssignmentStatus>> = {
  submitted: "submitted",
  graded: "graded",
};

export default function Assignments() {
  usePageHeader({
    title: "Assignments",
    description: "All courses · Fall Semester 2024",
  });

  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [view, setView] = useState<ViewMode>("card");
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useAssignments({
    status: TAB_TO_STATUS[activeTab],
  });

  const filtered = [...(data ?? [])]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .filter((a) => {
      const q = query.toLowerCase();
      const matchesSearch =
        a.title.toLowerCase().includes(q) ||
        (a.courseName ?? "").toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (activeTab === "pending") return PENDING_STATUSES.includes(a.status);
      return true; // "all" / "submitted" / "graded" already filtered server-side
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
        <div className="flex items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search assignments..."
          />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        view === "card" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AssignmentCardSkeleton count={6} />
          </div>
        ) : (
          <Card className="p-0 shadow-xs">
            <CardContent className="divide-y p-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 sm:px-6">
                  <AssignmentRowSkeleton count={1} />
                </div>
              ))}
            </CardContent>
          </Card>
        )
      ) : error ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <AssignmentList
          assignments={filtered}
          view={view}
          emptyMessage="No assignments match your search."
        />
      )}
    </div>
  );
}