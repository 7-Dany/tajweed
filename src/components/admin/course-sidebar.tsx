"use client"

import { useState } from "react"
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
import { cn } from "@/lib/utils"
import type { CourseWithRelations } from "@/domain/course-repository"
import type { ChapterWithLessons } from "@/domain/courses"

export function CourseSidebar({
  course,
  expandedChapters,
  selectedLessonId,
  updateCoursePending,
  onToggleChapter,
  onSelectLesson,
  onEditCourse,
  onSaveCourse,
  onCancelEditCourse,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onMoveLesson,
}: {
  course: CourseWithRelations
  expandedChapters: Set<string>
  selectedLessonId: string | null
  updateCoursePending: boolean
  onToggleChapter: (id: string) => void
  onSelectLesson: (id: string) => void
  onEditCourse: () => void
  onSaveCourse: (input: { title: string; titleEn?: string; description?: string; descriptionEn?: string }) => void
  onCancelEditCourse: () => void
  onAddChapter: () => void
  onEditChapter: (chapter: ChapterWithLessons) => void
  onDeleteChapter: (id: string) => void
  onAddLesson: (chapterId: string) => void
  onEditLesson: (lessonId: string) => void
  onDeleteLesson: (id: string) => void
  onMoveLesson: (lessonId: string, targetChapterId: string) => void
}) {
  const [courseForm, setCourseForm] = useState<{
    title: string; titleEn: string; description: string; descriptionEn: string
  } | null>(null)

  const editing = courseForm !== null

  const handleEdit = () => {
    setCourseForm({
      title: course.title,
      titleEn: course.titleEn ?? "",
      description: course.description ?? "",
      descriptionEn: course.descriptionEn ?? "",
    })
    onEditCourse()
  }

  const handleCancel = () => {
    setCourseForm(null)
    onCancelEditCourse()
  }

  const handleSave = () => {
    if (!courseForm) return
    onSaveCourse(courseForm)
    setCourseForm(null)
  }

  const otherChapters = (currentId: string) =>
    course.chapters.filter((ch) => ch.id !== currentId)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card">
      {/* Course header */}
      <div className="flex items-start gap-3 border-b border-border p-4 pb-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <IconBook2 size={20} />
        </span>
        <div className="min-w-0 flex-1">
          {courseForm ? (
            <div className="flex flex-col gap-2">
              <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="عنوان الدورة (عربي)" className="h-8 text-sm" />
              <Input value={courseForm.titleEn} onChange={(e) => setCourseForm({ ...courseForm, titleEn: e.target.value })} placeholder="عنوان الدورة (English)" className="h-8 text-sm" />
              <Input value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="وصف الدورة (عربي)" className="h-8 text-sm" />
              <Input value={courseForm.descriptionEn} onChange={(e) => setCourseForm({ ...courseForm, descriptionEn: e.target.value })} placeholder="وصف الدورة (English)" className="h-8 text-sm" />
              <div className="flex gap-1">
                <Button size="sm" onClick={handleSave} disabled={updateCoursePending}>حفظ</Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>إلغاء</Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="truncate text-base font-bold">{course.title}</h2>
              {course.titleEn && <p className="truncate text-xs text-muted-foreground">{course.titleEn}</p>}
              {course.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{course.description}</p>}
              {course.descriptionEn && <p className="line-clamp-2 text-xs text-muted-foreground">{course.descriptionEn}</p>}
              <button onClick={handleEdit} className="mt-1 inline-flex items-center gap-0.5 text-xs text-primary hover:underline">
                <IconPencil size={12} />
                تعديل
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add chapter button */}
      <div className="px-4">
        <Button variant="outline" className="w-full" size="sm" onClick={onAddChapter}>
          <IconPlus data-icon="inline-start" />
          إضافة فصل
        </Button>
      </div>

      {/* Chapters list */}
      <div className="flex flex-col gap-1 p-2 pt-0">
        {course.chapters.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">لا توجد فصول بعد</p>
        )}
        {course.chapters.map((chapter) => {
          const isOpen = expandedChapters.has(chapter.id)
          return (
            <div key={chapter.id} className="rounded-xl">
              {/* Chapter header */}
              <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted">
                <button onClick={() => onToggleChapter(chapter.id)} className="grid size-6 shrink-0 place-items-center text-muted-foreground">
                  <IconChevronLeft size={16} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                <button onClick={() => onToggleChapter(chapter.id)} className="flex-1 truncate text-start text-sm font-medium">
                  {chapter.title}
                  {chapter.titleEn && <span className="mr-1 text-xs text-muted-foreground">({chapter.titleEn})</span>}
                </button>
                <span className="ml-1 text-xs text-muted-foreground">{chapter.lessons.length}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring data-open:opacity-100"
                  >
                    <IconDotsVertical size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEditChapter(chapter)}>
                      <IconPencil size={16} />تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddLesson(chapter.id)}>
                      <IconFiles size={16} />إضافة درس
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDeleteChapter(chapter.id)}>
                      <IconTrash size={16} />حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Lessons */}
              {isOpen && (
                <div className="mr-5 flex flex-col border-r border-border pr-1">
                  {chapter.lessons.length === 0 && (
                    <p className="px-2 py-2 text-xs text-muted-foreground">لا توجد دروس</p>
                  )}
                  {chapter.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "group flex w-full items-center gap-1 rounded-md px-2 py-1",
                        lesson.id === selectedLessonId ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
                      )}
                    >
                      <button
                        onClick={() => {
                          onSelectLesson(lesson.id)
                          if (!expandedChapters.has(chapter.id)) onToggleChapter(chapter.id)
                        }}
                        className="flex flex-1 items-center gap-1 truncate text-start"
                      >
                        <IconClipboardList size={14} className="shrink-0 text-muted-foreground" />
                        <span className="flex-1 truncate text-xs">{lesson.title}</span>
                      </button>
                      <div className="flex items-center gap-0.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            className="grid size-5 shrink-0 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring data-open:opacity-100"
                          >
                            <IconDotsVertical size={11} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onEditLesson(lesson.id)}>
                              <IconPencil size={16} />تعديل
                            </DropdownMenuItem>
                            {otherChapters(chapter.id).length > 0 && (
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <IconSelector size={16} />نقل إلى...
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuGroup>
                                    {otherChapters(chapter.id).map((ch) => (
                                      <DropdownMenuItem key={ch.id} onClick={() => onMoveLesson(lesson.id, ch.id)}>
                                        ← {ch.title}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => onDeleteLesson(lesson.id)}>
                              <IconTrash size={16} />حذف
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
  )
}
