"use client"

import { IconArrowRight, IconBook, IconCheck, IconPlayerPlay } from "@tabler/icons-react"

import type { CourseWithRelations, LessonWithChapter } from "@/lib/courses"
import { useContent, useTranslations } from "@/lib/i18n"

type CourseBrowserProps = {
  course: CourseWithRelations
  completedLessons: string[]
  onSelectLesson: (lesson: LessonWithChapter) => void
  onExit: () => void
}

export function CourseBrowser({
  course,
  completedLessons,
  onSelectLesson,
  onExit,
}: CourseBrowserProps) {
  const t = useTranslations()
  const tc = useContent()
  const courseTranslated = tc(course.slug, course.title, course.description)
  const totalLessons = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.length,
    0
  )
  const completedCount = completedLessons.filter((id) =>
    course.chapters.some((ch) => ch.lessons.some((l) => l.id === id))
  ).length
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  return (
    <div
      className="h-screen w-full overflow-y-auto"
      style={{ background: "var(--slide-bg)" }}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 pb-24 sm:px-6 sm:py-12">
        {/* ── Back to catalog (positioned at the "end" edge) ── */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--slide-primary)] px-4 py-2 text-sm font-bold text-[var(--slide-primary-fg)] shadow-sm transition-opacity hover:opacity-90"
          >
            {t("browser.backToCatalog")}
            <IconArrowRight size={16} className="dir-arrow" />
          </button>
        </div>
        {/* ── Course header ── */}
        <header className="mb-8 text-center sm:mb-12">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--slide-primary-soft)] bg-[var(--slide-primary-tint)] px-4 py-1.5 text-sm font-bold text-[var(--slide-primary)]"
          >
            <IconBook size={16} />
            {t("browser.badge")}
          </div>
          <h1
            className="mb-3 text-4xl font-bold text-[var(--slide-fg)] sm:text-5xl"
          >
            {courseTranslated.title}
          </h1>
          {courseTranslated.description && (
            <p className="mx-auto mb-5 max-w-xl text-base text-[var(--slide-fg-muted)] sm:text-lg">
              {courseTranslated.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--slide-fg-subtle)]">
            <span>{t("catalog.teacher")}:</span>
            <span className="font-bold text-[var(--slide-fg)]">
              {tc("teacher", course.teacher.name).title}
            </span>
          </div>
        </header>

        {/* ── Progress bar ── */}
        {totalLessons > 0 && (
          <div className="mb-8 sm:mb-10">
            <div className="mb-2 flex items-center justify-between text-sm text-[var(--slide-fg-muted)]">
              <span>{t("browser.progress")}</span>
              <span className="font-bold">
                {completedCount} / {totalLessons}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--slide-bg-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--slide-primary)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Chapters & lessons ── */}
        <div className="flex flex-col gap-8">
          {course.chapters.map((chapter, chIndex) => {
            const chapterTranslated = tc(chapter.title, chapter.title)
            return (
            <section key={chapter.id}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-[var(--slide-primary-soft)] bg-[var(--slide-primary-tint)] text-sm font-bold text-[var(--slide-primary)]"
                >
                  {chIndex + 1}
                </span>
                <h2
                  className="text-xl font-bold text-[var(--slide-fg)] sm:text-2xl"
                >
                  {chapterTranslated.title}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {chapter.lessons.map((lesson, lIndex) => {
                  const isDone = completedLessons.includes(lesson.id)
                  const lessonTranslated = tc(lesson.slug, lesson.title, lesson.description)
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className="group flex items-center gap-4 rounded-xl border border-[var(--slide-border)] bg-[var(--slide-card)] p-4 text-start shadow-sm transition-all hover:border-[var(--slide-primary-soft)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--slide-primary)] sm:p-5"
                    >
                      {/* Status / play icon */}
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${
                          isDone
                            ? "bg-[var(--slide-primary)] text-[var(--slide-primary-fg)]"
                            : "bg-[var(--slide-bg-subtle)] text-[var(--slide-primary)] group-hover:bg-[var(--slide-primary-tint)]"
                        }`}
                      >
                        {isDone ? (
                          <IconCheck size={20} />
                        ) : (
                          <IconPlayerPlay size={18} />
                        )}
                      </span>

                      {/* Title + description */}
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold text-[var(--slide-fg)] sm:text-lg"
                        >
                          {lessonTranslated.title}
                        </h3>
                        {lessonTranslated.description && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-[var(--slide-fg-subtle)]">
                            {lessonTranslated.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <span className="dir-arrow-wrap shrink-0 text-[var(--slide-fg-subtle)]">
                        <IconArrowRight size={20} className="dir-arrow" />
                      </span>
                    </button>
                  )
                })}

                {chapter.lessons.length === 0 && (
                  <p className="rounded-xl border border-dashed border-[var(--slide-border)] p-4 text-center text-sm text-[var(--slide-fg-subtle)]">
                    {t("browser.empty")}
                  </p>
                )}
              </div>
            </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
