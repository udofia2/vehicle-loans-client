// API Response types - Updated to match backend structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Complete API Response wrapper for paginated data
export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: PaginatedResponse<T>;
  message: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Re-export all domain types
export * from "./vehicle";
export * from "./valuation";
export * from "./loan";
export * from "./offer";
