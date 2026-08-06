import { NextResponse } from "next/server";
import { getProjects, getUserById, getUserByIdentifier } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { identifier: string } }) {
  try {
    let member = await getUserByIdentifier(params.identifier);
    if (!member && /^\d+$/.test(params.identifier)) {
      member = await getUserById(Number(params.identifier));
    }
    if (!member || member.role === "admin") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    const projects = await getProjects(member.id);
    const { email: _email, last_login_at: _lastLogin, ...publicMember } = member;
    return NextResponse.json({ member: publicMember, projects });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
