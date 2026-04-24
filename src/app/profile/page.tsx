import type { Metadata } from "next";
import Image from "next/image";
import { getSessionFromCookies } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { USER_ROLE_COLORS } from "@/constants";
import { cn } from "@/lib/utils/cn";
import { Mail, Shield, User } from "lucide-react";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSessionFromCookies();
  const avatarName = session?.name ?? "User";
  const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    avatarName,
  )}&background=0F172A&color=fff&size=160&rounded=true&bold=true&format=png`;

  return (
    <DashboardShell title="Profile">
      <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
        {/* Avatar + name */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-2xl font-bold text-primary-foreground shadow-md">
              <Image
                src={avatarSrc}
                alt={`${avatarName} avatar`}
                width={80}
                height={80}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold">{session?.name}</h2>
              <p className="text-sm text-muted-foreground">{session?.email}</p>
              <Badge
                variant="outline"
                className={cn("mt-2 capitalize", USER_ROLE_COLORS[session?.role ?? "admin"])}
              >
                {session?.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Full name</p>
                <p className="text-sm font-medium">{session?.name}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email address</p>
                <p className="text-sm font-medium">{session?.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{session?.role}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-mono text-sm text-muted-foreground">{session?.userId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
