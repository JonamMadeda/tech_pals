import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ALL_SESSION_COOKIES, COOKIE_CLEAR_ATTRIBUTES, readSessionToken } from "@/lib/auth/cookies";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST() {
  const cookieStore = await cookies();
  const token = readSessionToken((name) => cookieStore.get(name));

  const response = NextResponse.json({ ok: true });

  for (const name of ALL_SESSION_COOKIES) {
    response.cookies.set(name, "", COOKIE_CLEAR_ATTRIBUTES);
  }

  if (token) {
    void fetch(`${NEON_AUTH_URL}/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `__Secure-neon-auth.session_token=${token}`,
      },
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }

  return response;
}
