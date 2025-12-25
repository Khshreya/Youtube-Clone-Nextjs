"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function VideoCardNew({ video }) {
  const router = useRouter();
  const pathname = usePathname();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pages where Watch Later should NOT appear
  const hideWatchLater =
    pathname.startsWith("/history") ||
    pathname.startsWith("/watch-later") ||
    pathname.startsWith("/subscriptions") ||
    pathname.startsWith("/channel") ||
    pathname.startsWith("/my-channel");

  const href =
    video.contentType === "short"
      ? `/shorts?video=${video.id}`
      : `/watch/${video.id}`;

  // ▶ Open video
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

  //  Watch Later
  const handleWatchLater = async (e) => {
    e.stopPropagation();

    if (saved || loading) return;

    setLoading(true);

    try {
      await fetch("/api/watch-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });

      setSaved(true);
    } catch (err) {
      console.error("Watch Later failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="relative cursor-pointer group focus:outline-none"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video overflow-hidden rounded-xl bg-black dark:bg-gray-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* WATCH LATER BUTTON (conditionally rendered) */}
      

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