/**
 * JsonCourseRepository — CourseRepository implementation backed by
 * src/content/courses.json (+ .md lesson files on disk). This is the "no
 * database yet" implementation; see domain/course-repository.ts for the
 * interface this must keep satisfying, and refactor-issues/06-teacher-entity.md
 * for the swap-to-Prisma goal.
 *
 * All reads are synchronous (in-memory, loaded from the JSON file at module
 * load). All writes read-modify-write the in-memory object, then persist it
 * back to disk as JSON.
 */

import { promises as fs, readFileSync } from "node:fs"
import path from "node:path"

import courseData from "@/content/courses.json"
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

/* ───────────────────────── On-disk JSON shapes ───────────────────────── */

type JsonLesson = {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  contentKey: string
  order: number
  source?: LessonSourceInput
}

type JsonChapter = {
  id: string
  title: string
  titleEn?: string
  order: number
  lessons: JsonLesson[]
}

type JsonCourse = {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  teacherId: string
  chapters: JsonChapter[]
}

type JsonTeacher = {
  id: string
  name: string
  email: string
  bio: string
}

type JsonData = {
  teachers: JsonTeacher[]
  courses: JsonCourse[]
}

const COURSES_JSON_PATH = path.join(process.cwd(), "src", "content", "courses.json")
const LESSONS_DIR = path.join(process.cwd(), "src", "content", "lessons")

/** Reads a lesson markdown file off disk (e.g. "madd-rules.md"). */
function readLessonMarkdown(file: string): string {
  return readFileSync(path.join(LESSONS_DIR, file), "utf-8")
}

/** Resolves a stored LessonSourceInput (which may be a file reference) to a real LessonSource. */
function resolveLessonSource(source: LessonSourceInput | undefined): LessonSource | undefined {
  if (!source) return undefined
  if (source.type === "markdown-file") {
    return {
      type: "markdown-i18n",
      ar: readLessonMarkdown(source.file),
      en: source.fileEn ? readLessonMarkdown(source.fileEn) : undefined,
    }
  }
  return source
}

export class JsonCourseRepository implements CourseRepository {
  private data: JsonData

  constructor(initialData: JsonData) {
    // Deep-clone so mutations here never touch the imported JSON module's
    // cached object across repository instances (mainly matters for tests).
    this.data = structuredClone(initialData)
  }

  /* ───────────────────────── Internal helpers ───────────────────────── */

  private findTeacher(teacherId: string): JsonTeacher {
    const teacher = this.data.teachers.find((t) => t.id === teacherId)
    if (!teacher) throw new Error(`Unknown teacherId: ${teacherId}`)
    return teacher
  }

  private findCourseIndex(courseId: string): number {
    return this.data.courses.findIndex((c) => c.id === courseId)
  }

  private findChapter(chapterId: string): { course: JsonCourse; chapter: JsonChapter } | null {
    for (const course of this.data.courses) {
      const chapter = course.chapters.find((ch) => ch.id === chapterId)
      if (chapter) return { course, chapter }
    }
    return null
  }

  private findLesson(
    lessonId: string
  ): { course: JsonCourse; chapter: JsonChapter; lesson: JsonLesson } | null {
    for (const course of this.data.courses) {
      for (const chapter of course.chapters) {
        const lesson = chapter.lessons.find((l) => l.id === lessonId)
        if (lesson) return { course, chapter, lesson }
      }
    }
    return null
  }

  private toTeacher(t: JsonTeacher): Teacher {
    return { id: t.id, name: t.name, bio: t.bio || null, avatarUrl: null }
  }

  private toLesson(l: JsonLesson, chapterId: string): LessonWithChapter {
    return {
      id: l.id,
      slug: l.slug,
      title: l.title,
      titleEn: l.titleEn,
      description: l.description || null,
      descriptionEn: l.descriptionEn,
      contentKey: l.contentKey,
      order: l.order,
      chapterId,
      source: resolveLessonSource(l.source),
    }
  }

  private toChapter(ch: JsonChapter): ChapterWithLessons {
    return {
      id: ch.id,
      title: ch.title,
      titleEn: ch.titleEn,
      order: ch.order,
      lessons: ch.lessons.map((l) => this.toLesson(l, ch.id)),
    }
  }

