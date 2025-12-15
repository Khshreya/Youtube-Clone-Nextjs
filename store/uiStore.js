// store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  collapseSidebar: false,
  toggleCollapseSidebar: () =>
    set((s) => ({ collapseSidebar: !s.collapseSidebar })),

  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),

  searchTerm: "",
  setSearchTerm: (value) => set({ searchTerm: value }),

  selectedCategory: "All",
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));