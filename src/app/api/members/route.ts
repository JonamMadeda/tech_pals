import { NextResponse } from "next/server";
import { getAllUsers, getLeaders, getPublicUsers, getUserByEmail } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/server";

function stripEmail<T extends { email: string }>(user: T): Omit<T, "email"> {
  const { email, ...rest } = user;
  return rest;
}

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    const currentUser = session?.user ? await getUserByEmail(session.user.email) : null;
    const scope = new URL(request.url).searchParams.get("scope");
    const role = new URL(request.url).searchParams.get("role");
    const isAdmin = currentUser?.role === "admin";

    let users;
    if (scope === "all" && isAdmin) {
      users = await getAllUsers();
    } else if (role === "leader") {
      users = await getLeaders();
    } else {
      users = await getPublicUsers();
    }

    // Strip emails from non-admin responses
    if (!isAdmin) {
      users = users.map(stripEmail);
    }

    return NextResponse.json({ members: users });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
