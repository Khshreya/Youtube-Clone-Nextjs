"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Type, UploadCloud } from "lucide-react";

const CLOUD_NAME = "dr0d88x1m";
const UPLOAD_PRESET = "youtube_clone_unsigned";

/* ---------------- CLOUDINARY ---------------- */
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Thumbnail upload failed");
  return (await res.json()).secure_url;
}

async function uploadVideoToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Video upload failed");
  return (await res.json()).secure_url;
}

/* ---------------- DURATION ---------------- */
const getVideoDuration = (file) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const seconds = Math.floor(video.duration);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      resolve(`${m}:${s.toString().padStart(2, "0")}`);
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  });

/* ---------------- PAGE ---------------- */
export default function UploadDetailsPage() {
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [uploadData, setUploadData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const data = window.__uploadData;

    if (!data || !data.videoFile) {
      window.location.href = "/upload";
      return;
    }

    const init = async () => {
      const duration = await getVideoDuration(data.videoFile);

      const updatedMeta = {
        ...data.meta,
        duration,
      };

      setUploadData(data);
      setMeta(updatedMeta);

      const url = URL.createObjectURL(data.videoFile);
      setVideoPreviewUrl(url);
    };

    init();
  }, []);

  const publish = async () => {
    if (!title) return alert("Caption is required");

    try {
      setUploading(true);

      const videoUrl = await uploadVideoToCloudinary(uploadData.videoFile);
      const thumbUrl = await uploadImageToCloudinary(uploadData.thumbnailFile);

      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoUrl,
          thumbnail: thumbUrl,
          contentType: meta.contentType,
          duration: meta.duration,
          editMetadata: { filter: meta.filter?.name },
        }),
      });

      delete window.__uploadData;
      alert("Video published successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Publish failed");
    } finally {
      setUploading(false);
    }
  };

  if (!videoPreviewUrl) {
    return <div className="pt-28 text-center text-gray-500">Loading…</div>;
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => (window.location.href = "/upload")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold">Review & publish</h1>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
          {/* PREVIEW */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} />
              <p className="font-medium">Preview</p>
            </div>
<div className="flex justify-center">
  <div className="w-[320px] max-w-full rounded-xl overflow-hidden bg-black">
    <video
      src={videoPreviewUrl}
      controls
      className="w-full h-[180px] object-contain"
      style={{ filter: meta?.filter?.css || "none" }}
    />
  </div>
</div>



            <div className="mt-2 text-xs text-gray-500">
              Duration: <span className="font-medium">{meta?.duration}</span>
            </div>
          </div>

          {/* CAPTION */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type size={18} />
              <label className="text-sm font-medium">Caption</label>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a caption for your video"
              className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white border border-gray-300
                         dark:border-gray-600 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              disabled={uploading}
              onClick={publish}
              className={`px-7 py-2.5 rounded-full text-sm font-medium transition
                ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
            >
              <UploadCloud size={16} />
              {uploading ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
