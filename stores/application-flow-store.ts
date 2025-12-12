"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  LoanApplicationCreate,
  PersonalInfo,
  EmploymentInfo,
  LoanDetails,
} from "@/types";

/**
 * Application Flow Store using Zustand
 * Manages multi-step form data and application flow state
 */

interface ApplicationFlowState {
  // Current application data
  currentApplication: Partial<LoanApplicationCreate>;

  // Form step state
  currentStep: number;
  completedSteps: number[];

  // Step-specific data
  personalInfo: Partial<PersonalInfo>;
  employmentInfo: Partial<EmploymentInfo>;
  loanDetails: Partial<LoanDetails>;

  // Selected entities for application
  selectedVehicleId: string | null;
  selectedValuationId: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  setPersonalInfo: (data: Partial<PersonalInfo>) => void;
  setEmploymentInfo: (data: Partial<EmploymentInfo>) => void;
  setLoanDetails: (data: Partial<LoanDetails>) => void;
  setSelectedVehicle: (vehicleId: string | null) => void;
  setSelectedValuation: (valuationId: string | null) => void;

  // Application management
  saveApplication: () => void;
  clearApplication: () => void;
  loadApplication: (data: Partial<LoanApplicationCreate>) => void;

  // Validation state
  stepValidation: Record<number, boolean>;
  setStepValid: (step: number, valid: boolean) => void;
}

export const useApplicationFlowStore = create<ApplicationFlowState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentApplication: {},
      currentStep: 1,
      completedSteps: [],
      personalInfo: {},
      employmentInfo: {},
      loanDetails: {},
      selectedVehicleId: null,
      selectedValuationId: null,
      stepValidation: {},

      // Step management
      setCurrentStep: (step) => set({ currentStep: step }),
      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),

      // Form data setters
      setPersonalInfo: (data) =>
        set((state) => ({
          ...state,
          personalInfo: { ...state.personalInfo, ...data },
        })),

      setEmploymentInfo: (data) =>
        set((state) => ({
          ...state,
          employmentInfo: { ...state.employmentInfo, ...data },
        })),

      setLoanDetails: (data) =>
        set((state) => ({
          ...state,
          loanDetails: { ...state.loanDetails, ...data },
        })),

      // Entity selection
      setSelectedVehicle: (vehicleId) =>
        set((state) => ({
          selectedVehicleId: vehicleId,
          currentApplication: {
            ...state.currentApplication,
            vehicleId: vehicleId || undefined,
          },
        })),

      setSelectedValuation: (valuationId) =>
        set((state) => ({
          selectedValuationId: valuationId,
          currentApplication: {
            ...state.currentApplication,
            valuationId: valuationId || undefined,
          },
        })),

      // Application management
      saveApplication: () => {
        const state = get();
        // This could trigger a save to localStorage or API
        console.log("Saving application:", state.currentApplication);
      },

      clearApplication: () =>
        set({
          currentApplication: {},
          currentStep: 1,
          completedSteps: [],
          personalInfo: {},
          employmentInfo: {},
          loanDetails: {},
          selectedVehicleId: null,
          selectedValuationId: null,
          stepValidation: {},
        }),

      loadApplication: (data) =>
        set(() => ({
          currentApplication: data,
          personalInfo: {
            applicantName: data.applicantName || "",
            applicantEmail: data.applicantEmail || "",
            applicantPhone: data.applicantPhone || "",
          },
          employmentInfo: {
            monthlyIncome: data.monthlyIncome || 0,
            employmentStatus: data.employmentStatus || "EMPLOYED",
          },
          loanDetails: {
            loanAmount: data.loanAmount || 0,
            interestRate: data.interestRate || 0,
            termMonths: data.termMonths || 12,
            notes: data.notes || "",
          },
          selectedVehicleId: data.vehicleId || null,
          selectedValuationId: data.valuationId || null,
          currentStep: 0,
          completedSteps: [],
        })),

      // Validation
      setStepValid: (step, valid) =>
        set((state) => ({
          stepValidation: { ...state.stepValidation, [step]: valid },
        })),
    }),
    {
      name: "autocheck-application-flow",
      storage: createJSONStorage(() => localStorage),
      // Persist everything except validation state
      partialize: (state) => ({
        currentApplication: state.currentApplication,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        personalInfo: state.personalInfo,
        employmentInfo: state.employmentInfo,
        loanDetails: state.loanDetails,
        selectedVehicleId: state.selectedVehicleId,
        selectedValuationId: state.selectedValuationId,
      }),
    }
  )
);
