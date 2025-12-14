// components/CategoryList.js
"use client";

export default function CategoryList() {
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
    <div className="flex gap-3 overflow-x-auto px-4 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          // no onClick – purely visual
          className="px-4 py-2 rounded-full whitespace-nowrap border text-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
