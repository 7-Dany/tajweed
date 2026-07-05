"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { optionalOrderField, createFormResolver } from "@/lib/admin-schema-helpers"

const createLessonSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  contentKey: z.string().min(1, "المفتاح (contentKey) مطلوب"),
  order: optionalOrderField,
})

type FormValues = z.infer<typeof createLessonSchema>

export function CreateLessonForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean
  onSubmit: (values: { title: string; titleEn?: string; contentKey: string; order?: number }) => void
}) {
  const form = useForm<FormValues>({
    resolver: createFormResolver(createLessonSchema),
    defaultValues: { title: "", titleEn: "", contentKey: "", order: undefined },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="new-lesson-title">العنوان (عربي)</FieldLabel>
          <FieldContent>
            <Input id="new-lesson-title" {...form.register("title")} placeholder="عنوان الدرس" />
            <FieldError errors={[form.formState.errors.title]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="new-lesson-title-en">العنوان (English)</FieldLabel>
          <FieldContent>
            <Input id="new-lesson-title-en" {...form.register("titleEn")} placeholder="Lesson title" />
          </FieldContent>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="new-lesson-content-key">المفتاح (contentKey)</FieldLabel>
        <FieldContent>
          <Input id="new-lesson-content-key" {...form.register("contentKey")} placeholder="مثال: lesson-1" className="font-mono" />
          <FieldError errors={[form.formState.errors.contentKey]} />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="new-lesson-order">الترتيب (اختياري)</FieldLabel>
        <FieldContent>
          <Input id="new-lesson-order" type="number" {...form.register("order")} placeholder="سيُضاف في النهاية إن تُرك فارغًا" />
          <FieldError errors={[form.formState.errors.order]} />
        </FieldContent>
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting || !form.formState.isValid}>
          {submitting ? "جارٍ الإنشاء..." : "إنشاء"}
        </Button>
      </div>
    </form>
  )
}
