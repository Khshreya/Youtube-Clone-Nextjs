"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import VideoThumbnailPicker from "@/components/VideoThumbnailPicker";

/* ---------- SAFE HELPER ---------- */
const getVideoDuration = (file) =>
  new Promise((resolve, reject) => {
    // ✅ guard: must be a File
    if (!(file instanceof File)) {
      reject("Invalid file");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject("Failed to load video metadata");
    };

    video.src = URL.createObjectURL(file);
  });

export default function UploadClient() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [type, setType] = useState("video");
  const [selectedFilter, setSelectedFilter] = useState({
    name: "Normal",
    css: "none",
  });

  /* ---------- PICK VIDEO ---------- */
  const pickVideo = useCallback((selectedType) => {
    setType(selectedType);
    fileInputRef.current?.click();
  }, []);

  /* ---------- HANDLE FILE ---------- */
  const handleVideoSelect = useCallback(async (file) => {
    // ✅ guard again (mobile + cancel safe)
    if (!(file instanceof File)) return;

    try {
      const durationSec = await getVideoDuration(file);

      const minutes = Math.floor(durationSec / 60);
      const seconds = Math.floor(durationSec % 60);

      window.__videoDuration = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      setVideoFile(file);
      setThumbnail(null);
      setSelectedFilter({ name: "Normal", css: "none" });
    } catch (err) {
      console.error(err);
      alert("Invalid or unsupported video file");
    }
  }, []);

  /* ---------- CONTINUE ---------- */
  const goToDetails = useCallback(() => {
    if (!videoFile || !thumbnail) return;

    window.__uploadData = {
      videoFile,
      thumbnailFile: thumbnail,
      meta: {
        contentType: type,
        filter: selectedFilter,
        duration: window.__videoDuration,
      },
    };

    router.push("/upload/details");
  }, [videoFile, thumbnail, type, selectedFilter, router]);

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="mx-auto max-w-xl">
        {/* FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoSelect(file);
          }}
        />

        {/* CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <UploadCloud className="text-red-600" />
            <h1 className="text-lg font-semibold">
              Upload video
            </h1>
          </div>

          {/* TYPE SELECT */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => pickVideo("video")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition
                ${
                  type === "video"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              Video
            </button>

            <button
              onClick={() => pickVideo("short")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition
                ${
                  type === "short"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              Short
            </button>
          </div>

          {/* EMPTY STATE */}
          {!videoFile && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="
                cursor-pointer
                border border-dashed rounded-xl
                p-8 text-center
                text-gray-400
                hover:bg-gray-50 dark:hover:bg-gray-700
              "
            >
              Tap to select a video
            </div>
          )}

          {/* THUMBNAIL PICKER */}
          {videoFile && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">
                Choose thumbnail
              </p>

              <VideoThumbnailPicker
                videoFile={videoFile}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onSelect={setThumbnail}
              />
            </div>
          )}

          {/* CONTINUE */}
        {videoFile && thumbnail && (
  <div className="flex justify-end mt-6">
    <button
      onClick={goToDetails}
      className="
        px-6 py-2
        rounded-full
        bg-red-600 text-white
        text-sm font-medium
        hover:bg-red-700
        transition
      "
    >
      Continue
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
