"use client";

import { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

/* ---------------- SPINNER COMPONENT ---------------- */
function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="
          h-10 w-10
          border-4 border-gray-300
          border-t-red-600
          rounded-full
          animate-spin
        "
      />
    </div>
  );
}

/* ---------------- CLOUDINARY HELPERS (UNSIGNED) ---------------- */

//  CLOUD NAME
const CLOUD_NAME = "dr0d88x1m";

//  UNSIGNED PRESET NAME
const UPLOAD_PRESET = "youtube_clone_unsigned";

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Thumbnail error:", err);
    throw new Error("Thumbnail upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}

async function uploadVideoToCloudinary(file) {
  const MAX_MB = 50;

  //  Size validation
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error("Video must be less than 50 MB");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Video upload failed:", err);
    throw new Error("Video upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}




/* ---------------- UPLOAD PAGE ---------------- */
export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [type, setType] = useState("video");
  const [uploading, setUploading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        const user = data.user;

        if (!user) {
          window.location.href = "/login";
          return;
        }

        if (user.isGuest) {
          setIsGuest(true);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setAuthLoading(false);
      }
    };
    check();
  }, []);

  /* ---------------- UPLOAD LOGIC ---------------- */
  const uploadVideo = async () => {
    if (!title || !videoFile || !thumbnail) {
      alert("All fields are required");
      return;
    }

    try {
      setUploading(true);

      // Upload thumbnail
      const thumbnailUrl = await uploadImageToCloudinary(thumbnail);

      // Upload video
      const videoUrl = await uploadVideoToCloudinary(videoFile);

      // Save metadata
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoUrl,
          thumbnail: thumbnailUrl,
          contentType: type,
        }),
      });

      if (!res.ok) throw new Error("DB save failed");

      alert("Upload complete ");
      setTitle("");
      setVideoFile(null);
      setThumbnail(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div className="pt-20">Checking access…</div>;
  }

  if (isGuest) {
    return (
      <div className="pt-20 flex justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Guests cannot upload videos
          </h2>
          <p className="mb-4">
            Please{" "}
            <a className="text-red-600" href="/login">
              sign in
            </a>{" "}
            or register to upload videos.
          </p>
          <a
            className="inline-block bg-red-600 text-white py-2 px-4 rounded"
            href="/login"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 flex justify-center px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Upload video</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium">Content type</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="video">Video</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Thumbnail</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
              {thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  className="w-24 h-14 object-cover rounded"
                  alt="Thumbnail preview"
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed rounded-xl p-6 text-center mb-6">
          <UploadCloud className="mx-auto mb-2 text-gray-500" size={36} />
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop your video here
          </p>

          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="video"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
          <label
            htmlFor="video"
            className="cursor-pointer text-red-600 font-medium"
          >
            Select video file
          </label>

          {videoFile && (
            <p className="mt-2 text-sm text-gray-700">
              🎬 {videoFile.name}
            </p>
          )}
        </div>

        <button
          disabled={uploading}
          onClick={uploadVideo}
          className="
            w-full bg-red-600 hover:bg-red-700
            disabled:opacity-50
            text-white py-2 rounded-lg
          "
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-20">
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-sm text-gray-600">Uploading video…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
