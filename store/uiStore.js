// store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
  /* ---------------- THEME ---------------- */
  darkMode: false,
  toggleDarkMode: () =>
    set((s) => ({ darkMode: !s.darkMode })),

  /* ---------------- DESKTOP SIDEBAR ---------------- */
  collapseSidebar: false,
  toggleCollapseSidebar: () =>
    set((s) => ({ collapseSidebar: !s.collapseSidebar })),

  /* ---------------- MOBILE SIDEBAR ---------------- */
  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () =>
    set({ mobileSidebarOpen: false }),

  /* ---------------- SIDEBAR ACTIVE MENU ---------------- */
  activeMenu: "Home",
  setActiveMenu: (menu) =>
    set({ activeMenu: menu }),

  /* ---------------- SEARCH ---------------- */
  searchTerm: "",
  setSearchTerm: (value) =>
    set({ searchTerm: value }),

  /* ---------------- CATEGORY ---------------- */
  selectedCategory: "All",
  setSelectedCategory: (cat) =>
    set({ selectedCategory: cat }),
}));
