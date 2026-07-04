/**
 * CourseRepository — the storage-agnostic seam for all course/chapter/lesson
 * CRUD. `JsonCourseRepository` (json-course-repository.ts) is the only
 * implementation today, backed by src/content/courses.json + .md files on
 * disk. When a real database is ready, write a `PrismaCourseRepository`
 * implementing this same interface and swap the singleton exported from
 * domain/courses.ts — nothing above this layer (API routes, components)
 * needs to change.
 *
 * See refactor-issues/06-teacher-entity.md for the original "swap for
 * Prisma later" goal this interface is written against.
 */

import type { LessonSource } from "@/domain/slides/source"

/* ───────────────────────── Read-side shapes ───────────────────────── */

export type Teacher = {
  id: string
  name: string
  bio: string | null
  avatarUrl: string | null
}

export type LessonWithChapter = {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string | null
  descriptionEn?: string
  contentKey: string
  order: number
  chapterId: string
  /**
   * Where this lesson's slides come from — a `LessonSource` (markdown or
   * markdown-i18n; already resolved from any on-disk .md files by the
   * repository implementation). Optional only for defensive/legacy
   * entries; lesson-player.tsx shows a "deck not found" screen if absent.
   */
  source?: LessonSource
}

export type ChapterWithLessons = {
  id: string
  title: string
  titleEn?: string
  order: number
  lessons: LessonWithChapter[]
}

export type CourseWithRelations = {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string | null
  descriptionEn?: string
  teacher: Teacher
  chapters: ChapterWithLessons[]
}

export type CourseSummary = {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string | null
  descriptionEn?: string
  teacher: {
    id: string
    name: string
  }
  chapterCount: number
  lessonCount: number
}

/* ───────────────────────── Write-side input shapes ───────────────────────── */

export type CreateCourseInput = {
  slug: string
  title: string
  titleEn?: string
  description?: string | null
  descriptionEn?: string
}

export type UpdateCourseInput = Partial<{
  slug: string
  title: string
  titleEn?: string
  description: string | null
  descriptionEn?: string
}>

export type CreateChapterInput = {
  title: string
  titleEn?: string
  order?: number
}

export type UpdateChapterInput = Partial<{
  title: string
  titleEn?: string
  order: number
}>

/**
 * A lesson's `source` at the storage layer can either be a fully-inline
 * `LessonSource` (markdown / markdown-i18n with the markdown already
 * embedded), OR this file-reference shorthand — which points at one or two
 * `.md` files under src/content/lessons (ar + optional en). The JSON
 * implementation resolves these off disk before handing lessons back to
 * callers; other implementations (e.g. a DB-backed one) may not need this
 * variant at all.
 */
export type LessonSourceInput =
  | LessonSource
  | { type: "markdown-file"; file: string; fileEn?: string }

export type CreateLessonInput = {
  slug: string
  title: string
  titleEn?: string
  description?: string | null
  descriptionEn?: string
  contentKey: string
  order?: number
  source?: LessonSourceInput
}

export type UpdateLessonInput = Partial<{
  slug: string
  title: string
  titleEn?: string
  description: string | null
  descriptionEn?: string
  contentKey: string
  order: number
  source: LessonSourceInput
  chapterId: string
}>

/* ───────────────────────── The repository seam ───────────────────────── */

export interface CourseRepository {
  /* Courses */
  listCourses(): CourseSummary[]
  getCourseBySlug(slug: string): CourseWithRelations | null
  getCourseById(id: string): CourseWithRelations | null
  createCourse(teacherId: string, input: CreateCourseInput): Promise<CourseWithRelations>
  updateCourse(courseId: string, input: UpdateCourseInput): Promise<CourseWithRelations>
  deleteCourse(courseId: string): Promise<void>

  /* Chapters */
  getChapterById(chapterId: string): ChapterWithLessons | null
  createChapter(courseId: string, input: CreateChapterInput): Promise<ChapterWithLessons>
  updateChapter(chapterId: string, input: UpdateChapterInput): Promise<ChapterWithLessons>
  deleteChapter(chapterId: string): Promise<void>

  /* Lessons */
  getLessonById(lessonId: string): LessonWithChapter | null
  createLesson(chapterId: string, input: CreateLessonInput): Promise<LessonWithChapter>
  updateLesson(lessonId: string, input: UpdateLessonInput): Promise<LessonWithChapter>
  deleteLesson(lessonId: string): Promise<void>
}
