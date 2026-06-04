import { usePageHeader } from "@/components/page-header-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Assignments() {
  usePageHeader({
    title: "Assignments",
    description: "Keep track of upcoming deadlines and submit your coursework.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <FileText className="size-5" />
          </div>
          <CardTitle className="text-lg font-semibold">Active & Graded Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display your active, submitted, and graded assignments with direct file submission portals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
