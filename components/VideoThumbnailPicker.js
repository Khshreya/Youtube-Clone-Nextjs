"use client";

import { useRef, useState, useEffect } from "react";

export const FILTERS = [
  { name: "Normal", css: "none" },
  { name: "Warm", css: "brightness(1.05) saturate(1.2)" },
  { name: "Cool", css: "brightness(1.05) saturate(0.9)" },
  { name: "B&W", css: "grayscale(1)" },
  { name: "Vintage", css: "sepia(0.4) contrast(1.1)" },
  { name: "Fade", css: "contrast(0.9) brightness(1.1)" },
];

export default function VideoThumbnailPicker({
  videoFile,
  onSelect,
  onFilterChange,
  initialFilterIndex = 0,
  initialPreview,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [filterIndex, setFilterIndex] = useState(initialFilterIndex);
  const [preview, setPreview] = useState(initialPreview || null);

  useEffect(() => {
    onFilterChange?.(FILTERS[filterIndex], filterIndex);
  }, [filterIndex]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.filter = FILTERS[filterIndex].css;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "thumbnail.jpg", {
        type: "image/jpeg",
      });

      const url = URL.createObjectURL(blob);
      setPreview(url);
      onSelect(file);

      sessionStorage.setItem("thumbnailPreview", url);
    });
  };

  return (
    <div className="space-y-5">
     <video
  ref={videoRef}
  src={URL.createObjectURL(videoFile)}
  controls
  className="w-full rounded-xl"
  style={{ filter: FILTERS[filterIndex].css }}
/>



      <div className="flex gap-3 overflow-x-auto">
        {FILTERS.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setFilterIndex(i)}
           className={`px-4 py-2 rounded-full border transition
  ${
    i === filterIndex
      ? "bg-red-600 text-white border-red-600"
      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
  }
`}

          >
            {f.name}
          </button>
        ))}
      </div>

      <button
        onClick={captureFrame}
        className="px-5 py-2 border rounded-lg"
      >
        📸 Capture frame
      </button>

      {preview && (
        <img src={preview} className="w-24 rounded border" />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
