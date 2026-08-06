import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { deleteUser, getUserByEmail, getUserById, updateUser } from "@/lib/db";

async function getAdmin() {
  const session = await getCurrentSession();
  if (!session?.user) return null;
  const member = await getUserByEmail(session.user.email);
  return member?.role === "admin" ? member : null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  const body = await request.json();
  if (body.role === "admin") return NextResponse.json({ error: "Administrator roles cannot be assigned here" }, { status: 400 });
  if (body.username !== undefined && !/^[a-zA-Z0-9_]{3,30}$/.test(body.username)) {
    return NextResponse.json({ error: "Username must be 3–30 letters, numbers, or underscores" }, { status: 400 });
  }
  const member = await updateUser(Number(params.id), {
    username: body.username?.toLowerCase(), name: body.name, avatar: body.avatar, role: body.role, title: body.title, bio: body.bio,
    tags: Array.isArray(body.tags) ? body.tags : undefined, github: body.github,
    linkedin: body.linkedin, website: body.website, lang: body.lang,
  });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  if (admin.id === Number(params.id)) return NextResponse.json({ error: "You cannot remove your own administrator account" }, { status: 400 });
  const target = await getUserById(Number(params.id));
  if (!target || target.role === "admin") return NextResponse.json({ error: "Administrator accounts cannot be removed here" }, { status: 400 });
  await deleteUser(Number(params.id));
  return NextResponse.json({ success: true });
}
