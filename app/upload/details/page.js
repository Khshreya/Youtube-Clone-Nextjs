"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const CLOUD_NAME = "dr0d88x1m";
const UPLOAD_PRESET = "youtube_clone_unsigned";

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

export default function UploadDetailsPage() {
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [uploadData, setUploadData] = useState(null);

  useEffect(() => {
    const data = window.__uploadData;
    if (!data) {
      window.location.href = "/upload";
      return;
    }

    setUploadData(data);
    setMeta(data.meta);

    const url = URL.createObjectURL(data.videoFile);
    setVideoPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
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
          editMetadata: { filter: meta.filter?.name },
        }),
      });

      delete window.__uploadData;
      sessionStorage.removeItem("uploadMeta");
      alert("Video published successfully ");

      window.location.href = "/";
    } catch (err) {
      alert("Publish failed");
    } finally {
      setUploading(false);
    }
  };

  if (!videoPreviewUrl) {
    return <div className="pt-20 text-center">Loading…</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-100 dark:bg-[#0f172a]">
      <div className="max-w-xl mx-auto space-y-6 px-4">

        <button
          onClick={() => (window.location.href = "/upload")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-semibold">Preview</h1>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl space-y-3">
          <video
            src={videoPreviewUrl}
            controls
            className="w-full rounded-xl"
            style={{ filter: meta?.filter?.css || "none" }}
          />

          {meta?.filter && (
            <div className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full w-fit">
              Filter: <span className="font-medium">{meta.filter.name}</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Caption *</label>
          <input
  className="
    w-full mt-1 px-4 py-2 rounded-lg
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    border border-gray-300 dark:border-gray-600
    focus:outline-none focus:ring-2 focus:ring-red-500
  "
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Write a caption"
/>

        </div>

       <div className="flex justify-end pt-4">
  <button
    disabled={uploading}
    onClick={publish}
    className={`
      px-6 py-2 rounded-lg text-sm font-medium transition-all
      ${
        uploading
          ? "bg-gray-400 dark:bg-gray-600 text-gray-700 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
      }
    `}
  >
    {uploading ? "Publishing..." : "Publish"}
  </button>
</div>

      </div>
    </div>
  );
}
