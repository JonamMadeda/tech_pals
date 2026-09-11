import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ALL_SESSION_COOKIES, COOKIE_CLEAR_ATTRIBUTES } from "@/lib/auth/cookies";
import { validatePassword } from "@/lib/validation";
import { validateCsrfToken } from "@/lib/csrf";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(request: Request) {
  try {
    const csrfValid = await validateCsrfToken(request);
    if (!csrfValid) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const limited = rateLimit(`change-password:${clientIp(request)}`, 5);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join("; ") },
        { status: 400 }
      );
    }

    // Call Neon Auth change-password endpoint
    const appUrl =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";
    const neonRes = await fetch(`${NEON_AUTH_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": appUrl,
        "Cookie": `__Secure-neon-auth.session_token=${session.session.token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!neonRes.ok) {
      const errorBody = await neonRes.json().catch(() => null);
      const errorMsg = errorBody?.message || "Failed to change password";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Invalidate session cookies after successful password change
    const response = NextResponse.json({ success: true });
    for (const cookieName of ALL_SESSION_COOKIES) {
      response.cookies.set(cookieName, "", COOKIE_CLEAR_ATTRIBUTES);
    }
    return response;
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
