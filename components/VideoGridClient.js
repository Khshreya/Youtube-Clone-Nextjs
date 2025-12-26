"use client";

import { useUIStore } from "@/store/uiStore";
import VideoCardNew from "@/components/VideoCardNew";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function VideoGridClient({
  videos = [],
  showDelete = false,
}) {
  const router = useRouter();
  const searchTerm = useUIStore((s) => s.searchTerm);
  const selectedCategory = useUIStore((s) => s.selectedCategory);

  const [openMenu, setOpenMenu] = useState(null);

  const deleteVideo = async (videoId) => {
    const ok = confirm("Are you sure you want to delete this video?");
    if (!ok) return;

    await fetch(`/api/video/delete?videoId=${videoId}`, {
      method: "DELETE",
    });

    setOpenMenu(null);
    router.refresh();
  };

  const filtered = videos.filter((video) => {
    if (!video) return false;

    const matchesSearch =
      !searchTerm ||
      video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel?.toLowerCase().includes(searchTerm.toLowerCase());

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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((video) => (
          <div key={video.id} className="relative group">
            {/* VIDEO CARD */}
            <VideoCardNew video={video} />

            {/* 3 DOT MENU (OWNER ONLY) */}
            {showDelete && (
              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={() =>
                    setOpenMenu(
                      openMenu === video.id ? null : video.id
                    )
                  }
                  className="
                    p-1 rounded-full
                    bg-black/60 text-white
                    opacity-0 group-hover:opacity-100
                    transition
                  "
                >
                  <MoreVertical size={18} />
                </button>

                {openMenu === video.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border text-sm">
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
