import { usePageHeader } from "@/components/page-header-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function Grades() {
  usePageHeader({
    title: "Grades",
    description: "Review your academic performances, gradebook, and cumulative GPA statistics.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <GraduationCap className="size-5" />
          </div>
          <CardTitle className="text-lg font-semibold">Gradebook & Academic Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display your grades, grade charts, cumulative GPA, and an interactive GPA calculator tool.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
