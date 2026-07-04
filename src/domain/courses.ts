import { courseRepository } from "@/domain/supabase-course-repository"

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

export const getCourses = () => courseRepository.listCourses()
export const getCourseBySlug = (slug: string) => courseRepository.getCourseBySlug(slug)
export const getCourseById = (id: string) => courseRepository.getCourseById(id)
export const createCourse = courseRepository.createCourse.bind(courseRepository)
export const updateCourse = courseRepository.updateCourse.bind(courseRepository)
export const deleteCourse = courseRepository.deleteCourse.bind(courseRepository)

export const getChapterById = (chapterId: string) => courseRepository.getChapterById(chapterId)
export const createChapter = courseRepository.createChapter.bind(courseRepository)
export const updateChapter = courseRepository.updateChapter.bind(courseRepository)
export const deleteChapter = courseRepository.deleteChapter.bind(courseRepository)

export const getLessonById = (lessonId: string) => courseRepository.getLessonById(lessonId)
export const createLesson = courseRepository.createLesson.bind(courseRepository)
export const updateLesson = courseRepository.updateLesson.bind(courseRepository)
export const deleteLesson = courseRepository.deleteLesson.bind(courseRepository)