  private toCourseWithRelations(c: JsonCourse): CourseWithRelations {
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      titleEn: c.titleEn,
      description: c.description || null,
      descriptionEn: c.descriptionEn,
      teacher: this.toTeacher(this.findTeacher(c.teacherId)),
      chapters: [...c.chapters].sort((a, b) => a.order - b.order).map((ch) => this.toChapter(ch)),
    }
  }

  /** Persists the in-memory `data` object back to courses.json. */
  private async persist(): Promise<void> {
    await fs.writeFile(COURSES_JSON_PATH, JSON.stringify(this.data, null, 2) + "\n", "utf-8")
  }

  /* ───────────────────────── Courses ───────────────────────── */

  async listCourses(): Promise<CourseSummary[]> {
    return this.data.courses.map((c) => {
      const teacher = this.findTeacher(c.teacherId)
      const chapters = [...c.chapters].sort((a, b) => a.order - b.order)
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        titleEn: c.titleEn,
        description: c.description || null,
        descriptionEn: c.descriptionEn,
        teacher: { id: teacher.id, name: teacher.name },
        chapterCount: chapters.length,
        lessonCount: chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
      }
    })
  }

  async getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
    const course = this.data.courses.find((c) => c.slug === slug)
    return course ? this.toCourseWithRelations(course) : null
  }

  async getCourseById(id: string): Promise<CourseWithRelations | null> {
    const course = this.data.courses.find((c) => c.id === id)
    return course ? this.toCourseWithRelations(course) : null
  }

  async createCourse(teacherId: string, input: CreateCourseInput): Promise<CourseWithRelations> {
    this.findTeacher(teacherId) // throws if unknown

    const slug = input.slug ? slugify(input.slug) : slugify(input.title)
    if (this.data.courses.some((c) => c.slug === slug)) {
      throw new Error(`A course with slug "${slug}" already exists`)
    }

    const course: JsonCourse = {
      id: `course-${slug}`,
      slug,
      title: input.title,
      titleEn: input.titleEn,
      description: input.description ?? "",
      descriptionEn: input.descriptionEn,
      teacherId,
      chapters: [],
    }

    this.data.courses.push(course)
    await this.persist()
    return this.toCourseWithRelations(course)
  }

  async updateCourse(courseId: string, input: UpdateCourseInput): Promise<CourseWithRelations> {
    const index = this.findCourseIndex(courseId)
    if (index === -1) throw new Error(`Unknown courseId: ${courseId}`)
    const course = this.data.courses[index]

    if (input.slug !== undefined) {
      const slug = slugify(input.slug)
      if (slug !== course.slug && this.data.courses.some((c) => c.slug === slug)) {
        throw new Error(`A course with slug "${slug}" already exists`)
      }
      course.slug = slug
    }
    if (input.title !== undefined) course.title = input.title
    if (input.titleEn !== undefined) course.titleEn = input.titleEn
    if (input.description !== undefined) course.description = input.description ?? ""
    if (input.descriptionEn !== undefined) course.descriptionEn = input.descriptionEn ?? ""

    await this.persist()
    return this.toCourseWithRelations(course)
  }

  async deleteCourse(courseId: string): Promise<void> {
    const index = this.findCourseIndex(courseId)
    if (index === -1) throw new Error(`Unknown courseId: ${courseId}`)
    this.data.courses.splice(index, 1)
    await this.persist()
  }

  /* ───────────────────────── Chapters ───────────────────────── */

  async getChapterById(chapterId: string): Promise<ChapterWithLessons | null> {
    const found = this.findChapter(chapterId)
    return found ? this.toChapter(found.chapter) : null
  }

  async createChapter(courseId: string, input: CreateChapterInput): Promise<ChapterWithLessons> {
    const course = this.data.courses.find((c) => c.id === courseId)
    if (!course) throw new Error(`Unknown courseId: ${courseId}`)

    const order = input.order ?? course.chapters.length + 1
    const chapter: JsonChapter = {
      id: `chapter-${slugify(input.title)}-${course.chapters.length + 1}`,
      title: input.title,
      titleEn: input.titleEn,
      order,
      lessons: [],
    }

    course.chapters.push(chapter)
    await this.persist()
    return this.toChapter(chapter)
  }

  async updateChapter(chapterId: string, input: UpdateChapterInput): Promise<ChapterWithLessons> {
    const found = this.findChapter(chapterId)
    if (!found) throw new Error(`Unknown chapterId: ${chapterId}`)
    const { chapter } = found

    if (input.title !== undefined) chapter.title = input.title
    if (input.titleEn !== undefined) chapter.titleEn = input.titleEn
    if (input.order !== undefined) chapter.order = input.order

    await this.persist()
    return this.toChapter(chapter)
  }

  async deleteChapter(chapterId: string): Promise<void> {
    const found = this.findChapter(chapterId)
    if (!found) throw new Error(`Unknown chapterId: ${chapterId}`)
    found.course.chapters = found.course.chapters.filter((ch) => ch.id !== chapterId)
    await this.persist()
  }

  /* ───────────────────────── Lessons ───────────────────────── */

  async getLessonById(lessonId: string): Promise<LessonWithChapter | null> {
    const found = this.findLesson(lessonId)
    return found ? this.toLesson(found.lesson, found.chapter.id) : null
  }

  async createLesson(chapterId: string, input: CreateLessonInput): Promise<LessonWithChapter> {
    const found = this.findChapter(chapterId)
    if (!found) throw new Error(`Unknown chapterId: ${chapterId}`)
    const { chapter } = found

    const slug = input.slug ? slugify(input.slug) : slugify(input.title)
    if (chapter.lessons.some((l) => l.slug === slug)) {
      throw new Error(`A lesson with slug "${slug}" already exists in this chapter`)
    }

    const order = input.order ?? chapter.lessons.length + 1
    const lesson: JsonLesson = {
      id: `lesson-${slug}`,
      slug,
      title: input.title,
      titleEn: input.titleEn,
      description: input.description ?? "",
      descriptionEn: input.descriptionEn,
      contentKey: input.contentKey,
      order,
      source: input.source,
    }

    chapter.lessons.push(lesson)
    await this.persist()
    return this.toLesson(lesson, chapter.id)
  }

  async updateLesson(lessonId: string, input: UpdateLessonInput): Promise<LessonWithChapter> {
    const found = this.findLesson(lessonId)
    if (!found) throw new Error(`Unknown lessonId: ${lessonId}`)
    let { course, chapter, lesson } = found

    if (input.slug !== undefined) {
      const slug = slugify(input.slug)
      if (slug !== lesson.slug && chapter.lessons.some((l) => l.slug === slug)) {
        throw new Error(`A lesson with slug "${slug}" already exists in this chapter`)
      }
      lesson.slug = slug
    }
    if (input.title !== undefined) lesson.title = input.title
    if (input.titleEn !== undefined) lesson.titleEn = input.titleEn
    if (input.description !== undefined) lesson.description = input.description ?? ""
    if (input.descriptionEn !== undefined) lesson.descriptionEn = input.descriptionEn ?? ""
    if (input.contentKey !== undefined) lesson.contentKey = input.contentKey
    if (input.order !== undefined) lesson.order = input.order
    if (input.source !== undefined) lesson.source = input.source

    // Move lesson to a different chapter within the same course
    if (input.chapterId !== undefined && input.chapterId !== chapter.id) {
      const targetChapter = course.chapters.find((c) => c.id === input.chapterId)
      if (!targetChapter) throw new Error(`Unknown chapterId: ${input.chapterId}`)
      chapter.lessons = chapter.lessons.filter((l) => l.id !== lessonId)
      targetChapter.lessons.push(lesson)
      chapter = targetChapter
    }

    await this.persist()
    return this.toLesson(lesson, chapter.id)
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const found = this.findLesson(lessonId)
    if (!found) throw new Error(`Unknown lessonId: ${lessonId}`)
    found.chapter.lessons = found.chapter.lessons.filter((l) => l.id !== lessonId)
    await this.persist()
  }
}

/** Singleton instance used throughout the app — see domain/courses.ts. */
export const courseRepository: CourseRepository = new JsonCourseRepository(courseData as JsonData)
