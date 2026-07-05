"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { LessonMarkdownEditor } from "@/components/admin/lesson-markdown-editor"
import { DEFAULT_LESSON_MARKDOWN } from "@/components/admin/default-lesson-markdown"
import type { LessonWithChapter } from "@/domain/course-repository"

export function LessonInlineEditor({
  courseSlug,
  lesson,
  updateLesson,
}: {
  courseSlug: string
  lesson: LessonWithChapter
  updateLesson: {
    isPending: boolean
    mutate: (args: {
      chapterId: string
      lessonId: string
      input: Record<string, unknown>
    }, opts?: { onSuccess?: () => void; onError?: (err: Error) => void }) => void
  }
}) {
  const existingEn = lesson.source?.type === "markdown-i18n" ? lesson.source.en : undefined
  const defaultMarkdown =
    lesson.source?.type === "markdown"
      ? lesson.source.markdown
      : lesson.source?.type === "markdown-i18n"
        ? lesson.source.ar
        : DEFAULT_LESSON_MARKDOWN

  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [markdownEn, setMarkdownEn] = useState<string | undefined>(existingEn)
  const [isMarkdownValid, setIsMarkdownValid] = useState(true)
  const initial = useRef({ markdown: defaultMarkdown, markdownEn: existingEn })
  const isDirty = markdown !== initial.current.markdown || markdownEn !== initial.current.markdownEn

  const handleSave = () => {
    const source = markdownEn
      ? { type: "markdown-i18n" as const, ar: markdown, en: markdownEn }
      : existingEn
        ? { type: "markdown-i18n" as const, ar: markdown, en: existingEn }
        : { type: "markdown" as const, markdown }

    updateLesson.mutate(
      {
        chapterId: lesson.chapterId,
        lessonId: lesson.id,
        input: {
          title: lesson.title,
          slug: lesson.slug || undefined,
          description: lesson.description || undefined,
          contentKey: lesson.contentKey,
          order: lesson.order,
          source,
        },
      },
      {
        onSuccess: () => toast.success("تم حفظ الدرس"),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  return (
    <LessonMarkdownEditor
      arValue={markdown}
      enValue={markdownEn}
      onArChange={setMarkdown}
      onEnChange={setMarkdownEn}
      onValidityChange={setIsMarkdownValid}
      actions={
        <Button type="button" size="sm" onClick={handleSave} disabled={updateLesson.isPending || !isMarkdownValid || !isDirty}>
          {updateLesson.isPending ? "جارٍ الحفظ..." : "حفظ"}
        </Button>
      }
    />
  )
}
