// components/Navbar.js
"use client";
import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const toggleCollapseSidebar = useUIStore((s) => s.toggleCollapseSidebar);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const toggleMobileCategory = useUIStore((s) => s.toggleMobileCategory);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-3 border-b bg-white dark:bg-gray-900">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* DESKTOP */}
        <button
          onClick={toggleCollapseSidebar}
          className="hidden md:block p-2 rounded-full"
        >
          ☰
        </button>

        {/* MOBILE SIDEBAR */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-full"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold">CnTube</h1>
      </div>

      {/* RIGHT */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
