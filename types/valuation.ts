import { z } from "zod";
import { vehicleSchema } from "./vehicle";

/**
 * Valuation-related types and schemas
 * Based on the backend API specification
 */

// Enums matching backend
export const ValuationSource = {
  KBB: "kbb",
  EDMUNDS: "edmunds",
  NADA: "nada",
  MANUAL: "manual",
  EXTERNAL_API: "external_api",
} as const;

// Valuation schema matching backend ValuationResponseDto
export const valuationSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  estimatedValue: z.number().min(0, "Estimated value must be positive"),
  minValue: z.number().min(0, "Minimum value must be positive"),
  maxValue: z.number().min(0, "Maximum value must be positive"),
  source: z.enum(["kbb", "edmunds", "nada", "manual", "external_api"]),
  valuationDate: z.string().datetime(),
  metadata: z.string().optional(),
  createdAt: z.string().datetime(),
  // Optional relations that may be populated
  vehicle: vehicleSchema.optional(),
});

export type Valuation = z.infer<typeof valuationSchema>;

// Create schema matching backend CreateValuationDto
export const valuationCreateSchema = z.object({
  vehicleId: z.string().uuid(),
  estimatedValue: z.number().min(0, "Estimated value must be positive"),
  minValue: z.number().min(0, "Minimum value must be positive"),
  maxValue: z.number().min(0, "Maximum value must be positive"),
  source: z.enum(["kbb", "edmunds", "nada", "manual", "external_api"]),
  metadata: z.string().optional(),
});

// Generate valuation schema for automatic valuation
export const valuationGenerateSchema = z.object({
  vehicleId: z.string().uuid(),
  source: z
    .enum(["kbb", "edmunds", "nada", "manual", "external_api"])
    .optional(),
});

export type ValuationRequest = z.infer<typeof valuationCreateSchema>;
export type ValuationGenerate = z.infer<typeof valuationGenerateSchema>;
