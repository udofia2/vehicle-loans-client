"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { valuationApi } from "@/lib/api";
import type { ValuationRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Valuation-related React Query hooks
 */

// Query keys
export const valuationKeys = {
  all: ["valuations"] as const,
  lists: () => [...valuationKeys.all, "list"] as const,
  list: (filters: string) => [...valuationKeys.lists(), { filters }] as const,
  details: () => [...valuationKeys.all, "detail"] as const,
  detail: (id: string) => [...valuationKeys.details(), id] as const,
  byVehicle: (vehicleId: string) =>
    [...valuationKeys.all, "vehicle", vehicleId] as const,
};

// Queries
export const useValuationById = (id: string) => {
  return useQuery({
    queryKey: valuationKeys.detail(id),
    queryFn: () => valuationApi.getById(id),
    enabled: !!id,
  });
};

export const useValuationsByVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: valuationKeys.byVehicle(vehicleId),
    queryFn: () => valuationApi.getByVehicle(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useMyValuations = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: valuationKeys.list(JSON.stringify(params || {})),
    queryFn: () => valuationApi.getAll(params),
  });
};

// Mutations
export const useRequestValuation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ValuationRequest) => valuationApi.create(data),
    onSuccess: (data, variables) => {
      // Invalidate valuations for this vehicle
      queryClient.invalidateQueries({
        queryKey: valuationKeys.byVehicle(variables.vehicleId),
      });
      // Invalidate user's valuations list
      queryClient.invalidateQueries({ queryKey: valuationKeys.lists() });

      toast({
        title: "Success",
        description: "Valuation requested successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request valuation",
        variant: "destructive",
      });
    },
  });
};

export const useGenerateValuation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { vehicleId: string; source?: string }) =>
      valuationApi.generate(data),
    onSuccess: (data) => {
      // Update the valuation in cache
      queryClient.setQueryData(valuationKeys.detail(data.data.data.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: valuationKeys.lists() });

      toast({
        title: "Success",
        description: "Valuation generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate valuation",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteValuation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => valuationApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: valuationKeys.lists() });

      toast({
        title: "Success",
        description: "Valuation deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete valuation",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateValuation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ValuationRequest>;
    }) => valuationApi.update(id, data),
    onSuccess: (data) => {
      // Update the specific valuation in cache
      queryClient.setQueryData(valuationKeys.detail(data.data.data.id), data);
      // Invalidate valuation lists
      queryClient.invalidateQueries({ queryKey: valuationKeys.lists() });

      toast({
        title: "Success",
        description: "Valuation updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update valuation",
        variant: "destructive",
      });
    },
  });
};
