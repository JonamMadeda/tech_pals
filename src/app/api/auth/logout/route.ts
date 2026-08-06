import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__Secure-neon-auth.session_token")?.value;

    if (token) {
      await fetch(`${NEON_AUTH_URL}/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
          "Cookie": `__Secure-neon-auth.session_token=${token}`,
        },
      });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("__Secure-neon-auth.session_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
