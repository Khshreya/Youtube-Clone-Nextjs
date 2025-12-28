"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  Settings,
  LogOut,
  ChevronRight,
  Check,

  Palette,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openThemeMenu, setOpenThemeMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
        setOpenThemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideSearch =
    pathname.startsWith("/upload") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/shorts");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpenMenu(false);
    setOpenThemeMenu(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">CnTube</h1>
        </div>

        {/* SEARCH */}
        {!hideSearch && (
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <input
              placeholder="Search"
              className="w-full px-4 py-2 rounded-full
                         bg-gray-100 dark:bg-gray-800 outline-none"
            />
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/upload")}
            className="px-4 py-2 rounded-full
                       bg-gray-100 dark:bg-gray-800 text-sm"
          >
            + Create
          </button>

          {/* Avatar */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu((p) => !p)}
                className="w-9 h-9 rounded-full bg-red-600 text-white
                           flex items-center justify-center font-semibold"
              >
                {user.name?.[0]?.toUpperCase()}
              </button>

              {/* DROPDOWN */}
              {openMenu && (
                <div
                  className="
                    absolute right-0 mt-2 w-56
                    bg-white dark:bg-gray-800
                    rounded-xl shadow-2xl
                    border dark:border-gray-700
                    overflow-hidden
                    z-[60]
                  "
                >
                  {/* USER INFO */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <div className="h-px bg-gray-200 dark:bg-gray-700" />

                  {/* SETTINGS */}
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-3
                               px-4 py-2.5 text-sm
                               hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  {/* CHANGE THEME */}
                  <button
                    onClick={() => setOpenThemeMenu((p) => !p)}
                    className="w-full flex items-center justify-between
                               px-4 py-2.5 text-sm
                               hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                   <div className="flex items-center gap-3">
  <Palette size={18} />
  Change Theme
</div>
                    <ChevronRight size={16} />
                  </button>

                  {/* THEME OPTIONS */}
                  {openThemeMenu && (
                    <div className="mx-2 mb-2 rounded-lg border dark:border-gray-700">
                      {/* LIGHT */}
                      <button
                        onClick={() => {
                          if (darkMode) toggleDarkMode();
                        }}
                        className="w-full flex items-center justify-between
                                   px-3 py-2 text-sm
                                   hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Sun size={16} />
                          Light Theme
                        </div>
                        {!darkMode && <Check size={16} />}
                      </button>

                      {/* DARK */}
                      <button
                        onClick={() => {
                          if (!darkMode) toggleDarkMode();
                        }}
                        className="w-full flex items-center justify-between
                                   px-3 py-2 text-sm
                                   hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Moon size={16} />
                          Dark Theme
                        </div>
                        {darkMode && <Check size={16} />}
                      </button>
                    </div>
                  )}

                  <div className="h-px bg-gray-200 dark:bg-gray-700" />

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3
                               px-4 py-2.5 text-sm
                               text-red-600
                               hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-3 py-1 border rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
