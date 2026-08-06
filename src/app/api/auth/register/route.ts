import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getUserByEmail, createUser } from "@/lib/db";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if current user is admin in our users table
    const currentUser = await getUserByEmail(session.user.email);
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can add members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name, role, title, bio, tags, github, linkedin, website } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate role - only admin, leader, member are allowed
    const allowedRoles = ["admin", "leader", "member"];
    const memberRole = allowedRoles.includes(role) ? role : "member";

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      );
    }

    // Create user via Neon Auth HTTP API
    const neonRes = await fetch(`${NEON_AUTH_URL}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!neonRes.ok) {
      const errorBody = await neonRes.json().catch(() => null);
      const errorMsg = errorBody?.message || "Failed to create account";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Create member profile in our DB
    const avatar = name
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const member = await createUser({
      email: email.toLowerCase(),
      name,
      avatar,
      role: memberRole,
      title: title ?? "",
      bio: bio ?? "",
      tags: tags ?? [],
      github: github ?? "",
      linkedin: linkedin ?? "",
      website: website ?? "",
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
