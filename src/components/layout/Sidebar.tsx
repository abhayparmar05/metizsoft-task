"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Info, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: User },
  { label: "About", href: "/about", icon: Info },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { logout, isSubmitting } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-2 px-6 transition-opacity hover:opacity-80"
        aria-label="Go to dashboard"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
          M
        </div>
        <span className="font-display text-lg font-bold tracking-tight">METIZSOFT</span>
      </Link>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
          disabled={isSubmitting}
        >
          <LogOut className="h-4 w-4" />
          {isSubmitting ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
