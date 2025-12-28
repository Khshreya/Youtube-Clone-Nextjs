"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function VideoCardNew({ video }) {
  const router = useRouter();
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const isPreviewable =
    video.videoUrl &&
    (video.videoUrl.endsWith(".mp4") ||
      video.videoUrl.includes("cloudinary"));

  const href =
    video.contentType === "short"
      ? `/shorts?video=${video.id}`
      : `/watch/${video.id}`;

  const handleClick = async () => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });
    } catch {}

    router.push(href);
    router.refresh();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setHovered(true);
        if (isPreviewable) videoRef.current?.play();
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      className="
        relative cursor-pointer group
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* THUMBNAIL / PREVIEW */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-black">

        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-300
            ${hovered ? "scale-110 opacity-90" : "scale-100 opacity-100"}
          `}
        />

        {/* Hover Preview (ONLY if supported) */}
        {isPreviewable && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            playsInline
            preload="metadata"
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-300
              ${hovered ? "opacity-100" : "opacity-0"}
            `}
          />
        )}

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
          {video.duration || "12:34"}
        </span>
      </div>

      {/* TEXT */}
      <h3 className="mt-3 font-semibold text-sm sm:text-base line-clamp-2">
        {video.title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 truncate">
        {video.channel}
      </p>
    </div>
  );
}
