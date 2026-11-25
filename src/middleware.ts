import { NextResponse, type NextRequest } from "next/server";
import { isOperatorAuthorized, operatorChallenge, operatorHeaders } from "@/lib/operator-access";

export async function middleware(request: NextRequest) {
  if (!await isOperatorAuthorized(request.headers.get("authorization"))) return operatorChallenge();
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(operatorHeaders)) response.headers.set(key, value);
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*", "/ads/:path*", "/ads-import/:path*",
    "/google-ads-import/:path*", "/google-sheets-script/:path*",
  ],
};
