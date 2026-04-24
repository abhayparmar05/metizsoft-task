import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/middleware";
import { MOCK_USERS } from "@/lib/api/mockData";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_TABLE_SORT_BY,
  DEFAULT_TABLE_SORT_ORDER,
} from "@/constants";
import type { ApiResponse, PaginatedUsersResponse, User, SortOrder } from "@/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized. Please sign in." },
      { status: 401 },
    );
  }

  // ── Parse query params ────────────────────────────────────────────────────
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, Number(searchParams.get("page") ?? DEFAULT_PAGE));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? DEFAULT_PAGE_LIMIT)),
  );
  const sortBy = (searchParams.get("sortBy") ?? DEFAULT_TABLE_SORT_BY) as keyof User;
  const order = (searchParams.get("order") ?? DEFAULT_TABLE_SORT_ORDER) as SortOrder;
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  // ── Filter ────────────────────────────────────────────────────────────────
  let filtered = MOCK_USERS;

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search) ||
        u.role.toLowerCase().includes(search),
    );
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  const SORTABLE_KEYS: Array<keyof User> = ["name", "email", "createdAt", "role", "status"];
  const activeSortKey: keyof User = SORTABLE_KEYS.includes(sortBy)
    ? sortBy
    : DEFAULT_TABLE_SORT_BY;

  filtered = [...filtered].sort((a, b) => {
    const aVal = String(a[activeSortKey]);
    const bVal = String(b[activeSortKey]);
    const cmp = aVal.localeCompare(bVal);
    return order === "asc" ? cmp : -cmp;
  });

  // ── Paginate ──────────────────────────────────────────────────────────────
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * limit;
  const users = filtered.slice(offset, offset + limit);

  return NextResponse.json<ApiResponse<PaginatedUsersResponse>>(
    {
      success: true,
      data: { users, total, page: safePage, limit, totalPages },
    },
    { status: 200 },
  );
}
