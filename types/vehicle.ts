import { z } from "zod";

/**
 * Vehicle-related types and schemas
 * Based on the backend API specification
 */

// Enums matching backend
export const VehicleCondition = {
  EXCELLENT: "excellent",
  GOOD: "good",
  FAIR: "fair",
  POOR: "poor",
} as const;

export const TransmissionType = {
  MANUAL: "manual",
  AUTOMATIC: "automatic",
  CVT: "cvt",
  SEMI_AUTOMATIC: "semi_automatic",
} as const;

export const FuelType = {
  GASOLINE: "gasoline",
  DIESEL: "diesel",
  ELECTRIC: "electric",
  HYBRID: "hybrid",
  PLUGIN_HYBRID: "plugin_hybrid",
  HYDROGEN: "hydrogen",
} as const;

// Base vehicle schema matching backend VehicleResponseDto
export const vehicleSchema = z.object({
  id: z.string().uuid(),
  vin: z
    .string()
    .length(17)
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Invalid VIN format"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(2030),
  mileage: z.number().int().min(0),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  transmission: z.enum(["manual", "automatic", "cvt", "semi_automatic"]),
  fuelType: z.enum([
    "gasoline",
    "diesel",
    "electric",
    "hybrid",
    "plugin_hybrid",
    "hydrogen",
  ]),
  color: z.string().min(1, "Color is required"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

// Vehicle input schemas (for forms) - matching backend CreateVehicleDto
export const vehicleSearchSchema = z.object({
  vin: z
    .string()
    .length(17)
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Invalid VIN format"),
});

export const vehicleCreateSchema = z.object({
  vin: z
    .string()
    .length(17)
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Invalid VIN format"),
  make: z.string().min(1, "Make is required").max(100),
  model: z.string().min(1, "Model is required").max(100),
  year: z.number().int().min(1900).max(2030),
  mileage: z.number().int().min(0),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  transmission: z.enum(["manual", "automatic", "cvt", "semi_automatic"]),
  fuelType: z.enum([
    "gasoline",
    "diesel",
    "electric",
    "hybrid",
    "plugin_hybrid",
    "hydrogen",
  ]),
  color: z.string().min(1, "Color is required").max(50),
});

export type VehicleSearch = z.infer<typeof vehicleSearchSchema>;
export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;
