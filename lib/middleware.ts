// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = "zoe"; // change this to your desired password

const protectedPaths = ["/", 
                        "/gallery", 
                        "/proposal",
                        "/engagementPhotos", 
                        "/party", 
                        "/partyMembers", 
                        "/proposal", 
                        "/proposalClues", 
                        "/states"]; // add any existing pages

export function middleware(req: NextRequest) {
  
  const url = req.nextUrl.clone();
  console.log("Middleware hit for:", req.nextUrl.pathname);

    // Check if the request is for a protected path
  const isProtected = protectedPaths.some((path) =>
    url.pathname === path || url.pathname.startsWith(path + "/")
  );

  // Protect only /secret pages
  if (isProtected) {
    const authCookie = req.cookies.get("protected-auth")?.value;

    if (authCookie !== PASSWORD) {
      // redirect to login page
      url.pathname = "/login";
      url.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // run middleware on all pages
};

