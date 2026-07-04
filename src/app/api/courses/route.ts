import { NextResponse } from "next/server"

import { createCourse, getCourses } from "@/domain/courses"

/** GET /api/courses — list all courses (catalog summary shape). */
export async function GET() {
  return NextResponse.json(await getCourses())
}

/**
 * POST /api/courses — a teacher creates a new course.
 * Body: { teacherId, slug?, title, description? }
 *
 * No auth layer yet (see refactor-issues/06-teacher-entity.md) — teacherId
 * is passed explicitly in the body until one exists.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body.teacherId !== "string" || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "Expected { teacherId, title, slug?, description? }" },
      { status: 400 }
    )
  }

  try {
    const course = await createCourse(body.teacherId, {
      slug: body.slug,
      title: body.title,
      titleEn: body.titleEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
    })
    return NextResponse.json(course, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create course" },
      { status: 400 }
    )
  }
}
