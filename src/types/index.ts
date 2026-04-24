// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin";
  expiresAt: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface LoginResponseData {
  user: AuthUser;
  token: string;
}

// ─── User / Data Table ────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  createdAt: string;
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Table Query ──────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc";

export interface UserQueryParams {
  page: number;
  limit: number;
  sortBy: keyof User;
  order: SortOrder;
  search: string;
}
