"use client";

import { Suspense } from "react";
import { useUsers } from "@/hooks/useUsers";
import { getUserColumns } from "./columns";
import { DataTable } from "./DataTable";
import { TableSearch } from "./TableSearch";
import { TablePagination } from "./TablePagination";
import { TableSkeleton } from "./TableSkeleton";
import type { User, SortOrder } from "@/types";
import { Users } from "lucide-react";

// ─── Inner component uses useSearchParams via useUsers ────────────────────────
function UsersTableInner() {
  const {
    data,
    isLoading,
    error,
    queryParams,
    setPage,
    setLimit,
    setSearch,
    setSorting,
  } = useUsers();

  const columns = getUserColumns({
    currentSortBy: queryParams.sortBy,
    currentOrder: queryParams.order,
    onSort: (sortBy: keyof User, order: SortOrder) => setSorting(sortBy, order),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <h2 className="font-display text-lg font-semibold">All Users</h2>
            {data && !isLoading && (
              <p className="text-xs text-muted-foreground">
                {data.total} {data.total === 1 ? "user" : "users"} total
              </p>
            )}
          </div>
        </div>

        <TableSearch
          value={queryParams.search}
          onChange={setSearch}
          className="w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        error={error}
        emptyMessage={
          queryParams.search
            ? `No users match "${queryParams.search}".`
            : "No users found."
        }
      />

      {/* Pagination */}
      {data && (
        <TablePagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={queryParams.limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
}

// ─── Exported wrapper — Suspense required for useSearchParams in App Router ───
export function UsersTable() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} columns={3} />}>
      <UsersTableInner />
    </Suspense>
  );
}
