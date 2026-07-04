import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionToken } from "@/lib/admin-auth"

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/login/", "/api/admin/login"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get("admin_session")?.value
  if (!token) {
    return redirectToLogin(request)
  }

  const username = await verifySessionToken(token)
  if (!username) {
    return redirectToLogin(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}
