import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// route any request to "/" path to "{protocol}://{host}/campaign"
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/campaign", request.url));
}

export const config = {
  matcher: "/",
};
