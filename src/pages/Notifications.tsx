import { useState } from "react";
import { format, isToday, isThisWeek } from "date-fns";
import {Bell, GraduationCap, Megaphone, CheckCircle2} from "lucide-react";
import {Link} from "react-router-dom";
import { usePageHeader } from "@/components/page-header-context";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/use-notifications";
import type { Notification } from "@/api/notifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Category inference
type NotifCategory = "all" | "unread" | "deadlines" | "grades" | "announcements";

const TABS: {id: NotifCategory; label: string}[] = [
  {id: "all", label: "All"},
  {id: "unread", label: "Unread"},
  {id: "deadlines", label: "Deadlines"},
  {id: "grades", label: "Grades"},
  {id: "announcements", label: "Announcements"},
];

type ContentCategory = Exclude<NotifCategory, "all" | "unread">;

function inferCategory(n: Notification): ContentCategory {
  const text = `${n.title} ${n.body}`.toLowerCase();
  if (text.includes("due") || text.includes("deadline") || text.includes("submission")) return "deadlines";
  if (
    text.includes("grade") ||
    text.includes("graded") ||
    text.includes("scored") ||
    text.includes("result")
  )
    return "grades";
  return "announcements";
}

function filterNotifications(notifications: Notification[], tab: NotifCategory): Notification[] {
  if (tab === "unread") return notifications.filter((n) => !n.isRead);
  if (tab === "all") return notifications;
  return notifications.filter((n) => inferCategory(n) === tab);
}

// Icon config
const CATEGORY_ICON: Record<ContentCategory, {icon: React.ElementType; bg: string; color: string} > = {
  deadlines: {icon: Bell, bg: "bg-primary/10", color: "text-primary"},
  grades: {icon: GraduationCap, bg: "bg-emerald-500/10", color: "text-emerald-600"},
  announcements: {icon: Megaphone, bg: "bg-violet-500/10", color: "text-violet-500"},
};

function NotifIcon({ notification}: {notification: Notification}) {
  const {icon: Icon, bg, color} = CATEGORY_ICON[inferCategory(notification)];
  return (
    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", bg)}>
      <Icon className={cn("size-4", color)}/>
    </div>
  );
}

// Time grouping
type Group = {label: string; items: Notification[]};

function groupByTime(notifications: Notification[]): Group[] {
  const today: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];

  for (const n of notifications) {
    const date = new Date(n.createdAt);
    if (isToday(date)) today.push(n);
    else if (isThisWeek(date, {weekStartsOn: 1})) thisWeek.push(n);
    else earlier.push(n);
  }

  return [
    {label: "Today", items: today},
    {label: "This Week", items: thisWeek},
    {label: "Earlier", items: earlier},
  ].filter((g) => g.items.length > 0);
}

// Course link
const COURSE_PATTERNS = [
  {pattern: /mathematics\s*101/i, label: "Mathematics 101"},
  {pattern: /english\s*literature/i, label: "English Literature"},
  {pattern: /biology\s*fundamentals/i, label: "Biology Fundamentals"},
];

function CourseLink({body}: {body: string}) {
  const match = COURSE_PATTERNS.find(({pattern}) => pattern.test(body));
  if (!match) return null;
  return (
    <Link to="/courses" className="inline-block text-xs font-medium text-primary hover:underline">
      {match.label}
    </Link>
  );
}

// Notification row
type NotificationRowProps = {
  notification: Notification;
  onMarkRead: (id: string) => void;
  isPending: boolean;
};

function NotificationRow({notification: n, onMarkRead, isPending}: NotificationRowProps) {
  const date = new Date(n.createdAt);
  const timeLabel = isToday(date) ? `${Math.max(1, Math.round((Date.now() - date.getTime()) / 3_600_000))} h ago` : format(date, "MMM d");

  return (
    <div className={cn(
      "flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors",
      !n.isRead ? "border-primary/20 bg-primary/5" : "border-border bg-card hover:bg-muted/40"
    )}>
      <NotifIcon notification={n}/>

      <div className="min-w-0 flex-1 space-y-1">
        <p
          className={cn(
            "text-sm leading-snug",
            !n.isRead ? "font-semibold text-foreground" : "font-medium text-foreground"
          )}
        >
          {n.title}
        </p>
        <p className="text-sm text-muted-foreground">{n.body}</p>
        <CourseLink body={n.body} />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={cn(
            "flex items-center gap-1 text-xs",
            !n.isRead ? "font-medium text-primary" : "text-muted-foreground"
          )}
        >
          {!n.isRead && <span className="size-1.5 rounded-full bg-primary"/> }
          {timeLabel}
        </span>
        {!n.isRead && (
          <button
            onClick={() => onMarkRead(n.id)}
            disabled={isPending}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}

// Skeleton
function NotificationsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({length: 5}).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4">
          <Skeleton className="size-9 shrink-0 rounded-full"/>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48"/>
            <Skeleton className="h-3 w-full max-w-sm"/>
            <Skeleton className="h-3 w-24"/>
          </div>
          <Skeleton className="h-3 w-12"/>
        </div>
      ))}
    </div>
  );
}

// Tab bar
type TabBarProps = {
  active: NotifCategory;
  onChange: (t: NotifCategory) => void;
  unreadCount: number;
};

function TabBar({active, onChange, unreadCount}: TabBarProps) {
  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-3 pb-3 pt-1 text-sm font-medium transition-colors",
            active === tab.id ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:content-['']" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.id === "unread" && unreadCount > 0 && (
            <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({tab}: {tab: NotifCategory}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Bell className="size-5 text-muted-foreground"/>
      </div>
      <p className="text-sm text-muted-foreground">
        {tab === "unread" ? "No unread notifications." : "Nothing here yet."}
      </p>
    </div>
  );
}

// Page
export default function Notifications() {
  usePageHeader({
    title: "Notifications",
    description: "Stay on top of deadlines, grades, and announcements.",
  });

  const [activeTab, setActiveTab] = useState<NotifCategory>("all");

  const {data: notifications, isLoading, error} = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;
  const filtered = filterNotifications(notifications ?? [], activeTab);
  const groups = groupByTime(filtered);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        {unreadCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            {unreadCount} unread
          </span>
        ) : (
          <span />
        )}
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCircle2 className="size-3.5"/>
            {markAllRead.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} unreadCount={unreadCount}/>

      {/* Content */}
      {isLoading ? (
        <NotificationsSkeleton />
      ) : error ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Failed to load notifications. Please try again.
        </p>
      ) : !filtered.length ? (
        <EmptyState tab={activeTab}/>
      ) : (
        <div className="space-y-8">
          {groups.map(({label, items}) => (
            <section key={label} className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</h2>
              {items.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onMarkRead={(id) => markRead.mutate(id)}
                  isPending={markRead.isPending}
                />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}