import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getCommunityMeeting, getUserByEmail, updateCommunityMeeting } from "@/lib/db";
import { isValidUrl } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function currentMember() {
  const session = await getCurrentSession();
  if (!session?.user) return null;
  return getUserByEmail(session.user.email);
}

export async function GET() {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json({ meeting: await getCommunityMeeting() });
}

export async function PATCH(request: Request) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (member.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json();
  const meetingUrl = String(body.meeting_url ?? "").trim();
  if (!isValidUrl(meetingUrl)) return NextResponse.json({ error: "Enter a valid http(s) meeting link" }, { status: 400 });
  return NextResponse.json({ meeting: await updateCommunityMeeting(meetingUrl) });
}
