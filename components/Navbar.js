// components/Navbar.js
"use client";

import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const toggleCollapseSidebar = useUIStore((s) => s.toggleCollapseSidebar);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              toggleMobileSidebar();
            } else {
              toggleCollapseSidebar();
            }
          }}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ☰
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          CnTube
        </h1>
      </div>

      <div className="hidden sm:flex items-center gap-2 max-w-md flex-1 mx-4">
        <input
          type="text"
          placeholder="Search…"
          className="w-full px-4 py-2 border rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
