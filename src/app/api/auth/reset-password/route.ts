import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/validation";
import { validateCsrfToken } from "@/lib/csrf";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(request: Request) {
  try {
    const csrfValid = await validateCsrfToken(request);
    if (!csrfValid) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const limited = rateLimit(`reset-password:${clientIp(request)}`, 5);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
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

    // Call Neon Auth reset-password endpoint
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const neonRes = await fetch(`${NEON_AUTH_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": appUrl,
      },
      body: JSON.stringify({
        newPassword,
        token,
      }),
    });

    if (!neonRes.ok) {
      const errorBody = await neonRes.json().catch(() => null);
      const errorMsg = errorBody?.message || "Failed to reset password";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
