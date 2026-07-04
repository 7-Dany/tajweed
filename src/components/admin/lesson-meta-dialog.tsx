"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { slugify } from "@/lib/slugify"
import { optionalOrderField } from "@/lib/admin-schema-helpers"
import { useUpdateLesson } from "@/hooks/use-admin-data"
import type { LessonWithChapter } from "@/domain/course-repository"

const lessonMetaSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "يُسمح فقط بالأحرف اللاتينية والأرقام والواصلات")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  contentKey: z.string().min(1, "المفتاح (contentKey) مطلوب"),
  order: optionalOrderField,
})

type FormValues = z.infer<typeof lessonMetaSchema>

export function LessonMetaDialog({
  courseSlug,
  lesson,
  open,
  onOpenChange,
}: {
  courseSlug: string
  lesson: LessonWithChapter
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateLesson = useUpdateLesson(courseSlug)
  const form = useForm<FormValues>({
    resolver: zodResolver(lessonMetaSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: lesson.title,
      titleEn: lesson.titleEn ?? "",
      slug: lesson.slug,
      description: lesson.description ?? "",
      descriptionEn: lesson.descriptionEn ?? "",
      contentKey: lesson.contentKey,
      order: lesson.order,
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    updateLesson.mutate(
      {
        chapterId: lesson.chapterId,
        lessonId: lesson.id,
        input: {
          title: values.title,
          titleEn: values.titleEn || undefined,
          slug: values.slug ? slugify(values.slug) : undefined,
          description: values.description || undefined,
          descriptionEn: values.descriptionEn || undefined,
          contentKey: values.contentKey,
          order: values.order,
        },
      },
      {
        onSuccess: () => {
          toast.success("تم حفظ بيانات الدرس")
          onOpenChange(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الدرس</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="meta-title">العنوان (عربي)</FieldLabel>
              <FieldContent>
                <Input id="meta-title" {...form.register("title")} />
                <FieldError errors={[form.formState.errors.title]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="meta-title-en">العنوان (English)</FieldLabel>
              <FieldContent>
                <Input id="meta-title-en" {...form.register("titleEn")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="meta-slug">الرابط (slug)</FieldLabel>
              <FieldContent>
                <Input id="meta-slug" placeholder="سيُشتق تلقائيًا" {...form.register("slug")} />
                <FieldError errors={[form.formState.errors.slug]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="meta-content-key">المفتاح (contentKey)</FieldLabel>
              <FieldContent>
                <Input id="meta-content-key" {...form.register("contentKey")} />
                <FieldError errors={[form.formState.errors.contentKey]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="meta-order">الترتيب</FieldLabel>
              <FieldContent>
                <Input id="meta-order" type="number" {...form.register("order")} />
                <FieldError errors={[form.formState.errors.order]} />
              </FieldContent>
            </Field>
            <div className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="meta-description">الوصف (عربي)</FieldLabel>
                <FieldContent>
                  <Textarea id="meta-description" {...form.register("description")} />
                  <FieldError errors={[form.formState.errors.description]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="meta-description-en">الوصف (English)</FieldLabel>
                <FieldContent>
                  <Textarea id="meta-description-en" {...form.register("descriptionEn")} />
                </FieldContent>
              </Field>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={updateLesson.isPending}>
              {updateLesson.isPending ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
