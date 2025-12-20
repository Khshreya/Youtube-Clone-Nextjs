"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";

export default function CategoryList() {
  const pathname = usePathname() || "";

  const selectedCategory = useUIStore((s) => s.selectedCategory);
  const setSelectedCategory = useUIStore((s) => s.setSelectedCategory);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);

  /* ❌ Pages where Category list should NOT appear */
  const hideOnRoutes = [
    "/channel",
    "/history",
    "/watch-later",
    "/subscriptions",
    "/shorts",
  ];

  const shouldHide = hideOnRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /* ✅ Sync URL → category (SAFE) */
  useEffect(() => {
    if (!pathname) return;

    const routeToCategory = {
      "/gaming": "Gaming",
      "/music": "Music",
      "/trending": "Trending",
    };

    const nextCategory = routeToCategory[pathname] ?? "All";

    if (nextCategory !== selectedCategory) {
      setSelectedCategory(nextCategory);
    }
  }, [pathname, selectedCategory, setSelectedCategory]);

  /* 🚫 Hide safely AFTER hooks */
  if (shouldHide || mobileSidebarOpen) {
    return null;
  }

  const categories = [
    "All",
    "Music",
    "Gaming",
    "Live",
    "News",
    "Movies",
    "Sports",
    "Technology",
    "Comedy",
    "Education",
    "Fitness",
    "Trending",
  ];

  return (
    <div className="sticky top-14 z-40 bg-white dark:bg-gray-900 pt-2">
      <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                h-9 px-4 text-sm rounded-lg whitespace-nowrap transition
                ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
