import { apiClient } from "./client";
import type {
  Valuation,
  ValuationRequest,
  ApiResponse,
  ApiPaginatedResponse,
} from "@/types";

/**
 * Valuation API endpoints - Updated to match backend structure
 */

export const valuationApi = {
  // Create new valuation
  create: (data: ValuationRequest): Promise<ApiResponse<Valuation>> =>
    apiClient.post("/valuations", data),

  // Generate valuation (automatic valuation)
  generate: (data: {
    vehicleId: string;
    source?: string;
  }): Promise<ApiResponse<Valuation>> =>
    apiClient.post("/valuations/generate", data),

  // Get all valuations with pagination
  getAll: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Valuation>> =>
    apiClient.get("/valuations", { params }),

  // Get valuation by ID
  getById: (id: string): Promise<ApiResponse<Valuation>> =>
    apiClient.get(`/valuations/${id}`),

  // Delete valuation
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/valuations/${id}`),

  // Update valuation
  update: (
    id: string,
    data: Partial<ValuationRequest>
  ): Promise<ApiResponse<Valuation>> =>
    apiClient.put(`/valuations/${id}`, data),

  // Get valuations for a vehicle
  getByVehicle: (
    vehicleId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<Valuation>> =>
    apiClient.get(`/valuations/vehicle/${vehicleId}`, { params }),

  // Get latest valuation for a vehicle
  getLatestByVehicle: (vehicleId: string): Promise<ApiResponse<Valuation>> =>
    apiClient.get(`/valuations/vehicle/${vehicleId}/latest`),

  // Search valuations by source
  searchBySource: (params: {
    source: string;
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Valuation>> =>
    apiClient.get("/valuations/search/source", { params }),

  // Search valuations by date range
  searchByDateRange: (params: {
    startDate: string;
    endDate: string;
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Valuation>> =>
    apiClient.get("/valuations/search/date-range", { params }),

  // Get valuation stats
  getStats: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get("/valuations/stats/count"),
};
