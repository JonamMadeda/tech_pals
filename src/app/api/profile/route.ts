import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { deleteUser, findUserByUsername, getUserByEmail, updateUser } from "@/lib/db";
import { isValidUsername } from "@/lib/validation";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const body = await request.json();

  let username: string | undefined;
  if (body.username !== undefined) {
    username = String(body.username).trim().toLowerCase();
    if (username && !isValidUsername(username)) {
      return NextResponse.json({ error: "Username must be 3–30 letters, numbers, or underscores" }, { status: 400 });
    }
    username = username || undefined;
    if (username) {
      const taken = await findUserByUsername(username, member.id);
      if (taken) return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
    }
  }

  const commits = body.commits !== undefined ? Math.max(0, Math.floor(Number(body.commits)) || 0) : undefined;
  const prs = body.prs !== undefined ? Math.max(0, Math.floor(Number(body.prs)) || 0) : undefined;

  const updated = await updateUser(member.id, {
    username,
    name: body.name, avatar: body.avatar, title: body.title, bio: body.bio,
    tags: Array.isArray(body.tags) ? body.tags : undefined,
    github: body.github, linkedin: body.linkedin, website: body.website, lang: body.lang,
    commits, prs,
  });
  return NextResponse.json({ member: updated });
}

export async function DELETE() {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  await deleteUser(member.id);
  return NextResponse.json({ success: true });
}
