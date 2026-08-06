import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getUserByEmail, updateUser } from "@/lib/db";

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
  const updated = await updateUser(member.id, {
    name: body.name, avatar: body.avatar, title: body.title, bio: body.bio,
    tags: Array.isArray(body.tags) ? body.tags : undefined,
    github: body.github, linkedin: body.linkedin, website: body.website, lang: body.lang,
  });
  return NextResponse.json({ member: updated });
}
