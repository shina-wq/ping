export type LessonType = "video" | "reading" | "quiz";
export type LessonStatus = "completed" | "current" | "locked";

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  status: LessonStatus;
  description: string;
  overview: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};