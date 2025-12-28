"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function VideoCardNew({ video }) {
  const router = useRouter();
  const pathname = usePathname();

  // Decide where to open video
  const href =
    video.contentType === "short"
      ? `/shorts?video=${video.id}`
      : `/watch/${video.id}`;

  // Open video + save history
  const handleClick = async () => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });
    } catch (err) {
      console.error("History update failed", err);
    }

    router.push(href);
    router.refresh();
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="
        relative cursor-pointer group focus:outline-none
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video overflow-hidden rounded-xl bg-black dark:bg-gray-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="
            h-full w-full object-cover
            transition-transform duration-300 ease-out
            group-hover:scale-105
          "
        />
      </div>

      {/* Text */}
      <h3 className="mt-2 font-semibold text-sm sm:text-base truncate">
        {video.title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 truncate">
        {video.channel}
      </p>
    </div>
  );
}
