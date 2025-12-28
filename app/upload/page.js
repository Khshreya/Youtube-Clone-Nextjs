"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Zap,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
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
    return <div className="pt-28 text-center text-gray-500">Loading…</div>;
  }

  if (isGuest) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Guests cannot upload videos.
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="mx-auto max-w-3xl">

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

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <UploadCloud className="text-red-600" />
            <h1 className="text-xl font-semibold">Upload video</h1>
          </div>

          {/* CONTENT TYPE */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => pickVideo("video")}
              className={`flex items-center gap-4 p-4 rounded-xl border transition
                ${
                  type === "video"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              <Video />
              <div>
                <p className="font-medium">Video</p>
                <p className="text-xs text-gray-500">Long-form content</p>
              </div>
            </button>

            <button
              onClick={() => pickVideo("short")}
              className={`flex items-center gap-4 p-4 rounded-xl border transition
                ${
                  type === "short"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              <Zap />
              <div>
                <p className="font-medium">Short</p>
                <p className="text-xs text-gray-500">Vertical, under 60s</p>
              </div>
            </button>
          </div>

          {/* EMPTY STATE */}
          {!videoFile && (
            <div className="border border-dashed rounded-xl p-10 text-center text-gray-400 dark:border-gray-700">
              Select a video file to continue
            </div>
          )}

          {/* THUMBNAIL PICKER */}
          {videoFile && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={18} />
                <p className="font-medium">Visual style
</p>
              </div>

              <VideoThumbnailPicker
                key={videoFile.name}
                videoFile={videoFile}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onSelect={setThumbnail}
              />
            </div>
          )}

          {/* ACTION */}
          {videoFile && thumbnail && (
            <div className="flex justify-end mt-8">
              <button
                onClick={goToDetails}
                className="px-8 py-2.5 rounded-full text-sm font-medium
                           bg-red-600 hover:bg-red-700 text-white transition"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* UPLOADING OVERLAY */}
        {uploading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
