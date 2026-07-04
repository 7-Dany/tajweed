import { CourseApp } from "@/components/course/course-app"
import { getCourses } from "@/domain/courses"

export default function Page() {
  const courses = getCourses()

  if (courses.length === 0) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center"
        style={{ background: "var(--slide-bg)" }}
      >
        <p className="text-lg text-slide-fg">
          لا توجد دورات متاحة بعد.
        </p>
        <p className="text-sm text-slide-fg-muted">
          أضف دورات في <code>src/content/courses.json</code>
        </p>
      </div>
    )
  }

  return <CourseApp courses={courses} />
}
