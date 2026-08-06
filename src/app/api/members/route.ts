import { NextResponse } from "next/server";
import { getAllUsers, getLeaders, getPublicUsers, getUserByEmail } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    const currentUser = session?.user ? await getUserByEmail(session.user.email) : null;
    const scope = new URL(request.url).searchParams.get("scope");
    const role = new URL(request.url).searchParams.get("role");
    const users = scope === "all" && currentUser?.role === "admin"
      ? await getAllUsers()
      : role === "leader"
        ? await getLeaders()
        : await getPublicUsers();
    return NextResponse.json({ members: users });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
