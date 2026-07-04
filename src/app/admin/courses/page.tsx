"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconBook2, IconClipboardList, IconDotsVertical, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CourseForm, type CourseFormValues } from "@/components/admin/course-form"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useCoursesQuery, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/use-admin-data"

export default function AdminCoursesPage() {
  const router = useRouter()
  const { data: courses, isLoading } = useCoursesQuery()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const deleteCourse = useDeleteCourse()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<{ slug: string; title: string; titleEn?: string | null; description: string | null; descriptionEn?: string | null } | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  const handleCreate = (values: CourseFormValues) => {
    createCourse.mutate(
      {
        title: values.title,
        titleEn: values.titleEn || undefined,
        slug: values.slug ?? "",
        description: values.description ?? null,
        descriptionEn: values.descriptionEn || undefined,
        teacherId: values.teacherId ?? "teacher-1",
      },
      {
        onSuccess: () => {
          toast.success("تم إنشاء الدورة")
          setCreateOpen(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleUpdate = (values: CourseFormValues) => {
    if (!editingCourse) return
    updateCourse.mutate(
      { slug: editingCourse.slug, input: { title: values.title, titleEn: values.titleEn || undefined, slug: values.slug, description: values.description ?? null, descriptionEn: values.descriptionEn || undefined } },
      {
        onSuccess: () => {
          toast.success("تم حفظ التغييرات")
          setEditingCourse(null)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleDelete = () => {
    if (!deleteSlug) return
    deleteCourse.mutate(deleteSlug, {
      onSuccess: () => {
        toast.success("تم حذف الدورة")
        setDeleteSlug(null)
      },
      onError: (err) => {
        toast.error(err.message)
        setDeleteSlug(null)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">الدورات</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <IconPlus data-icon="inline-start" />
          إضافة دورة
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">جارٍ التحميل...</p>
      ) : !courses || courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          لا توجد دورات بعد
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/admin/courses/${course.slug}`)}
              className="group flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-6 text-start shadow-sm transition-all hover:border-primary/30 hover:shadow-md focus:outline-none"
            >
              {/* Top row: icon + 3-dots menu */}
              <div className="mb-4 flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <IconBook2 size={24} />
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <IconDotsVertical size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setEditingCourse({ slug: course.slug, title: course.title, titleEn: course.titleEn, description: course.description, descriptionEn: course.descriptionEn })
                      }}
                    >
                      <IconPencil size={16} />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setDeleteSlug(course.slug)
                      }}
                    >
                      <IconTrash size={16} />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title */}
              <h2 className="mb-2 text-2xl font-bold">
                {course.title}
              </h2>

              {/* Description */}
              {course.description && (
                <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              )}

              {/* Footer: teacher + stats */}
              <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {course.teacher.name}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconClipboardList size={14} />
                  {course.chapterCount} فصول · {course.lessonCount} دروس
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة دورة جديدة</DialogTitle>
          </DialogHeader>
          <CourseForm
            showTeacherId
            submitLabel="إنشاء"
            submitting={createCourse.isPending}
            onSubmit={handleCreate}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الدورة</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <CourseForm
              defaultValues={{ title: editingCourse.title, titleEn: editingCourse.titleEn ?? "", slug: editingCourse.slug, description: editingCourse.description ?? "", descriptionEn: editingCourse.descriptionEn ?? "" }}
              submitLabel="حفظ"
              submitting={updateCourse.isPending}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteSlug}
        onOpenChange={(open) => !open && setDeleteSlug(null)}
        title="حذف الدورة؟"
        description="سيتم حذف جميع الفصول والدروس المرتبطة بها. لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        loading={deleteCourse.isPending}
      />
    </div>
  )
}
