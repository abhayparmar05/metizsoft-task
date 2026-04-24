import type { Metadata } from "next";
import { Shield, Lock, Globe, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "About" };

const ROUTE_INFO = [
  {
    path: "/login",
    access: "Public",
    description: "Authentication page. Redirects to /dashboard if already signed in.",
    icon: Globe,
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    path: "/about",
    access: "Public",
    description: "This page. Accessible without authentication.",
    icon: Globe,
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    path: "/dashboard",
    access: "Protected",
    description: "Main dashboard with user data table. Requires a valid session cookie.",
    icon: Lock,
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    path: "/profile",
    access: "Protected",
    description: "User profile page. Requires a valid session cookie.",
    icon: Lock,
    badgeClass: "bg-blue-100 text-blue-700",
  },
] as const;

const TECH_STACK = [
  "Next.js 14 (App Router)",
  "TypeScript (strict)",
  "Tailwind CSS",
  "shadcn/ui (Radix UI)",
  "TanStack Table v8",
  "React Hook Form",
  "Zod validation",
  "Axios",
  "Jose (JWT)",
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-muted/40 px-4 py-16">
      <div className="mx-auto max-w-3xl animate-slide-up space-y-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground shadow-lg">
            M
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">METIZSOFT</h1>

          <Link href="/login">
            <Button className="mt-2">Go to Sign In →</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" /> Route Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ROUTE_INFO.map(({ path, access, description, icon: Icon, badgeClass }) => (
              <div
                key={path}
                className="flex items-start gap-4 rounded-lg border bg-background p-4"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium">
                      {path}
                    </code>
                    <Badge variant="outline" className={badgeClass}>
                      {access}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5" /> Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TECH_STACK.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {tech}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
