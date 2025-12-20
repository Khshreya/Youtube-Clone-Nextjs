"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";

export default function CategoryList() {
  const pathname = usePathname();
  const selectedCategory = useUIStore((s) => s.selectedCategory);
  const setSelectedCategory = useUIStore((s) => s.setSelectedCategory);

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

  //  SYNC URL → CATEGORY
  useEffect(() => {
    if (pathname === "/gaming") setSelectedCategory("Gaming");
    else if (pathname === "/music") setSelectedCategory("Music");
    else if (pathname === "/trending") setSelectedCategory("Trending");
    else setSelectedCategory("All");
  }, [pathname, setSelectedCategory]);
if (pathname.startsWith("/shorts")) {
    return null;
  }
  return (
    <div className="sticky top-14 z-40 bg-white dark:bg-gray-900  pt-2">
      <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-4 text-sm rounded-lg transition whitespace-nowrap
                ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800"
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
