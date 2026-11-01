import { NextResponse, type NextRequest } from "next/server";

import { isSignedInFromRequest } from "@/lib/amplify-server";

const authPages = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const signedIn = await isSignedInFromRequest(request, response);
  const onAuthPage = authPages.includes(request.nextUrl.pathname);

  if (onAuthPage && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!onAuthPage && !signedIn) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
