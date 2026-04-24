export const AUTH_COOKIE_NAME = "auth_token" as const;
export const AUTH_TOKEN_EXPIRY_HOURS = 24;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_TABLE_SORT_BY = "name" as const;
export const DEFAULT_TABLE_SORT_ORDER = "asc" as const;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const PROTECTED_ROUTES = ["/dashboard", "/profile"] as const;

export const API_ROUTES = {
  LOGIN: "/api/login",
  LOGOUT: "/api/logout",
  USERS: "/api/users",
} as const;

export const USER_ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  editor: "bg-blue-100 text-blue-700",
};

export const USER_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-red-100 text-red-600",
  pending: "bg-amber-100 text-amber-700",
};
