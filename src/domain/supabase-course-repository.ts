import { readFileSync } from "node:fs"
import path from "node:path"

import type { LessonSource } from "@/domain/slides/source"
import type {
  ChapterWithLessons,
  CourseRepository,
  CourseSummary,
  CourseWithRelations,
  CreateChapterInput,
  CreateCourseInput,
  CreateLessonInput,
  LessonSourceInput,
  LessonWithChapter,
  Teacher,
  UpdateChapterInput,
  UpdateCourseInput,
  UpdateLessonInput,
} from "@/domain/course-repository"
import { slugify } from "@/lib/slugify"
import { supabase } from "@/lib/supabase"

/* ─────────────────────── DB row shapes ─────────────────────── */

type DbTeacher = {
  id: string
  name: string
  bio: string | null
  avatar_url: string | null
  email: string | null
}

type DbCourse = {
  id: string
  slug: string
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  teacher_id: string
}

type DbChapter = {
  id: string
  course_id: string
  title: string
  title_en: string | null
  order: number
}

type DbLesson = {
  id: string
  chapter_id: string
  slug: string
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  content_key: string
  order: number
  source: unknown
}

/* ─────────────────────── File-based lesson source resolution ─────────────────────── */

const LESSONS_DIR = path.join(process.cwd(), "src", "content", "lessons")

function readLessonMarkdown(file: string): string {
  return readFileSync(path.join(LESSONS_DIR, file), "utf-8")
}

function resolveLessonSource(source: unknown): LessonSource | undefined {
  if (!source || typeof source !== "object") return undefined
  const input = source as LessonSourceInput
  if (input.type === "markdown-file") {
    return {
      type: "markdown-i18n",
      ar: readLessonMarkdown(input.file),
      en: input.fileEn ? readLessonMarkdown(input.fileEn) : undefined,
    }
  }
  return input as LessonSource
}

/* ─────────────────────── Mappers ─────────────────────── */

function toTeacher(t: DbTeacher): Teacher {
  return { id: t.id, name: t.name, bio: t.bio, avatarUrl: t.avatar_url }
}

function toLesson(l: DbLesson): LessonWithChapter {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    titleEn: l.title_en ?? undefined,
    description: l.description,
    descriptionEn: l.description_en ?? undefined,
    contentKey: l.content_key,
    order: l.order,
    chapterId: l.chapter_id,
    source: resolveLessonSource(l.source),
  }
}

function toChapter(ch: DbChapter, lessons: LessonWithChapter[]): ChapterWithLessons {
  return {
    id: ch.id,
    title: ch.title,
    titleEn: ch.title_en ?? undefined,
    order: ch.order,
    lessons: lessons.sort((a, b) => a.order - b.order),
  }
}

/* ─────────────────────── Repository ─────────────────────── */

export class SupabaseCourseRepository implements CourseRepository {
  /* ─────────────────────── Courses ─────────────────────── */

  async listCourses(): Promise<CourseSummary[]> {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("id, slug, title, title_en, description, description_en, teacher_id")
      .order("title")
    if (error) throw new Error(error.message)
    if (!courses) return []

    const summaries: CourseSummary[] = []
    for (const c of courses) {
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id, name")
        .eq("id", c.teacher_id)
        .single()
      if (!teacher) continue

      const { count: chapterCount } = await supabase
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("course_id", c.id)

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .eq("course_id", c.id)

      let lessonCount = 0
      if (chapters) {
        const chapterIds = chapters.map((ch) => ch.id)
        if (chapterIds.length > 0) {
          const { count } = await supabase
            .from("lessons")
            .select("id", { count: "exact", head: true })
            .in("chapter_id", chapterIds)
          lessonCount = count ?? 0
        }
      }

      summaries.push({
        id: c.id,
        slug: c.slug,
        title: c.title,
        titleEn: c.title_en ?? undefined,
        description: c.description,
        descriptionEn: c.description_en ?? undefined,
        teacher: { id: teacher.id, name: teacher.name },
        chapterCount: chapterCount ?? 0,
        lessonCount,
      })
    }
    return summaries
  }

