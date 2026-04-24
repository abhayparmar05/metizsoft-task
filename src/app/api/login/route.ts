import { NextRequest, NextResponse } from "next/server";
import { validateMockCredentials } from "@/lib/auth/mockUsers";
import { createSessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_EXPIRY_HOURS } from "@/constants";
import type { ApiResponse, LoginResponseData } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = validateMockCredentials(email, password);

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user);

    const response = NextResponse.json<ApiResponse<LoginResponseData>>(
      { success: true, data: { user, token } },
      { status: 200 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_TOKEN_EXPIRY_HOURS * 3600,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
