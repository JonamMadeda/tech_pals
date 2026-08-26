import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionToken } from "@/lib/auth/cookies";

export function middleware(request: NextRequest) {
  const sessionToken = readSessionToken((name) => request.cookies.get(name));
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isMemberArea = request.nextUrl.pathname.startsWith("/member");
  const isDiscussions = request.nextUrl.pathname.startsWith("/discussions");

  if ((isDashboard || isMemberArea || isDiscussions) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/member/:path*", "/discussions/:path*"],
};
