import {format} from "date-fns";
import { useParams } from "react-router-dom";

import {Badge} from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useAnnouncements } from "@/hooks/use-announcements";
import type { Announcement } from "@/api/announcements";

function AnnouncementCard({title, body, author, createdAt, isUnread, isPinned}: Announcement) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors", isPinned ? "border-primary/20 bg-primary/5" : "border-border bg-background hover:bg-muted/40"
      )}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {title}
          </h3>
          {isUnread && (
            <Badge variant="info" className="h-5 rounded-full px-2 text-[10px]">
              New
            </Badge>
          )}
          {isPinned && (
            <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">
              Pinned
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
              {getInitials(author)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {author} &bull; {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function AnnouncementsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-5">
          <Skeleton className="mb-3 h-4 w-64" />
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function CourseAnnouncements() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: announcements, isLoading, error } = useAnnouncements(courseId ?? "");

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <AnnouncementsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Failed to load announcements. Please try again.
      </p>
    );
  }

  if (!announcements?.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No announcements for this course yet.
      </p>
    );
  }

  // Server already returns pinned-first, newest-first, but we re-sort
  // defensively in case pagination ever changes that guarantee.
  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-3xl space-y-4">
      {sorted.map((announcement) => (
        <AnnouncementCard key={announcement.id} {...announcement} />
      ))}
    </div>
  );
}