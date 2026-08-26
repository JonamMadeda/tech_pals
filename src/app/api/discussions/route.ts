import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { createDiscussionPost, getDiscussionPosts, getUserByEmail } from "@/lib/db";

async function currentMember() {
  const session = await getCurrentSession();
  if (!session?.user) return null;
  return getUserByEmail(session.user.email);
}

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") === "top" ? "top" : "new";
  const pageRaw = Number(url.searchParams.get("page") ?? "0");
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? Math.min(pageRaw, 10000) : 0;
  const rows = await getDiscussionPosts(member.id, { limit: PAGE_SIZE + 1, offset: page * PAGE_SIZE, sort });
  const hasMore = rows.length > PAGE_SIZE;
  return NextResponse.json({
    posts: hasMore ? rows.slice(0, PAGE_SIZE) : rows,
    hasMore,
    viewer: { id: member.id, role: member.role }
  });
}

export async function POST(request: Request) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = String((await request.json()).body ?? "").trim();
  if (!body) return NextResponse.json({ error: "Write something to share." }, { status: 400 });
  if (body.length > 2000) return NextResponse.json({ error: "Posts can be up to 2,000 characters." }, { status: 400 });
  return NextResponse.json({ post: await createDiscussionPost(member.id, body) }, { status: 201 });
}
