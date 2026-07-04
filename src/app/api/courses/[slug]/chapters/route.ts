import { NextResponse } from "next/server"

import { createChapter, getCourseBySlug } from "@/domain/courses"

/**
 * POST /api/courses/[slug]/chapters — adds a chapter to an existing course.
 * Body: { title, order? }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body.title !== "string") {
    return NextResponse.json({ error: "Expected { title, order? }" }, { status: 400 })
  }

  try {
    const chapter = await createChapter(course.id, { title: body.title, order: body.order })
    return NextResponse.json(chapter, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create chapter" },
      { status: 400 }
    )
  }
}
