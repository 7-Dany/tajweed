import { createHmac, randomBytes } from "node:crypto"

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

function getSecret(): string {
  return process.env.ADMIN_JWT_SECRET ?? "fallback-dev-secret-change-me"
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = JSON.stringify({ username, exp: Date.now() + SESSION_DURATION_MS })
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url")
  const enc = Buffer.from(payload, "utf-8").toString("base64url")
  return `${enc}.${sig}`
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const parts = token.split(".")
  if (parts.length !== 2) return null

  try {
    const payloadStr = Buffer.from(parts[0], "base64url").toString("utf-8")
    const expectedSig = parts[1]
    const sig = createHmac("sha256", getSecret()).update(payloadStr).digest("base64url")
    if (sig !== expectedSig) return null

    const payload = JSON.parse(payloadStr)
    if (Date.now() > payload.exp) return null

    return payload.username as string
  } catch {
    return null
  }
}
