import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { deleteDiscussionPost, getDiscussionPostOwner, getUserByEmail, updateDiscussionPost } from "@/lib/db";

async function currentMember() {
  const session = await getCurrentSession();
  if (!session?.user) return null;
  return getUserByEmail(session.user.email);
}

function canModerate(role: string): boolean {
  return role === "admin" || role === "leader";
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const postId = Number(params.id);
  const ownerId = await getDiscussionPostOwner(postId);
  if (!Number.isInteger(postId) || ownerId === null) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (!canModerate(member.role) && ownerId !== member.id) return NextResponse.json({ error: "You cannot edit this post" }, { status: 403 });
  const body = String((await request.json()).body ?? "").trim();
  if (!body || body.length > 2000) return NextResponse.json({ error: "Posts must be between 1 and 2,000 characters." }, { status: 400 });
  return NextResponse.json({ post: await updateDiscussionPost(postId, body) });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const postId = Number(params.id);
  const ownerId = await getDiscussionPostOwner(postId);
  if (!Number.isInteger(postId) || ownerId === null) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (!canModerate(member.role) && ownerId !== member.id) return NextResponse.json({ error: "You cannot delete this post" }, { status: 403 });
  await deleteDiscussionPost(postId);
  return NextResponse.json({ success: true });
}
