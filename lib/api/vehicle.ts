import { apiClient } from "./client";
import type {
  Vehicle,
  VehicleSearch,
  VehicleCreate,
  ApiResponse,
  ApiPaginatedResponse,
} from "@/types";

/**
 * Vehicle API endpoints - Updated to match backend structure
 */

export const vehicleApi = {
  // Create new vehicle with VIN lookup
  create: (data: VehicleCreate): Promise<ApiResponse<Vehicle>> =>
    apiClient.post("/vehicles", data),

  // Create vehicle manually without VIN lookup
  createManual: (data: VehicleCreate): Promise<ApiResponse<Vehicle>> =>
    apiClient.post("/vehicles/manual", data),

  // Get all vehicles with pagination
  getAll: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Vehicle>> =>
    apiClient.get("/vehicles", { params }),

  // Get vehicle by ID
  getById: (id: string): Promise<ApiResponse<Vehicle>> =>
    apiClient.get(`/vehicles/${id}`),

  // Get vehicle by VIN
  getByVin: (vin: string): Promise<ApiResponse<Vehicle>> =>
    apiClient.get(`/vehicles/vin/${vin}`),

  // Decode VIN (get manufacturer data without saving)
  decodeVin: (vin: string): Promise<ApiResponse<any>> =>
    apiClient.get(`/vehicles/decode/${vin}`),

  // Update vehicle
  update: (
    id: string,
    data: Partial<VehicleCreate>
  ): Promise<ApiResponse<Vehicle>> => apiClient.put(`/vehicles/${id}`, data),

  // Delete vehicle
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/vehicles/${id}`),

  // Search vehicles by make and model
  searchByMakeModel: (params: {
    make: string;
    model: string;
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Vehicle>> =>
    apiClient.get("/vehicles/search/make-model", { params }),

  // Search vehicles by year range
  searchByYearRange: (params: {
    startYear: number;
    endYear: number;
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<Vehicle>> =>
    apiClient.get("/vehicles/search/year-range", { params }),

  // Get vehicle count stats
  getStats: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get("/vehicles/stats/count"),
};
