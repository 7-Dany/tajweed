"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { DEFAULT_LESSON_MARKDOWN } from "@/components/admin/default-lesson-markdown"
import { optionalOrderField } from "@/lib/admin-schema-helpers"
import { parseMarkdownLesson } from "@/domain/slides/markdown-parser"

const lessonMetaSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().optional(),
  description: z.string().optional(),
  contentKey: z.string().min(1, "المفتاح (contentKey) مطلوب"),
  order: optionalOrderField,
})

export type LessonMetaValues = z.infer<typeof lessonMetaSchema>

export function LessonForm({
  defaultValues,
  defaultMarkdown,
  defaultMarkdownEn,
  submitLabel = "حفظ",
  submitting,
  onSubmit,
}: {
  defaultValues?: Partial<LessonMetaValues>
  defaultMarkdown?: string
  defaultMarkdownEn?: string
  submitLabel?: string
  submitting?: boolean
  onSubmit: (values: LessonMetaValues, markdown: string, markdownEn?: string) => void
}) {
  const form = useForm<LessonMetaValues>({
    resolver: zodResolver(lessonMetaSchema) as unknown as Resolver<LessonMetaValues>,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      contentKey: "",
      ...defaultValues,
    },
  })

  const [markdown, setMarkdown] = useState(defaultMarkdown ?? DEFAULT_LESSON_MARKDOWN)
  const [markdownEn, setMarkdownEn] = useState(defaultMarkdownEn)
  const [isMarkdownValid, setIsMarkdownValid] = useState(true)

  const handleSubmit = form.handleSubmit((values) => {
    try {
      parseMarkdownLesson(markdown)
      if (markdownEn) parseMarkdownLesson(markdownEn)
    } catch (err) {
      toast.error("تعذّر حفظ الدرس", {
        description: err instanceof Error ? err.message : "خطأ غير معروف في تحليل Markdown",
      })
      return
    }
    onSubmit(values, markdown, markdownEn)
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="lesson-title">العنوان</FieldLabel>
          <FieldContent>
            <Input id="lesson-title" {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="lesson-slug">الرابط (slug)</FieldLabel>
          <FieldContent>
            <Input
              id="lesson-slug"
              placeholder="سيُشتق تلقائيًا من العنوان إن تُرك فارغًا"
              {...form.register("slug")}
            />
            <FieldError errors={[form.formState.errors.slug]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="lesson-content-key">المفتاح (contentKey)</FieldLabel>
          <FieldContent>
            <Input id="lesson-content-key" {...form.register("contentKey")} />
            <FieldError errors={[form.formState.errors.contentKey]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="lesson-order">الترتيب</FieldLabel>
          <FieldContent>
            <Input id="lesson-order" type="number" {...form.register("order")} />
            <FieldError errors={[form.formState.errors.order]} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="lesson-description">الوصف</FieldLabel>
          <FieldContent>
            <Textarea id="lesson-description" {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </FieldContent>
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || !isMarkdownValid}>
          {submitting ? "جارٍ الحفظ..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
