"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import VideoThumbnailPicker from "@/components/VideoThumbnailPicker";

/* ---------------- SPINNER ---------------- */
function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [type, setType] = useState("video");
  const [uploading, setUploading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState({
    name: "Normal",
    css: "none",
  });

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      if (data.user.isGuest) setIsGuest(true);
      setAuthLoading(false);
    };
    check();
  }, []);

  /* ---------------- VIDEO PICK ---------------- */
  const pickVideo = useCallback((selectedType) => {
    setType(selectedType);
    fileInputRef.current?.click();
  }, []);

  const handleVideoSelect = useCallback((file) => {
    setVideoFile(file);
    setThumbnail(null);
    setSelectedFilter({ name: "Normal", css: "none" });
  }, []);

  const goToDetails = useCallback(() => {
    if (!videoFile || !thumbnail) return;

    window.__uploadData = {
      videoFile,
      thumbnailFile: thumbnail,
      meta: {
        contentType: type,
        filter: selectedFilter,
      },
    };

    sessionStorage.setItem(
      "uploadMeta",
      JSON.stringify({
        contentType: type,
        filter: selectedFilter,
      })
    );

    router.push("/upload/details");
  }, [videoFile, thumbnail, type, selectedFilter, router]);

  if (authLoading) {
    return <div className="pt-20 text-center">Loading……</div>;
  }

  if (isGuest) {
    return (
      <div className="pt-20 text-center text-gray-500">
        Guests cannot upload videos.
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-100 dark:bg-[#0f172a] flex justify-center px-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">

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

        <h1 className="text-2xl font-semibold">Upload video</h1>

        {/* STEP 1 */}
        <div className="border rounded-xl p-5 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-3">Step 1 · Choose content type</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => pickVideo("video")}
              className={`p-4 rounded-xl border text-left transition flex gap-3
                ${
                  type === "video"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20 shadow-md"
                    : "border-gray-300 dark:border-gray-700 hover:shadow-sm"
                }`}
            >
              <span className="text-xl">🎬</span>
              <div>
                <p className="font-semibold">Video</p>
                <p className="text-xs text-gray-500">
                  Long-form horizontal videos
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => pickVideo("short")}
              className={`p-4 rounded-xl border text-left transition flex gap-3
                ${
                  type === "short"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20 shadow-md"
                    : "border-gray-300 dark:border-gray-700 hover:shadow-sm"
                }`}
            >
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-semibold">Short</p>
                <p className="text-xs text-gray-500">
                  Vertical videos under 60s
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        {!videoFile && (
          <div className="border-2 border-dashed rounded-xl p-10 text-center text-gray-400">
            Select a video file to continue
          </div>
        )}

        {videoFile && (
          <div className="border rounded-xl p-5 bg-gray-50 dark:bg-gray-800">
            <h2 className="font-semibold mb-3">Step 2 · Choose thumbnail</h2>

            <VideoThumbnailPicker
              key={videoFile.name}
              videoFile={videoFile}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              onSelect={setThumbnail}
            />
          </div>
        )}

        {/* STEP 3 */}
        {videoFile && thumbnail && (
          <div className="flex justify-end">
            <button
              onClick={goToDetails}
              className="px-6 py-2 rounded-lg text-sm font-medium
                         bg-red-600 hover:bg-red-700 text-white
                         shadow-md hover:shadow-lg transition"
            >
              Next →
            </button>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
