"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export default function ThemeWrapper({ children }) {
  const darkMode = useUIStore((s) => s.darkMode);
  const initDarkMode = useUIStore((s) => s.initDarkMode);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);

  // Initialize theme on mount (reads from localStorage or prefers-color-scheme)
  useEffect(() => {
    initDarkMode();
  }, [initDarkMode]);

  // Keep document root 'dark' class in sync with state
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  return (
    <div
      className={`
        min-h-screen flex flex-col md:flex-row
        ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}
        ${mobileSidebarOpen ? "overflow-hidden" : ""}
      `}
    >
      {children}
    </div>
  );
}
