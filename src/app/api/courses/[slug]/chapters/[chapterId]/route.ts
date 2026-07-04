import { NextResponse } from "next/server"

import { deleteChapter, getChapterById, getCourseBySlug, updateChapter } from "@/domain/courses"

/** GET /api/courses/[slug]/chapters/[chapterId] — a single chapter with its lessons. */
export async function GET(
  _request: Request,
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

  return NextResponse.json(getChapterById(chapterId))
}

/**
 * PATCH /api/courses/[slug]/chapters/[chapterId] — updates a chapter's
 * title/order.
 * Body: { title?, order? }
 */
export async function PATCH(
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
  if (!body) {
    return NextResponse.json({ error: "Expected { title?, order? }" }, { status: 400 })
  }

  try {
    const chapter = await updateChapter(chapterId, { title: body.title, order: body.order })
    return NextResponse.json(chapter)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update chapter" },
      { status: 400 }
    )
  }
}

/** DELETE /api/courses/[slug]/chapters/[chapterId] — deletes a chapter and its lessons. */
export async function DELETE(
  _request: Request,
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

  try {
    await deleteChapter(chapterId)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete chapter" },
      { status: 400 }
    )
  }
}
