import { NextResponse } from "next/server"
import { createSessionToken } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  let username: string | null = null
  let password: string | null = null

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null)
    username = body?.username ?? null
    password = body?.password ?? null
  } else {
    const form = await request.formData().catch(() => null)
    username = (form?.get("username") as string | null) ?? null
    password = (form?.get("password") as string | null) ?? null
  }

  if (!username || !password) {
    return NextResponse.json({ error: "اسم المستخدم وكلمة المرور مطلوبان" }, { status: 400 })
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 })
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 })
  }

  const token = await createSessionToken(username)

  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return response
}
