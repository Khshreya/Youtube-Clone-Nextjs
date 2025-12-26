"use client";

import Link from "next/link";
import {
  Home,
  PlaySquare,
  Clapperboard,
  Clock,
  ThumbsUp,

  Flame,
  Music,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function Sidebar() {
  const collapseSidebar = useUIStore((s) => s.collapseSidebar);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);

  const items = [
    { icon: Home, label: "Home", href: "/" },
    { icon: PlaySquare, label: "Shorts", href: "/shorts" },
    { icon: Clapperboard, label: "Subscriptions", href: "/subscriptions" },
    { icon: GraduationCap, label: "Your Channel", href: "/channel" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: Clock, label: "Watch Later", href: "/watch-later" },
    { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
    { icon: Flame, label: "Trending", href: "/trending" },
    { icon: Music, label: "Music", href: "/music" },
    { icon: Gamepad2, label: "Gaming", href: "/gaming" },
  ];

  const NavItem = ({ Icon, label, href }) => (
    <Link
      href={href}
      onClick={toggleMobileSidebar}
      className="
        flex items-center gap-4 px-4 py-3 rounded-xl
        cursor-pointer transition
        hover:bg-gray-100 dark:hover:bg-gray-800
      "
    >
      <Icon size={22} />
      {!collapseSidebar && (
        <span className="text-[15px] font-medium">{label}</span>
      )}
    </Link>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`
          hidden md:flex h-screen
          bg-white dark:bg-gray-900
          pt-16 px-2 flex-col
          transition-all duration-300
          ${collapseSidebar ? "w-[90px]" : "w-[280px]"}
        `}
      >
        {items.map((item) => (
          <NavItem
            key={item.label}
            Icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-900 pt-16 px-2 shadow-xl">
            {items.map((item) => (
              <NavItem
                key={item.label}
                Icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>

          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={toggleMobileSidebar}
          />
        </div>
      )}
    </>
  );
}