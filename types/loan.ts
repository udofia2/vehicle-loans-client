import { z } from "zod";

/**
 * Loan application types and schemas
 * Based on the backend API specification
 */

// Enums matching backend
export const LoanApplicationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  UNDER_REVIEW: "under_review",
} as const;

// Loan application schema matching backend LoanApplicationResponseDto
export const loanApplicationSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  valuationId: z.string().uuid(),
  applicantName: z.string().min(2, "Applicant name is required").max(100),
  applicantEmail: z.string().email("Invalid email address"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  employmentStatus: z.enum([
    "EMPLOYED",
    "SELF_EMPLOYED",
    "UNEMPLOYED",
    "RETIRED",
  ]),
  loanAmount: z.number().min(1000, "Minimum loan amount is 1000"),
  interestRate: z.number().min(0).max(50),
  termMonths: z.number().int().min(12).max(84),
  notes: z.string().optional(),
  status: z.enum([
    "pending",
    "approved",
    "rejected",
    "cancelled",
    "under_review",
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LoanApplication = z.infer<typeof loanApplicationSchema>;

// Create schema matching backend CreateLoanApplicationDto
export const loanApplicationCreateSchema = z.object({
  vehicleId: z.string().uuid(),
  valuationId: z.string().uuid(),
  applicantName: z.string().min(2, "Applicant name is required").max(100),
  applicantEmail: z.string().email("Invalid email address"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  employmentStatus: z.enum([
    "EMPLOYED",
    "SELF_EMPLOYED",
    "UNEMPLOYED",
    "RETIRED",
  ]),
  loanAmount: z.number().min(1000, "Minimum loan amount is 1000"),
  interestRate: z.number().min(0).max(50),
  termMonths: z.number().int().min(12).max(84),
  notes: z.string().optional(),
});

export type LoanApplicationCreate = z.infer<typeof loanApplicationCreateSchema>;

// Form schemas for step-by-step application (simplified)
export const personalInfoSchema = z.object({
  applicantName: z.string().min(2, "Applicant name is required").max(100),
  applicantEmail: z.string().email("Invalid email address"),
  applicantPhone: z.string().min(1, "Phone number is required"),
});

export const employmentInfoSchema = z.object({
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  employmentStatus: z.enum([
    "EMPLOYED",
    "SELF_EMPLOYED",
    "UNEMPLOYED",
    "RETIRED",
  ]),
});

export const loanDetailsSchema = z.object({
  loanAmount: z.number().min(1000, "Minimum loan amount is 1000"),
  interestRate: z.number().min(0).max(50),
  termMonths: z.number().int().min(12).max(84),
  notes: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type EmploymentInfo = z.infer<typeof employmentInfoSchema>;
export type LoanDetails = z.infer<typeof loanDetailsSchema>;
