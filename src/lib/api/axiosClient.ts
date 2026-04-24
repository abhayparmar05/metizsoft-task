import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// ─── Custom params serializer — skips undefined / empty-string values ─────────
function serializeParams(params: Record<string, unknown>): string {
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    // Skip undefined and empty strings so they don't pollute the query string
    if (value === undefined || value === null || value === "") continue;
    urlParams.set(key, String(value));
  }

  return urlParams.toString();
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // forward cookies (auth_token) on every request
  timeout: 10_000,
  paramsSerializer: (params) => serializeParams(params as Record<string, unknown>),
});

// ─── Request interceptor — log outgoing URL in dev for easy debugging ─────────
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      const serialized = config.params
        ? serializeParams(config.params as Record<string, unknown>)
        : "";
      const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}${serialized ? `?${serialized}` : ""}`;
      console.debug("[axios] →", config.method?.toUpperCase(), fullUrl);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response interceptor — normalise every error into a plain Error ──────────
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Extract server-provided message if available
    const serverMessage =
      error.response?.data &&
      !error.response.data.success
        ? error.response.data.error
        : undefined;

    if (error.response?.status === 401) {
      // Propagate a typed, readable error so callers can show UI feedback
      // and optionally redirect — we do NOT redirect here to keep this layer pure.
      return Promise.reject(
        new Error(serverMessage ?? "Unauthorized. Please sign in."),
      );
    }

    const message =
      serverMessage ||
      error.message ||
      "An unexpected error occurred. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
