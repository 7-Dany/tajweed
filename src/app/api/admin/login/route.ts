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
    return new NextResponse(
      `<html dir="rtl"><body style="font-family:sans-serif;padding:2rem">
        <p>اسم المستخدم وكلمة المرور مطلوبان</p>
        <a href="/admin/login">العودة</a>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    )
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 })
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return new NextResponse(
      `<html dir="rtl"><body style="font-family:sans-serif;padding:2rem">
        <p>بيانات الدخول غير صحيحة</p>
        <a href="/admin/login">العودة</a>
      </body></html>`,
      { status: 401, headers: { "Content-Type": "text/html" } }
    )
  }

  const token = await createSessionToken(username)

  const response = NextResponse.redirect(new URL("/admin/courses", request.url), 303)
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return response
}
