// components/VideoGridClient.js
"use client";

import { useUIStore } from "@/store/uiStore";
import VideoCardNew from "@/components/VideoCardNew";

export default function VideoGridClient({ videos }) {
  const searchTerm = useUIStore((s) => s.searchTerm);
  const selectedCategory = useUIStore((s) => s.selectedCategory);

  const filtered = videos.filter((video) => {
    const matchesSearch =
      !searchTerm ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No videos found
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6">
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        {filtered.map((video) => (
          <VideoCardNew key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}