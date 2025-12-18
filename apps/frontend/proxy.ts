import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("streamIt_token")?.value;
  const { pathname } = req.nextUrl;
  console.log("token ", token);

  const publicPaths = ["/", "/sign-in", "/sign-up", "/verify-otp"];

  const isPublic = publicPaths.includes(pathname);
  const isProtected = pathname.startsWith("/streams");
  // If no token and trying to access protected route
  if (!token && isProtected) {
    console.log("no token, but /stream route");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (token) {
    try {
      console.log("Token found");
      await jose.jwtVerify(token, SECRET);
      if (isPublic) {
        console.log("but public route");
        return NextResponse.redirect(new URL("/streams", req.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.error("JWT Error:", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify-otp",
    "/streams/:path*",
    "/streams",
  ],
};
