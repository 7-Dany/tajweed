/**
 * Course data access layer.
 *
 * Reads from a static JSON file (src/data/courses.json) — no database.
 * To add/edit courses, chapters, or lessons, edit the JSON file directly.
 *
 * When you're ready to use a database, swap these functions for Prisma
 * queries — the types and signatures stay the same.
 */

import courseData from "@/data/courses.json"

/* ───────────────────────── Types ───────────────────────── */

export type LessonWithChapter = {
  id: string
  slug: string
  title: string
  description: string | null
  contentKey: string
  order: number
  chapterId: string
}

export type ChapterWithLessons = {
  id: string
  title: string
  order: number
  lessons: LessonWithChapter[]
}

export type CourseWithRelations = {
  id: string
  slug: string
  title: string
  description: string | null
  teacher: {
    id: string
    name: string
    bio: string | null
    avatarUrl: string | null
  }
  chapters: ChapterWithLessons[]
}

export type CourseSummary = {
  id: string
  slug: string
  title: string
  description: string | null
  teacher: {
    id: string
    name: string
  }
  chapterCount: number
  lessonCount: number
}

/* ───────────────────────── Internal helpers ───────────────────────── */

type JsonLesson = {
  id: string
  slug: string
  title: string
  description: string
  contentKey: string
  order: number
}

type JsonChapter = {
  id: string
  title: string
  order: number
  lessons: JsonLesson[]
}

type JsonCourse = {
  id: string
  slug: string
  title: string
  description: string
  teacherId: string
  chapters: JsonChapter[]
}

type JsonData = {
  teacher: {
    id: string
    name: string
    email: string
    bio: string
  }
  courses: JsonCourse[]
}

const data = courseData as JsonData

/** Convert a JSON lesson to the LessonWithChapter type. */
function toLesson(l: JsonLesson, chapterId: string): LessonWithChapter {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    description: l.description || null,
    contentKey: l.contentKey,
    order: l.order,
    chapterId,
  }
}

/** Convert a JSON chapter to the ChapterWithLessons type. */
function toChapter(ch: JsonChapter): ChapterWithLessons {
  return {
    id: ch.id,
    title: ch.title,
    order: ch.order,
    lessons: ch.lessons.map((l) => toLesson(l, ch.id)),
  }
}

/** Convert a JSON course to the full CourseWithRelations type. */
function toCourseWithRelations(c: JsonCourse): CourseWithRelations {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description || null,
    teacher: {
      id: data.teacher.id,
      name: data.teacher.name,
      bio: data.teacher.bio || null,
      avatarUrl: null,
    },
    chapters: c.chapters
      .sort((a, b) => a.order - b.order)
      .map(toChapter),
  }
}

/* ───────────────────────── Public API ───────────────────────── */

/** Fetch all courses (for the catalog), with teacher info and counts. */
export function getCourses(): CourseSummary[] {
  return data.courses.map((c) => {
    const chapters = c.chapters.sort((a, b) => a.order - b.order)
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description || null,
      teacher: { id: data.teacher.id, name: data.teacher.name },
      chapterCount: chapters.length,
      lessonCount: chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
    }
  })
}

/** Fetch a course by slug, with its full chapter/lesson tree. */
export function getCourseBySlug(slug: string): CourseWithRelations | null {
  const course = data.courses.find((c) => c.slug === slug)
  return course ? toCourseWithRelations(course) : null
}

/** Fetch a course by id, with its full chapter/lesson tree. */
export function getCourseById(id: string): CourseWithRelations | null {
  const course = data.courses.find((c) => c.id === id)
  return course ? toCourseWithRelations(course) : null
}
