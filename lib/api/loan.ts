import { apiClient } from "./client";
import type {
  LoanApplication,
  LoanApplicationCreate,
  ApiResponse,
  ApiPaginatedResponse,
} from "@/types";

/**
 * Loan application API endpoints - Updated to match backend structure
 */

export const loanApi = {
  // Create loan application
  create: (
    data: LoanApplicationCreate
  ): Promise<ApiResponse<LoanApplication>> =>
    apiClient.post("/loan-applications", data),

  // Get all loan applications with pagination
  getAll: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<LoanApplication>> =>
    apiClient.get("/loan-applications", { params }),

  // Get loan application by ID
  getById: (id: string): Promise<ApiResponse<LoanApplication>> =>
    apiClient.get(`/loan-applications/${id}`),

  // Update loan application
  update: (
    id: string,
    data: Partial<LoanApplicationCreate>
  ): Promise<ApiResponse<LoanApplication>> =>
    apiClient.put(`/loan-applications/${id}`, data),

  // Delete loan application
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/loan-applications/${id}`),

  // Update loan application status
  updateStatus: (
    id: string,
    status: string
  ): Promise<ApiResponse<LoanApplication>> =>
    apiClient.patch(`/loan-applications/${id}/status`, { status }),

  // Approve loan application
  approve: (id: string): Promise<ApiResponse<LoanApplication>> =>
    apiClient.put(`/loan-applications/${id}/approve`),

  // Reject loan application
  reject: (id: string, reason: string): Promise<ApiResponse<LoanApplication>> =>
    apiClient.put(`/loan-applications/${id}/reject`, { reason }),

  // Cancel loan application
  cancel: (id: string): Promise<ApiResponse<LoanApplication>> =>
    apiClient.put(`/loan-applications/${id}/cancel`),

  // Get loan applications by vehicle
  getByVehicle: (
    vehicleId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<LoanApplication>> =>
    apiClient.get(`/loan-applications/vehicle/${vehicleId}`, { params }),

  // Get loan applications by status
  getByStatus: (
    status: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<LoanApplication>> =>
    apiClient.get(`/loan-applications/status/${status}`, { params }),

  // Get loan applications by valuation
  getByValuation: (
    valuationId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<LoanApplication>> =>
    apiClient.get(`/loan-applications/valuation/${valuationId}`, { params }),

  // Search loan applications by date range
  searchByDateRange: (params: {
    startDate: string;
    endDate: string;
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<LoanApplication>> =>
    apiClient.get("/loan-applications/search/date-range", { params }),

  // Calculate payment for loan application
  calculatePayment: (
    id: string,
    params: { loanAmount: number; termMonths: number; interestRate: number }
  ): Promise<ApiResponse<{ monthlyPayment: number; totalInterest: number }>> =>
    apiClient.get(`/loan-applications/${id}/calculate-payment`, { params }),

  // Get payment schedule for loan application
  getPaymentSchedule: (id: string): Promise<ApiResponse<object[]>> =>
    apiClient.get(`/loan-applications/${id}/payment-schedule`),

  // Get loan application stats
  getStats: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get("/loan-applications/stats/count"),
};
