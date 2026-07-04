"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"

const courseSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  teacherId: z.string().optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export function CourseForm({
  defaultValues,
  showTeacherId = false,
  submitLabel = "حفظ",
  submitting,
  onSubmit,
}: {
  defaultValues?: Partial<CourseFormValues>
  showTeacherId?: boolean
  submitLabel?: string
  submitting?: boolean
  onSubmit: (values: CourseFormValues) => void
}) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      slug: "",
      description: "",
      descriptionEn: "",
      teacherId: "teacher-1",
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="course-title">العنوان (عربي)</FieldLabel>
          <FieldContent>
            <Input id="course-title" {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="course-title-en">العنوان (English)</FieldLabel>
          <FieldContent>
            <Input id="course-title-en" {...form.register("titleEn")} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="course-slug">الرابط (slug)</FieldLabel>
        <FieldContent>
          <Input
            id="course-slug"
            placeholder="سيُشتق تلقائيًا من العنوان إن تُرك فارغًا"
            {...form.register("slug")}
          />
          <FieldError errors={[form.formState.errors.slug]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="course-description">الوصف (عربي)</FieldLabel>
          <FieldContent>
            <Textarea id="course-description" {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="course-description-en">الوصف (English)</FieldLabel>
          <FieldContent>
            <Textarea id="course-description-en" {...form.register("descriptionEn")} />
          </FieldContent>
        </Field>
      </div>

      {showTeacherId && (
        <Field>
          <FieldLabel htmlFor="course-teacher">معرّف المعلم (teacherId)</FieldLabel>
          <FieldContent>
            <Input id="course-teacher" {...form.register("teacherId")} />
            <FieldError errors={[form.formState.errors.teacherId]} />
          </FieldContent>
        </Field>
      )}

      <Button type="submit" disabled={submitting} className="w-fit self-end">
        {submitting ? "جارٍ الحفظ..." : submitLabel}
      </Button>
    </form>
  )
}
