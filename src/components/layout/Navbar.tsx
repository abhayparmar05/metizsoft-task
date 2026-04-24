import Link from "next/link";
import { getSessionFromCookies } from "@/lib/auth/session";

interface NavbarProps {
  title: string;
}

export async function Navbar({ title }: NavbarProps) {
  const session = await getSessionFromCookies();

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Open profile page"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-medium leading-none">{session?.name ?? "Guest"}</span>
            <span className="text-xs capitalize text-muted-foreground">{session?.role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
