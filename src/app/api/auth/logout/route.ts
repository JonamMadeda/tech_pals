import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

// Mirror the exact attributes Neon Auth (better-auth) uses for its cookies so
// the browser reliably deletes them regardless of the original Set-Cookie.
const CLEAR_ATTRIBUTES = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  expires: new Date(0),
  maxAge: 0,
};

const SESSION_COOKIES = [
  "__Secure-neon-auth.session_token",
  "__Secure-neon-auth.session_data",
  "__Secure-neon-auth.dont_remember",
  "__Secure-neon-auth.account_data",
];

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-neon-auth.session_token")?.value;

  const response = NextResponse.json({ ok: true });

  // Clear the browser cookie first and always. The network call to Neon Auth
  // must never block this response — if the live `sign-out` endpoint stalls,
  // the Set-Cookie (and the client redirect) would never arrive.
  for (const name of SESSION_COOKIES) {
    response.cookies.set(name, "", CLEAR_ATTRIBUTES);
  }

  if (token) {
    // Best-effort server-side revocation, fire-and-forget with a hard timeout.
    void fetch(`${NEON_AUTH_URL}/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `__Secure-neon-auth.session_token=${token}`,
      },
      signal: AbortSignal.timeout(5000),
    }).catch(() => {
      // Cookie already cleared locally; nothing else to do.
    });
  }

  return response;
}
