"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "@/lib/admin-api"
import type {
  ChapterWithLessons,
  CourseWithRelations,
} from "@/domain/courses"

const adminKeys = {
  courses: ["admin", "courses"] as const,
  course: (slug: string) => ["admin", "courses", slug] as const,
}

/* ─────── Factory: queries ─────── */

function useAdminQuery<T>(key: readonly [...string[]], fn: () => Promise<T>, enabled = true) {
  return useQuery({ queryKey: key, queryFn: fn, enabled })
}

/* ─────── Factory: mutations ─────── */

function useAdminMutation<TData, TVariables>(
  mutationFn: (v: TVariables) => Promise<TData>,
  invalidate:
    | readonly (readonly string[])[]
    | ((data: TData, variables: TVariables) => readonly (readonly string[])[]),
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (data, vars) => {
      const keys = typeof invalidate === "function" ? invalidate(data, vars) : invalidate
      for (const key of keys) qc.invalidateQueries({ queryKey: key as readonly string[] })
    },
  })
}

/* ─────── Courses ─────── */

export function useCoursesQuery() {
  return useAdminQuery(adminKeys.courses, adminApi.listCourses)
}

export function useCourseQuery(slug: string) {
  return useAdminQuery(adminKeys.course(slug), () => adminApi.getCourse(slug), !!slug)
}

export function useCreateCourse() {
  return useAdminMutation(
    (input: Parameters<typeof adminApi.createCourse>[0]) => adminApi.createCourse(input),
    [adminKeys.courses],
  )
}

export function useUpdateCourse() {
  return useAdminMutation(
    ({ slug, input }: { slug: string; input: Parameters<typeof adminApi.updateCourse>[1] }) =>
      adminApi.updateCourse(slug, input),
    (updated: CourseWithRelations, { slug }) =>
      updated.slug !== slug
        ? [adminKeys.courses, adminKeys.course(slug), adminKeys.course(updated.slug)]
        : [adminKeys.courses, adminKeys.course(slug)],
  )
}

export function useDeleteCourse() {
  return useAdminMutation(
    (slug: string) => adminApi.deleteCourse(slug),
    [adminKeys.courses],
  )
}

/* ─────── Chapters ─────── */

export function useCreateChapter(slug: string) {
  return useAdminMutation(
    (input: Parameters<typeof adminApi.createChapter>[1]) => adminApi.createChapter(slug, input),
    [adminKeys.course(slug)],
  )
}

export function useUpdateChapter(slug: string) {
  return useAdminMutation(
    ({ chapterId, input }: { chapterId: string; input: Parameters<typeof adminApi.updateChapter>[2] }) =>
      adminApi.updateChapter(slug, chapterId, input),
    [adminKeys.course(slug)],
  )
}

export function useDeleteChapter(slug: string) {
  return useAdminMutation(
    (chapterId: string) => adminApi.deleteChapter(slug, chapterId),
    [adminKeys.course(slug)],
  )
}

/* ─────── Lessons ─────── */

export function useCreateLesson(slug: string) {
  return useAdminMutation(
    ({ chapterId, input }: { chapterId: string; input: Parameters<typeof adminApi.createLesson>[2] }) =>
      adminApi.createLesson(slug, chapterId, input),
    [adminKeys.course(slug)],
  )
}

export function useUpdateLesson(slug: string) {
  return useAdminMutation(
    ({ chapterId, lessonId, input }: { chapterId: string; lessonId: string; input: Parameters<typeof adminApi.updateLesson>[3] }) =>
      adminApi.updateLesson(slug, chapterId, lessonId, input),
    [adminKeys.course(slug)],
  )
}

export function useDeleteLesson(slug: string) {
  return useAdminMutation(
    ({ chapterId, lessonId }: { chapterId: string; lessonId: string }) =>
      adminApi.deleteLesson(slug, chapterId, lessonId),
    [adminKeys.course(slug)],
  )
}
