"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Home,
  PlaySquare,
  Clapperboard,
  PlusSquare,
  GraduationCap,
  History,
  Clock,
  ThumbsUp,
  Flame,
  Music,
  Gamepad2,
  Settings,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

/* Mini sidebar (desktop default) */
const MINI_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlaySquare, label: "Shorts", href: "/shorts" },
  { icon: Clapperboard, label: "Subscriptions", href: "/subscriptions" },
  { icon: GraduationCap, label: "You", href: "/channel" },
];

/* Full sidebar (overlay) */
const FULL_ITEMS = [
  ...MINI_ITEMS,
  { icon: PlusSquare, label: "Upload", href: "/upload" },
  { icon: History, label: "History", href: "/history" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
  { icon: Flame, label: "Trending", href: "/trending" },
  { icon: Music, label: "Music", href: "/music" },
  { icon: Gamepad2, label: "Gaming", href: "/gaming" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const open = useUIStore((s) => s.mobileSidebarOpen);
  const toggle = useUIStore((s) => s.toggleMobileSidebar);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* ================= MINI SIDEBAR (DESKTOP) ================= */}
      {!open && (
        <aside className="hidden md:flex fixed left-0 top-14 z-20 w-[72px] h-[calc(100vh-56px)]
                          bg-white dark:bg-gray-900 ">
          <div className="flex flex-col items-center gap-6 py-4 w-full">
            {MINI_ITEMS.map(({ icon: Icon, label, href }) => (
              <Link
  key={label}
  href={href}
  className="flex flex-col items-center gap-1 text-xs
             text-gray-900 dark:text-gray-100
             hover:bg-gray-100 dark:hover:bg-gray-800
             px-2 py-2 rounded-lg"
>

                <Icon size={22} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* ================= FULL OVERLAY SIDEBAR ================= */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={toggle}
          />

          {/* Sidebar */}
          <aside
            className="fixed left-0 top-0 z-[1000]
                       w-[240px] h-full
                       bg-white dark:bg-gray-900
                       shadow-xl
                       overflow-y-auto sidebar-scroll"
          >
            {/* 🔥 SIDEBAR HEADER (THIS FIXES YOUR ISSUE) */}
            <div className="h-14 flex items-center gap-3 px-4 
                            bg-white dark:bg-gray-900 sticky top-0 z-10">
              <button
                onClick={toggle}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ☰
              </button>
              <span className="text-lg font-semibold">CnTube</span>
            </div>

            {/* Sidebar items */}
            <div className="px-2 py-3">
              {FULL_ITEMS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={toggle}
                  className="flex items-center gap-5 px-4 py-2.5 rounded-lg
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Icon size={22} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
