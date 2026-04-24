import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSessionFromCookies } from "@/lib/auth/session";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage() {
  const session = await getSessionFromCookies();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md animate-slide-up space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground shadow-lg">
            M
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">METIZSOFT</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
