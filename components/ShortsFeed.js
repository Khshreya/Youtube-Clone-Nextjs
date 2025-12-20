"use client";

import { useEffect, useRef, useState } from "react";
import { getYouTubeId } from "@/utils/getYouTubeId";

export default function ShortsFeed({ shorts }) {
  const containerRefs = useRef([]);
  const videoRefs = useRef([]);
  const savedHistoryRef = useRef(new Set());

  const [activeIndex, setActiveIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [savedMap, setSavedMap] = useState({});

  /* ---------------------------
     Intersection Observer
     (detect active short)
  ---------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.9 }
    );

    containerRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ---------------------------
     Play / Pause MP4 Shorts
  ---------------------------- */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  /* ---------------------------
     Save to History (once)
  ---------------------------- */
  useEffect(() => {
    const short = shorts[activeIndex];
    if (!short) return;

    if (savedHistoryRef.current.has(short.id)) return;
    savedHistoryRef.current.add(short.id);

    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: short.id }),
    }).catch(() => {});
  }, [activeIndex, shorts]);

  /* ---------------------------
     Watch Later
  ---------------------------- */
  const handleWatchLater = async (e, short) => {
    e.stopPropagation();
    if (savedMap[short.id]) return;

    try {
      await fetch("/api/watch-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: short.id }),
      });

      setSavedMap((prev) => ({
        ...prev,
        [short.id]: true,
      }));
    } catch (err) {
      console.error("Watch later failed", err);
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] overflow-y-scroll snap-y snap-mandatory bg-white dark:bg-gray-900">
      {shorts.map((short, i) => {
        const ytId = getYouTubeId(short.videoUrl);
        const isActive = i === activeIndex;
        const isSaved = savedMap[short.id];

        return (
          <div
            key={short.id}
            data-index={i}
            ref={(el) => (containerRefs.current[i] = el)}
            className="h-[calc(100vh-56px)] snap-start flex justify-center items-center"
          >
            <div className="relative w-full max-w-sm h-full bg-black overflow-hidden">
              {/* ---------------- VIDEO ---------------- */}
              {ytId ? (
                <iframe
                  key={`${ytId}-${audioEnabled}-${isActive}`}
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=${
                    isActive ? 1 : 0
                  }&mute=${audioEnabled ? 0 : 1}&controls=0&playsinline=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={short.videoUrl}
                  muted={!audioEnabled}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* ---------------- TAP TO UNMUTE ---------------- */}
              {!audioEnabled && isActive && (
                <button
                  onClick={() => setAudioEnabled(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-lg font-semibold z-10"
                >
                  🔊 Tap to unmute
                </button>
              )}

              {/* ---------------- WATCH LATER (TOP) ---------------- */}
              <button
                onClick={(e) => handleWatchLater(e, short)}
                className={`
                  absolute top-4 right-4 z-20
                  px-3 py-2 rounded-full text-sm font-medium
                  transition
                  ${
                    isSaved
                      ? "bg-green-600 text-white"
                      : "bg-black/70 text-white hover:bg-black"
                  }
                `}
              >
                {isSaved ? "✓ Saved" : "⏰ Watch later"}
              </button>

              {/* ---------------- TEXT OVERLAY ---------------- */}
              <div className="absolute bottom-6 left-4 right-4 text-white z-20">
                <h3 className="font-semibold text-lg">{short.title}</h3>
                <p className="text-sm opacity-80">{short.channel}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
