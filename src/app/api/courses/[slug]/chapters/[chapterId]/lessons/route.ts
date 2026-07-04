import { NextResponse } from "next/server"

import { createLesson, getCourseBySlug } from "@/domain/courses"

/**
 * POST /api/courses/[slug]/chapters/[chapterId]/lessons — adds a lesson to
 * an existing chapter.
 * Body: { title, contentKey, slug?, description?, order?, source? }
 *
 * `source` is an optional LessonSourceInput (domain/course-repository.ts)
 * — either an inline `{ type: "markdown"|"markdown-i18n", ... }` payload,
 * or `{ type: "markdown-file", file, fileEn? }` pointing at .md files
 * under src/content/lessons.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string; chapterId: string }> }
) {
  const { slug, chapterId } = await params
  const course = getCourseBySlug(slug)
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }
  if (!course.chapters.some((ch) => ch.id === chapterId)) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body.title !== "string" || typeof body.contentKey !== "string") {
    return NextResponse.json(
      { error: "Expected { title, contentKey, slug?, description?, order?, source? }" },
      { status: 400 }
    )
  }

  try {
    const lesson = await createLesson(chapterId, {
      slug: body.slug,
      title: body.title,
      description: body.description,
      contentKey: body.contentKey,
      order: body.order,
      source: body.source,
    })
    return NextResponse.json(lesson, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create lesson" },
      { status: 400 }
    )
  }
}