  async getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single()
    if (error || !course) return null
    return this.loadCourseRelations(course as DbCourse)
  }

  async getCourseById(id: string): Promise<CourseWithRelations | null> {
    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single()
    if (error || !course) return null
    return this.loadCourseRelations(course as DbCourse)
  }

  private async loadCourseRelations(course: DbCourse): Promise<CourseWithRelations> {
    const { data: teacher } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", course.teacher_id)
      .single()
    if (!teacher) throw new Error(`Unknown teacherId: ${course.teacher_id}`)

    const { data: dbChapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("course_id", course.id)
      .order("order")
    const chapters: ChapterWithLessons[] = []

    for (const ch of dbChapters ?? []) {
      const dbCh = ch as DbChapter
      const { data: dbLessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("chapter_id", dbCh.id)
        .order("order")
      const lessons = (dbLessons ?? []).map((l) => toLesson(l as DbLesson))
      chapters.push(toChapter(dbCh, lessons))
    }

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      titleEn: course.title_en ?? undefined,
      description: course.description,
      descriptionEn: course.description_en ?? undefined,
      teacher: toTeacher(teacher as DbTeacher),
      chapters,
    }
  }

  async createCourse(teacherId: string, input: CreateCourseInput): Promise<CourseWithRelations> {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title)

    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
    if (existing) throw new Error(`A course with slug "${slug}" already exists`)

    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        slug,
        title: input.title,
        title_en: input.titleEn ?? null,
        description: input.description ?? null,
        description_en: input.descriptionEn ?? null,
        teacher_id: teacherId,
      })
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return this.loadCourseRelations(course as DbCourse)
  }

  async updateCourse(courseId: string, input: UpdateCourseInput): Promise<CourseWithRelations> {
    const updates: Record<string, unknown> = {}
    if (input.slug !== undefined) {
      const slug = slugify(input.slug)
      const { data: existing } = await supabase
        .from("courses")
        .select("id")
        .neq("id", courseId)
        .eq("slug", slug)
        .maybeSingle()
      if (existing) throw new Error(`A course with slug "${slug}" already exists`)
      updates.slug = slug
    }
    if (input.title !== undefined) updates.title = input.title
    if (input.titleEn !== undefined) updates.title_en = input.titleEn ?? null
    if (input.description !== undefined) updates.description = input.description
    if (input.descriptionEn !== undefined) updates.description_en = input.descriptionEn ?? null
    updates.updated_at = new Date().toISOString()

    const { data: course, error } = await supabase
      .from("courses")
      .update(updates)
      .eq("id", courseId)
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return this.loadCourseRelations(course as DbCourse)
  }

  async deleteCourse(courseId: string): Promise<void> {
    const { error } = await supabase.from("courses").delete().eq("id", courseId)
    if (error) throw new Error(error.message)
  }

  /* ─────────────────────── Chapters ─────────────────────── */

  async getChapterById(chapterId: string): Promise<ChapterWithLessons | null> {
    const { data: chapter, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", chapterId)
      .single()
    if (error || !chapter) return null
    const dbCh = chapter as DbChapter
    const { data: dbLessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("chapter_id", dbCh.id)
      .order("order")
    const lessons = (dbLessons ?? []).map((l) => toLesson(l as DbLesson))
    return toChapter(dbCh, lessons)
  }

  async createChapter(courseId: string, input: CreateChapterInput): Promise<ChapterWithLessons> {
    const { data: maxOrder } = await supabase
      .from("chapters")
      .select("order")
      .eq("course_id", courseId)
      .order("order", { ascending: false })
      .limit(1)
    const order = input.order ?? (maxOrder && maxOrder.length > 0 ? maxOrder[0].order + 1 : 1)

    const { data: chapter, error } = await supabase
      .from("chapters")
      .insert({
        course_id: courseId,
        title: input.title,
        title_en: input.titleEn ?? null,
        order,
      })
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return toChapter(chapter as DbChapter, [])
  }

  async updateChapter(chapterId: string, input: UpdateChapterInput): Promise<ChapterWithLessons> {
    const updates: Record<string, unknown> = {}
    if (input.title !== undefined) updates.title = input.title
    if (input.titleEn !== undefined) updates.title_en = input.titleEn ?? null
    if (input.order !== undefined) updates.order = input.order
    updates.updated_at = new Date().toISOString()

    const { data: chapter, error } = await supabase
      .from("chapters")
      .update(updates)
      .eq("id", chapterId)
      .select("*")
      .single()
    if (error) throw new Error(error.message)

    const result = await this.getChapterById(chapterId)
    if (!result) throw new Error(`Chapter not found after update: ${chapterId}`)
    return result
  }

  async deleteChapter(chapterId: string): Promise<void> {
    const { error } = await supabase.from("chapters").delete().eq("id", chapterId)
    if (error) throw new Error(error.message)
  }

  /* ─────────────────────── Lessons ─────────────────────── */

  async getLessonById(lessonId: string): Promise<LessonWithChapter | null> {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single()
    if (error || !lesson) return null
    return toLesson(lesson as DbLesson)
  }

  async createLesson(chapterId: string, input: CreateLessonInput): Promise<LessonWithChapter> {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title)

    const { data: existing } = await supabase
      .from("lessons")
      .select("id")
      .eq("chapter_id", chapterId)
      .eq("slug", slug)
      .maybeSingle()
    if (existing) throw new Error(`A lesson with slug "${slug}" already exists in this chapter`)

    const { data: maxOrder } = await supabase
      .from("lessons")
      .select("order")
      .eq("chapter_id", chapterId)
      .order("order", { ascending: false })
      .limit(1)
    const order = input.order ?? (maxOrder && maxOrder.length > 0 ? maxOrder[0].order + 1 : 1)

    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert({
        chapter_id: chapterId,
        slug,
        title: input.title,
        title_en: input.titleEn ?? null,
        description: input.description ?? null,
        description_en: input.descriptionEn ?? null,
        content_key: input.contentKey,
        order,
        source: input.source ?? null,
      })
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return toLesson(lesson as DbLesson)
  }

  async updateLesson(lessonId: string, input: UpdateLessonInput): Promise<LessonWithChapter> {
    const updates: Record<string, unknown> = {}
    if (input.slug !== undefined) {
      const slug = slugify(input.slug)
      const { data: existing } = await supabase
        .from("lessons")
        .select("id, chapter_id")
        .eq("id", lessonId)
        .single()
      if (existing) {
        const { data: dup } = await supabase
          .from("lessons")
          .select("id")
          .neq("id", lessonId)
          .eq("chapter_id", existing.chapter_id)
          .eq("slug", slug)
          .maybeSingle()
        if (dup) throw new Error(`A lesson with slug "${slug}" already exists in this chapter`)
      }
      updates.slug = slug
    }
    if (input.title !== undefined) updates.title = input.title
    if (input.titleEn !== undefined) updates.title_en = input.titleEn ?? null
    if (input.description !== undefined) updates.description = input.description
    if (input.descriptionEn !== undefined) updates.description_en = input.descriptionEn ?? null
    if (input.contentKey !== undefined) updates.content_key = input.contentKey
    if (input.order !== undefined) updates.order = input.order
    if (input.source !== undefined) updates.source = input.source
    if (input.chapterId !== undefined) updates.chapter_id = input.chapterId
    updates.updated_at = new Date().toISOString()

    const { data: lesson, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", lessonId)
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return toLesson(lesson as DbLesson)
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId)
    if (error) throw new Error(error.message)
  }
}

export const courseRepository: CourseRepository = new SupabaseCourseRepository()
