import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getUserByEmail } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const member = await getUserByEmail(session.user.email);
    if (!member) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Return only necessary fields for client-side role checking
    const { email, last_login_at, ...safeMember } = member;
    return NextResponse.json({ member: safeMember });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}