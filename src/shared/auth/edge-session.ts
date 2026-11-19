export interface EdgeSessionPayload {
  userId: string;
  email: string;
  role: "BUYER" | "VENDOR" | "ADMIN";
  exp: number;
}

export const SESSION_COOKIE_NAME = "vendora_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "vendora-production-security-secret-key-2026-min-32-chars";

/**
 * High-performance, Web-Standard session verification for Next.js Edge Middleware
 * Zero Node.js runtime dependencies; works natively across all Edge runtimes (Vercel Edge, Netlify Edge, Cloudflare).
 */
export async function verifyEdgeSessionToken(
  token: string
): Promise<EdgeSessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));

    let binary = "";
    const bytes = new Uint8Array(expectedSigBuf);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const expectedSig = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (expectedSig !== signature) return null;

    const rawPayload = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload: EdgeSessionPayload = JSON.parse(rawPayload);

    if (!payload.userId || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
