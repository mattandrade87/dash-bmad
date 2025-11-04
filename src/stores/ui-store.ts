import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  // Modals
  isTransactionModalOpen: boolean;
  isEditTransactionModalOpen: boolean;
  isCategoryModalOpen: boolean;
  isGoalModalOpen: boolean;

  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Selected items
  selectedTransactionId: string | null;
  selectedCategoryId: string | null;
  selectedGoalId: string | null;

  // Theme
  theme: "light" | "dark" | "system";

  // Actions - Modals
  openTransactionModal: () => void;
  closeTransactionModal: () => void;

  openEditTransactionModal: (transactionId: string) => void;
  closeEditTransactionModal: () => void;

  openCategoryModal: () => void;
  closeCategoryModal: () => void;

  openGoalModal: () => void;
  closeGoalModal: () => void;

  // Actions - Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Actions - Theme
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Actions - Selected items
  setSelectedTransaction: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;
  setSelectedGoal: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    // Initial state - Modals
    isTransactionModalOpen: false,
    isEditTransactionModalOpen: false,
    isCategoryModalOpen: false,
    isGoalModalOpen: false,

    // Initial state - Sidebar
    isSidebarOpen: true,
    isSidebarCollapsed: false,

    // Initial state - Selected items
    selectedTransactionId: null,
    selectedCategoryId: null,
    selectedGoalId: null,

    // Initial state - Theme
    theme: "system",

    // Modal actions
    openTransactionModal: () => set({ isTransactionModalOpen: true }),

    closeTransactionModal: () =>
      set({ isTransactionModalOpen: false, selectedTransactionId: null }),

    openEditTransactionModal: (transactionId) =>
      set({
        isEditTransactionModalOpen: true,
        selectedTransactionId: transactionId,
      }),

    closeEditTransactionModal: () =>
      set({
        isEditTransactionModalOpen: false,
        selectedTransactionId: null,
      }),

    openCategoryModal: () => set({ isCategoryModalOpen: true }),

    closeCategoryModal: () =>
      set({ isCategoryModalOpen: false, selectedCategoryId: null }),

    openGoalModal: () => set({ isGoalModalOpen: true }),

    closeGoalModal: () => set({ isGoalModalOpen: false, selectedGoalId: null }),

    // Sidebar actions
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    toggleSidebarCollapsed: () =>
      set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    // Theme actions
    setTheme: (theme) => set({ theme }),

    // Selected items actions
    setSelectedTransaction: (id) => set({ selectedTransactionId: id }),

    setSelectedCategory: (id) => set({ selectedCategoryId: id }),

    setSelectedGoal: (id) => set({ selectedGoalId: id }),
  }))
);
