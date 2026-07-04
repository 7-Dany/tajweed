"use client"

/**
 * React Query hooks wrapping lib/admin-api.ts for the admin UI
 * (src/app/admin/**). One hook per mutation shape; chapter/lesson mutations
 * take the chapterId/lessonId as part of the mutate() variables (rather than
 * being baked into the hook) so a single hook instance can serve every row
 * in a table.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "@/lib/admin-api"
import type {
  CreateChapterInput,
  CreateCourseInput,
  CreateLessonInput,
  UpdateChapterInput,
  UpdateCourseInput,
  UpdateLessonInput,
} from "@/domain/courses"

export const adminKeys = {
  courses: ["admin", "courses"] as const,
  course: (slug: string) => ["admin", "courses", slug] as const,
}

/* ───────────────────────── Courses ───────────────────────── */

export function useCoursesQuery() {
  return useQuery({ queryKey: adminKeys.courses, queryFn: adminApi.listCourses })
}

export function useCourseQuery(slug: string) {
  return useQuery({
    queryKey: adminKeys.course(slug),
    queryFn: () => adminApi.getCourse(slug),
    enabled: !!slug,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCourseInput & { teacherId: string }) =>
      adminApi.createCourse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.courses }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ slug, input }: { slug: string; input: UpdateCourseInput }) =>
      adminApi.updateCourse(slug, input),
    onSuccess: (updated, { slug }) => {
      qc.invalidateQueries({ queryKey: adminKeys.courses })
      qc.invalidateQueries({ queryKey: adminKeys.course(slug) })
      if (updated.slug !== slug) {
        qc.invalidateQueries({ queryKey: adminKeys.course(updated.slug) })
      }
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => adminApi.deleteCourse(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.courses }),
  })
}

/* ───────────────────────── Chapters ───────────────────────── */

export function useCreateChapter(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateChapterInput) => adminApi.createChapter(slug, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}

export function useUpdateChapter(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      chapterId,
      input,
    }: {
      chapterId: string
      input: UpdateChapterInput
    }) => adminApi.updateChapter(slug, chapterId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}

export function useDeleteChapter(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (chapterId: string) => adminApi.deleteChapter(slug, chapterId),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}

/* ───────────────────────── Lessons ───────────────────────── */

export function useCreateLesson(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      chapterId,
      input,
    }: {
      chapterId: string
      input: CreateLessonInput
    }) => adminApi.createLesson(slug, chapterId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}

export function useUpdateLesson(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      chapterId,
      lessonId,
      input,
    }: {
      chapterId: string
      lessonId: string
      input: UpdateLessonInput
    }) => adminApi.updateLesson(slug, chapterId, lessonId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}

export function useDeleteLesson(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      chapterId,
      lessonId,
    }: {
      chapterId: string
      lessonId: string
    }) => adminApi.deleteLesson(slug, chapterId, lessonId),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.course(slug) }),
  })
}
