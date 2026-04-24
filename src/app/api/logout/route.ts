import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/constants";
import type { ApiResponse } from "@/types";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json<ApiResponse<null>>(
    { success: true, data: null },
    { status: 200 },
  );

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
