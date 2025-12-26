"use client";

import { useEffect, useRef, useState } from "react";
import { getYouTubeId } from "@/utils/getYouTubeId";
import LikeDislikeBar from "@/components/LikeDislikeBar";
import WatchLaterButton from "@/components/WatchLaterButton";
import SubscribeButton from "@/components/SubscribeButton";

export default function ShortsFeed({ shorts }) {
  const containerRefs = useRef([]);
  const videoRefs = useRef([]);
  const savedHistoryRef = useRef(new Set());

  const [activeIndex, setActiveIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  /* Detect active short */
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

  /* Play / Pause local videos */
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

  /* Save to history */
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

  return (
    <div className="h-[calc(100vh-56px)] overflow-y-scroll snap-y snap-mandatory ">
      {shorts.map((short, i) => {
        const ytId = getYouTubeId(short.videoUrl);
        const isActive = i === activeIndex;

        return (
          <div
            key={short.id}
            data-index={i}
            ref={(el) => (containerRefs.current[i] = el)}
            className="h-[calc(100vh-56px)] snap-start flex justify-center items-center relative"
          >
            <div className="relative w-full max-w-sm h-full overflow-hidden bg-black">

              {/* VIDEO LAYER (NON CLICKABLE) */}
              {ytId ? (
                <iframe
                  key={`${ytId}-${audioEnabled}-${isActive}`}
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=${
                    isActive ? 1 : 0
                  }&mute=${audioEnabled ? 0 : 1}&controls=0&playsinline=1`}
                  className="w-full h-full pointer-events-none"
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
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* TAP TO UNMUTE (SAFE OVERLAY) */}
              {!audioEnabled && isActive && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                  <button
                    onClick={() => setAudioEnabled(true)}
                    className="pointer-events-auto bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Tap to unmute
                  </button>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="absolute right-3 bottom-24 z-50 pointer-events-auto flex flex-col items-center gap-5">
                <LikeDislikeBar videoId={short.id} layout="vertical" />
                <WatchLaterButton videoId={short.id} />
                <SubscribeButton channel={short.channel} />
              </div>

              {/* TEXT */}
              <div className="absolute bottom-6 left-4 right-4 z-50 text-white">
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