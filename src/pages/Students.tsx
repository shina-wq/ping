import { usePageHeader } from "@/components/page-header-context";

export default function Students() {
  usePageHeader({
    title: "Students",
    description: "Manage students across your courses.",
  });

  return (
    <p className="py-12 text-center text-sm text-muted-foreground">
      Student roster is coming soon.
    </p>
  );
}