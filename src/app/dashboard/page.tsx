import type { Metadata } from "next";
import { getSessionFromCookies } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { UsersTable } from "@/components/data-table/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { MOCK_USERS } from "@/lib/api/mockData";

export const metadata: Metadata = { title: "Dashboard" };

function computeStats() {
  const total = MOCK_USERS.length;
  const active = MOCK_USERS.filter((u) => u.status === "active").length;
  const inactive = MOCK_USERS.filter((u) => u.status === "inactive").length;
  const pending = MOCK_USERS.filter((u) => u.status === "pending").length;
  return { total, active, inactive, pending };
}

const STAT_CARDS = [
  {
    label: "Total Users",
    key: "total" as const,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active",
    key: "active" as const,
    icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Inactive",
    key: "inactive" as const,
    icon: UserX,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    label: "Pending",
    key: "pending" as const,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
] as const;

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  const stats = computeStats();

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome banner */}
        <div>
          <h2 className="font-display text-2xl font-bold">
            Good day, {session?.name?.split(" ")[0] ?? "there"} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your user base.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CARDS.map(({ label, key, icon: Icon, color, bg }) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-bold">{stats[key]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users data table */}
        <Card>
          <CardContent className="pt-6">
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
