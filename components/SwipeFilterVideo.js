"use client";

import { useRef, useState } from "react";

const FILTERS = [
  { name: "Normal", css: "none" },
  { name: "Warm", css: "brightness(1.05) saturate(1.2)" },
  { name: "Cool", css: "brightness(1.05) saturate(0.9)" },
  { name: "B&W", css: "grayscale(1)" },
  { name: "Vintage", css: "sepia(0.4) contrast(1.1)" },
  { name: "Fade", css: "contrast(0.9) brightness(1.1)" },
];

export default function SwipeFilterVideo({ videoFile, onChange }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (Math.abs(diff) < 40) return; // ignore small swipes

    if (diff > 0 && index < FILTERS.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      onChange(FILTERS[newIndex]);
    }

    if (diff < 0 && index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      onChange(FILTERS[newIndex]);
    }
  };

  if (!videoFile) return null;

  return (
    <div className="relative">
      <video
        src={URL.createObjectURL(videoFile)}
        controls
        className="w-full rounded-lg transition-all duration-300"
        style={{ filter: FILTERS[index].css }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* Filter name overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
        {FILTERS[index].name}
      </div>
    </div>
  );
}
