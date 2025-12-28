"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video, Zap, UploadCloud, Image as ImageIcon } from "lucide-react";
import VideoThumbnailPicker from "@/components/VideoThumbnailPicker";

const getVideoDuration = (file) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  });

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [type, setType] = useState("video");
  const [selectedFilter, setSelectedFilter] = useState({
    name: "Normal",
    css: "none",
  });

  const pickVideo = useCallback((selectedType) => {
    setType(selectedType);
    fileInputRef.current?.click();
  }, []);

  const handleVideoSelect = useCallback(async (file) => {
    const durationSec = await getVideoDuration(file);
    const minutes = Math.floor(durationSec / 60);
    const seconds = Math.floor(durationSec % 60);

    const formattedDuration = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    window.__videoDuration = formattedDuration;

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
        duration: window.__videoDuration,
      },
    };

    router.push("/upload/details");
  }, [videoFile, thumbnail, type, selectedFilter, router]);

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="mx-auto max-w-3xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleVideoSelect(e.target.files[0])}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <UploadCloud className="text-red-600" />
            <h1 className="text-xl font-semibold">Upload video</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => pickVideo("video")}
              className={`p-4 rounded-xl border flex gap-4 ${
                type === "video"
                  ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300"
              }`}
            >
              <Video />
              <div>
                <p className="font-medium">Video</p>
                <p className="text-xs text-gray-500">Long-form</p>
              </div>
            </button>

            <button
              onClick={() => pickVideo("short")}
              className={`p-4 rounded-xl border flex gap-4 ${
                type === "short"
                  ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300"
              }`}
            >
              <Zap />
              <div>
                <p className="font-medium">Short</p>
                <p className="text-xs text-gray-500">Under 60s</p>
              </div>
            </button>
          </div>

          {!videoFile && (
            <div className="border border-dashed rounded-xl p-10 text-center text-gray-400">
              Select a video file to continue
            </div>
          )}

          {videoFile && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={18} />
                <p className="font-medium">Visual style</p>
              </div>

              <VideoThumbnailPicker
                videoFile={videoFile}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onSelect={setThumbnail}
              />
            </div>
          )}

          {videoFile && thumbnail && (
            <div className="flex justify-end mt-8">
              <button
                onClick={goToDetails}
                className="px-8 py-2.5 rounded-full bg-red-600 text-white"
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
