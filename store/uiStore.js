
// store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  /* ---------------- THEME ---------------- */
  darkMode: false,

  // initialize theme from localStorage or prefers-color-scheme
  initDarkMode: () => {
    if (typeof window === "undefined") return;
    const val = localStorage.getItem("darkMode");
    let dark;
    if (val !== null) {
      dark = val === "1";
    } else {
      dark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    set({ darkMode: dark });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
    }
  },

  setDarkMode: (value) => {
    set({ darkMode: value });
    try {
      localStorage.setItem("darkMode", value ? "1" : "0");
    } catch (e) {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", value);
    }
  },

  toggleDarkMode: () => {
    const newVal = !get().darkMode;
    get().setDarkMode(newVal);
  },

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
