import { CourseApp } from "@/components/course/course-app"
import { getCourses } from "@/lib/courses"

export default function Page() {
  const courses = getCourses()

  if (courses.length === 0) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center"
        style={{ background: "var(--slide-bg)" }}
      >
        <p className="text-lg text-[var(--slide-fg)]">
          لا توجد دورات متاحة بعد.
        </p>
        <p className="text-sm text-[var(--slide-fg-muted)]">
          أضف دورات في <code>src/data/courses.json</code>
        </p>
      </div>
    )
  }

  return <CourseApp courses={courses} />
}
