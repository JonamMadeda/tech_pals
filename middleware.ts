import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("__Secure-neon-auth.session_token")?.value;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isMemberArea = request.nextUrl.pathname.startsWith("/member");

  if ((isDashboard || isMemberArea) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/member/:path*"],
};
