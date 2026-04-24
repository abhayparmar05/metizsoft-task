import type { AuthUser } from "@/types";

interface MockCredential {
  password: string;
  user: AuthUser;
}

const MOCK_CREDENTIALS: Record<string, MockCredential> = {
  "admin@example.com": {
    password: "admin123",
    user: {
      id: "usr_01",
      name: "Alice Admin",
      email: "admin@example.com",
      role: "admin",
    },
  },
};

export function validateMockCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const entry = MOCK_CREDENTIALS[email.toLowerCase()];
  if (!entry || entry.password !== password) return null;
  return entry.user;
}
