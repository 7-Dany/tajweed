const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

async function getKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const secret = process.env.ADMIN_JWT_SECRET ?? "fallback-dev-secret-change-me"
  const enc = new TextEncoder().encode(secret) as Uint8Array<ArrayBuffer>
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, usage)
}

function toBytes(str: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(str) as Uint8Array<ArrayBuffer>
}

function toBase64Url(buf: ArrayBuffer | Uint8Array<ArrayBuffer>): string {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return btoa(String.fromCharCode(...u8))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array<ArrayBuffer> {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) str += "="
  const raw = atob(str)
  const buf = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return view as Uint8Array<ArrayBuffer>
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = JSON.stringify({ username, exp: Date.now() + SESSION_DURATION_MS })
  const enc = toBytes(payload)
  const key = await getKey(["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, enc)
  return `${toBase64Url(enc)}.${toBase64Url(sig)}`
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const parts = token.split(".")
  if (parts.length !== 2) return null

  try {
    const key = await getKey(["verify"])
    const data = fromBase64Url(parts[0])
    const sig = fromBase64Url(parts[1])
    const valid = await crypto.subtle.verify("HMAC", key, sig, data)
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(data))
    if (Date.now() > payload.exp) return null

    return payload.username as string
  } catch {
    return null
  }
}
