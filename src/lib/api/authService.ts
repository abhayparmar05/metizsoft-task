import axiosClient from "./axiosClient";
import type { ApiSuccessResponse, LoginCredentials, LoginResponseData } from "@/types";
import { API_ROUTES } from "@/constants";

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponseData> {
  const response = await axiosClient.post<ApiSuccessResponse<LoginResponseData>>(
    API_ROUTES.LOGIN,
    credentials,
  );
  return response.data.data;
}

export async function logoutUser(): Promise<void> {
  await axiosClient.post(API_ROUTES.LOGOUT);
}
