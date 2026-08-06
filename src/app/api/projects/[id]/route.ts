import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { deleteProject, getUserByEmail, updateProject } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const body = await request.json();
  const project = await updateProject(Number(params.id), member.id, body);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  await deleteProject(Number(params.id), member.role === "admin" ? undefined : member.id);
  return NextResponse.json({ success: true });
}
