import { usePageHeader } from "@/components/page-header-context";
import { useCourses } from "@/hooks/use-courses";
import { CourseCard, CourseCardSkeleton, mapCourse } from "@/components/course-card";

export default function Courses() {
  usePageHeader({
    title: "My Courses",
    description: "All your enrolled courses.",
  });

  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCardSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Failed to load courses. Please try again.
      </p>
    );
  }

  if (!courses?.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        You are not enrolled in any courses yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={course.id} {...mapCourse(course, index)} />
      ))}
    </div>
  );
}