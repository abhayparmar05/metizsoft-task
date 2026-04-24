import { NextRequest } from "next/server";
import { verifySessionToken } from "./session";
import { AUTH_COOKIE_NAME } from "@/constants";
import type { SessionPayload } from "@/types";

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
