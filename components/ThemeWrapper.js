// ThemeWrapper.js
"use client";
import { useUIStore } from "@/store/uiStore";

export default function ThemeWrapper({ children }) {
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-black"
      } min-h-screen flex flex-col md:flex-row transition-all duration-300`}
    >
      {children}
    </div>
  );
}