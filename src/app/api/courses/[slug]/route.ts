import { NextResponse } from "next/server"

import { deleteCourse, getCourseBySlug, updateCourse } from "@/domain/courses"

/** GET /api/courses/[slug] — returns a course with its full chapter/lesson tree. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}

/**
 * PATCH /api/courses/[slug] — updates a course's slug/title/description.
 * Body: { slug?, title?, description? }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Expected { slug?, title?, description? }" }, { status: 400 })
  }

  try {
    const updated = await updateCourse(course.id, {
      slug: body.slug,
      title: body.title,
      titleEn: body.titleEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
    })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update course" },
      { status: 400 }
    )
  }
}

/** DELETE /api/courses/[slug] — deletes a course and all its chapters/lessons. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  try {
    await deleteCourse(course.id)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete course" },
      { status: 400 }
    )
  }
}
