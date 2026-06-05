import { usePageHeader } from "@/components/page-header-context";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/** Derives up to two initials from a full name. e.g. "Aiko Tanaka" → "AT" */
const getInitials = (name: string): string =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function Settings() {
  usePageHeader({
    title: "Settings",
    description: "Manage your account and preferences.",
  });

  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── Profile ── */}
      <Card className="shadow-xs">
        <CardHeader className="border-b pb-5">
          <CardTitle className="text-base font-semibold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {user ? getInitials(user.name) : ""}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <Separator className="my-5" />

          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user?.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize text-foreground">{user?.role}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* ── Coming soon ── */}
      <Card className="shadow-xs">
        <CardHeader className="border-b pb-5">
          <CardTitle className="text-base font-semibold">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">
            Notification preferences, theme settings, and account management
            will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}