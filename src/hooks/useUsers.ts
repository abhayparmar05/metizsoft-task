"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fetchUsers } from "@/lib/api/userService";
import type { PaginatedUsersResponse, UserQueryParams, SortOrder, User } from "@/types";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_TABLE_SORT_BY,
  DEFAULT_TABLE_SORT_ORDER,
} from "@/constants";

const SORTABLE_KEYS: Array<keyof User> = ["name", "email", "createdAt", "role", "status"];

interface UseUsersReturn {
  data: PaginatedUsersResponse | null;
  isLoading: boolean;
  error: string | null;
  queryParams: UserQueryParams;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: keyof User, order: SortOrder) => void;
  refetch: () => void;
}

// ─── Read initial state from URL so refreshing / sharing preserves filters ────
function buildQueryFromUrl(searchParams: URLSearchParams): UserQueryParams {
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const parsedSortBy =
    sortBy && SORTABLE_KEYS.includes(sortBy as keyof User)
      ? (sortBy as keyof User)
      : DEFAULT_TABLE_SORT_BY;
  const parsedOrder = order === "asc" || order === "desc" ? order : DEFAULT_TABLE_SORT_ORDER;

  return {
    page: Math.max(1, Number(searchParams.get("page") ?? DEFAULT_PAGE)),
    limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? DEFAULT_PAGE_LIMIT))),
    sortBy: parsedSortBy,
    order: parsedOrder,
    search: searchParams.get("search") ?? "",
  };
}

// ─── Write query params back to browser URL bar ───────────────────────────────
function buildUrlSearch(params: UserQueryParams): string {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));
  qs.set("sortBy", params.sortBy);
  qs.set("order", params.order);
  const search = params.search.trim();
  if (search) qs.set("search", search);
  return qs.toString();
}

export function useUsers(): UseUsersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryParams, setQueryParams] = useState<UserQueryParams>(() =>
    buildQueryFromUrl(searchParams),
  );
  const [data, setData] = useState<PaginatedUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const didNormalizeUrlRef = useRef(false);

  // ─── Push updated params to URL without full page navigation ─────────────────
  const syncToUrl = useCallback(
    (params: UserQueryParams) => {
      const nextSearch = buildUrlSearch(params);
      const currentSearch = searchParams.toString();

      if (nextSearch === currentSearch) {
        return;
      }

      router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    if (didNormalizeUrlRef.current) {
      return;
    }

    didNormalizeUrlRef.current = true;
    syncToUrl(queryParams);
  }, [queryParams, syncToUrl]);

  // ─── Fetch whenever queryParams or fetchTrigger changes ──────────────────────
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchUsers(queryParams);
        if (!cancelled) setData(result);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load users.";
        if (message.toLowerCase().includes("unauthorized")) {
          router.push("/login");
          return;
        }
        setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, fetchTrigger]);

  // ─── State setters — each also updates the browser URL ───────────────────────
  const setPage = useCallback(
    (page: number) => {
      setQueryParams((prev) => {
        const next = { ...prev, page };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  const setLimit = useCallback(
    (limit: number) => {
      setQueryParams((prev) => {
        const next = { ...prev, limit, page: 1 };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  const setSearch = useCallback(
    (search: string) => {
      setQueryParams((prev) => {
        const next = { ...prev, search, page: 1 };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  const setSorting = useCallback(
    (sortBy: keyof User, order: SortOrder) => {
      setQueryParams((prev) => {
        const next = { ...prev, sortBy, order, page: 1 };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  return { data, isLoading, error, queryParams, setPage, setLimit, setSearch, setSorting, refetch };
}
