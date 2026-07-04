import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createHmac } from "node:crypto"

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

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

async function verifySessionToken(token: string): Promise<string | null> {
  const parts = token.split(".")
  if (parts.length !== 2) return null

  try {
    const payloadStr = Buffer.from(parts[0], "base64url").toString("utf-8")
    const expectedSig = parts[1]

    const secret = process.env.ADMIN_JWT_SECRET ?? "fallback-dev-secret-change-me"
    const sig = createHmac("sha256", secret)
      .update(payloadStr)
      .digest("base64url")

    if (sig !== expectedSig) return null

    const payload = JSON.parse(payloadStr)
    if (Date.now() > payload.exp) return null

    return payload.username as string
  } catch {
    return null
  }
}
