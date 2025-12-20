"use client";

import { useUIStore } from "@/store/uiStore";

export default function ThemeWrapper({ children }) {
  const darkMode = useUIStore((s) => s.darkMode);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);

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
