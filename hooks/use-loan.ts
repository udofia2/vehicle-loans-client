"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanApi } from "@/lib/api";
import type { LoanApplicationCreate } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Loan application related React Query hooks
 */

// Query keys
export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (filters: string) => [...loanKeys.lists(), { filters }] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: string) => [...loanKeys.details(), id] as const,
};

// Queries
export const useLoanById = (id: string) => {
  return useQuery({
    queryKey: loanKeys.detail(id),
    queryFn: () => loanApi.getById(id),
    enabled: !!id,
  });
};

export const useMyLoans = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: loanKeys.list(JSON.stringify(params || {})),
    queryFn: () => loanApi.getAll(params),
  });
};

// Mutations
export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationCreate) => loanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      toast({
        title: "Success",
        description: "Loan application created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create loan application",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LoanApplicationCreate>;
    }) => loanApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: loanKeys.detail(variables.id),
      });
      toast({
        title: "Success",
        description: "Loan application updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update loan application",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      toast({
        title: "Success",
        description: "Loan application deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete loan application",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLoanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      loanApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: loanKeys.detail(variables.id),
      });
      toast({
        title: "Success",
        description: "Loan application status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update loan status",
        variant: "destructive",
      });
    },
  });
};

export const useApproveLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanApi.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(id) });
      toast({
        title: "Success",
        description: "Loan application approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to approve loan application",
        variant: "destructive",
      });
    },
  });
};

export const useRejectLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      loanApi.reject(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: loanKeys.detail(variables.id),
      });
      toast({
        title: "Success",
        description: "Loan application rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to reject loan application",
        variant: "destructive",
      });
    },
  });
};
