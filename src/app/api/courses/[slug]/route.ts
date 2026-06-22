import { NextResponse } from "next/server"

import { getCourseBySlug } from "@/lib/courses"

/** GET /api/courses/[slug] — returns a course with its full chapter/lesson tree. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}
