"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatters";
import type { User, SortOrder } from "@/types";

interface SortableHeaderProps {
  label: string;
  columnKey: keyof User;
  currentSortBy: keyof User;
  currentOrder: SortOrder;
  onSort: (key: keyof User, order: SortOrder) => void;
}

function SortableHeader({
  label,
  columnKey,
  currentSortBy,
  currentOrder,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSortBy === columnKey;
  const nextOrder: SortOrder =
    isActive && currentOrder === "asc" ? "desc" : "asc";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1 font-medium"
      onClick={() => onSort(columnKey, nextOrder)}
    >
      {label}
      {isActive ? (
        currentOrder === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </Button>
  );
}

interface GetColumnsOptions {
  currentSortBy: keyof User;
  currentOrder: SortOrder;
  onSort: (key: keyof User, order: SortOrder) => void;
}

export function getUserColumns({
  currentSortBy,
  currentOrder,
  onSort,
}: GetColumnsOptions): ColumnDef<User>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatId(row.original.id)}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <SortableHeader
          label="Name"
          columnKey="name"
          currentSortBy={currentSortBy}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.department}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <SortableHeader
          label="Email"
          columnKey="email"
          currentSortBy={currentSortBy}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      ),
    },
  ];
}
