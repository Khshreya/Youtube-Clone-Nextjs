"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [menuOpen, setMenuOpen] = useState(false);


  const toggleCollapseSidebar = useUIStore((s) => s.toggleCollapseSidebar);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const darkMode = useUIStore((s) => s.darkMode);
  const searchTerm = useUIStore((s) => s.searchTerm);
  const setSearchTerm = useUIStore((s) => s.setSearchTerm);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2">
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

        {/* SEARCH (HIDDEN ON UPLOAD) */}
        {!pathname.startsWith("/upload"&& "/settings") && (
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 outline-none"
            />
          </div>
        )}

{/* RIGHT */}
<div className="flex items-center gap-3">
  {/* Create / Upload */}
  <button
    onClick={() => router.push("/upload")}
    className="flex items-center gap-2 px-4 py-2 rounded-full
               bg-gray-100 dark:bg-gray-800
               hover:bg-gray-200 dark:hover:bg-gray-700
               text-sm font-medium"
  >
    <span className="text-lg">+</span>
    Create
  </button>

  {/* Theme toggle */}
  <button
    onClick={toggleDarkMode}
    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
    title="Toggle theme"
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

  {/* Avatar + dropdown */}
  {user && (
<div className="relative">
  {/* Avatar */}
  <button
    onClick={() => setMenuOpen((prev) => !prev)}
    className="w-9 h-9 rounded-full overflow-hidden border
               bg-red-600 text-white font-semibold
               flex items-center justify-center"
  >
    {user.name?.charAt(0).toUpperCase()}
  </button>

  {/* Dropdown */}
  {menuOpen && (
    <div
      className="
        absolute right-0 mt-2 w-48
        bg-white dark:bg-gray-800
        rounded-xl shadow-lg
        border dark:border-gray-700
        z-50
      "
    >
      {/* Channel name */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold">
          {user.name}
        </p>
        <p className="text-xs text-gray-500">
          Your channel
        </p>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-700" />

      {/* Settings */}
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/settings");
        }}
        className="w-full text-left px-4 py-2.5 text-sm
                   hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Settings
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-700" />

      {/* Logout */}
      <button
        onClick={() => {
          setMenuOpen(false);
          handleLogout();
        }}
        className="w-full text-left px-4 py-2.5 text-sm text-red-600
                   hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  )}
</div>


  )}

  {!user && (
    <Link
      href="/login"
      className="text-sm px-3 py-1 border rounded"
    >
      Login
    </Link>
  )}
</div>

      </div>
    </nav>
  );
}
