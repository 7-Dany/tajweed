"use client"

import { useReducer } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { DEFAULT_LESSON_MARKDOWN } from "@/components/admin/default-lesson-markdown"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChapterForm, type ChapterFormValues } from "@/components/admin/chapter-form"
import { CreateLessonForm } from "@/components/admin/create-lesson-form"
import { CourseSidebar } from "@/components/admin/course-sidebar"
import { LessonInlineEditor } from "@/components/admin/lesson-inline-editor"
import { LessonMetaDialog } from "@/components/admin/lesson-meta-dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
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

type DialogState =
  | null
  | { type: "createChapter" }
  | { type: "editChapter"; chapter: ChapterWithLessons }
  | { type: "deleteChapter"; chapterId: string }
  | { type: "deleteLesson"; lessonId: string }
  | { type: "createLesson"; chapterId: string }
  | { type: "editLessonMeta"; lesson: LessonWithChapter }

type State = {
  expandedChapters: Set<string>
  selectedLessonId: string | null
  dialog: DialogState
}

type Action =
  | { type: "TOGGLE_CHAPTER"; id: string }
  | { type: "SELECT_LESSON"; id: string | null }
  | { type: "OPEN_DIALOG"; dialog: DialogState }
  | { type: "CLOSE_DIALOG" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_CHAPTER": {
      const next = new Set(state.expandedChapters)
      if (next.has(action.id)) next.delete(action.id)
      else next.add(action.id)
      return { ...state, expandedChapters: next }
    }
    case "SELECT_LESSON":
      return { ...state, selectedLessonId: action.id }
    case "OPEN_DIALOG":
      return { ...state, dialog: action.dialog }
    case "CLOSE_DIALOG":
      return { ...state, dialog: null }
  }
}

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

  const [state, dispatch] = useReducer(reducer, {
    expandedChapters: new Set<string>(),
    selectedLessonId: null,
    dialog: null,
  })

  if (isLoading) return (
    <div className="flex flex-1 min-h-0 gap-6">
      <aside className="w-80 shrink-0">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3 border-b border-border pb-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-full rounded-xl" />
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="flex flex-1 min-h-0 gap-2 rounded-2xl border border-border p-0">
          <div className="flex flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
            <div className="flex-1 p-3">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <div className="flex-1 p-3">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
  if (!course) return <p className="text-muted-foreground">لم يتم العثور على الدورة.</p>

  const handleSaveCourse = (input: { title: string; titleEn?: string; description?: string; descriptionEn?: string }) => {
    updateCourse.mutate(
      { slug, input: { title: input.title, titleEn: input.titleEn || undefined, slug: undefined, description: input.description || null, descriptionEn: input.descriptionEn || undefined } },
      {
        onSuccess: (updated) => {
          toast.success("تم حفظ التغييرات")
          if (updated.slug !== slug) router.replace(`/admin/courses/${updated.slug}`)
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  const handleCreateChapter = (values: ChapterFormValues) => {
    createChapter.mutate(
      { title: values.title, titleEn: values.titleEn || undefined, order: values.order },
      { onSuccess: () => { toast.success("تم إنشاء الفصل"); dispatch({ type: "CLOSE_DIALOG" }) }, onError: (err) => toast.error(err.message) },
    )
  }

  const handleUpdateChapter = (values: ChapterFormValues) => {
    const chapter = state.dialog?.type === "editChapter" ? state.dialog.chapter : null
    if (!chapter) return
    updateChapterMutation.mutate(
      { chapterId: chapter.id, input: { title: values.title, titleEn: values.titleEn || undefined, order: values.order } },
      { onSuccess: () => { toast.success("تم حفظ الفصل"); dispatch({ type: "CLOSE_DIALOG" }) }, onError: (err) => toast.error(err.message) },
    )
  }

  const handleDeleteChapter = () => {
    const id = state.dialog?.type === "deleteChapter" ? state.dialog.chapterId : null
    if (!id) return
    deleteChapterMutation.mutate(id, {
      onSuccess: () => { toast.success("تم حذف الفصل"); dispatch({ type: "CLOSE_DIALOG" }) },
      onError: (err) => { toast.error(err.message); dispatch({ type: "CLOSE_DIALOG" }) },
    })
  }

  const handleDeleteLesson = () => {
    const id = state.dialog?.type === "deleteLesson" ? state.dialog.lessonId : null
    if (!id) return
    const found = findLessonInCourse(id)
    if (!found) return
    deleteLessonMutation.mutate(
      { chapterId: found.chapterId, lessonId: id },
      {
        onSuccess: () => {
          toast.success("تم حذف الدرس")
          if (state.selectedLessonId === id) dispatch({ type: "SELECT_LESSON", id: null })
          dispatch({ type: "CLOSE_DIALOG" })
        },
        onError: (err) => { toast.error(err.message); dispatch({ type: "CLOSE_DIALOG" }) },
      },
    )
  }

  const handleCreateLesson = (values: { title: string; titleEn?: string; contentKey: string; order?: number }) => {
    const chapterId = state.dialog?.type === "createLesson" ? state.dialog.chapterId : null
    if (!chapterId) return
    createLesson.mutate(
      {
        chapterId,
        input: { slug: "", title: values.title, titleEn: values.titleEn, contentKey: values.contentKey, order: values.order, source: { type: "markdown" as const, markdown: DEFAULT_LESSON_MARKDOWN } },
      },
      {
        onSuccess: (lesson) => {
          toast.success("تم إنشاء الدرس")
          dispatch({ type: "CLOSE_DIALOG" })
          dispatch({ type: "SELECT_LESSON", id: lesson.id })
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  const handleMoveLesson = (lessonId: string, targetChapterId: string) => {
    const found = findLessonInCourse(lessonId)
    if (!found) return
    toast.promise(
      updateLesson.mutateAsync({ chapterId: found.chapterId, lessonId, input: { chapterId: targetChapterId } }),
      { loading: "جارٍ نقل الدرس...", success: "تم نقل الدرس", error: (err) => err.message },
    )
  }

  const findLessonInCourse = (lessonId: string): { chapterId: string } | null => {
    for (const ch of course.chapters) {
      if (ch.lessons.some((l) => l.id === lessonId)) return { chapterId: ch.id }
    }
    return null
  }

  const selectedLesson: LessonWithChapter | null = (() => {
    if (!state.selectedLessonId) return null
    for (const ch of course.chapters) {
      const found = ch.lessons.find((l) => l.id === state.selectedLessonId)
      if (found) return found
    }
    return null
  })()

  const handleEditLesson = (id: string) => {
    for (const ch of course.chapters) {
      const found = ch.lessons.find((l) => l.id === id)
      if (found) { dispatch({ type: "OPEN_DIALOG", dialog: { type: "editLessonMeta", lesson: found } }); return }
    }
  }

  return (
    <>
      <div className="flex flex-1 min-h-0 gap-6">
        <aside className="w-80 shrink-0 overflow-y-auto">
          <CourseSidebar
            course={course}
            expandedChapters={state.expandedChapters}
            selectedLessonId={state.selectedLessonId}
            updateCoursePending={updateCourse.isPending}
            onToggleChapter={(id) => dispatch({ type: "TOGGLE_CHAPTER", id })}
            onSelectLesson={(id) => dispatch({ type: "SELECT_LESSON", id })}
            onEditCourse={() => {}}
            onSaveCourse={handleSaveCourse}
            onCancelEditCourse={() => {}}
            onAddChapter={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "createChapter" } })}
            onEditChapter={(chapter) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "editChapter", chapter } })}
            onDeleteChapter={(chapterId) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "deleteChapter", chapterId } })}
            onAddLesson={(chapterId) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "createLesson", chapterId } })}
            onEditLesson={handleEditLesson}
            onDeleteLesson={(lessonId) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "deleteLesson", lessonId } })}
            onMoveLesson={handleMoveLesson}
          />
        </aside>
        <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedLesson ? (
            <LessonInlineEditor key={selectedLesson.id} courseSlug={slug} lesson={selectedLesson} updateLesson={updateLesson} />
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">اختر درسًا لعرض محتواه</p>
            </div>
          )}
        </main>
      </div>

      <Dialog open={state.dialog?.type === "createChapter"} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة فصل جديد</DialogTitle></DialogHeader>
          <ChapterForm submitLabel="إنشاء" submitting={createChapter.isPending} onSubmit={handleCreateChapter} />
        </DialogContent>
      </Dialog>

      <Dialog open={state.dialog?.type === "createLesson"} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة درس جديد</DialogTitle></DialogHeader>
          <CreateLessonForm submitting={createLesson.isPending} onSubmit={handleCreateLesson} />
        </DialogContent>
      </Dialog>

      <Dialog open={state.dialog?.type === "editChapter"} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })}>
        <DialogContent>
          <DialogHeader><DialogTitle>تعديل الفصل</DialogTitle></DialogHeader>
          {state.dialog?.type === "editChapter" && (
            <ChapterForm defaultValues={{ title: state.dialog.chapter.title, titleEn: state.dialog.chapter.titleEn ?? "", order: state.dialog.chapter.order }} submitLabel="حفظ" submitting={updateChapterMutation.isPending} onSubmit={handleUpdateChapter} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={state.dialog?.type === "deleteChapter"} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })} title="حذف الفصل؟" description="سيتم حذف جميع الدروس داخل هذا الفصل. لا يمكن التراجع عن هذا الإجراء." onConfirm={handleDeleteChapter} loading={deleteChapterMutation.isPending} />

      <ConfirmDialog open={state.dialog?.type === "deleteLesson"} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })} title="حذف الدرس؟" description="لا يمكن التراجع عن هذا الإجراء." onConfirm={handleDeleteLesson} loading={deleteLessonMutation.isPending} />

      {state.dialog?.type === "editLessonMeta" && (
        <LessonMetaDialog courseSlug={slug} lesson={state.dialog.lesson} open onOpenChange={(o) => !o && dispatch({ type: "CLOSE_DIALOG" })} />
      )}
    </>
  )
}
