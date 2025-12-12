"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { offerApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

/**
 * Loan offer related React Query hooks
 */

// Query keys
export const offerKeys = {
  all: ["offers"] as const,
  lists: () => [...offerKeys.all, "list"] as const,
  list: (filters: string) => [...offerKeys.lists(), { filters }] as const,
  details: () => [...offerKeys.all, "detail"] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  byStatus: (status: string) => [...offerKeys.all, "status", status] as const,
  byLoan: (loanId: string) => [...offerKeys.all, "loan", loanId] as const,
};

// Queries
export const useOfferById = (id: string) => {
  return useQuery({
    queryKey: offerKeys.detail(id),
    queryFn: () => offerApi.getById(id),
    enabled: !!id,
  });
};

export const useMyOffers = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: offerKeys.list(JSON.stringify(params || {})),
    queryFn: () => offerApi.getAll(params),
  });
};

export const useOffersByStatus = (
  status: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: offerKeys.byStatus(status),
    queryFn: () => offerApi.getByStatus(status, params),
    enabled: !!status,
  });
};

export const useOffersByLoanApplication = (
  loanApplicationId: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: offerKeys.byLoan(loanApplicationId),
    queryFn: () => offerApi.getByLoanApplication(loanApplicationId, params),
    enabled: !!loanApplicationId,
  });
};

// Mutations
export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      loanApplicationId: string;
      interestRate: number;
      loanTerm: number;
      offeredAmount: number;
      expirationHours?: number;
    }) => offerApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: offerKeys.byLoan(variables.loanApplicationId),
      });
      toast({
        title: "Success",
        description: "Loan offer created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create loan offer",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => offerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
      toast({
        title: "Success",
        description: "Loan offer deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete loan offer",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      offerId,
      data,
    }: {
      offerId: string;
      data: {
        offeredAmount?: number;
        interestRate?: number;
        loanTerm?: number;
        expiresAt?: string;
      };
    }) => offerApi.update(offerId, data),
    onSuccess: (_, { offerId }) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) });
      toast({
        title: "Success",
        description: "Loan offer updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update loan offer",
        variant: "destructive",
      });
    },
  });
};

export const useAcceptOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => offerApi.accept(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(id) });
      toast({
        title: "Success",
        description: "Loan offer accepted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to accept loan offer",
        variant: "destructive",
      });
    },
  });
};

export const useDeclineOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => offerApi.decline(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(id) });
      toast({
        title: "Success",
        description: "Loan offer declined",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to decline loan offer",
        variant: "destructive",
      });
    },
  });
};
