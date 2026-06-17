import {format} from "date-fns";

import {Badge} from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

// Types
type Announcement = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  isNew: boolean;
  isPinned: boolean;
}

// Static data
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Problem Set 4 — Clarification on Question 3",
    body: "Several students have asked about Question 3 in Problem Set 4. To clarify: you should use the quadratic formula, not factoring, for part (b). Full marks will be awarded for either method if the working is shown correctly. Please reach out if you have further questions before the Dec 14 deadline.",
    author: "Dr. Johnson",
    createdAt: "2024-12-13",
    isNew: true,
    isPinned: true,
  },
  {
    id: "2",
    title: "Midterm Results Posted",
    body: "Midterm exam results have been posted to the Grades tab. The class average was 79%. Overall a solid performance — well done to everyone. Individual feedback has been added to each submission. If you wish to discuss your result, office hours are Tuesdays 2–4 PM.",
    author: "Dr. Johnson",
    createdAt: "2024-12-02",
    isNew: true,
    isPinned: false,
  },
  {
    id: "3",
    title: "No Class on Nov 29 — Public Holiday",
    body: "As a reminder, there will be no lecture on Friday November 29 due to the public holiday. The recorded lecture from last semester covering the same content is available on the course page. Please watch it before the next session on December 3.",
    author: "Dr. Johnson",
    createdAt: "2024-11-27",
    isNew: false,
    isPinned: false,
  },
  {
    id: "4",
    title: "Welcome to Mathematics 101 — Fall 2024",
    body: 'Welcome everyone! I am looking forward to a great semester. Please review the course syllabus linked below and make sure you have access to the required textbook: "Calculus: Early Transcendentals" 9th edition. Our first assignment will be due in Week 3. Office hours are posted on the course info page.',
    author: "Dr. Johnson",
    createdAt: "2024-09-03",
    isNew: false,
    isPinned: false,
  },
];

function AnnouncementCard({title, body, author, createdAt, isNew, isPinned}: Announcement) {
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
          {isNew && (
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

export default function CourseAnnouncements() {
  // Pinned first, then chronological order
  const sorted = [...ANNOUNCEMENTS].sort((a, b) => {
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