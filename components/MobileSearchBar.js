"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { usePathname } from "next/navigation";

export default function MobileSearchBar() {
  const pathname = usePathname();

  const searchTerm = useUIStore((s) => s.searchTerm);
  const setSearchTerm = useUIStore((s) => s.setSearchTerm);

  const [user, setUser] = useState(null);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  /* ---------------- GLOBAL HIDES ---------------- */
  if (
    pathname.startsWith("/upload") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/details") ||
    pathname.startsWith("/shorts")
  ) {
    return null;
  }

  /* ---------------- HIDE FOR GUEST / LOGOUT ---------------- */
  const restrictedPages = [
    "/liked",
    "/watch-later",
    "/subscriptions",
    "/channel",
    "/history",
  ];

  const isRestrictedPage = restrictedPages.some((p) =>
    pathname.startsWith(p)
  );

  if (isRestrictedPage && (!user || user.isGuest)) {
    return null;
  }

  return (
    <div
      className="sm:hidden px-3 pt-2 pb-3 border-b
                 bg-white dark:bg-gray-900
                 dark:border-gray-700"
    >
      <input
        type="text"
        placeholder="Search…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full px-4 py-2 rounded-full
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
        "
      />
    </div>
  );
}
