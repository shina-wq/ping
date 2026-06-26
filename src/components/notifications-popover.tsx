import {format} from "date-fns";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { useNotifications, useMarkNotificationRead } from "@/hooks/use-notifications";
import { useNotificationCount } from "@/hooks/use-notification-count";
import { Button } from "./ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import {cn} from "@/lib/utils";
import { useState } from "react";

// Notification item
type NotificationItemProps = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  onMardRead: (id: string) => void;
  isPending: boolean;
};

function NotificationItem({
  id,
  title,
  body,
  isRead,
  createdAt,
  onMardRead,
  isPending,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50", !isRead && "bg-primary/5"
      )}
    >
      {/* Unread dot */}
      <div className="mt-1.5 flex size-2 shrink-0 items-center justify-center">
        {!isRead && <span className="size-2 rounded-full bg-primary" />}
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "truncate text-sm leading-snug",
            isRead ? "font-normal text-foreground" : "font-semibold text-foreground"
          )}
        >
          {title}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {body}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(createdAt), "MMM d 'at' h:mm a")}
        </p>
      </div>

      {!isRead && (
        <button
          onClick={() => onMardRead(id)}
          disabled={isPending}
          className="shrink-0 self-start text-xs text-primary hover:underline disabled:opacity-50"
          aria-label={`Mark "${title}" as read`}
        >
          Mark read
        </button>
      )}
    </div>
  );
}

// Skeleton
function NotificationsSkeleton() {
  return (
    <>
      {Array.from({ length: 4}).map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3">
          <Skeleton className="mt-1.5 size-2 shrink-0 rounded-full"/>
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-40"/>
            <Skeleton className="h-3 w-full max-w-56"/>
            <Skeleton className="h-3 w-20"/>
          </div>
        </div>
      ))}
    </>
  );
}

// Popover
export function NotificationsPopover() {
  const [open, setOpen] = useState(false);

  const unreadCount = useNotificationCount();
  const {data: notifications, isLoading, error} = useNotifications();
  const markRead = useMarkNotificationRead();

  // Show up to 5 most recent in the popover
  const preview = notifications?.slice(0, 5) ?? [];
  const newCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="size-4"/>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 gap-0 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {newCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {newCount} new
              </span>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y max-h-105 overflow-y-auto">
            {isLoading ? (
              <NotificationsSkeleton />
            ) : error ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">Failed to load notifications</p>
            ) : !preview.length ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                You're all caught up!
              </p>
            ) : (
              preview.map((n) => (
                <NotificationItem
                  key={n.id}
                  {...n}
                  onMardRead={(id) => markRead.mutate(id)}
                  isPending={markRead.isPending}
                />
              ))
            )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2.5">
            <Button variant="link" className="h-auto p-0 text-sm text-primary" asChild>
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
              >View all notifications →</Link>
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}