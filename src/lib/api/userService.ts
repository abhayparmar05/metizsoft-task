import axiosClient from "./axiosClient";
import type {
  ApiSuccessResponse,
  PaginatedUsersResponse,
  UserQueryParams,
} from "@/types";
import { API_ROUTES } from "@/constants";

export async function fetchUsers(
  params: UserQueryParams,
): Promise<PaginatedUsersResponse> {
  // Keep the table state explicit so the backend and the browser URL match.
  const cleanParams: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    order: params.order,
  };

  // Only append search when the user has actually typed something
  if (params.search.trim() !== "") {
    cleanParams.search = params.search.trim();
  }

  const response = await axiosClient.get<ApiSuccessResponse<PaginatedUsersResponse>>(
    API_ROUTES.USERS,
    { params: cleanParams },
  );

  return response.data.data;
}
