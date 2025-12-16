"use client";

import { useUIStore } from "@/store/uiStore";

export default function CategoryList() {
  const selectedCategory = useUIStore((s) => s.selectedCategory);
  const setSelectedCategory = useUIStore((s) => s.setSelectedCategory);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const collapseSidebar = useUIStore((s) => s.collapseSidebar);
  const leftOffsetClass = collapseSidebar ? "md:left-[90px]" : "md:left-[280px]";

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
    <div
      className={
        "sticky top-14 w-full z-40 inset-x-0 md:right-0 " +
        leftOffsetClass +
        " bg-white dark:bg-gray-900 " +
        "border-b dark:border-gray-700 " +
        "transition-all duration-300 " +
        (mobileSidebarOpen ? "hidden md:block" : "block")
      }
    >
      <div className="flex gap-3 overflow-x-auto px-3 py-3">
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                "px-4 py-2 rounded-full whitespace-nowrap text-sm border transition " +
                (isActive
                  ? "bg-black text-white border-black dark:bg-white dark:text-black"
                  : "bg-gray-100 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700")
              }
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
