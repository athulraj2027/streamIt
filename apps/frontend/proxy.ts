import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";
const SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("streamIt_token")?.value;
  console.log("token received for middleware :  ", token);

  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/sign-in", "/sign-up", "/verify-otp"];

  const isPublic = publicPaths.some((path) => pathname === path);

  if (!token && !isPublic) {
    console.log("No token found, redirecting to signin page");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token) {
    try {
      const decoded = await jose.jwtVerify(token, SECRET);
      console.log("decoded : ", decoded);

      if (isPublic) {
        return NextResponse.redirect(new URL(`/streams`, request.url));
      }
    } catch (error) {
      console.error("JWT Error:", error);
      const loginUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/verify-otp", "/sign-up", "/streams"],
};
