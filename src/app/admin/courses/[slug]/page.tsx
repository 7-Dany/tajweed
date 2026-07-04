"use client"

import { useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconBook2,
  IconChevronLeft,
  IconClipboardList,
  IconDotsVertical,
  IconFiles,
  IconPencil,
  IconPlus,
  IconSelector,
  IconTrash,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChapterForm, type ChapterFormValues } from "@/components/admin/chapter-form"
import { LessonMarkdownEditor } from "@/components/admin/lesson-markdown-editor"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { LessonMetaDialog } from "@/components/admin/lesson-meta-dialog"
import { DEFAULT_LESSON_MARKDOWN } from "@/components/admin/default-lesson-markdown"
import {
  useCourseQuery,
  useUpdateCourse,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/hooks/use-admin-data"
import type { ChapterWithLessons } from "@/domain/courses"
import type { LessonWithChapter } from "@/domain/course-repository"
import { cn } from "@/lib/utils"

export default function AdminCoursePage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const { data: course, isLoading } = useCourseQuery(slug)
  const updateCourse = useUpdateCourse()
  const createChapter = useCreateChapter(slug)
  const updateChapterMutation = useUpdateChapter(slug)
  const deleteChapterMutation = useDeleteChapter(slug)
  const createLesson = useCreateLesson(slug)
  const updateLesson = useUpdateLesson(slug)
  const deleteLessonMutation = useDeleteLesson(slug)

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [courseFormOpen, setCourseFormOpen] = useState(false)

  const [createChapterOpen, setCreateChapterOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<ChapterWithLessons | null>(null)
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null)

  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [editingLessonMeta, setEditingLessonMeta] = useState<LessonWithChapter | null>(null)
  const [creatingLessonChapterId, setCreatingLessonChapterId] = useState<string | null>(null)

  const [courseTitle, setCourseTitle] = useState("")
  const [courseTitleEn, setCourseTitleEn] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseDescriptionEn, setCourseDescriptionEn] = useState("")

  if (isLoading) return <p className="text-muted-foreground">جارٍ التحميل...</p>
  if (!course) return <p className="text-muted-foreground">لم يتم العثور على الدورة.</p>

  if (!courseFormOpen && courseTitle === "") {
    setCourseTitle(course.title)
    setCourseTitleEn(course.titleEn ?? "")
    setCourseDescription(course.description ?? "")
    setCourseDescriptionEn(course.descriptionEn ?? "")
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSaveCourse = () => {
    updateCourse.mutate(
      { slug, input: { title: courseTitle, titleEn: courseTitleEn || undefined, slug: undefined, description: courseDescription || null, descriptionEn: courseDescriptionEn || undefined } },
      {
        onSuccess: (updated) => {
          toast.success("تم حفظ التغييرات")
          setCourseFormOpen(false)
          if (updated.slug !== slug) router.replace(`/admin/courses/${updated.slug}`)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleCreateChapter = (values: ChapterFormValues) => {
    createChapter.mutate(
      { title: values.title, titleEn: values.titleEn || undefined, order: values.order },
      {
        onSuccess: () => {
          toast.success("تم إنشاء الفصل")
          setCreateChapterOpen(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleUpdateChapter = (values: ChapterFormValues) => {
    if (!editingChapter) return
    updateChapterMutation.mutate(
      { chapterId: editingChapter.id, input: { title: values.title, titleEn: values.titleEn || undefined, order: values.order } },
      {
        onSuccess: () => {
          toast.success("تم حفظ الفصل")
          setEditingChapter(null)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleDeleteChapter = () => {
    if (!deletingChapterId) return
    deleteChapterMutation.mutate(deletingChapterId, {
      onSuccess: () => {
        toast.success("تم حذف الفصل")
        setDeletingChapterId(null)
      },
      onError: (err) => {
        toast.error(err.message)
        setDeletingChapterId(null)
      },
    })
  }

  const handleDeleteLesson = () => {
    if (!deletingLessonId) return
    const found = findLessonInCourse(deletingLessonId)
    if (!found) return
    deleteLessonMutation.mutate(
      { chapterId: found.chapterId, lessonId: deletingLessonId },
      {
        onSuccess: () => {
          toast.success("تم حذف الدرس")
          if (selectedLessonId === deletingLessonId) setSelectedLessonId(null)
          setDeletingLessonId(null)
        },
        onError: (err) => {
          toast.error(err.message)
          setDeletingLessonId(null)
        },
      }
    )
  }

  const handleCreateLessonInChapter = (values: { title: string; titleEn?: string; contentKey: string; order?: number }) => {
    if (!creatingLessonChapterId) return
    createLesson.mutate(
      {
        chapterId: creatingLessonChapterId,
        input: {
          slug: "",
          title: values.title,
          titleEn: values.titleEn,
          contentKey: values.contentKey,
          order: values.order,
          source: { type: "markdown", markdown: DEFAULT_LESSON_MARKDOWN },
        },
      },
      {
        onSuccess: (lesson) => {
          toast.success("تم إنشاء الدرس")
          setCreatingLessonChapterId(null)
          setSelectedLessonId(lesson.id)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  const handleMoveLesson = (lessonId: string, targetChapterId: string) => {
    const found = findLessonInCourse(lessonId)
    if (!found) return
    toast.promise(
      updateLesson.mutateAsync(
        { chapterId: found.chapterId, lessonId, input: { chapterId: targetChapterId } }
      ),
      {
        loading: "جارٍ نقل الدرس...",
        success: "تم نقل الدرس",
        error: (err) => err.message,
      }
    )
  }

  const findLessonInCourse = (lessonId: string): { chapterId: string } | null => {
    for (const ch of course!.chapters) {
      if (ch.lessons.some((l) => l.id === lessonId)) return { chapterId: ch.id }
    }
    return null
  }

  const otherChapters = (currentChapterId: string) =>
    course!.chapters.filter((ch) => ch.id !== currentChapterId)

  const selectedLesson: LessonWithChapter | null = (() => {
    if (!selectedLessonId) return null
    for (const ch of course.chapters) {
      const found = ch.lessons.find((l) => l.id === selectedLessonId)
      if (found) return found
    }
    return null
  })()

  return (
    <>
      <div className="flex flex-1 min-h-0 gap-6">
      {/* ─────── Sidebar ─────── */}
      <aside className="w-80 shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card">
          {/* Course header */}
            <div className="flex items-start gap-3 border-b border-border p-4 pb-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <IconBook2 size={20} />
              </span>
              <div className="min-w-0 flex-1">
                  {courseFormOpen ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="عنوان الدورة (عربي)"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={courseTitleEn}
                      onChange={(e) => setCourseTitleEn(e.target.value)}
                      placeholder="عنوان الدورة (English)"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      placeholder="وصف الدورة (عربي)"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={courseDescriptionEn}
                      onChange={(e) => setCourseDescriptionEn(e.target.value)}
                      placeholder="وصف الدورة (English)"
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSaveCourse} disabled={updateCourse.isPending}>
                        حفظ
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setCourseFormOpen(false)}>
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="truncate text-base font-bold">{course.title}</h2>
                    {course.titleEn && (
                      <p className="truncate text-xs text-muted-foreground">{course.titleEn}</p>
                    )}
                    {course.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {course.description}
                      </p>
                    )}
                    {course.descriptionEn && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {course.descriptionEn}
                      </p>
                    )}
                    <button
                      onClick={() => setCourseFormOpen(true)}
                      className="mt-1 inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                    >
                      <IconPencil size={12} />
                      تعديل
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Add chapter button */}
            <div className="px-4">
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setCreateChapterOpen(true)}
              >
                <IconPlus data-icon="inline-start" />
                إضافة فصل
              </Button>
            </div>

            {/* Chapters list */}
            <div className="flex flex-col gap-1 p-2 pt-0">
              {course.chapters.length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  لا توجد فصول بعد
                </p>
              )}
              {course.chapters.map((chapter) => {
                const isOpen = expandedChapters.has(chapter.id)
                return (
                  <div key={chapter.id} className="rounded-xl">
                    {/* Chapter header */}
                    <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted">
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="grid size-6 shrink-0 place-items-center text-muted-foreground"
                      >
                        <IconChevronLeft
                          size={16}
                          className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="flex-1 truncate text-start text-sm font-medium"
                      >
                        {chapter.title}
                        {chapter.titleEn && (
                          <span className="mr-1 text-xs text-muted-foreground">({chapter.titleEn})</span>
                        )}
                      </button>
                      <span className="ml-1 text-xs text-muted-foreground">
                        {chapter.lessons.length}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring data-open:opacity-100"
                        >
                          <IconDotsVertical size={14} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              setEditingChapter(chapter)
                            }}
                          >
                            <IconPencil size={16} />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              setCreatingLessonChapterId(chapter.id)
                            }}
                          >
                            <IconFiles size={16} />
                            إضافة درس
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              setDeletingChapterId(chapter.id)
                            }}
                          >
                            <IconTrash size={16} />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Lessons (collapsible) */}
                    {isOpen && (
                      <div className="mr-5 flex flex-col border-r border-border pr-1">
                        {chapter.lessons.length === 0 && (
                          <p className="px-2 py-2 text-xs text-muted-foreground">
                            لا توجد دروس
                          </p>
                        )}
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={cn(
                              "group flex w-full items-center gap-1 rounded-md px-2 py-1",
                              lesson.id === selectedLessonId
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/50"
                            )}
                          >
                            <button
                              onClick={() => {
                                setSelectedLessonId(lesson.id)
                                if (!expandedChapters.has(chapter.id)) toggleChapter(chapter.id)
                              }}
                              className="flex flex-1 items-center gap-1 truncate text-start"
                            >
                              <IconClipboardList
                                size={14}
                                className="shrink-0 text-muted-foreground"
                              />
                              <span className="flex-1 truncate text-xs">{lesson.title}</span>
                            </button>
                            <div className="flex items-center gap-0.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  className="grid size-5 shrink-0 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring data-open:opacity-100"
                                >
                                  <IconDotsVertical size={11} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation()
                                      setEditingLessonMeta(lesson)
                                    }}
                                  >
                                    <IconPencil size={16} />
                                    تعديل
                                  </DropdownMenuItem>
                                  {otherChapters(chapter.id).length > 0 && (
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger>
                                        <IconSelector size={16} />
                                        نقل إلى...
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuSubContent>
                                        <DropdownMenuGroup>
                                          {otherChapters(chapter.id).map((ch) => (
                                            <DropdownMenuItem
                                              key={ch.id}
                                              onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation()
                                                handleMoveLesson(lesson.id, ch.id)
                                              }}
                                            >
                                              ← {ch.title}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuGroup>
                                      </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation()
                                      setDeletingLessonId(lesson.id)
                                    }}
                                  >
                                    <IconTrash size={16} />
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* ─────── Main content ─────── */}
        <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedLesson ? (
            <LessonInlineEditor
              key={selectedLesson.id}
              courseSlug={slug}
              lesson={selectedLesson}
              updateLesson={updateLesson}
            />
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                اختر درسًا لعرض محتواه
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ─────── Dialogs ─────── */}

      <Dialog open={createChapterOpen} onOpenChange={setCreateChapterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فصل جديد</DialogTitle>
          </DialogHeader>
          <ChapterForm
            submitLabel="إنشاء"
            submitting={createChapter.isPending}
            onSubmit={handleCreateChapter}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!creatingLessonChapterId}
        onOpenChange={(open) => !open && setCreatingLessonChapterId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة درس جديد</DialogTitle>
          </DialogHeader>
          <CreateLessonForm
            submitting={createLesson.isPending}
            onSubmit={handleCreateLessonInChapter}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingChapter} onOpenChange={(open) => !open && setEditingChapter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفصل</DialogTitle>
          </DialogHeader>
          {editingChapter && (
            <ChapterForm
              defaultValues={{ title: editingChapter.title, titleEn: editingChapter.titleEn ?? "", order: editingChapter.order }}
              submitLabel="حفظ"
              submitting={updateChapterMutation.isPending}
              onSubmit={handleUpdateChapter}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingChapterId}
        onOpenChange={(open) => !open && setDeletingChapterId(null)}
        title="حذف الفصل؟"
        description="سيتم حذف جميع الدروس داخل هذا الفصل. لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDeleteChapter}
        loading={deleteChapterMutation.isPending}
      />

      <ConfirmDialog
        open={!!deletingLessonId}
        onOpenChange={(open) => !open && setDeletingLessonId(null)}
        title="حذف الدرس؟"
        description="لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDeleteLesson}
        loading={deleteLessonMutation.isPending}
      />

      {editingLessonMeta && (
        <LessonMetaDialog
          courseSlug={slug}
          lesson={editingLessonMeta}
          open
          onOpenChange={(open) => !open && setEditingLessonMeta(null)}
        />
      )}
    </>
  )
}

function LessonInlineEditor({
  courseSlug,
  lesson,
  updateLesson,
}: {
  courseSlug: string
  lesson: LessonWithChapter
  updateLesson: ReturnType<typeof useUpdateLesson>
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
      }
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

function CreateLessonForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean
  onSubmit: (values: { title: string; titleEn?: string; contentKey: string; order?: number }) => void
}) {
  const [title, setTitle] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [contentKey, setContentKey] = useState("")
  const [order, setOrder] = useState("")

  const canSubmit = title.trim().length > 0 && contentKey.trim().length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSubmit({
          title: title.trim(),
          titleEn: titleEn.trim() || undefined,
          contentKey: contentKey.trim(),
          order: order ? Number(order) : undefined,
        })
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="new-lesson-title">العنوان (عربي)</label>
        <Input
          id="new-lesson-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان الدرس"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="new-lesson-title-en">العنوان (English)</label>
        <Input
          id="new-lesson-title-en"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Lesson title"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="new-lesson-content-key">المفتاح (contentKey)</label>
        <Input
          id="new-lesson-content-key"
          value={contentKey}
          onChange={(e) => setContentKey(e.target.value)}
          placeholder="مثال: lesson-1"
          className="font-mono"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="new-lesson-order">الترتيب (اختياري)</label>
        <Input
          id="new-lesson-order"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="سيُضاف في النهاية إن تُرك فارغًا"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting || !canSubmit}>
          {submitting ? "جارٍ الإنشاء..." : "إنشاء"}
        </Button>
      </div>
    </form>
  )
}


