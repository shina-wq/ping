import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

import { usePageHeader } from "@/components/page-header-context";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function NotificationsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 border-b p-5 last:border-0">
          <Skeleton className="mt-1 size-2 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full max-w-sm" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function Notifications() {
  usePageHeader({
    title: "Notifications",
    description: "Stay up to date with your latest activity.",
  });

  const { data: notifications, isLoading, error } = useNotifications();
  const markRead    = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredNotifications = (notifications || []).filter(n =>
    n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query)
  );

  const hasUnread = filteredNotifications?.some((n) => !n.isRead) ?? false;

  return (
    <div className="space-y-4">
      {/* ── Actions bar ── */}
      {hasUnread && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        </div>
      )}

      {/* ── List ── */}
      <Card className="divide-y p-0 py-0 shadow-xs">
        {isLoading ? (
          <NotificationsSkeleton />
        ) : error ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Failed to load notifications. Please try again.
          </p>
        ) : !filteredNotifications?.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            You're all caught up!
          </p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 p-5 transition-colors",
                !n.isRead && "bg-primary/5"
              )}
            >
              {/* Unread indicator dot */}
              <div className="mt-1.5 flex size-2 shrink-0 items-center justify-center">
                {!n.isRead && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className={cn(
                  "text-sm",
                  n.isRead ? "font-normal text-foreground" : "font-semibold text-foreground"
                )}>
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(n.createdAt), "MMM d, h:mm a")}
                </p>
              </div>

              {!n.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => markRead.mutate(n.id)}
                  disabled={markRead.isPending}
                >
                  Mark as read
                </Button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}