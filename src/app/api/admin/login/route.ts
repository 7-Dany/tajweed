import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Expected { username, password }" }, { status: 400 })
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 })
  }

  if (body.username !== expectedUsername || body.password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = await createSessionToken(body.username)
  const cookieStore = await cookies()

  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return NextResponse.json({ success: true })
}
