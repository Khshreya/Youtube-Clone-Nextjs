// ThemeWrapper.js
"use client";

import { useUIStore } from "@/store/uiStore";

export default function ThemeWrapper({ children }) {
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <div
      className={`
        min-h-screen flex flex-col md:flex-row transition-all duration-300
        ${darkMode 
          ? "dark bg-gray-900 text-white" 
          : "bg-white text-black"
        }
      `}
    >
      {children}
    </div>
  );
}
