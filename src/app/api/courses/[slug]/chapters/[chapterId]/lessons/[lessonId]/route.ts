import { NextResponse } from "next/server"

import { deleteLesson, getCourseBySlug, getLessonById, updateLesson } from "@/domain/courses"

function findLessonInCourse(
  course: NonNullable<ReturnType<typeof getCourseBySlug>>,
  chapterId: string,
  lessonId: string
) {
  const chapter = course.chapters.find((ch) => ch.id === chapterId)
  if (!chapter) return { chapter: null, lesson: null }
  const lesson = chapter.lessons.find((l) => l.id === lessonId)
  return { chapter, lesson: lesson ?? null }
}

/** GET /api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId] */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; chapterId: string; lessonId: string }> }
) {
  const { slug, chapterId, lessonId } = await params
  const course = getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

  const { chapter, lesson } = findLessonInCourse(course, chapterId, lessonId)
  if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  return NextResponse.json(getLessonById(lessonId))
}

/**
 * PATCH /api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId] —
 * updates a lesson's slug/title/description/contentKey/order/source.
 * Body: { slug?, title?, description?, contentKey?, order?, source? }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; chapterId: string; lessonId: string }> }
) {
  const { slug, chapterId, lessonId } = await params
  const course = getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

  const { chapter, lesson } = findLessonInCourse(course, chapterId, lessonId)
  if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json(
      { error: "Expected { slug?, title?, description?, contentKey?, order?, source? }" },
      { status: 400 }
    )
  }

  try {
    const updated = await updateLesson(lessonId, {
      slug: body.slug,
      title: body.title,
      description: body.description,
      contentKey: body.contentKey,
      order: body.order,
      source: body.source,
      chapterId: body.chapterId,
    })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update lesson" },
      { status: 400 }
    )
  }
}

/** DELETE /api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string; chapterId: string; lessonId: string }> }
) {
  const { slug, chapterId, lessonId } = await params
  const course = getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

  const { chapter, lesson } = findLessonInCourse(course, chapterId, lessonId)
  if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  try {
    await deleteLesson(lessonId)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete lesson" },
      { status: 400 }
    )
  }
}
