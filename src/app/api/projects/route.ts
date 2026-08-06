import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { createProject, getProjects, getUserByEmail } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");
  return NextResponse.json({ projects: await getProjects(userId ? Number(userId) : undefined) });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const body = await request.json();
  if (!body.title?.trim()) return NextResponse.json({ error: "Project title is required" }, { status: 400 });
  const project = await createProject(member.id, {
    title: body.title.trim(), summary: body.summary ?? "", description: body.description ?? "", image_url: body.image_url ?? "",
    project_url: body.project_url ?? "", github_url: body.github_url ?? "", tags: Array.isArray(body.tags) ? body.tags : [], featured: body.featured !== false,
  });
  return NextResponse.json({ project }, { status: 201 });
}
