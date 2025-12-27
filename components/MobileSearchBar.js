"use client";

import { useUIStore } from "@/store/uiStore";
import { usePathname } from "next/navigation";

export default function MobileSearchBar() {
  const pathname = usePathname();

  //  HOOKS MUST BE CALLED FIRST
  const searchTerm = useUIStore((s) => s.searchTerm);
  const setSearchTerm = useUIStore((s) => s.setSearchTerm);

  //  CONDITIONAL RENDER AFTER HOOKS
  if (pathname.startsWith("/upload"&&"/settings"&&"/details")) return null;

  return (
    <div className="sm:hidden px-3 pt-2 pb-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
      <input
        type="text"
        placeholder="Search…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full
          px-4 py-2
          border rounded-full
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          border-gray-300 dark:border-gray-600
        "
      />
    </div>
  );
}
