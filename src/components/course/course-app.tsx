"use client"

import { lazy, Suspense, useCallback, useState, useTransition } from "react"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/ui/skeleton"
import { CourseBrowser } from "@/components/course/course-browser"
import { CourseCatalog } from "@/components/course/course-catalog"
import { ControlsBar } from "@/components/settings/controls-bar"
import { useLessonProgress } from "@/hooks/use-lesson-progress"
import type {
  CourseSummary,
  CourseWithRelations,
  LessonWithChapter,
} from "@/domain/courses"

// Code-split the lesson player (and its slide deck) so the catalog and
// browser load fast. React 19 Suspense handles the loading fallback.
const LessonPlayer = lazy(() =>
  import("@/components/course/lesson-player").then((m) => ({ default: m.LessonPlayer }))
)

/** Fetcher used by TanStack Query. */
async function fetchCourse(slug: string): Promise<CourseWithRelations> {
  const res = await fetch(`/api/courses/${slug}`)
  if (!res.ok) throw new Error("Failed to load course")
  return res.json()
}

type CourseAppProps = {
  courses: CourseSummary[]
}

export function CourseApp({ courses }: CourseAppProps) {
  const [activeCourseSlug, setActiveCourseSlug] = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<LessonWithChapter | null>(
    null
  )
  const [isPending, startTransition] = useTransition()
  const { completedLessons, markCompleted } = useLessonProgress()

  // Fetch the full course tree when a slug is selected. TanStack Query
  // handles loading/error state + caching, replacing the buggy manual
  // loadingCourse flag that never reset.
  const { data: activeCourse, isFetching: isFetchingCourse } = useQuery({
    queryKey: ["course", activeCourseSlug],
    queryFn: () => fetchCourse(activeCourseSlug!),
    enabled: activeCourseSlug !== null,
    staleTime: 5 * 60 * 1000,
  })

  /** Catalog → course browser. Uses startTransition for a smooth, non-blocking switch. */
  const handleSelectCourse = useCallback((slug: string) => {
    startTransition(() => setActiveCourseSlug(slug))
  }, [])

  /** Course browser → catalog. */
  const handleExitCourse = useCallback(() => {
    startTransition(() => {
      setActiveCourseSlug(null)
      setActiveLesson(null)
    })
  }, [])

  /** Lesson player → course browser. */
  const handleExitLesson = useCallback(() => {
    startTransition(() => setActiveLesson(null))
  }, [])

  const handleSelectLesson = useCallback((lesson: LessonWithChapter) => {
    startTransition(() => setActiveLesson(lesson))
  }, [])

  // ── Lesson player view ──
  if (activeLesson && activeCourse) {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-col" style={{ background: "var(--slide-bg)" }}>
            <div className="flex items-center justify-between border-b border-[var(--slide-border)] px-4 py-3">
              <Skeleton className="h-8 w-24 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
              <Skeleton className="size-8 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
            </div>
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="w-full max-w-2xl space-y-6">
                <Skeleton className="h-10 w-3/4 rounded-lg" style={{ background: "var(--slide-bg-subtle)" }} />
                <Skeleton className="h-5 w-1/2 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                <Skeleton className="h-64 w-full rounded-2xl" style={{ background: "var(--slide-bg-subtle)" }} />
                <div className="flex justify-center gap-2">
                  <Skeleton className="size-3 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
                  <Skeleton className="size-3 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
                  <Skeleton className="size-3 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <LessonPlayer
          lesson={activeLesson}
          onExit={handleExitLesson}
          onComplete={markCompleted}
        />
      </Suspense>
    )
  }

  // ── Course browser view ──
  if (activeCourse) {
    return (
      <>
        <ControlsBar />
        <CourseBrowser
          course={activeCourse}
          completedLessons={completedLessons}
          onSelectLesson={handleSelectLesson}
          onExit={handleExitCourse}
        />
      </>
    )
  }

  // ── Catalog view (default) ──
  return (
    <>
      <ControlsBar />
      <CourseCatalog
        courses={courses}
        onSelectCourse={handleSelectCourse}
        loading={isFetchingCourse || isPending}
      />
    </>
  )
}
