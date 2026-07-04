/**
 * Thin fetch client for the admin UI (src/app/admin/**) — talks to the
 * existing REST routes under src/app/api/courses/**, which are themselves
 * thin wrappers over domain/courses.ts (see that file + course-repository.ts
 * for the underlying CRUD contract).
 *
 * Every method throws `ApiError` with the server's `{ error }` message on
 * failure, so callers (react-query mutations in hooks/use-admin-data.ts)
 * can surface `err.message` directly in a toast.
 */

import type {
  ChapterWithLessons,
  CourseSummary,
  CourseWithRelations,
  CreateChapterInput,
  CreateCourseInput,
  CreateLessonInput,
  LessonWithChapter,
  UpdateChapterInput,
  UpdateCourseInput,
  UpdateLessonInput,
} from "@/domain/courses"

export class ApiError extends Error {}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(
      (data && typeof data.error === "string" && data.error) ||
        `تعذّر تنفيذ الطلب (${res.status})`
    )
  }

  return data as T
}

export const adminApi = {
  /* Courses */
  listCourses: () => request<CourseSummary[]>("/api/courses"),
  getCourse: (slug: string) => request<CourseWithRelations>(`/api/courses/${slug}`),
  createCourse: (input: CreateCourseInput & { teacherId: string }) =>
    request<CourseWithRelations>("/api/courses", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateCourse: (slug: string, input: UpdateCourseInput) =>
    request<CourseWithRelations>(`/api/courses/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteCourse: (slug: string) =>
    request<void>(`/api/courses/${slug}`, { method: "DELETE" }),

  /* Chapters */
  createChapter: (slug: string, input: CreateChapterInput) =>
    request<ChapterWithLessons>(`/api/courses/${slug}/chapters`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateChapter: (slug: string, chapterId: string, input: UpdateChapterInput) =>
    request<ChapterWithLessons>(`/api/courses/${slug}/chapters/${chapterId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteChapter: (slug: string, chapterId: string) =>
    request<void>(`/api/courses/${slug}/chapters/${chapterId}`, { method: "DELETE" }),

  /* Lessons */
  createLesson: (slug: string, chapterId: string, input: CreateLessonInput) =>
    request<LessonWithChapter>(`/api/courses/${slug}/chapters/${chapterId}/lessons`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateLesson: (
    slug: string,
    chapterId: string,
    lessonId: string,
    input: UpdateLessonInput
  ) =>
    request<LessonWithChapter>(
      `/api/courses/${slug}/chapters/${chapterId}/lessons/${lessonId}`,
      { method: "PATCH", body: JSON.stringify(input) }
    ),
  deleteLesson: (slug: string, chapterId: string, lessonId: string) =>
    request<void>(`/api/courses/${slug}/chapters/${chapterId}/lessons/${lessonId}`, {
      method: "DELETE",
    }),
}
