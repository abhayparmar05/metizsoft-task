import Link from "next/link";
import { getSessionFromCookies } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export async function NotFoundState() {
  const session = await getSessionFromCookies();
  const primaryHref = session ? "/dashboard" : "/login";
  const primaryLabel = session ? "Go to dashboard" : "Sign in";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="space-y-8 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-3">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
              404
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              This page wandered off.
            </h1>
            <p className="text-sm text-muted-foreground">
              The route you requested could not be found. Use the links below to head
              back to a known place.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">
                <Home className="mr-2 h-4 w-4" />
                About
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
