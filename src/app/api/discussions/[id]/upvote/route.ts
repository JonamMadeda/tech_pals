import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getDiscussionPostOwner, getUserByEmail, toggleDiscussionUpvote } from "@/lib/db";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const member = await getUserByEmail(session.user.email);
  if (!member) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const postId = Number(params.id);
  if (!Number.isInteger(postId) || await getDiscussionPostOwner(postId) === null) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(await toggleDiscussionUpvote(postId, member.id));
}
