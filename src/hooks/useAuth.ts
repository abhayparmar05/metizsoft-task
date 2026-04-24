"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, logoutUser } from "@/lib/api/authService";
import type { LoginCredentials } from "@/types";

interface UseAuthReturn {
  isSubmitting: boolean;
  authError: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function login(credentials: LoginCredentials): Promise<void> {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginUser(credentials);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout(): Promise<void> {
    setIsSubmitting(true);
    try {
      await logoutUser();
    } catch {
      // best-effort logout — always redirect
    } finally {
      setIsSubmitting(false);
      router.push("/login");
      router.refresh();
    }
  }

  return { isSubmitting, authError, login, logout };
}
