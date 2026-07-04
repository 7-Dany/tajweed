"use client"

import { useCallback, useState } from "react"
import { IconArrowRight, IconX } from "@tabler/icons-react"

import { SlideDeck } from "@/components/slides/slide"
import { SlideRenderer, slideToClassName } from "@/components/slides/slide-renderer"
import { ControlsBar } from "@/components/settings/controls-bar"
import { resolveLessonSlides } from "@/domain/slides/source"
import { useI18n, useTranslations } from "@/translations/provider"
import type { LessonWithChapter } from "@/domain/courses"

type LessonPlayerProps = {
  lesson: LessonWithChapter
  onExit: () => void
  onComplete: (lessonId: string) => void
}

export function LessonPlayer({
  lesson,
  onExit,
  onComplete,
}: LessonPlayerProps) {
  const { locale } = useI18n()
  // Every lesson now carries an explicit markdown `source` (courses.json +
  // domain/courses.ts resolve .md files on disk into one) — the old
  // contentKey/static-deck fallback has been removed (refactor-issues/
  // 05-migrate-remaining-decks.md, 07-markdown-parser.md).
  const slides = lesson.source ? resolveLessonSlides(lesson.source, locale) : null
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false)
  const t = useTranslations()

  const handleSlideChange = useCallback(
    (current: number, total: number) => {
      // Mark the lesson as complete when the user reaches the last slide
      if (total > 0 && current === total - 1 && !hasMarkedComplete) {
        onComplete(lesson.id)
        setHasMarkedComplete(true)
      }
    },
    [lesson.id, onComplete, hasMarkedComplete]
  )

  // Deck not found — show a friendly error
  if (!slides) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
        style={{ background: "var(--slide-bg)" }}
      >
        <p className="text-lg text-[var(--slide-fg)]">
          {t("player.deckNotFound")}: <code>{lesson.contentKey}</code>
        </p>
        <button
          onClick={onExit}
          className="rounded-lg border border-[var(--slide-border)] bg-[var(--slide-card)] px-4 py-2 text-sm font-bold text-[var(--slide-primary)]"
        >
          {t("player.back")}
        </button>
      </div>
    )
  }

  return (
    <div className="@container/slide relative h-screen w-full overflow-hidden">
      <SlideDeck
        slideClasses={slides.map((slide) => slideToClassName(slide))}
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, i) => (
          <SlideRenderer key={i} slide={slide} />
        ))}
      </SlideDeck>

      {/* Top-end: exit button.
          - Mobile: circular X icon (matches deck button size/style)
          - Desktop: arrow + text label
          Positioned at the "end" edge: right in LTR (English), left in RTL (Arabic).
          Uses pointer-events-none on the container so it doesn't block
          slide interactions. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end p-3">
        {/* Mobile: circular X button (same style as deck buttons) */}
        <button
          onClick={onExit}
          aria-label={t("player.backToCourse")}
          title={t("player.backToCourse")}
          className="pointer-events-auto grid size-8 place-items-center rounded-full border border-[var(--slide-border-strong)] bg-[var(--slide-card)] text-[var(--slide-fg)] shadow-sm transition-all hover:bg-[var(--slide-primary)] hover:text-[var(--slide-primary-fg)] hover:border-[var(--slide-primary)] sm:hidden"
        >
          <IconX size={16} />
        </button>

        {/* Desktop: arrow + text label (pill shape) */}
        <button
          onClick={onExit}
          aria-label={t("player.backToCourse")}
          title={t("player.backToCourse")}
          className="pointer-events-auto hidden items-center gap-1.5 rounded-full border border-[var(--slide-border-strong)] bg-[var(--slide-card)] px-4 py-2 text-sm font-bold text-[var(--slide-fg)] shadow-sm transition-all hover:bg-[var(--slide-primary)] hover:text-[var(--slide-primary-fg)] hover:border-[var(--slide-primary)] sm:inline-flex"
        >
          <span>{t("browser.backToCatalog")}</span>
          <IconArrowRight size={16} className="dir-arrow" />
        </button>
      </div>

      {/* Bottom-start: settings (language + theme) */}
      <ControlsBar />
    </div>
  )
}
