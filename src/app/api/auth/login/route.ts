import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 401 }
      );
    }

    // Forward the request to Neon Auth directly (preserving cookies)
    const neonRes = await fetch(`${NEON_AUTH_URL}/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
      },
      body: JSON.stringify({ email, password }),
      redirect: "manual",
    });

    if (!neonRes.ok) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const neonBody = await neonRes.json();

    // Build our response
    const response = NextResponse.json({
      user: neonBody.user,
    });

    // Forward Neon Auth's Set-Cookie to the client
    const setCookies = neonRes.headers.getSetCookie();
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
