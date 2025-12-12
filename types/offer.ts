import { z } from "zod";

/**
 * Loan offer types and schemas
 * Based on the backend API specification
 */

// Enums matching backend
export const OfferStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
  ACCEPTED: "accepted",
  DECLINED: "declined",
} as const;

// Offer schema matching backend OfferResponseDto
export const loanOfferSchema = z.object({
  id: z.string().uuid(),
  loanApplicationId: z.string().uuid(),
  offeredAmount: z.number().positive("Offered amount must be positive"),
  interestRate: z.number().min(5).max(30),
  loanTerm: z.number().int().min(12).max(84),
  monthlyPayment: z.number().positive("Monthly payment must be positive"),
  totalPayable: z.number().positive("Total payable must be positive"),
  status: z.enum(["active", "expired", "accepted", "declined"]),
  expiresAt: z.string().datetime(),
  acceptedAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LoanOffer = z.infer<typeof loanOfferSchema>;

// Create schema matching backend CreateOfferDto
export const offerCreateSchema = z.object({
  loanApplicationId: z.string().uuid(),
  interestRate: z.number().min(5).max(30),
  loanTerm: z.number().int().min(12).max(84).optional(),
  offeredAmount: z.number().min(100000).optional(),
  expirationHours: z.number().int().min(24).max(720).optional(),
});

export type OfferCreate = z.infer<typeof offerCreateSchema>;

// Status update schema matching backend UpdateOfferStatusDto
export const offerStatusUpdateSchema = z.object({
  status: z.enum(["active", "expired", "accepted", "declined"]),
  reason: z.string().optional(),
});

export type OfferStatusUpdate = z.infer<typeof offerStatusUpdateSchema>;

// Legacy type for backwards compatibility
export type LoanOfferResponse = {
  offerId: string;
  action: "accept" | "decline";
  signature?: string;
};
