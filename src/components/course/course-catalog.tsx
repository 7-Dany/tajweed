"use client"

import { IconArrowRight, IconBook2, IconClipboardList, IconSchool } from "@tabler/icons-react"

import { Skeleton } from "@/components/ui/skeleton"
import type { CourseSummary } from "@/domain/courses"
import { useContent, useTranslations } from "@/translations/provider"

type CourseCatalogProps = {
  courses: CourseSummary[]
  onSelectCourse: (slug: string) => void
  loading?: boolean
}

export function CourseCatalog({
  courses,
  onSelectCourse,
  loading = false,
}: CourseCatalogProps) {
  const t = useTranslations()
  const tc = useContent()

  return (
    <div
      className="relative h-screen w-full overflow-y-auto"
      style={{ background: "var(--slide-bg)" }}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:px-6 sm:py-12">
        {/* ── Header ── */}
        <header className="mb-8 text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--slide-primary-soft)] bg-[var(--slide-primary-tint)] px-4 py-1.5 text-sm font-bold text-[var(--slide-primary)]">
            <IconSchool size={16} />
            {t("catalog.badge")}
          </div>
          <h1
            className="mb-3 text-4xl font-bold text-[var(--slide-fg)] sm:text-5xl"
          >
            {t("catalog.title")}
          </h1>
          <p className="mx-auto max-w-xl text-base text-[var(--slide-fg-muted)] sm:text-lg">
            {t("catalog.subtitle")}
          </p>
        </header>

        {/* ── Course cards ── */}
        {courses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--slide-border)] p-8 text-center text-[var(--slide-fg-subtle)]">
            {t("catalog.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {courses.map((course) => {
              const translated = tc(course.slug, course.title, course.description)
              return (
              <button
                key={course.id}
                onClick={() => onSelectCourse(course.slug)}
                className="group flex flex-col rounded-2xl border border-[var(--slide-border)] bg-[var(--slide-card)] p-6 text-start shadow-sm transition-all hover:border-[var(--slide-primary-soft)] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--slide-primary)]"
              >
                {/* Top row: icon + arrow */}
                <div className="mb-4 flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-[var(--slide-primary-tint)] text-[var(--slide-primary)] transition-colors group-hover:bg-[var(--slide-primary)] group-hover:text-[var(--slide-primary-fg)]">
                    <IconBook2 size={24} />
                  </span>
                  <span className="dir-arrow-wrap text-[var(--slide-fg-subtle)]">
                    <IconArrowRight size={22} className="dir-arrow" />
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="mb-2 text-2xl font-bold text-[var(--slide-fg)]"
                >
                  {translated.title}
                </h2>

                {/* Description */}
                {translated.description && (
                  <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--slide-fg-muted)]">
                    {translated.description}
                  </p>
                )}

                {/* Footer: teacher + stats */}
                <div className="mt-auto flex items-center gap-4 border-t border-[var(--slide-border)] pt-4 text-xs text-[var(--slide-fg-subtle)]">
                  <span className="font-bold text-[var(--slide-fg)]">
                    {tc("teacher", course.teacher.name).title}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IconClipboardList size={14} />
                    {course.chapterCount} {t("catalog.chapters")} ·{" "}
                    {course.lessonCount} {t("catalog.lessons")}
                  </span>
                </div>
              </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--slide-bg)_80%,transparent)] backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 flex flex-col items-center gap-3 sm:mb-12">
              <Skeleton className="h-7 w-32 rounded-full" style={{ background: "var(--slide-bg-subtle)" }} />
              <Skeleton className="h-10 w-64 rounded-lg" style={{ background: "var(--slide-bg-subtle)" }} />
              <Skeleton className="h-5 w-80 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border border-[var(--slide-border)] bg-[var(--slide-card)] p-6">
                  <div className="flex items-start justify-between">
                    <Skeleton className="size-12 rounded-xl" style={{ background: "var(--slide-bg-subtle)" }} />
                    <Skeleton className="size-6" style={{ background: "var(--slide-bg-subtle)" }} />
                  </div>
                  <Skeleton className="h-7 w-3/4 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                  <Skeleton className="h-4 w-full rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                  <Skeleton className="h-4 w-1/2 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                  <div className="mt-auto flex items-center gap-4 border-t border-[var(--slide-border)] pt-4">
                    <Skeleton className="h-4 w-20 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                    <Skeleton className="h-4 w-32 rounded-md" style={{ background: "var(--slide-bg-subtle)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
