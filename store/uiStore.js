// store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
  // Dark mode
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  // Desktop sidebar
  collapseSidebar: false,
  toggleCollapseSidebar: () =>
    set((s) => ({ collapseSidebar: !s.collapseSidebar })),

  //  MOBILE SIDEBAR (LEFT MENU)
  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  // MOBILE CATEGORY BAR (NEW)
  mobileCategoryOpen: false,
  toggleMobileCategory: () =>
    set((s) => ({ mobileCategoryOpen: !s.mobileCategoryOpen })),
  closeMobileCategory: () => set({ mobileCategoryOpen: false }),

  // Search
  searchTerm: "",
  setSearchTerm: (value) => set({ searchTerm: value }),

  // Category
  selectedCategory: "All",
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));
