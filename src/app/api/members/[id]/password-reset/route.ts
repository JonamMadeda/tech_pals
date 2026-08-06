import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getUserByEmail, getUserById } from "@/lib/db";

const NEON_AUTH_URL = process.env.NEON_AUTH_BASE_URL!;

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  const admin = session?.user ? await getUserByEmail(session.user.email) : null;
  if (admin?.role !== "admin") return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  const member = await getUserById(Number(params.id));
  if (!member || member.role === "admin") return NextResponse.json({ error: "Member not found" }, { status: 404 });
  const response = await fetch(`${NEON_AUTH_URL}/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
    body: JSON.stringify({ email: member.email, redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password` }),
  });
  if (!response.ok) return NextResponse.json({ error: "Could not send reset email" }, { status: 400 });
  return NextResponse.json({ success: true });
}
