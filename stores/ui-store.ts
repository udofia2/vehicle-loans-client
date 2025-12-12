"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * UI State Store using Zustand
 * Manages application-wide UI state that doesn't require server synchronization
 */

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Modal states
  modals: {
    vehicleSearch: boolean;
    loanApplication: boolean;
    offerComparison: boolean;
  };
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
  closeAllModals: () => void;

  // Toast/notification state
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    timestamp: number;
  }>;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Theme state
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Loading states for global operations
  loading: {
    global: boolean;
    vehicleSearch: boolean;
    loanSubmission: boolean;
  };
  setLoading: (key: keyof UIState["loading"], value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarOpen: true,
      sidebarCollapsed: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Modal states
      modals: {
        vehicleSearch: false,
        loanApplication: false,
        offerComparison: false,
      },
      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        })),
      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        })),
      closeAllModals: () =>
        set((state) => ({
          modals: Object.keys(state.modals).reduce(
            (acc, key) => ({ ...acc, [key]: false }),
            {} as UIState["modals"]
          ),
        })),

      // Toast/notification state
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id, timestamp },
          ],
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Theme state
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Loading states
      loading: {
        global: false,
        vehicleSearch: false,
        loanSubmission: false,
      },
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
    }),
    {
      name: "autocheck-ui-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
