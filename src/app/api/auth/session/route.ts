import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
