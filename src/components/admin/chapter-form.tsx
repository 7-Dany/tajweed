"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { optionalOrderField } from "@/lib/admin-schema-helpers"

const chapterSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  order: optionalOrderField,
})

export type ChapterFormValues = z.infer<typeof chapterSchema>

export function ChapterForm({
  defaultValues,
  submitLabel = "حفظ",
  submitting,
  onSubmit,
}: {
  defaultValues?: Partial<ChapterFormValues>
  submitLabel?: string
  submitting?: boolean
  onSubmit: (values: ChapterFormValues) => void
}) {
  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema) as unknown as Resolver<ChapterFormValues>,
    defaultValues: { title: "", titleEn: "", ...defaultValues },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="chapter-title">العنوان (عربي)</FieldLabel>
          <FieldContent>
            <Input id="chapter-title" {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="chapter-title-en">العنوان (English)</FieldLabel>
          <FieldContent>
            <Input id="chapter-title-en" {...form.register("titleEn")} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="chapter-order">الترتيب</FieldLabel>
        <FieldContent>
          <Input id="chapter-order" type="number" {...form.register("order")} />
          <FieldError errors={[form.formState.errors.order]} />
        </FieldContent>
      </Field>

      <Button type="submit" disabled={submitting} className="w-fit self-end">
        {submitting ? "جارٍ الحفظ..." : submitLabel}
      </Button>
    </form>
  )
}
