import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types";

/**
 * Axios client configuration
 * Based on the API specification
 */

// Extend AxiosRequestConfig to include metadata
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      requestStartedAt: number;
    };
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "10000",
  10
);

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.metadata = { requestStartedAt: new Date().getTime() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (
      process.env.NODE_ENV === "development" &&
      response.config.metadata?.requestStartedAt
    ) {
      const responseTime =
        new Date().getTime() - response.config.metadata.requestStartedAt;
      console.log(
        `[API] ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${response.status} (${responseTime}ms)`
      );
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = error.response.data || {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      };

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
          apiError.message =
            "You do not have permission to perform this action";
          break;
        case 404:
          // Not found
          apiError.message = "The requested resource was not found";
          break;
        case 422:
          // Validation error
          apiError.message = "Please check your input and try again";
          break;
        case 500:
          // Server error
          apiError.message = "Internal server error. Please try again later.";
          break;
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error
      const networkError: ApiError = {
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiError = {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(unknownError);
    }
  }
);

// Type-safe API methods
export const api = {
  get: <T>(url: string, config?: object) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: object, config?: object) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: object, config?: object) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: object, config?: object) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: object) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
