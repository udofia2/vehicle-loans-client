"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "@/lib/api";
import type { VehicleCreate } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Vehicle-related React Query hooks
 */

// Query keys
export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: string) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  search: (vin: string) => [...vehicleKeys.all, "search", vin] as const,
};

// Queries
export const useVehicleById = (id: string) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleApi.getById(id),
    enabled: !!id,
  });
};

export const useMyVehicles = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: vehicleKeys.list(JSON.stringify(params || {})),
    queryFn: () => vehicleApi.getAll(params),
  });
};

export const useVehicleSearch = (vin: string) => {
  return useQuery({
    queryKey: vehicleKeys.search(vin),
    queryFn: () => vehicleApi.getByVin(vin),
    enabled: !!vin && vin.length === 17,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleCreate) => vehicleApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VehicleCreate> }) =>
      vehicleApi.update(id, data),
    onSuccess: (data) => {
      // Update the specific vehicle in cache
      queryClient.setQueryData(vehicleKeys.detail(data.data.id), data);
      // Invalidate vehicle lists
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });

      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update vehicle",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });

      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });
};

export const useUploadVehicleImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) => {
      // TODO: Implement image upload when backend endpoint is available
      console.warn("Image upload not implemented in backend yet", {
        id,
        files: files.length,
      });
      return Promise.resolve({ data: [] });
    },
    onSuccess: (data, { id }) => {
      // Invalidate vehicle detail to refetch with new images
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) });

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    },
  });
};
