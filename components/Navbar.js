"use client";
import {
  useUser,
  useClerk,
} from "@clerk/nextjs";

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

  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk(); // ✅ Correct import for signOut

  const [openMenu, setOpenMenu] = useState(false);
  const [openThemeMenu, setOpenThemeMenu] = useState(false);

  const menuRef = useRef(null);

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
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

  /* ---------------- SEARCH VISIBILITY ---------------- */
  const restrictedSearchPages = [
    "/liked",
    "/watch-later",
    "/subscriptions",
    "/channel",
    "/history",
  ];

  const isRestrictedSearchPage = restrictedSearchPages.some((p) =>
    pathname.startsWith(p)
  );

  const hideSearch =
    pathname.startsWith("/upload") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/shorts") ||
    (isRestrictedSearchPage && !isSignedIn);

  /* ---------------- PROPER SIGN OUT ---------------- */
  const handleSignOut = async () => {
    await signOut();
    setOpenMenu(false);
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

          {/* CUSTOM USER / GUEST MENU */}
          <div className="relative" ref={menuRef}>
            {/* GUEST BUTTON */}
            {!isSignedIn && (
              <button
                onClick={() => router.push("/login")}
                className="w-9 h-9 rounded-full bg-red-600 text-white
                           flex items-center justify-center font-semibold"
              >
                G
              </button>
            )}

            {/* JUST PHOTO BUTTON */}
            {isSignedIn && (
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.[0]?.toUpperCase() || 
                     user?.username?.[0]?.toUpperCase() || 
                     user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() || 
                     'U'}
                  </div>
                )}
              </button>
            )}

            {/* FULL DROPDOWN */}
            <div
              className={`
                absolute right-0 mt-2 w-56
                bg-white dark:bg-gray-800
                rounded-xl shadow-2xl
                border dark:border-gray-700
                overflow-hidden z-[60]
                transform transition-all duration-200 ease-out
                ${
                  openMenu
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }
              `}
            >
              {/* USER INFO */}
              <div className="px-4 py-3">
                <p className="text-sm font-semibold truncate max-w-[200px]">
                  {user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.primaryEmailAddress?.emailAddress || 
                   user?.emailAddresses?.[0]?.emailAddress || 
                   'No email'}
                </p>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              {/* SETTINGS */}
              {isSignedIn && (
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-3
                             px-4 py-2.5 text-sm
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors"
                >
                  <Settings size={18} />
                  Settings
                </button>
              )}

              {/* THEME */}
              <button
                onClick={() => setOpenThemeMenu((p) => !p)}
                className="w-full flex items-center justify-between
                           px-4 py-2.5 text-sm
                           hover:bg-gray-100 dark:hover:bg-gray-700
                           transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Palette size={18} />
                  Change Theme
                </div>
                <ChevronRight size={16} />
              </button>

              {/* THEME OPTIONS */}
              <div
                className={`
                  mx-2 mb-2 rounded-lg border dark:border-gray-700
                  transform transition-all duration-200
                  ${
                    openThemeMenu
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 h-0 overflow-hidden pointer-events-none"
                  }
                `}
              >
                <button
                  onClick={() => darkMode && toggleDarkMode()}
                  className="w-full flex items-center justify-between
                             px-3 py-2 text-sm
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sun size={16} />
                    Light Theme
                  </div>
                  {!darkMode && <Check size={16} />}
                </button>

                <button
                  onClick={() => !darkMode && toggleDarkMode()}
                  className="w-full flex items-center justify-between
                             px-3 py-2 text-sm
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Moon size={16} />
                    Dark Theme
                  </div>
                  {darkMode && <Check size={16} />}
                </button>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              {/* SIGN OUT */}
              {isSignedIn && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3
                             px-4 py-2.5 text-sm text-red-600
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
