import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload, AuthUser } from "@/types";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_EXPIRY_HOURS } from "@/constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "super-secret-dev-key-change-in-production",
);

export async function createSessionToken(user: AuthUser): Promise<string> {
  const expiresAt = Date.now() + AUTH_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  };

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${AUTH_TOKEN_EXPIRY_HOURS}h`)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
