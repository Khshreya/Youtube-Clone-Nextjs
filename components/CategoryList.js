"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";

export default function CategoryList() {
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategory = useUIStore((s) => s.selectedCategory);
  const setSelectedCategory = useUIStore((s) => s.setSelectedCategory);

  const [user, setUser] = useState(null);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d?.user ?? null);
      })
      .catch(() => setUser(null));
  }, []);

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

  /* ---------------- SYNC URL → CATEGORY ---------------- */
  useEffect(() => {
    if (pathname === "/gaming") setSelectedCategory("Gaming");
    else if (pathname === "/music") setSelectedCategory("Music");
    else if (pathname === "/trending") setSelectedCategory("Trending");
    else setSelectedCategory("All");
  }, [pathname, setSelectedCategory]);

  /* ---------------- GLOBAL HIDES ---------------- */
  if (
    pathname.startsWith("/shorts") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/settings")
  ) {
    return null;
  }

  /* ---------------- HIDE FOR GUEST / LOGOUT ON SPECIFIC PAGES ---------------- */
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

  /* ---------------- HANDLER ---------------- */
  const handleClick = (cat) => {
    if (cat === "All") return router.push("/");
    if (cat === "Music") return router.push("/music");
    if (cat === "Gaming") return router.push("/gaming");
    if (cat === "Trending") return router.push("/trending");
    setSelectedCategory(cat);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="sticky top-14 z-40 bg-white dark:bg-gray-900 pt-2">
      <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;

          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
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
