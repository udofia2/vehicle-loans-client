import { apiClient } from "./client";
import type {
  LoanOffer,
  OfferCreate,
  ApiResponse,
  ApiPaginatedResponse,
} from "@/types";

/**
 * Loan offer API endpoints - Updated to match backend structure
 */

export const offerApi = {
  // Create new offer
  create: (data: {
    loanApplicationId: string;
    interestRate: number;
    loanTerm: number;
    offeredAmount: number;
    expirationHours?: number;
  }): Promise<ApiResponse<LoanOffer>> => apiClient.post("/offers", data),

  // Get all offers with pagination
  getAll: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<LoanOffer>> =>
    apiClient.get("/offers", { params }),

  // Get offers by status
  getByStatus: (
    status: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<LoanOffer>> =>
    apiClient.get(`/offers/status/${status}`, { params }),

  // Get offers for a loan application
  getByLoanApplication: (
    loanApplicationId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<LoanOffer>> =>
    apiClient.get(`/offers/loan/${loanApplicationId}`, { params }),

  // Get offer by ID
  getById: (id: string): Promise<ApiResponse<LoanOffer>> =>
    apiClient.get(`/offers/${id}`),

  // Delete offer
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/offers/${id}`),

  // Update offer
  update: (
    id: string,
    data: {
      offeredAmount?: number;
      interestRate?: number;
      loanTerm?: number;
      expiresAt?: string;
    }
  ): Promise<ApiResponse<LoanOffer>> => apiClient.put(`/offers/${id}`, data),

  // Update offer status
  updateStatus: (
    id: string,
    data: { status: string; reason?: string }
  ): Promise<ApiResponse<LoanOffer>> =>
    apiClient.patch(`/offers/${id}/status`, data),

  // Accept offer
  accept: (id: string): Promise<ApiResponse<LoanOffer>> =>
    apiClient.patch(`/offers/${id}/accept`),

  // Decline offer
  decline: (id: string): Promise<ApiResponse<LoanOffer>> =>
    apiClient.patch(`/offers/${id}/decline`),

  // Expire old offers
  expireOld: (): Promise<ApiResponse<{ expiredCount: number }>> =>
    apiClient.post("/offers/expire-old"),
};
