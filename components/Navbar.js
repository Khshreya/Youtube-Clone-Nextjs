"use client";

import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const toggleCollapseSidebar = useUIStore((s) => s.toggleCollapseSidebar);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const darkMode = useUIStore((s) => s.darkMode);
  const searchTerm = useUIStore((s) => s.searchTerm);
  const setSearchTerm = useUIStore((s) => s.setSearchTerm);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleCollapseSidebar}
            className="hidden md:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>

          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold">CnTube</h1>
        </div>

        {/* SEARCH */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 outline-none"
          />
        </div>

        {/* RIGHT */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
