/**
 * Course data access layer — thin facade over `courseRepository`
 * (domain/json-course-repository.ts), which implements the
 * `CourseRepository` interface (domain/course-repository.ts).
 *
 * This file exists so the rest of the app (API routes, components) can
 * import stable function names/types from one place without caring which
 * repository implementation is plugged in underneath. To swap to a real
 * database: write a `PrismaCourseRepository implements CourseRepository`
 * and change the one import below — nothing else needs to change.
 * See refactor-issues/06-teacher-entity.md.
 */

import { courseRepository } from "@/domain/json-course-repository"

export type {
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

/* ───────────────────────── Courses ───────────────────────── */

export const getCourses = () => courseRepository.listCourses()
export const getCourseBySlug = (slug: string) => courseRepository.getCourseBySlug(slug)
export const getCourseById = (id: string) => courseRepository.getCourseById(id)
export const createCourse = courseRepository.createCourse.bind(courseRepository)
export const updateCourse = courseRepository.updateCourse.bind(courseRepository)
export const deleteCourse = courseRepository.deleteCourse.bind(courseRepository)

/* ───────────────────────── Chapters ───────────────────────── */

export const getChapterById = (chapterId: string) => courseRepository.getChapterById(chapterId)
export const createChapter = courseRepository.createChapter.bind(courseRepository)
export const updateChapter = courseRepository.updateChapter.bind(courseRepository)
export const deleteChapter = courseRepository.deleteChapter.bind(courseRepository)

/* ───────────────────────── Lessons ───────────────────────── */

export const getLessonById = (lessonId: string) => courseRepository.getLessonById(lessonId)
export const createLesson = courseRepository.createLesson.bind(courseRepository)
export const updateLesson = courseRepository.updateLesson.bind(courseRepository)
export const deleteLesson = courseRepository.deleteLesson.bind(courseRepository)
