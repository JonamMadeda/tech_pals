import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(request: Request) {
  try {
    const csrfValid = await validateCsrfToken(request);
    if (!csrfValid) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const limited = rateLimit(`forgot-password:${clientIp(request)}:${String(email).toLowerCase()}`, 5);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    // Check if user exists in our DB
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Call Neon Auth request-password-reset endpoint
    const appUrl =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";
    const neonRes = await fetch(`${NEON_AUTH_URL}/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": appUrl,
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        redirectTo: `${appUrl}/reset-password`,
      }),
    });

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
