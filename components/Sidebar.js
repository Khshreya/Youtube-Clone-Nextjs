"use client";

import {
  Home,
  PlaySquare,
  Clapperboard,
  Clock,
  Flame,
  Music,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function Sidebar() {
  const collapse = useUIStore((s) => s.collapseSidebar);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);

  const items = [
    { icon: <Home size={22} />, label: "Home" },
    { icon: <PlaySquare size={22} />, label: "Shorts" },
    { icon: <Clapperboard size={22} />, label: "Subscriptions" },
    { icon: <GraduationCap size={22} />, label: "Your Channel" },
    { icon: <Clock size={22} />, label: "History" },
    { icon: <Clock size={22} />, label: "Watch Later" },
    { icon: <Flame size={22} />, label: "Trending" },
    { icon: <Music size={22} />, label: "Music" },
    { icon: <Gamepad2 size={22} />, label: "Gaming" },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`
          hidden md:flex
          h-screen border-r bg-white dark:bg-gray-950
          border-gray-200 dark:border-gray-800
          transition-all duration-300
          ${collapse ? "w-[90px]" : "w-[280px]"}
          flex-col overflow-hidden pt-14 z-40
        `}
      >
        <nav className="mt-4 space-y-1">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-xl transition"
            >
              {item.icon}
              {!collapse && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 h-full bg-white dark:bg-gray-950 pt-14">
            <nav className="mt-4 space-y-1">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-xl"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={toggleMobileSidebar}
          />
        </div>
      )}
    </>
  );
}
